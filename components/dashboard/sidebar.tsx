"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Trophy, Award, Code } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { motion } from "framer-motion";

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Courses",
    icon: BookOpen,
    href: "/courses",
    color: "text-violet-500",
  },
  {
    label: "Leaderboard",
    icon: Trophy,
    href: "/leaderboard",
    color: "text-orange-500",
  },
  {
    label: "Achievements",
    icon: Award,
    href: "/achievements",
    color: "text-emerald-500",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col border-r bg-white dark:bg-gray-900">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-purple-500 to-indigo-500"
          >
            <Code className="h-5 w-5 text-white" />
          </motion.div>
          <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-xl font-bold text-transparent">
            BuildSpace
          </span>
        </div>
      </div>

      <div className="flex-1 px-3">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
              pathname === route.href
                ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                : "",
            )}
          >
            <route.icon className={cn("h-5 w-5", route.color)} />
            <span>{route.label}</span>
          </Link>
        ))}
      </div>

      <div className="border-t p-6">
        <div className="flex items-center gap-3">
          <UserButton />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">Profile</p>
            <p className="truncate text-xs text-gray-500">Settings</p>
          </div>
        </div>
      </div>
    </div>
  );
}
