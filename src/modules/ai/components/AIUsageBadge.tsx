import { useAIUsage } from "@/modules/ai/hooks/useAIUsage";
import { BoltCircleBold } from "solar-icon-set";

export function AIUsageBadge() {
  const { usage, isLoading, isUnlimited, remaining } = useAIUsage();

  if (isLoading || !usage) return null;

  const label = isUnlimited
    ? "∞ ilimitado"
    : `${usage.used}/${usage.limit} este mês`;

  const isLow = !isUnlimited && remaining <= 1;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        isLow
          ? "bg-destructive/10 text-destructive"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <BoltCircleBold className="w-3.5 h-3.5" />
      <span>{label}</span>
    </div>
  );
}
