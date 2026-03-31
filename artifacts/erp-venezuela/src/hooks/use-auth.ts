import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { User } from "@/lib/types";

export function useAuth() {
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const token = localStorage.getItem("erp_token");
      if (!token) return null;
      const { data } = await supabase.from('users').select('*').eq('username', token).single();
      return data as User;
    },
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: any) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', credentials.username)
        .eq('password', credentials.password)
        .single();

      if (error || !data) throw new Error("Credenciales inválidas");
      
      return { user: data as User, token: data.username };
    },
    onSuccess: (data) => {
      localStorage.setItem("erp_token", data.token);
      queryClient.setQueryData(["auth", "me"], data.user);
    },
  });

  return {
    user: userQuery.data,
    isLoading: userQuery.isLoading,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout: () => {
      localStorage.removeItem("erp_token");
      queryClient.setQueryData(["auth", "me"], null);
      window.location.href = "/login";
    }
  };
}
