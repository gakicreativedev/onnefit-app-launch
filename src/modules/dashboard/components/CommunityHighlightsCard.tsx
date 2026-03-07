import { UsersGroupTwoRoundedBold, BookBold, DumbbellBold } from "solar-icon-set";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface HighlightItem {
  id: number;
  titleKey: string;
  icon: typeof BookBold;
  url: string;
}

const highlights: HighlightItem[] = [
  { id: 1, titleKey: "dashboard.trendingRecipes", icon: BookBold, url: "/diet" },
  { id: 2, titleKey: "dashboard.trendingWorkouts", icon: DumbbellBold, url: "/workouts" },
];

export function CommunityHighlightsCard() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="rounded-[20px] sm:rounded-[28px] bg-card p-4 sm:p-7">
      <header className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-primary/15">
          <UsersGroupTwoRoundedBold size={18} color="hsl(var(--primary))" />
        </div>
        <h2
          className="text-lg sm:text-xl font-black uppercase text-card-foreground tracking-tight"
          style={{ fontFamily: "'Zalando Sans Expanded', sans-serif" }}
        >
          {t("dashboard.community")}
        </h2>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {highlights.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.url)}
            className="group flex flex-col items-center justify-center rounded-2xl bg-primary px-4 py-6 sm:py-8 hover:brightness-110 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <item.icon size={28} color="currentColor" className="text-primary-foreground mb-2" />
            <span
              className="text-sm sm:text-base font-black text-primary-foreground text-center leading-tight whitespace-pre-line"
              style={{ fontFamily: "'Zalando Sans Expanded', sans-serif" }}
            >
              {t(item.titleKey)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
