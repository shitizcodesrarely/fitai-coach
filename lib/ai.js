import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Generate a 4-week progressive workout plan based on user profile.
 * Returns a parsed JSON object.
 */
export async function generateWorkoutPlan(userProfile) {
  const { age, weightKg, heightCm, goal, experience, daysPerWeek, equipment } =
    userProfile;

  const prompt = `You are an expert personal trainer. Generate a detailed 4-week progressive workout plan.

User profile:
- Age: ${age}
- Weight: ${weightKg}kg
- Height: ${heightCm}cm
- Goal: ${goal}
- Experience level: ${experience}
- Days per week available: ${daysPerWeek}
- Available equipment: ${equipment}

Return ONLY a valid JSON object with NO markdown, NO backticks, NO explanation. Use this exact structure:
{
  "title": "Plan name here",
  "weeks": [
    {
      "week": 1,
      "days": [
        {
          "dayLabel": "Day 1 - Push",
          "exercises": [
            {
              "name": "Bench Press",
              "sets": 4,
              "reps": "8-10",
              "restSeconds": 90,
              "notes": "Focus on chest squeeze at top"
            }
          ]
        }
      ]
    }
  ]
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(response.content[0].text);
}

/**
 * Analyse a form check from a base64 encoded image frame.
 * Used after extracting a key frame from the uploaded video.
 */
export async function analyseFormCheck(base64Image, exercise) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: base64Image,
            },
          },
          {
            type: "text",
            text: `Analyse this ${exercise} form. Give 3-5 specific, actionable feedback points. Be direct and practical. Focus on safety and injury prevention first, then effectiveness.`,
          },
        ],
      },
    ],
  });

  return response.content[0].text;
}

/**
 * Generate a personalised weekly coaching message.
 * Called by the Sunday cron job with the user's week summary.
 */
export async function generateWeeklyCoaching(user, sessionsSummary) {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `Write a motivating weekly coaching message for ${user.name}.
Their goal is: ${user.goal}.
This week's sessions: ${JSON.stringify(sessionsSummary)}.
Keep it under 150 words. Be specific to their actual data, encouraging, and end with one actionable tip for next week.`,
      },
    ],
  });

  return response.content[0].text;
}
