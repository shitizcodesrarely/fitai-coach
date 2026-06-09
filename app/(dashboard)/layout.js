import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import Sidebar from "@/components/layout/Sidebar";
import YodaWidget from "@/components/yoda/YodaWidget";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const [user, stats] = await Promise.all([
    prisma.user.findUnique({
      where:  { id: session.user.id },
      select: { id: true, name: true, email: true, avatarData: true },
    }),
    prisma.userStats.findUnique({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-tertiary)" }}>
      <Sidebar user={user} stats={stats} />
      <main className="flex-1 ml-56 p-8 min-h-screen">
        {children}
      </main>
      <YodaWidget />
    </div>
  );
}
