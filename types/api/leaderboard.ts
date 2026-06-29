export type LeaderboardEntry = {
  id: string;
  name: string | null;
  username: string | null;
  avatarUrl: string | null;
  points: number;
  level: number;
  currentStreak: number;
  rank: number;
};

export type LeaderboardResponse = {
  entries: LeaderboardEntry[];
  userRank: number | null;
  userPoints: number;
  userLevel: number;
  userStreak: number;
  totalUsers: number;
};
