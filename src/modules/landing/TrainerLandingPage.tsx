import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ChevronDown,
  Zap,
  Users,
  Dumbbell,
  TrendingUp,
  Target,
  Clock,
  Shield,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FitSoulLogo } from "@/components/FitSoulLogo";

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

/* ── Inline CTA ── */
function InlineCTA({ labelKey }: { labelKey?: string }) {
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
        {t(labelKey || "trainerLanding.hero.cta")} <ArrowRight className="w-4 h-4" />
      </Button>
    </motion.div>
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
        <div className="flex items-center gap-3">
          <FitSoulLogo className="w-10 h-10" color="hsl(var(--primary))" />
          <span className="text-xs font-medium text-muted-foreground border border-border/40 rounded-full px-2.5 py-0.5">
            Coaches
          </span>
        </div>
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
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[150px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center px-5">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-8">
            <Zap className="w-3.5 h-3.5" />
            {t("trainerLanding.hero.tagline")}
          </span>
        </motion.div>
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[0.95] mb-7"
        >
          {t("trainerLanding.hero.headline")}
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          {t("trainerLanding.hero.subheadline1")}
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="text-sm sm:text-base text-muted-foreground/80 max-w-xl mx-auto mb-12 leading-relaxed"
        >
          {t("trainerLanding.hero.subheadline2")}
        </motion.p>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}>
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="rounded-full px-10 py-7 text-base font-semibold glow-primary group shadow-2xl"
          >
            {t("trainerLanding.hero.cta")}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={6} className="mt-20 flex justify-center">
          <ChevronDown className="w-5 h-5 text-muted-foreground/30 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

/* ── Problem Section ── */
function ProblemSection() {
  const { t } = useTranslation();
  const painPoints = [
    t("trainerLanding.problem.p1"),
    t("trainerLanding.problem.p2"),
    t("trainerLanding.problem.p3"),
    t("trainerLanding.problem.p4"),
  ];
  return (
    <section className="py-24 sm:py-32 bg-card/30">
      <div className="max-w-3xl mx-auto px-5 text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-8"
        >
          {t("trainerLanding.problem.title")}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="text-muted-foreground text-base sm:text-lg mb-8 leading-relaxed"
        >
          {t("trainerLanding.problem.intro")}
        </motion.p>
        <motion.ul
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-col gap-3 items-center mb-10"
        >
          {painPoints.map((point, i) => (
            <motion.li key={i} variants={fadeUp} custom={i + 2} className="flex items-center gap-3 text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
              {point}
            </motion.li>
          ))}
        </motion.ul>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={6}
          className="text-muted-foreground/80 text-sm sm:text-base leading-relaxed max-w-lg mx-auto"
        >
          {t("trainerLanding.problem.conclusion1")}
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={7}
          className="text-foreground font-semibold text-base sm:text-lg mt-4"
        >
          {t("trainerLanding.problem.conclusion2")}
        </motion.p>
        <InlineCTA />
      </div>
    </section>
  );
}

/* ── Solution Section ── */
function SolutionSection() {
  const { t } = useTranslation();
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-3xl mx-auto px-5 text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6"
        >
          {t("trainerLanding.solution.title")}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="text-muted-foreground text-base sm:text-lg mb-4 leading-relaxed"
        >
          {t("trainerLanding.solution.p1")}
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          className="text-muted-foreground text-base sm:text-lg mb-10 leading-relaxed"
        >
          {t("trainerLanding.solution.p2")}
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
          className="text-2xl sm:text-3xl font-bold text-primary tracking-wide"
        >
          {t("trainerLanding.solution.pillars")}
        </motion.p>
        <InlineCTA />
      </div>
    </section>
  );
}

/* ── Benefits Section ── */
function BenefitsSection() {
  const { t } = useTranslation();
  const benefits = [
    { icon: Clock, titleKey: "trainerLanding.benefits.b0.title", descKey: "trainerLanding.benefits.b0.desc" },
    { icon: Shield, titleKey: "trainerLanding.benefits.b1.title", descKey: "trainerLanding.benefits.b1.desc" },
    { icon: BarChart3, titleKey: "trainerLanding.benefits.b2.title", descKey: "trainerLanding.benefits.b2.desc" },
  ];
  return (
    <section className="py-24 sm:py-32 bg-card/30">
      <div className="max-w-5xl mx-auto px-5">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            {t("trainerLanding.benefits.title")}
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            {t("trainerLanding.benefits.subtitle")}
          </p>
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 sm:grid-cols-3"
        >
          {benefits.map((b, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="relative group rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm p-8 text-center hover:border-primary/30 transition-colors"
            >
              <div className="mx-auto mb-5 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <b.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-3">{t(b.titleKey)}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{t(b.descKey)}</p>
            </motion.div>
          ))}
        </motion.div>
        <InlineCTA />
      </div>
    </section>
  );
}

/* ── Features Section ── */
function FeaturesSection() {
  const { t } = useTranslation();
  const features = [
    { icon: Users, titleKey: "trainerLanding.features.f0.title", descKey: "trainerLanding.features.f0.desc" },
    { icon: Dumbbell, titleKey: "trainerLanding.features.f1.title", descKey: "trainerLanding.features.f1.desc" },
    { icon: TrendingUp, titleKey: "trainerLanding.features.f2.title", descKey: "trainerLanding.features.f2.desc" },
    { icon: Target, titleKey: "trainerLanding.features.f3.title", descKey: "trainerLanding.features.f3.desc" },
  ];
  return (
    <section className="py-24 sm:py-32">
      <div className="max-w-5xl mx-auto px-5">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            {t("trainerLanding.features.title")}
          </h2>
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 sm:grid-cols-2"
        >
          {features.map((f, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="flex gap-5 items-start rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm p-7 hover:border-primary/30 transition-colors"
            >
              <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1.5">{t(f.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(f.descKey)}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <InlineCTA />
      </div>
    </section>
  );
}

/* ── Final CTA Section ── */
function FinalCTASection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="relative py-28 sm:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/6 blur-[180px] pointer-events-none" />
      <div className="relative max-w-3xl mx-auto text-center px-5">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6"
        >
          {t("trainerLanding.cta.headline")}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="text-muted-foreground text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        >
          {t("trainerLanding.cta.body")}
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={2}
          className="flex flex-col items-center gap-6"
        >
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="rounded-full px-10 py-7 text-base font-semibold glow-primary group shadow-2xl"
          >
            {t("trainerLanding.cta.button")}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <div className="flex items-center gap-2 text-muted-foreground/60 text-sm">
            <FitSoulLogo className="w-5 h-5" color="hsl(var(--muted-foreground))" />
            <span>{t("trainerLanding.cta.tagline")}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/20 py-8">
      <div className="max-w-6xl mx-auto px-5 flex items-center justify-between text-xs text-muted-foreground/50">
        <div className="flex items-center gap-2">
          <FitSoulLogo className="w-4 h-4" color="hsl(var(--muted-foreground))" />
          <span>Onne Fit</span>
        </div>
        <span>© {new Date().getFullYear()} — {t("landing.footer.rights")}</span>
      </div>
    </footer>
  );
}

/* ── Main Page ── */
export default function TrainerLandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <BenefitsSection />
      <FeaturesSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
