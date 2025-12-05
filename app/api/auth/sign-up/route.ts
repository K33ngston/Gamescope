import { NextResponse } from "next/server";
import { db } from "@/lib/database/db";
import { users, sessions } from "@/lib/database/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    if (!username || !email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const existingUser = await db.select().from(users).where(eq(users.username, username)).limit(1);
    if (existingUser.length > 0) {
      return NextResponse.json({ message: "Username taken" }, { status: 400 });
    }

    const existingEmail = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (existingEmail.length > 0) {
      return NextResponse.json({ message: "Email taken" }, { status: 400 });
    }

    const hash = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({ username, email, password: hash })
      .returning();

    const token = crypto.randomBytes(48).toString("hex");

    await db.insert(sessions).values({
      userId: newUser.id,
      token,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });

    const cookieStore = await cookies();
    cookieStore.set("gs_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
