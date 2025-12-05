import { NextResponse } from "next/server";
import { db } from "@/lib/database/db";
import { reviews, users } from "@/lib/database/schema";
import { cookies } from "next/headers";
import { eq, desc } from "drizzle-orm";

function getUserIdFromCookie() {
  const cookieStore = cookies();
  return cookieStore.get("gs_token")?.value || null;
}

export async function GET() {
  try {
    const result = await db
      .select({
        id: reviews.id,
        userId: reviews.userId,
        gameName: reviews.gameName,
        rating: reviews.rating,
        reviewText: reviews.reviewText,
        createdAt: reviews.createdAt,
        username: users.username,
      })
      .from(reviews)
      .leftJoin(users, eq(reviews.userId, users.id))
      .orderBy(desc(reviews.createdAt));

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = cookies().get("gs_token")?.value;

    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const session = await db.query.sessions.findFirst({
      where: (s, { eq }) => eq(s.token, token),
    });

    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { gameName, reviewText, rating } = body;

    const [newReview] = await db
      .insert(reviews)
      .values({
        userId: session.userId,
        gameName,
        reviewText,
        rating,
      })
      .returning();

    return NextResponse.json(newReview, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Failed to create review" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, gameName, reviewText, rating } = body;

    await db
      .update(reviews)
      .set({ gameName, reviewText, rating })
      .where(eq(reviews.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    await db.delete(reviews).where(eq(reviews.id, id));

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ message: "Failed to delete review" }, { status: 500 });
  }
}
