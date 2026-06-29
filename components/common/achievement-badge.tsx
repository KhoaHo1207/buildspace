import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Award } from "lucide-react";
import type { AchievementBadgeProps } from "@/types/components";

export function AchievementBadge({
  name,
  description,
  icon,
  earned,
  earnedAt,
  className,
}: AchievementBadgeProps) {
  return (
    <Card
      className={cn(
        "flex items-center gap-4 p-4 transition-all",
        earned
          ? "bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
          : "opacity-50",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full text-2xl",
          earned
            ? "bg-linear-to-br from-yellow-400 to-orange-400"
            : "bg-gray-200 dark:bg-gray-800",
        )}
      >
        {icon}
      </div>

      <div className="flex-1">
        <h4 className="font-semibold">{name}</h4>
        <p className="text-sm text-gray-500">{description}</p>
        {earned && earnedAt && (
          <p className="mt-1 text-xs text-gray-400">
            Earned on {new Date(earnedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      {earned && <Award className="h-5 w-5 text-yellow-500" />}
    </Card>
  );
}
