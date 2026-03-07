import { GOALS } from "../../constants";
import { OptionCard } from "../OptionCard";
import { useTranslation } from "react-i18next";
import type { OnboardingData } from "../../types";

interface GoalStepProps {
  data: OnboardingData;
  onUpdate: (field: keyof OnboardingData, value: any) => void;
}

export function GoalStep({ data, onUpdate }: GoalStepProps) {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      {GOALS.map((g) => (
        <OptionCard
          key={g.value}
          label={t(`onboarding.goals.${g.value}`)}
          desc={t(`onboarding.goals.${g.value}_desc`)}
          selected={data.goal === g.value}
          onClick={() => onUpdate("goal", g.value)}
        />
      ))}
    </div>
  );
}
