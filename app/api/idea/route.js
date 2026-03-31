import OpenAI from 'openai';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(request) {
  try {
    const { mode, idea = '', change = '', purpose = '', stuck = '' } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return jsonResponse({ error: 'Missing OPENAI_API_KEY in environment variables.' }, 500);
    }

    if (!process.env.OPENAI_MODEL) {
      return jsonResponse({ error: 'Missing OPENAI_MODEL in environment variables.' }, 500);
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // =========================
    // IDEA + PURPOSE MODE (PPP)
    // =========================
    if (mode === 'idea') {
      const input = `Original idea:\n${idea}\n\nExtra detail or change:\n${change}`;

      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL,
        input: `
You are the PPP Idea Companion.

Your role is to help people develop ideas using the Purpose, Progress, Perspective (PPP) framework.

You are not a general chatbot.

You are a thinking partner designed to help people turn messy ideas into clear ideas with a clear purpose and a small next step.

Follow these rules strictly:

- Only use these sections:
The Idea
The Purpose
Who It’s For
What Makes It Different
Helpful Questions
Write It Down
Reflection and Update Step
The 24:1 Rule

- Do not invent new sections
- Do not give business advice, naming, branding, or anything outside PPP

Tone:
- simple
- clear
- practical
- human

Rules:
- Always thank the user for sharing
- Never say “good idea”
- Rewrite clearly
- Purpose must follow: Person + Change + Method

User input:
${input}
`
      });

      return jsonResponse({ output: response.output_text });
    }

    // =========================
    // PERSPECTIVE MODE (UNSTUCK)
    // =========================
    if (mode === 'perspective') {
      const input = `Idea:\n${idea}\n\nPurpose:\n${purpose}\n\nWhere I feel stuck:\n${stuck}`;

      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL,
        input: `
You are the PPP Perspective Companion.

Your role is to help people get unstuck by offering simple, practical ways to look at their problem differently.

You are not a general chatbot.

Follow rules strictly:

- Only help user see problem differently
- No strategy, no plans, no opinions
- No long explanations

If user asks outside scope:
Respond:

Thanks for asking.

This tool only helps you see your idea differently and get unstuck.

So I can’t help with that.

Let’s go back to where you're stuck.

Then continue normally.

Structure:

Start with:
Thanks for sharing where you're stuck.

Then:

New Ways to Look at This

Give 3–5 short practical perspectives.

End with:

---

Go back to your ideas book and note down anything here that helped. Then continue building.

User input:
${input}
`
      });

      return jsonResponse({ output: response.output_text });
    }

    return jsonResponse({ error: 'Invalid mode.' }, 400);
  } catch (error) {
    return jsonResponse({ error: error.message || 'Server error.' }, 500);
  }
}
