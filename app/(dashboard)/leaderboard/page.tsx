"use client";

import { useUser } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Star } from "lucide-react";
import { LeaderboardSkeleton } from "@/lib/skeleton";
import type { LeaderboardEntry, LeaderboardResponse } from "@/types/api";

export default function LeaderboardPage() {
  const { user } = useUser();

  const { data: leaderboard, isLoading } = useQuery<LeaderboardResponse>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const res = await fetch("/api/leaderboard");
      if (!res.ok) throw new Error("Failed to fetch leaderboard");
      return res.json() as Promise<LeaderboardResponse>;
    },
  });

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-orange-600" />;
    return <span className="text-sm text-gray-500">{rank}</span>;
  };

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  const topThree = leaderboard?.entries?.slice(0, 3) || [];
  const restEntries = leaderboard?.entries?.slice(3) || [];
  const currentUserRank = leaderboard?.userRank;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="mt-1 text-gray-500">Top learners ranked by total XP</p>
      </div>

      {/* Your Rank Card */}
      {currentUserRank && (
        <Card className="border-purple-200 bg-linear-to-r from-purple-50 to-indigo-50 dark:border-purple-800 dark:from-purple-950/20 dark:to-indigo-950/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Your Rank</p>
                  <p className="text-2xl font-bold text-purple-600">
                    #{currentUserRank}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">
                    {user?.fullName || user?.username || "You"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {leaderboard?.userPoints?.toLocaleString() || 0} XP • Level{" "}
                    {leaderboard?.userLevel || 1}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3 text-yellow-500" />
                {leaderboard?.userStreak || 0} day streak
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <div className="grid gap-4 md:grid-cols-3">
          {topThree.map((entry: LeaderboardEntry, index: number) => (
            <Card
              key={entry.id}
              className={`text-center ${
                index === 0
                  ? "border-yellow-500 bg-linear-to-b from-yellow-50 to-transparent dark:from-yellow-950/20"
                  : index === 1
                    ? "border-gray-400"
                    : "border-orange-600"
              }`}
            >
              <CardContent className="pt-6">
                <div className="mb-2 text-4xl">
                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                </div>
                <Avatar className="mx-auto mb-3 h-16 w-16">
                  <AvatarImage src={entry.avatarUrl || undefined} />
                  <AvatarFallback className="bg-linear-to-r from-purple-600 to-indigo-600 text-lg text-white">
                    {(entry.name || entry.username || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="truncate text-lg font-semibold">
                  {entry.name || entry.username || "Anonymous"}
                </p>
                <p className="mt-2 text-2xl font-bold text-purple-600">
                  {entry.points.toLocaleString()} XP
                </p>
                <p className="text-sm text-gray-500">Level {entry.level}</p>
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-orange-500">
                  🔥 {entry.currentStreak} day streak
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Rest of Leaderboard */}
      {restEntries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>All Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {restEntries.map((entry: LeaderboardEntry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center font-semibold">
                      {getRankIcon(entry.rank)}
                    </div>
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={entry.avatarUrl || undefined} />
                      <AvatarFallback className="bg-purple-100 text-purple-600 dark:bg-purple-900/30">
                        {(entry.name || entry.username || "U")
                          .charAt(0)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {entry.name || entry.username || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Level {entry.level} • 🔥 {entry.currentStreak} days
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">
                      {entry.points.toLocaleString()} XP
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {leaderboard?.entries?.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Trophy className="mx-auto mb-3 h-12 w-12 text-gray-400" />
            <p className="text-gray-500">No leaderboard data yet</p>
            <p className="text-sm text-gray-400">
              Complete lessons to earn XP and appear here!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
