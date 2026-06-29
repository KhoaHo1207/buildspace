import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  achievements,
  courses,
  enrollments,
  lessons,
  progress,
  userAchievements,
  users,
} from "@/db/schema";

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Course = InferSelectModel<typeof courses>;
export type NewCourse = InferInsertModel<typeof courses>;
export type Lesson = InferSelectModel<typeof lessons>;
export type NewLesson = InferInsertModel<typeof lessons>;
export type Enrollment = InferSelectModel<typeof enrollments>;
export type NewEnrollment = InferInsertModel<typeof enrollments>;
export type Progress = InferSelectModel<typeof progress>;
export type NewProgress = InferInsertModel<typeof progress>;
export type Achievement = InferSelectModel<typeof achievements>;
export type NewAchievement = InferInsertModel<typeof achievements>;
export type UserAchievement = InferSelectModel<typeof userAchievements>;
export type NewUserAchievement = InferInsertModel<typeof userAchievements>;
