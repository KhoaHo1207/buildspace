"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  PlayCircle,
  Lock,
  Clock,
  Award,
  FileText,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { EnrollButton } from "@/components/common/enroll-button";
import { YouTubeVideo } from "@/components/common/youtube-video";
import type { CourseDetail, LessonWithProgress } from "@/types/api";

export default function CourseDetailPage() {
  const { courseId } = useParams();
  const queryClient = useQueryClient();
  const [selectedLesson, setSelectedLesson] = useState<LessonWithProgress | null>(
    null,
  );

  const {
    data: course,
    isLoading,
    refetch,
  } = useQuery<CourseDetail>({
    queryKey: ["course", courseId],
    queryFn: async () => {
      const res = await fetch(`/api/courses/${courseId}`);
      if (!res.ok) throw new Error("Failed to fetch course");
      return res.json() as Promise<CourseDetail>;
    },
  });

  const completeLessonMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lessonId, completed: true }),
      });
      if (!res.ok) throw new Error("Failed to update progress");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });

  const handleEnrollChange = (enrolled: boolean) => {
    refetch();
    queryClient.invalidateQueries({ queryKey: ["stats"] });
  };

  const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-purple-600" />
      </div>
    );
  }

  const completedLessons =
    course?.lessons?.filter((lesson) => lesson.completed).length || 0;
  const totalLessons = course?.lessons?.length || 0;
  const progress =
    totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="relative h-64 overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600">
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="absolute inset-0 flex items-center p-8">
          <div className="max-w-3xl flex-1">
            <div className="mb-4 flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-white/30 bg-white/20 text-white"
              >
                <Clock className="mr-1 h-3 w-3" />
                {course?.duration} min
              </Badge>
              <Badge
                variant="outline"
                className="border-white/30 bg-white/20 text-white"
              >
                <Award className="mr-1 h-3 w-3" />
                {course?.points} XP
              </Badge>
            </div>
            <h1 className="mb-2 text-4xl font-bold text-white">
              {course?.title}
            </h1>
            <p className="text-lg text-white/80">{course?.description}</p>
          </div>

          <div className="ml-4">
            <EnrollButton
              courseId={courseId as string}
              isEnrolled={course?.enrolled || false}
              onEnrollChange={handleEnrollChange}
              size="lg"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="lessons" className="space-y-4">
            <TabsList>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </TabsList>

            <TabsContent value="lessons" className="space-y-4">
              {course?.lessons?.map((lesson, index) => {
                const isLocked = !course?.enrolled && index > 0;
                const canStart =
                  course?.enrolled &&
                  (index === 0 || course?.lessons[index - 1]?.completed);
                const hasVideo =
                  lesson.videoUrl && getYouTubeId(lesson.videoUrl);

                return (
                  <div
                    key={lesson.id}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all",
                      lesson.completed &&
                        "border-green-200 bg-green-50 dark:bg-green-900/20",
                      selectedLesson?.id === lesson.id &&
                        "ring-2 ring-purple-500",
                    )}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <div className="flex flex-1 items-center gap-4">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          lesson.completed
                            ? "bg-green-500"
                            : isLocked
                              ? "bg-gray-300"
                              : "bg-purple-500",
                        )}
                      >
                        {lesson.completed ? (
                          <CheckCircle className="h-5 w-5 text-white" />
                        ) : isLocked ? (
                          <Lock className="h-4 w-4 text-white" />
                        ) : (
                          <span className="text-sm font-bold text-white">
                            {index + 1}
                          </span>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {hasVideo && (
                            <Video className="h-4 w-4 text-blue-500" />
                          )}
                          <h3 className="font-medium">{lesson.title}</h3>
                        </div>
                        <p className="text-sm text-gray-500">
                          Lesson {index + 1} of {totalLessons}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!course?.enrolled && index === 0 && (
                        <div className="mr-2 text-sm text-orange-500">
                          Enroll to start
                        </div>
                      )}
                      {!lesson.completed && canStart && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            completeLessonMutation.mutate(lesson.id);
                          }}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Complete
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLesson(lesson);
                        }}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="overview">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 font-semibold">About this course</h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {course?.description}
                  </p>
                  {!course?.enrolled && (
                    <div className="mt-4 rounded-lg bg-purple-50 p-4 dark:bg-purple-950/20">
                      <p className="text-purple-600 dark:text-purple-400">
                        Click the "Enroll Now" button above to start this
                        course!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Progress</CardTitle>
            </CardHeader>
            <CardContent>
              {course?.enrolled ? (
                <>
                  <div className="mb-6 text-center">
                    <div className="mb-2 text-5xl font-bold text-purple-600">
                      {progress.toFixed(0)}%
                    </div>
                    <Progress value={progress} className="mb-4 h-2" />
                    <p className="text-sm text-gray-500">
                      {completedLessons} of {totalLessons} lessons completed
                    </p>
                  </div>

                  {progress === 100 && (
                    <div className="rounded-lg bg-green-50 p-4 text-center dark:bg-green-900/20">
                      <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-500" />
                      <p className="font-semibold text-green-600">
                        🎉 Congratulations!
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        You earned {course?.points} XP
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-6 text-center">
                  <Lock className="mx-auto mb-3 h-12 w-12 text-gray-400" />
                  <p className="text-gray-500">Enroll to track your progress</p>
                  <EnrollButton
                    courseId={courseId as string}
                    isEnrolled={false}
                    onEnrollChange={handleEnrollChange}
                    size="sm"
                    variant="default"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between border-b py-2">
                  <dt className="text-gray-500">Total Duration</dt>
                  <dd className="font-medium">{course?.duration} minutes</dd>
                </div>
                <div className="flex justify-between border-b py-2">
                  <dt className="text-gray-500">Lessons</dt>
                  <dd className="font-medium">{totalLessons}</dd>
                </div>
                <div className="flex justify-between border-b py-2">
                  <dt className="text-gray-500">Total XP</dt>
                  <dd className="font-medium text-yellow-600">
                    {course?.points} XP
                  </dd>
                </div>
                <div className="flex justify-between py-2">
                  <dt className="text-gray-500">Certificate</dt>
                  <dd className="font-medium text-green-600">Yes</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Lesson Modal - Simple version without notes */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-h-[90vh] w-full max-w-4xl overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-purple-600" />
                {selectedLesson.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLesson.videoUrl &&
                getYouTubeId(selectedLesson.videoUrl) && (
                  <YouTubeVideo
                    videoId={getYouTubeId(selectedLesson.videoUrl)!}
                    title={selectedLesson.title}
                  />
                )}

              <div className="mt-6 flex justify-end gap-2 border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => setSelectedLesson(null)}
                >
                  Close
                </Button>
                {course?.enrolled && !selectedLesson.completed && (
                  <Button
                    onClick={() => {
                      completeLessonMutation.mutate(selectedLesson.id);
                      setSelectedLesson(null);
                    }}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Mark as Complete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
