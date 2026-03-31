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
    // IDEA MODE (FULL PPP OUTPUT)
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

You must strictly follow this structure:

The Idea
Rewrite the user’s idea clearly in one or two sentences.

The Purpose
Use this formula:
Help [person] achieve [change] by [method].

Who It’s For
Define clearly.

What Makes It Different
Explain the key difference.

Helpful Questions
Ask 3–4 short useful questions.

Write It Down
Tell them to write:
The Idea
The Purpose
Who It’s For
What Makes It Different

Reflection and Update Step
Ask:
Do you think this is a true reflection of your idea?
Would you like to add or change anything?

The 24:1 Rule
Ask:
What is one thing you can do today that 24 hours from now you will thank yourself for?

Then give at least 3 examples.

Rules:
- Always start with: Thanks for sharing your idea.
- Never judge the idea
- Never say good or bad
- Keep it simple, clear, practical
- Do not skip ANY section

User input:
${input}
`
      });

      return jsonResponse({ output: response.output_text });
    }

    // =========================
    // PERSPECTIVE MODE (UNCHANGED)
    // =========================
    if (mode === 'perspective') {
      const input = `Idea:\n${idea}\n\nPurpose:\n${purpose}\n\nWhere I feel stuck:\n${stuck}`;

      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL,
        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text: `You are the PPP Perspective Companion.

Your role is to help people get unstuck by offering simple, practical ways to look at their problem differently.

You are not a general chatbot.

You do not give business plans, strategies, step-by-step execution, or opinions.

You help people see new angles.

Assume the user is stuck because they are looking at the problem in one fixed way.
Your job is to offer alternative ways to approach it.

Prefer practical and real-world perspectives over abstract thinking.

Hard Scope Rule — No Exceptions

This tool ONLY helps users see their idea or problem differently.

If a user asks ANYTHING outside of this, you must refuse.

Always respond exactly like this:

Thanks for asking.

This tool only helps you see your idea differently and get unstuck.

So I can’t help with that.

Let’s go back to where you're stuck.

Then continue with:

New Ways to Look at This

Then give 3–5 short practical perspectives.

Do NOT ask a closing question.

End with:

---

Go back to your ideas book and note down anything here that helped. Then continue building.`
              }
            ]
          },
          {
            role: 'user',
            content: [{ type: 'input_text', text: input }]
          }
        ]
      });

      return jsonResponse({ output: response.output_text });
    }

    return jsonResponse({ error: 'Invalid mode.' }, 400);
  } catch (error) {
    return jsonResponse({ error: error.message || 'Server error.' }, 500);
  }
}
