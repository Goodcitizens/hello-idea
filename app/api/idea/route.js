import OpenAI from 'openai';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const { mode = 'idea', idea = '', extra = '', change = '', purpose = '', stuck = '' } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return jsonResponse({ error: 'Missing OPENAI_API_KEY in environment variables.' }, 500);
    }

    const finalChange = change || extra || '';

    if (mode === 'idea') {
      const prompt = `
You help people clarify ideas using the PPP structure.

Return ONLY valid JSON.
Do not wrap it in markdown.
Do not add extra commentary.

Return exactly this shape:

{
  "idea": {
    "idea": "",
    "whoFor": "",
    "different": "",
    "questions": "",
    "instructions": "",
    "reflection": ""
  },
  "purpose": "",
  "progress": ""
}

Rules:

For idea.idea
Write only the clarified idea in plain English.

For idea.whoFor
Write who the idea is for.

For idea.different
Write what makes it different.

For idea.questions
Write 3 to 4 short helpful questions as plain text lines.

For idea.instructions
Write simple write down instructions.

For idea.reflection
Write exactly:
Do you think this is a true reflection of your idea?

Would you like to add or change anything?

If so, just write it in the box below and we’ll update your idea.

For purpose
Write the response in two parts inside the same field.

Part 1:
Write the practical reason for doing the idea.
Keep it matter of fact, clear and concise.

Part 2:
On a new line, add exactly:
Why it matters:
Then write the deeper human reason the idea matters.

Rules for the second part:
- Use plain human language.
- Do not sound preachy, dramatic or corporate.
- Do not exaggerate impact.
- Only go deeper if the idea genuinely touches things like connection, belonging, dignity, identity, relief, hope, family, community or meaning.
- If the idea does not naturally contain a deeper human driver, keep this second part short and grounded.
- Make sure the second part feels different from the practical purpose.

Format purpose exactly like this:
[first practical purpose sentence]

Why it matters:
[deeper human reason]

For progress
Use the 24:1 rule.

Write 3 to 5 very short practical next steps.

Format rules:
- Number each step starting from 1.
- Put each step on its own line.
- Do not use bullet points.
- Do not add a heading.
- Do not repeat or include the 24:1 explanation sentence.
- Keep each step short and practical.

Example format:
1. Find a suitable venue
2. Set a regular schedule
3. Reach out to local groups

User idea:
${idea}

Extra detail or change:
${finalChange || 'none'}
`;

      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: prompt,
      });

      const text = response.output_text?.trim();

      if (!text) {
        return jsonResponse({ error: 'No response text returned from OpenAI.' }, 500);
      }

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        return jsonResponse({ error: 'OpenAI returned invalid JSON.', raw: text }, 500);
      }

      return jsonResponse(parsed);
    }

    if (mode === 'perspective') {
      const prompt = `
You are the PPP Perspective Companion.

Your role is to help people get unstuck by offering simple, practical ways to look at their problem differently.

You are not a general chatbot.

You do not give business plans, strategies, step by step execution, or opinions.

You help people see new angles.

Assume the user is stuck because they are looking at the problem in one fixed way.
Your job is to offer alternative ways to approach it.

Prefer practical and real world perspectives over abstract thinking.

Start with:
Thanks for sharing where you're stuck.

Then:
New Ways to Look at This

Then give 3 to 5 short practical perspectives.

Do not ask a closing question.

End with exactly:

---
Go back to your ideas book and note down anything here that helped. Then continue building.

Idea:
${idea}

Purpose:
${purpose}

Where stuck:
${stuck}
`;

      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
        input: prompt,
      });

      const text = response.output_text?.trim();

      if (!text) {
        return jsonResponse({ error: 'No perspective text returned from OpenAI.' }, 500);
      }

      return jsonResponse({ output: text });
    }

    return jsonResponse({ error: 'Invalid mode.' }, 400);
  } catch (error) {
    return jsonResponse({ error: error.message || 'Server error.' }, 500);
  }
}
