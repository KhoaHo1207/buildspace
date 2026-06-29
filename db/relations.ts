import { defineRelations } from "drizzle-orm";
import { users } from "./schema/users";
import { courses } from "./schema/courses";
import { lessons } from "./schema/lessons";
import { enrollments } from "./schema/enrollments";
import { progress } from "./schema/progress";
import { achievements, userAchievements } from "./schema/achievements";

export const relations = defineRelations(
  {
    users,
    courses,
    lessons,
    enrollments,
    progress,
    achievements,
    userAchievements,
  },
  (r) => ({
    users: {
      enrollments: r.many.enrollments(),
      achievements: r.many.userAchievements(),
      progress: r.many.progress(),
    },
    courses: {
      lessons: r.many.lessons(),
      enrollments: r.many.enrollments(),
    },
    lessons: {
      course: r.one.courses({
        from: r.lessons.courseId,
        to: r.courses.id,
      }),
      progress: r.many.progress(),
    },
    enrollments: {
      user: r.one.users({
        from: r.enrollments.userId,
        to: r.users.id,
      }),
      course: r.one.courses({
        from: r.enrollments.courseId,
        to: r.courses.id,
      }),
    },
    progress: {
      user: r.one.users({
        from: r.progress.userId,
        to: r.users.id,
      }),
      lesson: r.one.lessons({
        from: r.progress.lessonId,
        to: r.lessons.id,
      }),
    },
    achievements: {
      users: r.many.userAchievements(),
    },
    userAchievements: {
      user: r.one.users({
        from: r.userAchievements.userId,
        to: r.users.id,
      }),
      achievement: r.one.achievements({
        from: r.userAchievements.achievementId,
        to: r.achievements.id,
      }),
    },
  }),
);
