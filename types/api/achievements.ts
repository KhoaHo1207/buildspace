import type { Achievement } from "@/types/database";

export type AchievementWithStatus = Achievement & {
  earned: boolean;
  earnedAt?: string | Date;
};
