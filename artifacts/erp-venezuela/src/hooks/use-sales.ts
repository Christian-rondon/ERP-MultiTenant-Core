import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "./use-api";
import { Sale, SalesSummary } from "@/lib/types";

export function useSales(from?: string, to?: string) {
  return useQuery({
    queryKey: ["sales", { from, to }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);
      const query = params.toString() ? `?${params.toString()}` : "";
      return fetchWithAuth<Sale[]>(`/sales${query}`);
    },
  });
}

export function useSalesSummary(from?: string, to?: string) {
  return useQuery({
    queryKey: ["sales-summary", { from, to }],
    queryFn: () => {
      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);
      const query = params.toString() ? `?${params.toString()}` : "";
      return fetchWithAuth<SalesSummary>(`/sales/summary${query}`);
    },
  });
}

export function useCreateSale() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { paymentMethod: string; items: { productId: number; quantity: number }[] }) =>
      fetchWithAuth<Sale>("/sales", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["sales-summary"] });
    },
  });
}
