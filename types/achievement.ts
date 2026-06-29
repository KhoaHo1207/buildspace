export type LessonsCompletedCriteria = {
  type: "lessons_completed";
  count: number;
};

export type CoursesCompletedCriteria = {
  type: "courses_completed";
  count: number;
};

export type StreakCriteria = {
  type: "streak";
  days: number;
};

export type AchievementCriteria =
  | LessonsCompletedCriteria
  | CoursesCompletedCriteria
  | StreakCriteria;

export function isAchievementCriteria(
  value: unknown,
): value is AchievementCriteria {
  if (!value || typeof value !== "object") return false;

  const criteria = value as { type?: string; count?: unknown; days?: unknown };

  switch (criteria.type) {
    case "lessons_completed":
    case "courses_completed":
      return typeof criteria.count === "number";
    case "streak":
      return typeof criteria.days === "number";
    default:
      return false;
  }
}
