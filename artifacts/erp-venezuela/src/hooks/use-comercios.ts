import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "./use-api";
import { Comercio } from "@/lib/types";

export function useComercios() {
  return useQuery<Comercio[]>({
    queryKey: ["comercios"],
    queryFn: () => fetchWithAuth<Comercio[]>("/comercios"),
  });
}

export function useCreateComercio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      name: string;
      ownerName: string;
      uniqueCode: string;
      ownerUsername: string;
      ownerPassword: string;
    }) =>
      fetchWithAuth("/comercios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comercios"] }),
  });
}

export function useToggleComercio() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) =>
      fetchWithAuth(`/comercios/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comercios"] }),
  });
}
