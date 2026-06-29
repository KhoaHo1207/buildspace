import type { Course, Lesson } from "@/types/database";

export type CourseListItem = Pick<
  Course,
  "id" | "title" | "description" | "thumbnail" | "duration" | "points"
> & {
  totalLessons: number;
  enrolled: boolean;
  progress: number;
};

export type LessonWithProgress = Lesson & {
  completed: boolean;
};

export type CourseDetail = Course & {
  lessons: LessonWithProgress[];
  enrolled: boolean;
  completed: boolean;
};
