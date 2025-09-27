import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function DashboardPage() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(process.env.COOKIE_NAME!)?.value;
    if (!token) throw new Error("Unauthorized");

    const decoded = verifyToken(token);

    return (
      `<main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>Welcome, user ${decoded}</p>
      </main>`
    );
  } catch {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p>Please <a href="/login">login</a> to access this page.</p>
      </main>
    );
  }
}
