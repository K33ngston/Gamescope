import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/database/db";
import { eq } from "drizzle-orm";
import { sessions } from "@/lib/database/schema";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("gs_token")?.value;

    if (token) {
      await db.delete(sessions).where(eq(sessions.token, token));
      cookieStore.delete("gs_token");
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
