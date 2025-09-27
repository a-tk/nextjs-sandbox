import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  const token = req.cookies.get(process.env.COOKIE_NAME!)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = verifyToken(token);
    return NextResponse.json({ message: "Protected data", user: decoded });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
