import { ACTIVITY_LEVELS } from "../../constants";
import { OptionCard } from "../OptionCard";
import { useTranslation } from "react-i18next";
import type { OnboardingData } from "../../types";

interface ActivityLevelStepProps {
  data: OnboardingData;
  onUpdate: (field: keyof OnboardingData, value: any) => void;
}

export function ActivityLevelStep({ data, onUpdate }: ActivityLevelStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      {ACTIVITY_LEVELS.map((a) => (
        <OptionCard
          key={a.value}
          label={t(`onboarding.activityLevels.${a.value}`)}
          desc={t(`onboarding.activityLevels.${a.value}_desc`)}
          selected={data.activity_level === a.value}
          onClick={() => onUpdate("activity_level", a.value)}
        />
      ))}
    </div>
  );
}
