import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth } from "./use-api";
import { User } from "@/lib/types";

export function useAuth() {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => fetchWithAuth<User>("/auth/me"),
    retry: false,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Login failed");
      }
      return res.json() as Promise<{ user: User; token: string }>;
    },
    onSuccess: (data) => {
      localStorage.setItem("erp_token", data.token);
      queryClient.setQueryData(["auth", "me"], data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => fetchWithAuth("/auth/logout", { method: "POST" }),
    onSettled: () => {
      localStorage.removeItem("erp_token");
      queryClient.setQueryData(["auth", "me"], null);
      window.location.href = "/login";
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
  };
}
