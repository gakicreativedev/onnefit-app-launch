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
  Globe,
  Zap,
  BarChart3,
  Calendar,
  Users,
  Star,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FitSoulLogo } from "@/components/FitSoulLogo";

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

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const langs = [
    { code: "en", label: "EN" },
    { code: "pt", label: "PT" },
    { code: "es", label: "ES" },
  ];
  return (
    <div className="flex items-center gap-1 rounded-full border border-border/50 bg-card/50 backdrop-blur-sm px-1 py-0.5">
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => i18n.changeLanguage(l.code)}
          className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
            i18n.language?.startsWith(l.code)
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function Navbar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 md:py-4">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <FitSoulLogo className="w-5 h-5" color="hsl(var(--primary))" />
          </div>
          <span className="text-lg font-bold tracking-tight">Onne Fit</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Button
            size="sm"
            onClick={() => navigate("/auth")}
            className="rounded-full px-5 font-medium"
          >
            {t("landing.nav.login")}
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}

function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden pt-20 pb-16 px-5">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-xs font-medium text-primary mb-8">
            <Zap className="w-3 h-3" />
            {t("landing.hero.tagline")}
          </span>
        </motion.div>
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6"
        >
          {t("landing.hero.headline")}
        </motion.h1>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={2}
          className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed"
        >
          {t("landing.hero.subheadline")}
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={3}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="rounded-full px-8 py-6 text-base font-semibold glow-primary group"
          >
            {t("landing.hero.cta")}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={4}
          className="mt-16 flex justify-center"
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground/40 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const { t } = useTranslation();
  return (
    <section className="py-24 md:py-32 px-5">
      <div className="max-w-3xl mx-auto text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-8"
        >
          {t("landing.problem.title")}
        </motion.h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed"
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
          className="mt-8 text-lg md:text-xl font-semibold text-foreground"
        >
          {t("landing.problem.conclusion")}
        </motion.p>
      </div>
    </section>
  );
}

function SolutionSection() {
  const { t } = useTranslation();
  return (
    <section className="py-24 md:py-32 px-5 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/4 blur-[150px]" />
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          custom={0}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
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
          className="text-muted-foreground text-base md:text-lg leading-relaxed mb-10"
        >
          {t("landing.solution.p2")}
        </motion.p>
        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={3}
          className="text-xl md:text-2xl font-bold tracking-wide text-primary"
        >
          {t("landing.solution.pillars")}
        </motion.p>
      </div>
    </section>
  );
}

const featureIcons = [Dumbbell, BarChart3, Flame, Target];

function FeaturesSection() {
  const { t } = useTranslation();
  const features = [0, 1, 2, 3];
  return (
    <section className="py-24 md:py-32 px-5">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-16"
        >
          {t("landing.features.title")}
        </motion.h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {features.map((i) => {
            const Icon = featureIcons[i];
            return (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                className="group relative rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm p-7 md:p-8 hover:border-primary/30 transition-all duration-300"
              >
                <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/15 transition-colors">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  {t(`landing.features.f${i}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`landing.features.f${i}.desc`)}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  const { t } = useTranslation();
  const benefits = [0, 1, 2];
  const icons = [Calendar, TrendingUp, Users];
  return (
    <section className="py-24 md:py-32 px-5 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
      <div className="max-w-4xl mx-auto text-center">
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
          className="text-muted-foreground text-base md:text-lg mb-16 max-w-xl mx-auto"
        >
          {t("landing.benefits.subtitle")}
        </motion.p>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {benefits.map((i) => {
            const Icon = icons[i];
            return (
              <motion.div key={i} variants={fadeUp} custom={i} className="flex flex-col items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-base font-semibold">{t(`landing.benefits.b${i}.title`)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(`landing.benefits.b${i}.desc`)}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function ProductSection() {
  const { t } = useTranslation();
  return (
    <section className="py-24 md:py-32 px-5">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-16"
        >
          {t("landing.product.title")}
        </motion.h2>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="aspect-[9/16] md:aspect-[3/4] rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm flex items-center justify-center"
            >
              <div className="text-center px-6">
                <div className="h-12 w-12 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  {i === 0 && <BarChart3 className="w-6 h-6 text-muted-foreground/60" />}
                  {i === 1 && <Dumbbell className="w-6 h-6 text-muted-foreground/60" />}
                  {i === 2 && <TrendingUp className="w-6 h-6 text-muted-foreground/60" />}
                </div>
                <p className="text-sm text-muted-foreground/60">{t(`landing.product.s${i}`)}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function PhilosophySection() {
  const { t } = useTranslation();
  return (
    <section className="py-24 md:py-40 px-5 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]" />
      </div>
      <div className="relative max-w-2xl mx-auto text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-8"
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
          className="text-muted-foreground text-base md:text-lg leading-relaxed"
        >
          {t("landing.philosophy.body")}
        </motion.p>
      </div>
    </section>
  );
}

function SocialProofSection() {
  const { t } = useTranslation();
  const testimonials = [0, 1, 2];
  return (
    <section className="py-24 md:py-32 px-5">
      <div className="max-w-5xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold tracking-tight text-center mb-16"
        >
          {t("landing.social.title")}
        </motion.h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {testimonials.map((i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              custom={i}
              className="rounded-2xl border border-border/40 bg-card/50 p-6 md:p-7"
            >
              <Quote className="w-5 h-5 text-primary/40 mb-4" />
              <p className="text-sm text-muted-foreground leading-relaxed mb-5 italic">
                "{t(`landing.social.t${i}.quote`)}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {t(`landing.social.t${i}.name`).charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{t(`landing.social.t${i}.name`)}</p>
                  <p className="text-xs text-muted-foreground">{t(`landing.social.t${i}.role`)}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mt-4">
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

function FinalCTASection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <section className="py-24 md:py-40 px-5 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-primary/6 blur-[150px]" />
      </div>
      <div className="relative max-w-2xl mx-auto text-center">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
        >
          {t("landing.cta.headline")}
        </motion.h2>
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={1}
          className="mb-10"
        >
          <p className="text-xl font-bold mb-1">Onne Fit</p>
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
            className="rounded-full px-10 py-6 text-base font-semibold glow-primary group"
          >
            {t("landing.cta.button")}
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-border/30 py-8 px-5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FitSoulLogo className="w-4 h-4" color="hsl(var(--primary))" />
          <span className="text-sm font-semibold">Onne Fit</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Onne Fit. {t("landing.footer.rights")}
        </p>
      </div>
    </footer>
  );
}

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
      <PhilosophySection />
      <SocialProofSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
}
