import { NextResponse } from "next/server";
import { db } from "@/lib/database/db";
import { reviews, reviewVotes, sessions, users } from "@/lib/database/schema";
import { eq, desc, and, sql } from "drizzle-orm";
import { cookies } from "next/headers";

async function getUser() {
  const cookie = await cookies();
  const token = cookie.get("gs_token")?.value;
  if (!token) return null;

  const [session] = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);
  if (!session) return null;

  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  return user || null;
}

export async function GET() {
  const rows = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  return NextResponse.json({ reviews: rows });
}

export async function POST(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { gameName, reviewText, rating } = await req.json();

  if (!gameName || !rating) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const [newReview] = await db
    .insert(reviews)
    .values({
      userId: user.id,
      gameName,
      reviewText,
      rating,
    })
    .returning();

  return NextResponse.json({ review: newReview });
}

export async function PUT(req: Request) {
  const user = await getUser();
  if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { reviewId } = await req.json();
  if (!reviewId) return NextResponse.json({ message: "Missing reviewId" }, { status: 400 });

  const existing = await db
    .select()
    .from(reviewVotes)
    .where(and(eq(reviewVotes.reviewId, reviewId), eq(reviewVotes.userId, user.id)))
    .limit(1);

  if (existing.length > 0) {
    return NextResponse.json({ message: "Already liked" }, { status: 400 });
  }

  await db.insert(reviewVotes).values({ reviewId, userId: user.id });

  await db
    .update(reviews)
    .set({ helpfulCount: sql`${reviews.helpfulCount} + 1` })
    .where(eq(reviews.id, reviewId));

  return NextResponse.json({ success: true });
}
