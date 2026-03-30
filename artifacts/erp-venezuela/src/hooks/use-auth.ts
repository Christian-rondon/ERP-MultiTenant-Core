import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWithAuth, ApiError } from "./use-api";
import { User } from "@/lib/types";

export function useAuth() {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      try {
        return await fetchWithAuth<User>("/auth/me");
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          if (err.message.includes("COMERCIO_SUSPENDIDO")) {
            localStorage.removeItem("erp_token");
            throw new ApiError(403, "COMERCIO_SUSPENDIDO");
          }
          return null;
        }
        return null;
      }
    },
    retry: false,
    staleTime: Infinity,
  });

  const isSuspended =
    userQuery.error instanceof ApiError &&
    (userQuery.error as ApiError).message === "COMERCIO_SUSPENDIDO";

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
    isSuspended,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
  };
}
