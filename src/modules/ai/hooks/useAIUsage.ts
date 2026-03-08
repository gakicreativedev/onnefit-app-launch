import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/modules/auth/hooks/useAuth";

interface AIUsage {
  plan: string;
  limit: number;
  used: number;
  allowed: boolean;
}

export function useAIUsage() {
  const { user } = useAuth();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["ai-usage", user?.id],
    queryFn: async (): Promise<AIUsage> => {
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.rpc("check_ai_limit", {
        _user_id: user.id,
      });

      if (error) throw error;
      return data as unknown as AIUsage;
    },
    enabled: !!user,
    staleTime: 30_000,
  });

  return {
    usage: data,
    isLoading,
    refetch,
    remaining: data ? (data.limit === -1 ? Infinity : data.limit - data.used) : 0,
    isUnlimited: data?.limit === -1,
  };
}
