import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import { ChartBold, UsersGroupRoundedBold, BoltCircleBold, DumbbellBold } from "solar-icon-set";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" as const } },
};

const PLAN_COLORS: Record<string, string> = {
  free: "hsl(var(--muted-foreground))",
  essential: "hsl(var(--primary))",
  pro: "#f59e0b",
  premium: "#8b5cf6",
};

interface Metrics {
  totalUsers: number;
  activeToday: number;
  activeWeek: number;
  workoutsToday: number;
  totalRecipes: number;
  totalWorkouts: number;
  totalUpdates: number;
  onboardingRate: number;
  workoutsPerDay: { date: string; count: number }[];
}

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [aiUsage, setAiUsage] = useState<{ function_name: string; count: number }[]>([]);
  const [planDist, setPlanDist] = useState<{ plan: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // Fetch admin metrics from edge function
      const { data: session } = await supabase.auth.getSession();
      const token = session?.session?.access_token;
      if (token) {
        try {
          const res = await supabase.functions.invoke("admin-metrics", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data) setMetrics(res.data);
        } catch (e) { console.error("admin-metrics error", e); }
      }

      // AI usage breakdown (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { data: aiData } = await supabase
        .from("ai_usage")
        .select("function_name")
        .gte("created_at", thirtyDaysAgo.toISOString());

      if (aiData) {
        const map: Record<string, number> = {};
        aiData.forEach((r: any) => { map[r.function_name] = (map[r.function_name] || 0) + 1; });
        setAiUsage(Object.entries(map).map(([function_name, count]) => ({ function_name, count })));
      }

      // Plan distribution
      const { data: subs } = await supabase.from("user_subscriptions").select("plan");
      if (subs) {
        const map: Record<string, number> = {};
        subs.forEach((s: any) => { map[s.plan] = (map[s.plan] || 0) + 1; });
        setPlanDist(Object.entries(map).map(([plan, count]) => ({ plan, count })));
      }

      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const statCards = metrics ? [
    { label: "Usuários totais", value: metrics.totalUsers, icon: UsersGroupRoundedBold },
    { label: "Ativos hoje", value: metrics.activeToday, icon: UsersGroupRoundedBold },
    { label: "Ativos (7 dias)", value: metrics.activeWeek, icon: UsersGroupRoundedBold },
    { label: "Treinos hoje", value: metrics.workoutsToday, icon: DumbbellBold },
    { label: "Receitas", value: metrics.totalRecipes, icon: ChartBold },
    { label: "Treinos na base", value: metrics.totalWorkouts, icon: DumbbellBold },
    { label: "Onboarding %", value: `${metrics.onboardingRate}%`, icon: ChartBold },
    { label: "Uso IA (30d)", value: aiUsage.reduce((s, a) => s + a.count, 0), icon: BoltCircleBold },
  ] : [];

  return (
    <motion.div className="flex flex-col gap-6 max-w-5xl mx-auto w-full" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-black text-foreground">Analytics <span className="text-primary">Completo</span></h1>
        <p className="text-sm text-muted-foreground">Visão geral do uso do app</p>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className="rounded-2xl bg-card p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <s.icon size={16} color="currentColor" />
              <span className="text-[10px] font-bold uppercase tracking-wide">{s.label}</span>
            </div>
            <p className="text-2xl font-black text-foreground">{s.value}</p>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workouts per day chart */}
        {metrics && metrics.workoutsPerDay.length > 0 && (
          <motion.div variants={fadeUp} className="rounded-2xl bg-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-4">Treinos por dia (últimos 7 dias)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={metrics.workoutsPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v: string) => v.slice(5)} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* AI usage breakdown */}
        {aiUsage.length > 0 && (
          <motion.div variants={fadeUp} className="rounded-2xl bg-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-4">Uso de IA (últimos 30 dias)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={aiUsage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} />
                <YAxis dataKey="function_name" type="category" tick={{ fontSize: 11 }} width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Plan distribution */}
        {planDist.length > 0 && (
          <motion.div variants={fadeUp} className="rounded-2xl bg-card p-5">
            <h3 className="text-sm font-bold text-foreground mb-4">Distribuição de Planos</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={planDist} dataKey="count" nameKey="plan" cx="50%" cy="50%" outerRadius={80} label={({ plan, count }) => `${plan} (${count})`}>
                  {planDist.map((entry) => (
                    <Cell key={entry.plan} fill={PLAN_COLORS[entry.plan] || "hsl(var(--muted-foreground))"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
