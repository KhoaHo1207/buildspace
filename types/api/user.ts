export type RecentActivityItem = {
  id: string;
  title: string;
  courseTitle: string;
  completedAt: string | Date | null;
};

export type UserStats = {
  username: string;
  level: number;
  totalXP: number;
  nextLevelPoints: number;
  currentStreak: number;
  longestStreak: number;
  totalLessonsCompleted: number;
  coursesInProgress: number;
  completedCourses: number;
  todayProgress: number;
  todayCompleted: number;
  remainingToday: number;
  recentActivity: RecentActivityItem[];
};

export type UserSyncResponse = {
  success: boolean;
  user: {
    id: string;
    clerkId: string;
    email: string;
    name: string | null;
    username: string | null;
    avatarUrl: string | null;
    points: number;
    level: number;
    currentStreak: number;
    longestStreak: number;
  };
  message: string;
};
