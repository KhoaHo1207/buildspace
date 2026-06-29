# BuildSpace

Nền tảng học lập trình gamified — người dùng đăng ký khóa học, hoàn thành bài học, tích lũy XP, giữ streak và mở khóa achievements. Xếp hạng trên leaderboard để tạo động lực học tập hàng ngày.

## Tính năng chính

- **Xác thực** — Đăng nhập / đăng ký qua [Clerk](https://clerk.com)
- **Khóa học & bài học** — Danh sách khóa học, chi tiết, video YouTube, theo dõi tiến độ
- **Gamification** — XP, level, streak, achievements
- **Leaderboard** — Top người học theo điểm
- **Dashboard** — Tổng quan stats, hoạt động gần đây, mục tiêu hôm nay
- **Import nội dung YouTube** — Script tự động lấy playlist từ kênh YouTube làm khóa học

## Tech stack

| Layer         | Công nghệ                             |
| ------------- | ------------------------------------- |
| Framework     | Next.js 16 (App Router)               |
| Auth          | Clerk                                 |
| Database      | PostgreSQL + Drizzle ORM v1           |
| Data fetching | TanStack React Query                  |
| UI            | shadcn/ui, Tailwind CSS v4, Radix UI  |
| Animation     | Framer Motion                         |
| Types         | TypeScript — tập trung trong `types/` |

## Cấu trúc thư mục

```
buildspace/
├── app/
│   ├── (auth)/              # Sign in / Sign up (Clerk)
│   ├── (dashboard)/         # Dashboard, Courses, Leaderboard, Achievements
│   ├── api/                 # REST API routes
│   ├── layout.tsx
│   └── page.tsx             # Landing page
├── components/
│   ├── common/              # CourseCard, EnrollButton, AchievementBadge...
│   ├── dashboard/           # Sidebar, Header, StatsCards
│   └── ui/                  # shadcn/ui components
├── db/
│   ├── schema/              # Drizzle table definitions
│   ├── relations.ts         # defineRelations (Drizzle v1)
│   ├── drizzle.ts           # DB client
│   └── fetch-youtube-content.ts
├── types/                   # Shared TypeScript types (API, DB, components)
├── constants/               # Landing page content
├── lib/                     # Utils, skeletons
└── drizzle.config.ts
```

## Luồng người dùng

```mermaid
flowchart TD
    A[Đăng nhập Clerk] --> B[/api/user/sync]
    B --> C[Dashboard]
    C --> D[Xem danh sách khóa /api/courses]
    D --> E[Chi tiết khóa /api/courses/:id]
    E --> F[Enroll /api/courses/:id/enroll]
    F --> G[Học bài & hoàn thành /api/progress]
    G --> H[Cập nhật XP, streak, achievements]
    H --> I[Xem stats /api/user/stats]
    H --> J[Leaderboard /api/leaderboard]
    H --> K[Achievements /api/achievements]
```

### 1. Onboarding

User đăng nhập qua Clerk → `POST /api/user/sync` tạo hoặc cập nhật profile trong DB → redirect về `/dashboard`.

### 2. Học khóa học

- Xem khóa học trên Dashboard hoặc `/courses`
- Vào chi tiết khóa → enroll → xem danh sách bài học (video YouTube)
- Đánh dấu hoàn thành bài → tự động enroll nếu chưa enroll

### 3. Gamification

- Mỗi bài hoàn thành cộng XP
- Streak tính theo ngày có bài hoàn thành
- Achievements mở khóa theo số bài, số khóa, hoặc streak
- Leaderboard xếp hạng theo tổng XP

## Trang (Pages)

| Route                  | Mô tả                                     | API sử dụng                                  |
| ---------------------- | ----------------------------------------- | -------------------------------------------- |
| `/`                    | Landing page                              | —                                            |
| `/sign-in`, `/sign-up` | Clerk auth                                | —                                            |
| `/dashboard`           | Tổng quan, sync user, recent activity     | `/api/user/sync`, `/api/user/stats`          |
| `/courses`             | Danh sách khóa học, tìm kiếm              | `/api/courses`                               |
| `/courses/[courseId]`  | Chi tiết, lessons, enroll, hoàn thành bài | `/api/courses/[id]`, `/api/progress`, enroll |
| `/achievements`        | Achievements đã mở / chưa mở              | `/api/achievements`                          |
| `/leaderboard`         | Bảng xếp hạng                             | `/api/leaderboard`                           |

## API Routes

| Endpoint                         | Method       | Mục đích                                          |
| -------------------------------- | ------------ | ------------------------------------------------- |
| `/api/user/sync`                 | POST         | Đồng bộ user Clerk ↔ database                     |
| `/api/user/stats`                | GET          | Stats: XP, level, streak, courses, activity       |
| `/api/courses`                   | GET          | Danh sách khóa + trạng thái enroll                |
| `/api/courses/[courseId]`        | GET          | Chi tiết khóa + lessons + progress                |
| `/api/courses/[courseId]/enroll` | POST, DELETE | Enroll / unenroll                                 |
| `/api/progress`                  | POST         | Cập nhật tiến độ bài học, award XP & achievements |
| `/api/achievements`              | GET          | Tất cả achievements + trạng thái earned           |
| `/api/leaderboard`               | GET          | Top users, rank của user hiện tại                 |
| `/api/streak`                    | GET          | Tính và cập nhật streak                           |

## Database schema

Các bảng trong `db/schema/`:

| Bảng                | Mô tả                                              |
| ------------------- | -------------------------------------------------- |
| `users`             | Profile, Clerk ID, XP, level, streak               |
| `courses`           | Khóa học (title, description, duration, points...) |
| `lessons`           | Bài học thuộc khóa (content, videoUrl, order)      |
| `enrollments`       | User ↔ Course                                      |
| `progress`          | Tiến độ từng bài học                               |
| `achievements`      | Định nghĩa achievement + criteria (JSON)           |
| `user_achievements` | Achievement user đã đạt                            |

Relations được khai báo tập trung tại `db/relations.ts` (Drizzle ORM v1 — `defineRelations`).

Types suy ra từ schema nằm trong `types/database.ts`; response API trong `types/api/`.

## Cài đặt

### Yêu cầu

- Node.js 20+
- PostgreSQL database
- Tài khoản [Clerk](https://clerk.com)
- (Tuỳ chọn) YouTube Data API key để import nội dung

### 1. Clone & cài dependencies

```bash
git clone <repo-url>
cd buildspace
pnpm install
# hoặc: npm install
```

### 2. Biến môi trường

Tạo file `.env` ở root project:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Database
DATABASE_URL=postgres://user:password@host:5432/dbname?sslmode=require

# YouTube import (tuỳ chọn)
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_channel_id
```

### 3. Database

```bash
# Đẩy schema lên PostgreSQL
pnpm db:push

# Mở Drizzle Studio (tuỳ chọn)
pnpm db:studio
```

> **Lưu ý:** Dùng `pnpm db:push` hoặc `pnpm exec drizzle-kit push` — **không** dùng `pnpm dlx drizzle-kit push` vì lệnh đó chạy ngoài `node_modules` của project và sẽ báo thiếu `drizzle-orm`.

### 4. Import khóa học từ YouTube (tuỳ chọn)

```bash
pnpm fetch:youtube
```

Script đọc playlist từ `YOUTUBE_CHANNEL_ID`, tạo `courses` và `lessons` trong database.

### 5. Chạy dev server

```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Scripts

| Lệnh                 | Mô tả                             |
| -------------------- | --------------------------------- |
| `pnpm dev`           | Chạy Next.js development server   |
| `pnpm build`         | Build production                  |
| `pnpm start`         | Chạy production server            |
| `pnpm lint`          | ESLint                            |
| `pnpm db:push`       | Đồng bộ schema → database         |
| `pnpm db:generate`   | Generate migration files          |
| `pnpm db:studio`     | Drizzle Studio UI                 |
| `pnpm fetch:youtube` | Import courses/lessons từ YouTube |

## Gợi ý thứ tự phát triển (tutorial)

Nếu bạn đang học hoặc dạy lại project từ đầu, có thể build theo thứ tự:

**API**

1. `/api/user/sync`
2. `/api/courses` → `/api/courses/[courseId]` → enroll
3. `/api/progress`
4. `/api/achievements` → `/api/leaderboard` → `/api/streak`
5. `/api/user/stats`

**Pages**

1. Sign in / Sign up (Clerk)
2. Dashboard
3. Courses list → Course detail (lessons + enroll)
4. Achievements → Leaderboard

Sau mỗi API, nối vào page tương ứng và demo trên browser để thấy data flow end-to-end.

## License

## Reference

https://youtu.be/kFb_yGqd67k?si=l4sI21nRbE1B238q
