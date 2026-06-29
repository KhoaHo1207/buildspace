import type { AchievementWithStatus } from "@/types/api/achievements";
import type { CourseListItem } from "@/types/api/courses";
import type { LeaderboardEntry } from "@/types/api/leaderboard";
import type { UserStats } from "@/types/api/user";

export type CourseCardProps = CourseListItem;

export type AchievementBadgeProps = Pick<
  AchievementWithStatus,
  "name" | "description" | "icon" | "earned"
> & {
  earnedAt?: string | Date;
  className?: string;
};

export type LeaderboardTableProps = {
  entries: LeaderboardEntry[];
  currentUserId?: string;
};

export type StatsCardsProps = {
  stats: Pick<
    UserStats,
    | "coursesInProgress"
    | "completedCourses"
    | "currentStreak"
    | "totalXP"
    | "level"
  >;
};

export type EnrollButtonProps = {
  courseId: string;
  isEnrolled: boolean;
  onEnrollChange?: (enrolled: boolean) => void;
  variant?: "default" | "outline" | "ghost" | "secondary";
  size?: "default" | "sm" | "lg";
};

export type YouTubeVideoProps = {
  videoId: string;
  title?: string;
};

export type StreakDisplayProps = {
  streak: number;
  className?: string;
};

export type ProgressBarProps = {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
};
