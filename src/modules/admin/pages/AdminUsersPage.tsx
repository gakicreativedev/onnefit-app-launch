import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VerifiedCheckBold, UserBold, CloseSquareBold, CrownBold } from "solar-icon-set";
import { toast } from "sonner";

interface UserRow {
  user_id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  plan?: string;
}

const PLAN_OPTIONS = [
  { value: "free", label: "Grátis", color: "text-muted-foreground" },
  { value: "essential", label: "Essencial", color: "text-blue-500" },
  { value: "pro", label: "Pro", color: "text-primary" },
  { value: "premium", label: "Premium", color: "text-amber-500" },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("profiles")
      .select("user_id, name, username, avatar_url, is_verified")
      .order("name", { ascending: true })
      .limit(100);

    if (search.trim()) {
      query = query.or(`name.ilike.%${search.trim()}%,username.ilike.%${search.trim()}%`);
    }

    const { data: profiles } = await query;
    const userList = (profiles as UserRow[]) || [];

    // Fetch subscriptions for all users
    if (userList.length > 0) {
      const userIds = userList.map(u => u.user_id);
      const { data: subs } = await supabase
        .from("user_subscriptions")
        .select("user_id, plan")
        .in("user_id", userIds);

      const subMap = new Map((subs || []).map(s => [s.user_id, s.plan]));
      userList.forEach(u => {
        u.plan = subMap.get(u.user_id) || "free";
      });
    }

    setUsers(userList);
    setLoading(false);
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleVerified = async (userId: string, currentState: boolean) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_verified: !currentState })
      .eq("user_id", userId);

    if (error) {
      toast.error("Erro ao atualizar verificação");
      return;
    }

    setUsers(prev =>
      prev.map(u => u.user_id === userId ? { ...u, is_verified: !currentState } : u)
    );
    toast.success(!currentState ? "Usuário verificado ✓" : "Verificação removida");
  };

  const changePlan = async (userId: string, newPlan: string) => {
    // Upsert: insert if not exists, update if exists
    const { error } = await supabase
      .from("user_subscriptions")
      .upsert(
        { user_id: userId, plan: newPlan, updated_at: new Date().toISOString() },
        { onConflict: "user_id" }
      );

    if (error) {
      toast.error("Erro ao atualizar plano");
      console.error(error);
      return;
    }

    setUsers(prev =>
      prev.map(u => u.user_id === userId ? { ...u, plan: newPlan } : u)
    );
    const planLabel = PLAN_OPTIONS.find(p => p.value === newPlan)?.label || newPlan;
    toast.success(`Plano alterado para ${planLabel}`);
  };

  const getPlanInfo = (plan: string) => PLAN_OPTIONS.find(p => p.value === plan) || PLAN_OPTIONS[0];

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div>
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <VerifiedCheckBold size={24} color="hsl(var(--primary))" />
          Verificação e Planos
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie verificação e planos de assinatura dos usuários
        </p>
      </div>

      <Input
        placeholder="Buscar por nome ou @username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">Nenhum usuário encontrado</p>
      ) : (
        <div className="space-y-2">
          {users.map(user => {
            const planInfo = getPlanInfo(user.plan || "free");
            return (
              <div
                key={user.user_id}
                className="flex items-center justify-between rounded-xl bg-card border border-border/50 px-4 py-3 gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <UserBold size={20} color="hsl(var(--muted-foreground))" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-foreground truncate">{user.name || "Sem nome"}</span>
                      {user.is_verified && <VerifiedCheckBold size={14} color="hsl(var(--primary))" />}
                    </div>
                    <span className="text-xs text-muted-foreground">@{user.username || "—"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Plan selector */}
                  <Select
                    value={user.plan || "free"}
                    onValueChange={(val) => changePlan(user.user_id, val)}
                  >
                    <SelectTrigger className="w-[130px] h-8 text-xs gap-1">
                      <CrownBold size={14} color="currentColor" className={planInfo.color} />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAN_OPTIONS.map(opt => (
                        <SelectItem key={opt.value} value={opt.value} className="text-xs">
                          <span className={opt.color}>{opt.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Verify button */}
                  <Button
                    size="sm"
                    variant={user.is_verified ? "destructive" : "default"}
                    onClick={() => toggleVerified(user.user_id, user.is_verified)}
                    className="gap-1 text-xs h-8 px-2.5"
                  >
                    {user.is_verified ? (
                      <CloseSquareBold size={14} color="currentColor" />
                    ) : (
                      <VerifiedCheckBold size={14} color="currentColor" />
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
