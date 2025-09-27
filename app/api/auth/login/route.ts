import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const valid = await comparePassword(password, user.password);
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

  const token = signToken({ id: user._id });

  const res = NextResponse.json({ message: "Logged in" });
  res.cookies.set({
    name: process.env.COOKIE_NAME!,
    value: token,
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24,
  });
  return res;
}
