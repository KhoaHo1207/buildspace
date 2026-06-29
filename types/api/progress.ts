export type ProgressRequest = {
  lessonId: string;
  completed: boolean;
};

export type ProgressResponse = {
  success: boolean;
};
