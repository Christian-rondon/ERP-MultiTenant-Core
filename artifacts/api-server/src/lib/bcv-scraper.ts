import { db } from "@workspace/db";
import { bcvRateTable } from "@workspace/db/schema";
import { desc } from "drizzle-orm";
import { logger } from "./logger";

let cachedRate: { rate: number; source: string; updatedAt: Date } | null = null;
let lastFetch: Date | null = null;

export async function scrapeBcvRate(): Promise<number | null> {
  try {
    const response = await fetch("https://www.bcv.org.ve/", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ERP-VE/1.0)",
        "Accept": "text/html",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;

    const html = await response.text();

    const patterns = [
      /id="dolar"[^>]*>.*?<strong[^>]*>([\d,\.]+)<\/strong>/s,
      /<div[^>]*id="dolar"[^>]*>[\s\S]*?<strong>([\d,\.]+)<\/strong>/,
      /USD.*?([\d]+[,\.]\d+)/,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        const rateStr = match[1].replace(",", ".");
        const rate = parseFloat(rateStr);
        if (!isNaN(rate) && rate > 1) {
          return rate;
        }
      }
    }

    return null;
  } catch (err) {
    logger.warn({ err }, "BCV scraper failed");
    return null;
  }
}

export async function getCurrentRate(): Promise<{ rate: number; source: string; updatedAt: Date }> {
  const now = new Date();
  const cacheAgeMs = lastFetch ? now.getTime() - lastFetch.getTime() : Infinity;
  const CACHE_TTL_MS = 4 * 60 * 60 * 1000;

  if (cachedRate && cacheAgeMs < CACHE_TTL_MS) {
    return cachedRate;
  }

  const dbRates = await db
    .select()
    .from(bcvRateTable)
    .orderBy(desc(bcvRateTable.updatedAt))
    .limit(1);

  const dbRate = dbRates[0];

  if (dbRate?.source === "MANUAL") {
    cachedRate = {
      rate: parseFloat(dbRate.rate),
      source: "MANUAL",
      updatedAt: dbRate.updatedAt,
    };
    lastFetch = now;
    return cachedRate;
  }

  const scraped = await scrapeBcvRate();
  if (scraped) {
    const [updated] = await db
      .insert(bcvRateTable)
      .values({ rate: scraped.toString(), source: "SCRAPER" })
      .returning();

    cachedRate = {
      rate: scraped,
      source: "SCRAPER",
      updatedAt: updated.updatedAt,
    };
    lastFetch = now;
    return cachedRate;
  }

  if (dbRate) {
    cachedRate = {
      rate: parseFloat(dbRate.rate),
      source: dbRate.source,
      updatedAt: dbRate.updatedAt,
    };
    lastFetch = now;
    return cachedRate;
  }

  const fallbackRate = 36.5;
  cachedRate = {
    rate: fallbackRate,
    source: "SCRAPER",
    updatedAt: now,
  };
  lastFetch = now;
  return cachedRate;
}

export function invalidateRateCache() {
  cachedRate = null;
  lastFetch = null;
}
