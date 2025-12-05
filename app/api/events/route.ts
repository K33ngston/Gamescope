import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/database/db";
import { events, sessions } from "@/lib/database/schema";
import { eq, desc } from "drizzle-orm";

async function getSessionUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("gs_token")?.value;
  if (!token) return null;

  const [session] = await db
    .select()
    .from(sessions)
    .where(eq(sessions.token, token))
    .limit(1);

  if (!session) return null;
  if (new Date(session.expiresAt) < new Date()) return null;

  return session.userId as string;
}

export async function GET() {
  try {
    const rows = await db
      .select()
      .from(events)
      .orderBy(desc(events.eventDate));

    return NextResponse.json(rows);
  } catch {
    return NextResponse.json({ message: "Failed to load events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      title,
      description,
      eventDate,
      eventTime,
      location,
      eventType,
      customType,
      durationMinutes,
      maxAttendees,
    } = body;

    if (!title || !eventDate || !location || !eventType) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const timePart = eventTime && typeof eventTime === "string" && eventTime.length > 0 ? eventTime : "00:00";
    const isoString = `${eventDate}T${timePart}:00`;
    const eventDateTime = new Date(isoString);

    if (isNaN(eventDateTime.getTime())) {
      return NextResponse.json({ message: "Invalid date or time" }, { status: 400 });
    }

    const [inserted] = await db
      .insert(events)
      .values({
        userId,
        title,
        description: description || null,
        eventDate: eventDateTime,
        location,
        eventType,
        customType: customType || null,
        durationMinutes: durationMinutes ? Number(durationMinutes) : null,
        maxAttendees: maxAttendees ? Number(maxAttendees) : null,
      })
      .returning();

    return NextResponse.json(inserted, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Failed to create event" }, { status: 500 });
  }
}
