import { motion } from "framer-motion";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { useXP, getLevel, type XPEntry } from "@/modules/gamification/hooks/useXP";
import { useStreak } from "@/modules/gamification/hooks/useStreak";
import { Progress } from "@/components/ui/progress";
import {
  FireBold,
  CupStarBold,
  MedalRibbonStarBold,
  GraphUpBold,
  StarBold,
  DumbbellBold,
  ChefHatBold,
  WaterdropsBold,
  CrownBold,
  MedalRibbonBold,
} from "solar-icon-set";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

/* ── Badge definitions ── */
interface Badge {
  id: string;
  labelKey: string;
  descKey: string;
  icon: typeof FireBold;
  color: string;
  requirement: (xp: number, streak: number, history: XPEntry[]) => boolean;
}

const BADGES: Badge[] = [
  { id: "first_workout", labelKey: "gamification.firstWorkout", descKey: "gamification.firstWorkoutDesc", icon: DumbbellBold, color: "text-blue-400", requirement: (_, __, h) => h.some((e) => e.source === "workout_completed") },
  { id: "first_diet", labelKey: "gamification.dietRegistered", descKey: "gamification.dietRegisteredDesc", icon: ChefHatBold, color: "text-green-400", requirement: (_, __, h) => h.some((e) => e.source === "diet_logged") },
  { id: "hydrated", labelKey: "gamification.hydrated", descKey: "gamification.hydratedDesc", icon: WaterdropsBold, color: "text-cyan-400", requirement: (_, __, h) => h.some((e) => e.source === "water_goal") },
  { id: "streak_3", labelKey: "gamification.threeDays", descKey: "gamification.threeDaysDesc", icon: FireBold, color: "text-orange-400", requirement: (_, s) => s >= 3 },
  { id: "streak_7", labelKey: "gamification.sevenDays", descKey: "gamification.sevenDaysDesc", icon: FireBold, color: "text-red-400", requirement: (_, s) => s >= 7 },
  { id: "streak_30", labelKey: "gamification.thirtyDays", descKey: "gamification.thirtyDaysDesc", icon: CrownBold, color: "text-yellow-400", requirement: (_, s) => s >= 30 },
  { id: "level_5", labelKey: "gamification.level5", descKey: "gamification.level5Desc", icon: StarBold, color: "text-purple-400", requirement: (xp) => getLevel(xp).level >= 5 },
  { id: "level_10", labelKey: "gamification.level10", descKey: "gamification.level10Desc", icon: MedalRibbonStarBold, color: "text-amber-400", requirement: (xp) => getLevel(xp).level >= 10 },
  { id: "xp_1000", labelKey: "gamification.xp1000", descKey: "gamification.xp1000Desc", icon: GraphUpBold, color: "text-emerald-400", requirement: (xp) => xp >= 1000 },
];

/* ── Source icon map ── */
const SOURCE_ICONS: Record<string, typeof FireBold> = {
  workout_completed: DumbbellBold,
  diet_logged: ChefHatBold,
  water_goal: WaterdropsBold,
  streak_bonus_3: FireBold,
  streak_bonus_7: FireBold,
  streak_bonus_30: CupStarBold,
};

const containerVariant = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const itemVariant = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

export default function GamificationPage() {
  const { user } = useAuth();
  const { totalXP, level, history, loading } = useXP(user?.id);
  const { streak, loading: streakLoading } = useStreak(user?.id);
  const [dbBadges, setDbBadges] = useState<any[]>([]);
  const [loadingBadges, setLoadingBadges] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchDbBadges() {
      if (!user) return;
      const { data } = await (supabase as any).from("user_badges").select("*").eq("user_id", user.id).order("awarded_at", { ascending: false });
      if (data) setDbBadges(data);
      setLoadingBadges(false);
    }
    fetchDbBadges();
  }, [user]);

  if (loading || streakLoading || loadingBadges) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const unlockedBadges = BADGES.filter((b) => b.requirement(totalXP, Math.max(streak.current_streak, streak.longest_streak), history));
  const lockedBadges = BADGES.filter((b) => !b.requirement(totalXP, Math.max(streak.current_streak, streak.longest_streak), history));

  return (
    <motion.div className="flex flex-col gap-6 max-w-4xl mx-auto" variants={containerVariant} initial="hidden" animate="show">
      {/* ── Level & XP Hero ── */}
      <motion.section variants={itemVariant} className="rounded-[34px] bg-primary p-6 sm:p-8 lg:p-10 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <CupStarBold size={28} color="currentColor" className="text-card" />
          <h1 className="text-2xl sm:text-4xl font-black uppercase text-card tracking-tight" style={{ fontFamily: "'Zalando Sans Expanded', sans-serif" }}>
            {t("gamification.yourProgress")}
          </h1>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-card/15 p-4 backdrop-blur">
            <span className="text-4xl font-black text-card">{level.level}</span>
            <span className="text-xs font-bold text-card/70 uppercase mt-1">{t("gamification.levelLabel")}</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-card/15 p-4 backdrop-blur">
            <span className="text-4xl font-black text-card">{totalXP.toLocaleString()}</span>
            <span className="text-xs font-bold text-card/70 uppercase mt-1">{t("gamification.totalXP")}</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-card/15 p-4 backdrop-blur">
            <span className="text-4xl font-black text-card">{streak.current_streak}</span>
            <span className="text-xs font-bold text-card/70 uppercase mt-1">{t("gamification.currentStreak")}</span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-card/15 p-4 backdrop-blur">
            <span className="text-4xl font-black text-card">{streak.longest_streak}</span>
            <span className="text-xs font-bold text-card/70 uppercase mt-1">{t("gamification.longestStreak")}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-xs font-bold text-card/80">
            <span>{t("gamification.levelLabel")} {level.level}</span>
            <span>{totalXP - level.currentThreshold} / {level.nextThreshold - level.currentThreshold} XP</span>
            <span>{t("gamification.levelLabel")} {level.level + 1}</span>
          </div>
          <Progress value={level.progress} className="h-3 bg-card/20 [&>div]:bg-card" />
        </div>
      </motion.section>

      {/* ── Badges ── */}
      <motion.section variants={itemVariant} className="rounded-[34px] bg-card p-6 sm:p-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl sm:text-2xl font-black text-card-foreground" style={{ fontFamily: "'Zalando Sans Expanded', sans-serif" }}>
            {t("gamification.badges")}
          </h2>
          <span className="text-sm font-bold text-muted-foreground">{unlockedBadges.length}/{BADGES.length}</span>
        </div>

        {unlockedBadges.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
            {unlockedBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <motion.div key={badge.id} whileHover={{ scale: 1.06 }} className="flex flex-col items-center gap-2 rounded-2xl bg-primary/10 border border-primary/20 p-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                    <Icon size={24} color="currentColor" className={badge.color} />
                  </div>
                  <span className="text-xs font-bold text-card-foreground leading-tight">{t(badge.labelKey)}</span>
                </motion.div>
              );
            })}
          </div>
        )}

        {dbBadges.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
            {dbBadges.map((badge) => (
              <motion.div key={badge.id} whileHover={{ scale: 1.06 }} className="flex flex-col items-center gap-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
                  {badge.badge_icon ? <span className="text-2xl">{badge.badge_icon}</span> : <MedalRibbonBold size={24} color="currentColor" className="text-amber-500" />}
                </div>
                <span className="text-xs font-bold text-card-foreground leading-tight">{badge.badge_name}</span>
              </motion.div>
            ))}
          </div>
        )}

        {lockedBadges.length > 0 && (
          <>
            <p className="text-xs font-bold text-muted-foreground uppercase mb-3">{t("gamification.locked")}</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {lockedBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.id} className="flex flex-col items-center gap-2 rounded-2xl bg-muted/30 p-4 text-center opacity-50">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                      <Icon size={24} color="currentColor" className="text-muted-foreground" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground leading-tight">{t(badge.labelKey)}</span>
                    <span className="text-[10px] text-muted-foreground/70 leading-tight">{t(badge.descKey)}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </motion.section>

      {/* ── XP History ── */}
      <motion.section variants={itemVariant} className="rounded-[34px] bg-card p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-black text-card-foreground mb-5" style={{ fontFamily: "'Zalando Sans Expanded', sans-serif" }}>
          {t("gamification.xpHistory")}
        </h2>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <StarBold size={48} color="currentColor" className="text-muted-foreground" />
            <p className="text-muted-foreground">{t("gamification.noActivityYet")}</p>
            <p className="text-muted-foreground text-sm">{t("gamification.completeToEarnXP")}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {history.slice(0, 20).map((entry) => {
              const Icon = SOURCE_ICONS[entry.source] || StarBold;
              const label = t(`gamification.sourceLabels.${entry.source}`, { defaultValue: entry.description || entry.source });
              return (
                <div key={entry.id} className="flex items-center justify-between rounded-2xl bg-muted/50 p-4 hover:bg-muted/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15">
                      <Icon size={18} color="currentColor" className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-card-foreground">{label}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(entry.created_at).toLocaleDateString(undefined, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-primary">+{entry.amount} XP</span>
                </div>
              );
            })}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}
