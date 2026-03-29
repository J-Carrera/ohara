import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { goal } = await req.json();

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 250,
      messages: [
        {
          role: "user",
          content: `
A user created this goal:
"${goal}"

Your job is to help them both reflect AND take action.

Respond in 3 parts:

1. Insight (1-2 sentences)
- Make a specific observation about what this goal suggests about the user
- Focus on behavior or mindset (not motivation fluff)

2. Milestones (2-4 bullet points)
- Break the goal into clear, realistic steps
- Focus on progression, not perfection
- Each step should feel immediately actionable

3. Tips (2-3 bullet points)
- Give practical advice to help them stay consistent
- Avoid generic advice — make it specific to this goal

Rules:
- No vague motivational language
- No “you got this” or clichés
- Everything should feel grounded and useful
- Keep it concise but meaningful

Output format:

Insight:
...

Milestones:
- ...
- ...

Tips:
- ...
- ...
`,
        },
      ],
    });

    const insight =
      message.content
        .filter((block) => block.type === "text")
        .map((block: any) => block.text)
        .join(" ") || "Stay consistent and keep showing up.";

    return Response.json({ insight });
  } catch (err) {
    return Response.json({ error: "AI failed" }, { status: 500 });
  }
}
