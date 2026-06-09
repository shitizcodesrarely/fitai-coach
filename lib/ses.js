import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const ses = new SESClient({ region: process.env.AWS_REGION });

/**
 * Send a transactional email via AWS SES.
 * Used for: weekly coaching digest, account verification, password reset.
 */
export async function sendEmail({ to, subject, html }) {
  const command = new SendEmailCommand({
    Source: process.env.AWS_SES_FROM_EMAIL,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body:    { Html: { Data: html } },
    },
  });

  await ses.send(command);
}

/**
 * Send the weekly coaching digest email.
 */
export async function sendWeeklyDigest(user, coachingMessage, sessionsSummary) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #16a34a;">Your Weekly FitAI Coaching Report</h2>
      <p>Hey ${user.name},</p>
      <p>${coachingMessage}</p>
      <hr/>
      <h3>This week at a glance</h3>
      <p>Sessions completed: <strong>${sessionsSummary.sessionsCompleted}</strong></p>
      <p>Total volume lifted: <strong>${sessionsSummary.totalVolume}kg</strong></p>
      <p style="color: #6b7280; font-size: 12px;">FitAI Coach — your AI personal trainer</p>
    </div>
  `;

  await sendEmail({ to: user.email, subject: "Your weekly FitAI coaching report", html });
}
