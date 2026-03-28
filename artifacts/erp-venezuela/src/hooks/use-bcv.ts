import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "./use-api";
import { BcvRate } from "@/lib/types";

export function useBcvRate() {
  return useQuery({
    queryKey: ["bcv-rate"],
    queryFn: () => fetchWithAuth<BcvRate>("/bcv/rate"),
    refetchInterval: 1000 * 60 * 60, // Refresh every hour
  });
}

export function useUpdateBcvRate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rate: number) => 
      fetchWithAuth<BcvRate>("/bcv/rate", {
        method: "POST",
        body: JSON.stringify({ rate }),
      }),
    onSuccess: (data) => {
      queryClient.setQueryData(["bcv-rate"], data);
    },
  });
}
