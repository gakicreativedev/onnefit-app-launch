import { Label } from "@/components/ui/label";
import { TagInput } from "../TagInput";
import { useTranslation } from "react-i18next";
import type { OnboardingData } from "../../types";

interface HealthRestrictionsStepProps {
  data: OnboardingData;
  onUpdate: (field: keyof OnboardingData, value: any) => void;
}

export function HealthRestrictionsStep({ data, onUpdate }: HealthRestrictionsStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>{t("onboarding.injuries")}</Label>
        <p className="text-xs text-muted-foreground">{t("onboarding.injuriesDesc")}</p>
        <TagInput tags={data.injuries} onChange={(tags) => onUpdate("injuries", tags)} placeholder={t("onboarding.injuriesPlaceholder")} />
      </div>
      <div className="space-y-2">
        <Label>{t("onboarding.allergies")}</Label>
        <p className="text-xs text-muted-foreground">{t("onboarding.allergiesDesc")}</p>
        <TagInput tags={data.allergies} onChange={(tags) => onUpdate("allergies", tags)} placeholder={t("onboarding.allergiesPlaceholder")} />
      </div>
      <div className="space-y-2">
        <Label>{t("onboarding.dietaryRestrictions")}</Label>
        <p className="text-xs text-muted-foreground">{t("onboarding.dietaryRestrictionsDesc")}</p>
        <TagInput tags={data.dietary_restrictions} onChange={(tags) => onUpdate("dietary_restrictions", tags)} placeholder={t("onboarding.dietaryRestrictionsPlaceholder")} />
      </div>
      <p className="text-xs text-muted-foreground text-center">{t("onboarding.privacyNote")}</p>
    </div>
  );
}
