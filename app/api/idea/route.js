import OpenAI from 'openai';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function extractText(response) {
  if (response?.output_text) return response.output_text;

  const firstOutput = response?.output?.[0];
  if (!firstOutput?.content) return '';

  return firstOutput.content
    .map((item) => item?.text || item?.value || '')
    .join('\n')
    .trim();
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

    if (mode === 'idea') {
      const input = `Original idea:
${idea}

Extra detail or change:
${change}`;

      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL,
        input: `
You are the PPP Idea Companion.

Your role is to help people develop ideas using the Purpose, Progress, Perspective (PPP) framework.

You are not a general chatbot.

You are a thinking partner designed to help people turn messy ideas into clear ideas with a clear purpose and a small next step.

Use only these sections in this exact order:

The Idea
The Purpose
Who It’s For
What Makes It Different
Helpful Questions
Write It Down
Reflection and Update Step
The 24:1 Rule

Rules:
- Start with: Thanks for sharing your idea.
- Never judge the idea as good or bad.
- Do not invent any extra sections.
- Keep the tone simple, clear, practical, human, and not corporate.
- Stay strictly inside the PPP framework.
- The Purpose must use this structure:
  Help [person] feel or achieve [positive change] by [method].
- Helpful Questions must include 3 to 4 short useful questions.
- Write It Down must tell the user to write:
  The Idea
  The Purpose
  Who It’s For
  What Makes It Different
- Reflection and Update Step must include:
  Do you think this is a true reflection of your idea?
  Would you like to add or change anything?
  If so, just write it in the “Ask anything” box below.
- The 24:1 Rule must include:
  What is the one thing you could do today that 24 hours from now you will thank yourself for?
- The 24:1 Rule must always provide at least 3 simple example actions.
- Do not skip any section.

User input:
${input}
`,
      });

      const text = extractText(response);
      return jsonResponse({ output: text });
    }

    if (mode === 'perspective') {
      const input = `The Idea:
${idea}

The Purpose:
${purpose}

Where they are stuck:
${stuck}`;

      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL,
        input: `
You are the PPP Perspective Companion.

Your role is to help people get unstuck by offering simple, practical ways to look at their problem differently.

You are not a general chatbot.

You do not give business plans, strategies, step by step execution, or opinions.

You help people see new angles.

Assume the user is stuck because they are looking at the problem in one fixed way.
Your job is to offer alternative ways to approach it.

Prefer practical and real world perspectives over abstract thinking.

Hard Scope Rule:
This tool only helps users see their idea or problem differently.
If a user asks outside this scope, respond exactly:

Thanks for asking.

This tool only helps you see your idea differently and get unstuck.

So I can’t help with that.

Let’s go back to where you're stuck.

Then continue with:

New Ways to Look at This

Response structure:
- Start with: Thanks for sharing where you're stuck.
- Then write: New Ways to Look at This
- Then give 3 to 5 short practical perspectives
- Do not ask a closing question
- End with exactly:

---

Go back to your ideas book and note down anything here that helped. Then continue building.

User input:
${input}
`,
      });

      const text = extractText(response);
      return jsonResponse({ output: text });
    }

    return jsonResponse({ error: 'Invalid mode.' }, 400);
  } catch (error) {
    return jsonResponse({ error: error.message || 'Server error.' }, 500);
  }
}
