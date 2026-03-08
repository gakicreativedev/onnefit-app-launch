import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Dumbbell,
  TrendingUp,
  Target,
  Flame,
  ArrowRight,
  ChevronDown,
  Zap,
  BarChart3,
  Calendar,
  Users,
  Star,
  Quote,
  Check,
  X,
  Sparkles,
  Crown,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FitSoulLogo } from "@/components/FitSoulLogo";
import screenshotDashboard from "@/assets/screenshot-dashboard.png";
import screenshotWorkouts from "@/assets/screenshot-workouts.png";
import screenshotProgress from "@/assets/screenshot-progress.png";

/* ── Inline CTA ── */
function InlineCTA() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex justify-center mt-12"
    >
      <Button
        size="lg"
        onClick={() => navigate("/auth")}
        className="rounded-full px-8 gap-2 text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
      >
        {t("landing.hero.cta")} <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
  );
}

/* ── Animations ── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

/* ── Language Switcher ── */
function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const langs = [
    { code: "en", label: "EN" },
    { code: "pt", label: "PT" },
    { code: "es", label: "ES" },
  ];
  return (
    <div className="flex items-center gap-0.5 rounded-full border border-border/40 bg-background/60 backdrop-blur-md px-1 py-0.5">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => i18n.changeLanguage(l.code)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
            i18n.language?.startsWith(l.code)
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

/* ── Navbar ── */
function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 bg-background/70 backdrop-blur-2xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <FitSoulLogo className="w-10 h-10" color="hsl(var(--primary))" />
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button
            size="sm"
            onClick={() => navigate("/auth")}
            className="rounded-full px-5 font-medium shadow-md"
          >
            {t("landing.nav.login")}
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}

/* ── Hero Section ── */
function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-16 pb-16">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-gym.jpg"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-background/85 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>
      {/* Glow accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[150px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center px-5">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-8">
            <Zap className="w-3.5 h-3.5" />
            {t("landing.hero.tagline")}
          </span>
        </motion.div>
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.95] mb-7"
        >
          {t("landing.hero.headline")}
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          {t("landing.hero.subheadline")}
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
        >
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="rounded-full px-10 py-7 text-base font-semibold glow-primary group shadow-2xl"
          >
            {t("landing.hero.cta")}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={5}
          className="mt-20 flex justify-center"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground/30 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

/* ── Problem Section ── */
function ProblemSection() {
  const { t } = useTranslation();
  return (
    <section className="py-28 md:py-36 px-5 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          custom={0}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-10"
        >
          {t("landing.problem.title")}
        </motion.h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="space-y-5 text-muted-foreground text-base md:text-lg leading-relaxed"
        >
          {[0, 1, 2].map((i) => (
            <motion.p key={i} variants={fadeUp} custom={i + 1}>
              {t(`landing.problem.p${i + 1}`)}
            </motion.p>
          ))}
        </motion.div>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={4}
          className="mt-10 text-lg md:text-2xl font-semibold text-primary"
        >
          {t("landing.problem.conclusion")}
        </motion.p>
      </div>
    </section>
  );
}

/* ── Solution Section ── */
function SolutionSection() {
  const { t } = useTranslation();
  return (
    <section className="py-28 md:py-36 px-5 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/4 blur-[180px]" />
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          custom={0}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-8"
        >
          {t("landing.solution.title")}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="text-muted-foreground text-base md:text-lg leading-relaxed mb-4"
        >
          {t("landing.solution.p1")}
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          className="text-muted-foreground text-base md:text-lg leading-relaxed mb-12"
        >
          {t("landing.solution.p2")}
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
          className="inline-flex items-center gap-3 rounded-2xl bg-card border border-border/50 px-8 py-4"
        >
          <span className="text-xl md:text-2xl font-bold tracking-wide text-primary">
            {t("landing.solution.pillars")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Features Section (with images) ── */
const featureImages = [
  "/images/feature-workout.jpg",
  "/images/feature-progress.jpg",
  "/images/feature-habits.jpg",
  "/images/feature-goals.jpg",
];
const featureIcons = [Dumbbell, BarChart3, Flame, Target];

function FeaturesSection() {
  const { t } = useTranslation();
  return (
    <section className="py-28 md:py-36 px-5">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-20"
        >
          {t("landing.features.title")}
        </motion.h2>
        <div className="space-y-8 md:space-y-6">
          {[0, 1, 2, 3].map((i) => {
            const Icon = featureIcons[i];
            const isReversed = i % 2 === 1;
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={0}
                className={`group grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-center rounded-3xl border border-border/30 bg-card/40 backdrop-blur-sm overflow-hidden hover:border-primary/20 transition-all duration-500`}
              >
                <div className={`p-8 md:p-12 ${isReversed ? "md:order-2" : ""}`}>
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/15 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight">
                    {t(`landing.features.f${i}.title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`landing.features.f${i}.desc`)}
                  </p>
                </div>
                <div className={`relative h-64 md:h-80 overflow-hidden ${isReversed ? "md:order-1" : ""}`}>
                  <img
                    src={featureImages[i]}
                    alt={t(`landing.features.f${i}.title`)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent md:bg-gradient-to-r md:from-card/60 md:via-transparent md:to-transparent" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Benefits Section ── */
function BenefitsSection() {
  const { t } = useTranslation();
  const icons = [Calendar, TrendingUp, Users];
  return (
    <section className="py-28 md:py-36 px-5 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
      <div className="max-w-5xl mx-auto text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
        >
          {t("landing.benefits.title")}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="text-muted-foreground text-base md:text-lg mb-20 max-w-xl mx-auto"
        >
          {t("landing.benefits.subtitle")}
        </motion.p>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[0, 1, 2].map((i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="group flex flex-col items-center gap-5 p-8 rounded-3xl border border-border/30 bg-card/30 hover:bg-card/60 hover:border-primary/20 transition-all duration-300"
              >
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 group-hover:shadow-lg group-hover:shadow-primary/10 transition-all duration-300">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold">{t(`landing.benefits.b${i}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`landing.benefits.b${i}.desc`)}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Product Section (app screenshots) ── */
function ProductSection() {
  const { t } = useTranslation();
  const screenshots = [screenshotDashboard, screenshotWorkouts, screenshotProgress];
  return (
    <section className="py-28 md:py-36 px-5 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-primary/5 blur-[180px]" />
      </div>
      <div className="relative max-w-6xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-20"
        >
          {t("landing.product.title")}
        </motion.h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-end"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              variants={scaleIn}
              custom={i}
              className={`relative rounded-2xl border border-border/30 bg-card/50 overflow-hidden shadow-2xl shadow-background/50 ${i === 1 ? "md:-mt-10" : ""}`}
            >
              <img
                src={screenshots[i]}
                alt={t(`landing.product.s${i}`)}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/60 to-transparent p-5 pt-14">
                <p className="text-sm font-semibold text-foreground">{t(`landing.product.s${i}`)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Philosophy Section (with background image) ── */
function PhilosophySection() {
  const { t } = useTranslation();
  return (
    <section className="relative py-32 md:py-48 px-5 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/philosophy.jpg"
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-background/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/6 blur-[120px]" />
      </div>
      <div className="relative max-w-2xl mx-auto text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl md:text-6xl font-bold tracking-tighter leading-tight mb-8"
        >
          {t("landing.philosophy.headline1")}
          <br />
          <span className="text-primary">{t("landing.philosophy.headline2")}</span>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-lg mx-auto"
        >
          {t("landing.philosophy.body")}
        </motion.p>
      </div>
    </section>
  );
}

/* ── Social Proof Section ── */
function SocialProofSection() {
  const { t } = useTranslation();
  const avatars = [
    "/images/testimonial-1.jpg",
    "/images/testimonial-2.jpg",
    "/images/testimonial-3.jpg",
  ];
  return (
    <section className="py-28 md:py-36 px-5">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-20"
        >
          {t("landing.social.title")}
        </motion.h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="rounded-3xl border border-border/30 bg-card/40 p-7 md:p-8 hover:bg-card/60 hover:border-primary/20 transition-all duration-300"
            >
              <Quote className="w-5 h-5 text-primary/30 mb-5" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 italic">
                "{t(`landing.social.t${i}.quote`)}"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src={avatars[i]}
                  alt={t(`landing.social.t${i}.name`)}
                  className="h-10 w-10 rounded-full object-cover border-2 border-border/50"
                  loading="lazy"
                />
                <div>
                  <p className="text-sm font-semibold">{t(`landing.social.t${i}.name`)}</p>
                  <p className="text-xs text-muted-foreground">{t(`landing.social.t${i}.role`)}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mt-5">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-primary text-primary" />
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── FAQ Section ── */
function FAQSection() {
  const { t } = useTranslation();
  const faqs = Array.from({ length: 8 }, (_, i) => ({
    q: t(`landing.faq.q${i}`),
    a: t(`landing.faq.a${i}`),
  }));

  return (
    <section className="py-24 md:py-36 px-5">
      <div className="max-w-3xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4">
            {t("landing.faq.title")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("landing.faq.subtitle")}
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-3"
        >
          {faqs.map((faq, i) => (
            <motion.details
              key={i}
              variants={fadeUp}
              className="group rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between px-6 py-5 text-left font-semibold text-card-foreground hover:bg-muted/30 transition-colors [&::-webkit-details-marker]:hidden list-none">
                <span className="pr-4">{faq.q}</span>
                <ChevronDown className="w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                {faq.a}
              </div>
            </motion.details>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Final CTA Section ── */
function FinalCTASection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="relative py-32 md:py-44 px-5 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/cta-bg.jpg"
          alt=""
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-background/90" />
      </div>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-primary/8 blur-[160px]" />
      </div>
      <div className="relative max-w-2xl mx-auto text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl md:text-6xl font-bold tracking-tighter mb-8"
        >
          {t("landing.cta.headline")}
        </motion.h2>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="mb-12"
        >
          <div className="inline-flex items-center justify-center mb-2">
            <FitSoulLogo className="w-6 h-6" color="hsl(var(--primary))" />
          </div>
          <p className="text-muted-foreground text-sm">{t("landing.hero.tagline")}</p>
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
        >
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="rounded-full px-12 py-7 text-base font-semibold glow-primary group shadow-2xl"
          >
            {t("landing.cta.button")}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/20 py-10 px-5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <FitSoulLogo className="w-4 h-4" color="hsl(var(--primary))" />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Onne Fit. {t("landing.footer.rights")}
        </p>
      </div>
    </footer>
  );
}

/* ── Pricing Section ── */
function PricingSection() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isBRL = i18n.language?.startsWith("pt");
  const [isAnnual, setIsAnnual] = React.useState(false);

  const plans = [
    {
      key: "free",
      icon: Zap,
      price: { brl: 0, usd: 0 },
      popular: false,
      features: ["f0", "f1", "f2", "f3", "f10", "f11", "f12"],
      excluded: ["x2"],
    },
    {
      key: "essential",
      icon: Heart,
      price: { brl: 19.90, usd: 3.90 },
      popular: false,
      features: ["f0", "f1", "f2", "f3", "f4", "f9"],
      excluded: ["x1", "x2"],
    },
    {
      key: "pro",
      icon: Sparkles,
      price: { brl: 29.90, usd: 9.90 },
      popular: true,
      features: ["f0", "f1", "f2", "f3", "f4", "f5", "f6"],
      excluded: ["x2"],
    },
    {
      key: "premium",
      icon: Crown,
      price: { brl: 49.90, usd: 19.90 },
      popular: false,
      features: ["f0", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8"],
      excluded: [],
    },
  ];

  const formatPrice = (value: number) => {
    if (value === 0) return "0";
    const final = isAnnual ? +(value * 0.8).toFixed(2) : value;
    return isBRL
      ? final.toFixed(2).replace(".", ",")
      : final.toFixed(2);
  };

  return (
    <section className="py-28 md:py-36 px-5 relative" id="pricing">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/30 to-transparent" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/4 blur-[180px]" />
      </div>
      <div className="relative max-w-6xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {t("landing.pricing.title")}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            {t("landing.pricing.subtitle")}
          </p>
        </motion.div>

        {/* Toggle mensal / anual */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mb-16"
        >
          <span className={`text-sm font-medium transition-colors ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
            {t("landing.pricing.monthly")}
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
              isAnnual ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-background shadow-md transition-transform duration-300 ${
                isAnnual ? "translate-x-7" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm font-medium transition-colors ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
            {t("landing.pricing.annual")}
          </span>
          {isAnnual && (
            <span className="ml-1 text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
              -20%
            </span>
          )}
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-4 items-start"
        >
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            const rawPrice = isBRL ? plan.price.brl : plan.price.usd;
            const price = formatPrice(rawPrice);
            const currency = isBRL ? "R$" : "$";
            const isFree = rawPrice === 0;
            return (
              <motion.div
                key={plan.key}
                variants={fadeUp}
                custom={idx}
                className={`relative rounded-3xl border p-7 md:p-8 transition-all duration-300 ${
                  plan.popular
                    ? "border-primary/40 bg-card/80 shadow-xl shadow-primary/5 md:-mt-4 md:mb-[-16px]"
                    : "border-border/30 bg-card/40 hover:border-border/50"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-4 py-1 text-xs font-semibold shadow-lg shadow-primary/20">
                      <Star className="w-3 h-3 fill-current" />
                      {t("landing.pricing.popular")}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                    plan.popular ? "bg-primary/15" : "bg-primary/10"
                  }`}>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold">{t(`landing.pricing.plans.${plan.key}.name`)}</h3>
                </div>

                <div className="mb-2">
                  <span className="text-4xl font-extrabold tracking-tight">
                    {currency}{price}
                  </span>
                  {!isFree && (
                    <span className="text-muted-foreground text-sm ml-1">
                      /{t("landing.pricing.month")}
                    </span>
                  )}
                </div>
                {!isFree && isAnnual && (
                  <p className="text-xs text-primary font-medium mb-1">
                    {t("landing.pricing.billedAnnually")}
                  </p>
                )}
                <p className="text-sm text-muted-foreground mb-8">
                  {t(`landing.pricing.plans.${plan.key}.desc`)}
                </p>

                <Button
                  onClick={() => navigate("/auth")}
                  className={`w-full rounded-full py-5 font-semibold mb-8 ${
                    plan.popular ? "glow-primary-sm" : ""
                  }`}
                  variant={plan.popular ? "default" : "outline"}
                >
                  {t(`landing.pricing.plans.${plan.key}.cta`)}
                </Button>

                <div className="space-y-3">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground/80">
                        {t(`landing.pricing.features.${f}`)}
                      </span>
                    </div>
                  ))}
                  {plan.excluded.map((x) => (
                    <div key={x} className="flex items-start gap-2.5 opacity-40">
                      <X className="w-4 h-4 mt-0.5 shrink-0" />
                      <span className="text-sm line-through">
                        {t(`landing.pricing.excluded.${x}`)}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={4}
          className="text-center text-xs text-muted-foreground mt-10"
        >
          {t("landing.pricing.note")}
        </motion.p>
      </div>
    </section>
  );
}

/* ── Main ── */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <BenefitsSection />
      <ProductSection />
      <PricingSection />
      <FAQSection />
      <PhilosophySection />
      <SocialProofSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
