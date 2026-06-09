import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/db";
import FormCheckUploader from "@/components/workout/FormCheckUploader";

export default async function FormCheckPage() {
  const session = await getServerSession(authOptions);
  const userId  = session.user.id;

  const checks = await prisma.formCheck.findMany({
    where:   { userId },
    orderBy: { createdAt: "desc" },
    take:    10,
  });

  const statusColors = {
    DONE:       { bg: "#dcfce7", text: "#15803d" },
    PROCESSING: { bg: "#fef9c3", text: "#854d0e" },
    PENDING:    { bg: "var(--bg-secondary)", text: "var(--text-secondary)" },
    FAILED:     { bg: "#fee2e2", text: "#991b1b" },
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
        Form Check
      </h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Upload a video — Claude AI will analyse your technique
      </p>

      <FormCheckUploader />

      {checks.length > 0 && (
        <div className="mt-8 space-y-3">
          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            Past checks
          </p>
          {checks.map((check) => {
            const colors = statusColors[check.status] ?? statusColors.PENDING;
            return (
              <div
                key={check.id}
                className="rounded-xl p-4"
                style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium capitalize" style={{ color: "var(--text-primary)" }}>
                    {check.exercise}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: colors.bg, color: colors.text }}
                  >
                    {check.status}
                  </span>
                </div>
                {check.aiFeedback && (
                  <p
                    className="text-sm whitespace-pre-line leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {check.aiFeedback}
                  </p>
                )}
                <p className="text-xs mt-2" style={{ color: "var(--text-secondary)" }}>
                  {new Date(check.createdAt).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
