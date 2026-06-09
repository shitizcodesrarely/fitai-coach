import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import WorkoutLogger from "@/components/workout/WorkoutLogger";
import OnboardingForm from "@/components/workout/OnboardingForm";

export default async function WorkoutPage() {
  const session = await getServerSession(authOptions);
  const userId  = session.user.id;

  const [user, plan] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.workoutPlan.findFirst({
      where:   { userId, isActive: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!plan) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
          Generate your plan
        </h1>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          Tell us about yourself and Claude AI will build your plan.
        </p>
        <OnboardingForm />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
        {plan.title}
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Log your sets. The iron waits for no one.
      </p>
      <WorkoutLogger plan={plan} userId={userId} />
    </div>
  );
}
