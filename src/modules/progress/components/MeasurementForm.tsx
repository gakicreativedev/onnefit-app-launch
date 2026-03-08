import { useState, forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MEASUREMENT_LABELS, MEASUREMENT_ICON_KEYS, type MeasurementField, type BodyMeasurement, type MeasurementIconKey } from "../types";
import { RulerBold, GraphUpBold, ChartBold, DumbbellBold, WalkingBold, ClipboardTextBold } from "solar-icon-set";

const ICON_MAP: Record<MeasurementIconKey, typeof RulerBold> = {
    scale: ChartBold,
    chart: GraphUpBold,
    ruler: RulerBold,
    muscle: DumbbellBold,
    leg: WalkingBold,
};

interface MeasurementFormProps {
    onSubmit: (data: Omit<BodyMeasurement, "id" | "user_id" | "created_at">) => Promise<boolean | undefined>;
    onCancel: () => void;
}

const FIELDS: MeasurementField[] = [
    "weight_kg", "body_fat_pct", "waist_cm", "hip_cm", "chest_cm",
    "arm_left_cm", "arm_right_cm", "thigh_left_cm", "thigh_right_cm", "neck_cm",
];

export const MeasurementForm = forwardRef<HTMLFormElement, MeasurementFormProps>(({ onSubmit, onCancel }, ref) => {
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [values, setValues] = useState<Record<string, string>>({});
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const data: any = { date, notes: notes || null };
        for (const field of FIELDS) {
            data[field] = values[field] ? parseFloat(values[field]) : null;
        }

        const hasValue = FIELDS.some((f) => data[f] !== null);
        if (!hasValue) {
            setSaving(false);
            return;
        }

        const ok = await onSubmit(data);
        setSaving(false);
        if (ok) {
            setValues({});
            setNotes("");
            onCancel();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="date" className="text-sm font-semibold">Data</Label>
                <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 h-11 rounded-xl bg-background/50"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                {FIELDS.map((field) => {
                    const Icon = ICON_MAP[MEASUREMENT_ICON_KEYS[field]];
                    return (
                        <div key={field}>
                            <Label htmlFor={field} className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <Icon size={12} color="currentColor" /> {MEASUREMENT_LABELS[field]}
                            </Label>
                            <Input
                                id={field}
                                type="number"
                                step="0.1"
                                min="0"
                                placeholder="—"
                                value={values[field] || ""}
                                onChange={(e) => setValues((prev) => ({ ...prev, [field]: e.target.value }))}
                                className="mt-0.5 h-10 rounded-xl bg-background/50 text-sm"
                            />
                        </div>
                    );
                })}
            </div>

            <div>
                <Label htmlFor="notes" className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <ClipboardTextBold size={14} color="currentColor" /> Observações
                </Label>
                <Input
                    id="notes"
                    placeholder="Como você se sente?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-0.5 h-10 rounded-xl bg-background/50"
                />
            </div>

            <div className="flex gap-2 pt-2">
                <Button type="button" variant="outline" className="flex-1 rounded-xl" onClick={onCancel}>Cancelar</Button>
                <Button type="submit" className="flex-1 rounded-xl glow-primary-sm" disabled={saving}>
                    {saving ? "Salvando..." : "Registrar"}
                </Button>
            </div>
        </form>
    );
});

MeasurementForm.displayName = "MeasurementForm";
