import { useState, lazy, Suspense } from "react";
import { useBodyMeasurements } from "../hooks/useBodyMeasurements";
import { useProgressPhotos } from "../hooks/useProgressPhotos";
import { MeasurementForm } from "../components/MeasurementForm";
import { ProgressCharts } from "../components/ProgressCharts";
import { PhotoGallery } from "../components/PhotoGallery";
import { MEASUREMENT_LABELS, MEASUREMENT_ICON_KEYS, type MeasurementField, type MeasurementIconKey } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
    RulerBold, GraphUpBold, CameraBold, CalendarMinimalisticBold, ChartBold,
    DumbbellBold, WalkingBold,
} from "solar-icon-set";

const HistoryPage = lazy(() => import("@/modules/history/pages/HistoryPage"));

type Tab = "overview" | "charts" | "photos" | "history";

const MEASUREMENT_SOLAR_ICONS: Record<MeasurementIconKey, typeof RulerBold> = {
    scale: ChartBold,
    chart: GraphUpBold,
    ruler: RulerBold,
    muscle: DumbbellBold,
    leg: WalkingBold,
};

const TAB_ICONS: Record<Tab, typeof RulerBold> = {
    overview: RulerBold,
    charts: GraphUpBold,
    photos: CameraBold,
    history: CalendarMinimalisticBold,
};

function DeltaBadge({ label, iconKey, current, previous, invert }: {
    label: string;
    iconKey: MeasurementIconKey;
    current: number | null;
    previous: number | null;
    invert?: boolean;
}) {
    if (current === null) return null;
    const diff = previous !== null ? current - previous : null;
    const isGood = diff !== null ? (invert ? diff < 0 : diff > 0) : null;
    const Icon = MEASUREMENT_SOLAR_ICONS[iconKey];

    return (
        <div className="rounded-2xl bg-card border border-border/40 p-3 flex flex-col gap-1">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                <Icon size={12} color="currentColor" /> {label}
            </span>
            <span className="text-xl font-black">{current}</span>
            {diff !== null && (
                <span className={`text-xs font-bold ${isGood ? "text-green-500" : "text-destructive"}`}>
                    {diff > 0 ? "+" : ""}{diff.toFixed(1)}
                </span>
            )}
        </div>
    );
}

export default function ProgressPage() {
    const { measurements, loading, add, remove, latest, previous } = useBodyMeasurements();
    const { photos, loading: photosLoading, uploading, upload, remove: removePhoto } = useProgressPhotos();
    const [tab, setTab] = useState<Tab>("overview");
    const [showForm, setShowForm] = useState(false);
    const { t } = useTranslation();

    const tabs: { id: Tab; label: string }[] = [
        { id: "overview", label: t("progress.measurements") },
        { id: "charts", label: t("progress.charts") },
        { id: "photos", label: t("progress.photos") },
        { id: "history", label: t("progress.history") },
    ];

    const overviewFields: { field: MeasurementField; invert?: boolean }[] = [
        { field: "weight_kg", invert: true },
        { field: "body_fat_pct", invert: true },
        { field: "waist_cm", invert: true },
        { field: "chest_cm" },
        { field: "arm_left_cm" },
        { field: "arm_right_cm" },
        { field: "hip_cm", invert: true },
        { field: "thigh_left_cm" },
        { field: "thigh_right_cm" },
        { field: "neck_cm" },
    ];

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center gap-3">
                <ChartBold size={28} color="currentColor" className="text-primary" />
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black">{t("progress.bodyProgress")}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{t("progress.bodyProgressDesc")}</p>
                </div>
            </div>

            <div className="flex gap-1 bg-muted/50 rounded-2xl p-1">
                {tabs.map((tb) => {
                    const Icon = TAB_ICONS[tb.id];
                    return (
                        <button
                            key={tb.id}
                            onClick={() => setTab(tb.id)}
                            className={`relative flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold transition-all ${tab === tb.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            {tab === tb.id && (
                                <motion.div
                                    layoutId="progress-tab"
                                    className="absolute inset-0 rounded-xl bg-primary glow-primary-sm"
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10"><Icon size={14} color="currentColor" /></span>
                            <span className="relative z-10 hidden sm:inline">{tb.label}</span>
                        </button>
                    );
                })}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                >
                    {tab === "overview" && (
                        <div className="space-y-4">
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="w-full rounded-2xl border-2 border-dashed border-primary/30 py-4 text-sm font-bold text-primary hover:border-primary/60 hover:bg-primary/5 transition-all"
                            >
                                {showForm ? `✕ ${t("progress.closeForm")}` : t("progress.newMeasurement")}
                            </button>

                            <AnimatePresence>
                                {showForm && (
                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                        <div className="glass-card rounded-2xl p-4">
                                            <MeasurementForm onSubmit={add} onCancel={() => setShowForm(false)} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                </div>
                            ) : latest ? (
                                <>
                                    <p className="text-xs text-muted-foreground">
                                        {t("progress.lastUpdate")}: {new Date(latest.date).toLocaleDateString()}
                                        {latest.notes && <span className="ml-2 italic">— {latest.notes}</span>}
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {overviewFields.map(({ field, invert }) => (
                                            <DeltaBadge
                                                key={field}
                                                label={MEASUREMENT_LABELS[field]}
                                                iconKey={MEASUREMENT_ICON_KEYS[field]}
                                                current={latest[field]}
                                                previous={previous?.[field] ?? null}
                                                invert={invert}
                                            />
                                        ))}
                                    </div>

                                    {measurements.length > 1 && (
                                        <div className="space-y-2 mt-4">
                                            <h3 className="text-sm font-bold text-muted-foreground">{t("progress.measurementHistory")}</h3>
                                            {[...measurements].reverse().map((m) => (
                                                <div key={m.id} className="flex items-center justify-between rounded-xl bg-card border border-border/40 p-3">
                                                    <div>
                                                        <p className="text-sm font-bold">{new Date(m.date).toLocaleDateString()}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {m.weight_kg && `${m.weight_kg}kg`}
                                                            {m.body_fat_pct && ` · ${m.body_fat_pct}%`}
                                                            {m.waist_cm && ` · ${m.waist_cm}cm ${t("progress.waist")}`}
                                                        </p>
                                                    </div>
                                                    <button onClick={() => remove(m.id)} className="text-xs text-destructive hover:underline font-semibold">
                                                        {t("progress.deleteLabel")}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                                    <RulerBold size={48} color="currentColor" className="mb-4" />
                                    <p className="text-sm font-bold">{t("progress.noMeasurementsYet")}</p>
                                    <p className="text-xs mt-1">{t("progress.recordMeasurements")}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {tab === "charts" && (
                        <div className="glass-card rounded-2xl p-4">
                            <ProgressCharts measurements={measurements} />
                        </div>
                    )}

                    {tab === "photos" && (
                        <PhotoGallery photos={photos} uploading={uploading} onUpload={upload} onDelete={removePhoto} />
                    )}

                    {tab === "history" && (
                        <Suspense fallback={
                            <div className="flex items-center justify-center py-12">
                                <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            </div>
                        }>
                            <HistoryPage />
                        </Suspense>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
