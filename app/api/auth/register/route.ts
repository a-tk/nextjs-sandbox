import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const existing = await User.findOne({ email });
  if (existing) return NextResponse.json({ error: "Email already exists" }, { status: 400 });

  const hashed = await hashPassword(password);
  const user = await User.create({ email, password: hashed });

  const token = signToken({ id: user._id });

  const res = NextResponse.json({ message: "User registered" }, { status: 201 });
  res.cookies.set({
    name: process.env.COOKIE_NAME!,
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
  return res;
}
