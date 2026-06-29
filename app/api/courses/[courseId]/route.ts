import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }, // ← Change type to Promise
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // ✅ Await params to get courseId
    const { courseId } = await params;

    const user = await db.query.users.findFirst({
      where: { clerkId: userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get course with lessons
    const course = await db.query.courses.findFirst({
      where: { id: courseId },
      with: {
        lessons: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!course) {
      return new NextResponse("Course not found", { status: 404 });
    }

    // Check if user is enrolled
    const enrollment = await db.query.enrollments.findFirst({
      where: { userId: user.id, courseId },
    });

    // Get progress for each lesson if enrolled
    let lessonsWithProgress = course.lessons ?? [];
    if (enrollment) {
      const lessonIds = course.lessons.map((l) => l.id);
      const userProgress = await db.query.progress.findMany({
        where: {
          userId: user.id,
          lessonId: { in: lessonIds },
        },
      });

      lessonsWithProgress = course.lessons.map((lesson) => ({
        ...lesson,
        completed: userProgress.some(
          (p) => p.lessonId === lesson.id && p.completed,
        ),
      }));
    } else {
      lessonsWithProgress = course.lessons.map((lesson) => ({
        ...lesson,
        completed: false,
      }));
    }

    return NextResponse.json({
      ...course,
      lessons: lessonsWithProgress,
      enrolled: !!enrollment,
      completed: enrollment?.completed || false,
    });
  } catch (error) {
    console.log("[COURSE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
