import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/database/db";
import { users, sessions, userGamification, pointsHistory, reviews } from "@/lib/database/schema";
import { eq, desc, sql } from "drizzle-orm";

async function getUserFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gs_token")?.value;
  if (!token) return null;

  const [session] = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);
  if (!session) return null;

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  return user;
}

export async function GET(req: Request) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "stats") {
    const [stats] = await db.select().from(userGamification).where(eq(userGamification.userId, user.id)).limit(1);
    const [reviewCount] = await db
      .select({ count: sql<number>`COUNT(*)` })
      .from(reviews)
      .where(eq(reviews.userId, user.id));

    const [upvoteCount] = await db
      .select({ total: sql<number>`SUM(helpful_count)` })
      .from(reviews)
      .where(eq(reviews.userId, user.id));

    return NextResponse.json({
      points: stats?.totalPoints || 0,
      reviews: reviewCount.count || 0,
      upvotes: upvoteCount.total || 0,
      streak: stats?.currentStreak || 0,
      badges: stats?.badges || [],
    });
  }

  if (action === "badges") {
    const [stats] = await db.select().from(userGamification).where(eq(userGamification.userId, user.id)).limit(1);
    return NextResponse.json(stats?.badges || []);
  }

  if (action === "leaderboard") {
    const period = searchParams.get("period") || "weekly";

    let orderBy =
      period === "weekly"
        ? sql`EXTRACT(WEEK FROM ${pointsHistory.createdAt})`
        : period === "monthly"
        ? sql`EXTRACT(MONTH FROM ${pointsHistory.createdAt})`
        : sql`EXTRACT(YEAR FROM ${pointsHistory.createdAt})`;

    const rows = await db
      .select({
        id: users.id,
        username: users.username,
        points: sql<number>`SUM(${pointsHistory.points})`,
      })
      .from(pointsHistory)
      .leftJoin(users, eq(pointsHistory.userId, users.id))
      .groupBy(users.id)
      .orderBy(desc(sql`SUM(${pointsHistory.points})`))
      .limit(20);

    return NextResponse.json(rows);
  }

  return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}

export async function POST(req: Request) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  if (body.action === "daily-bonus") {
    const today = new Date().toISOString().slice(0, 10);

    const [stats] = await db.select().from(userGamification).where(eq(userGamification.userId, user.id)).limit(1);

    if (stats?.lastActivityDate === today)
      return NextResponse.json({ message: "Already claimed today" }, { status: 400 });

    const newStreak =
      stats?.lastActivityDate === new Date(Date.now() - 86400000).toISOString().slice(0, 10)
        ? stats.currentStreak + 1
        : 1;

    const newPoints = (stats?.totalPoints || 0) + 10;

    await db
      .insert(pointsHistory)
      .values({ userId: user.id, action: "daily_bonus", points: 10 });

    await db
      .insert(userGamification)
      .values({
        userId: user.id,
        totalPoints: newPoints,
        currentStreak: newStreak,
        longestStreak: Math.max(stats?.longestStreak || 0, newStreak),
        lastActivityDate: today,
        badges: stats?.badges || [],
      })
      .onConflictDoUpdate({
        target: userGamification.userId,
        set: {
          totalPoints: newPoints,
          currentStreak: newStreak,
          longestStreak: Math.max(stats?.longestStreak || 0, newStreak),
          lastActivityDate: today,
        },
      });

    return NextResponse.json({ message: "Daily bonus claimed" });
  }

  return NextResponse.json({ message: "Invalid action" }, { status: 400 });
}
