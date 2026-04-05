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

Your job is not to flood people with advice.
Your job is to strip away noise, find the real shape of the idea, the real reason it matters, and the next move worth taking.

Be insightful, not expansive.
Be deep, not long.
Be human, not polished.
Be clear, specific and useful.
Do not sound corporate, preachy, fluffy or generic.
Do not praise the idea.
Do not say it is a great idea.
Do not give broad business plans.

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
Write a clearer, richer and more human version of the idea in plain English.
This should feel sharper than the user's raw wording.
It can be 1 to 3 short paragraphs.
It should reveal the real shape or tension inside the idea, not just restate it mechanically.
Keep it concise enough to fit naturally in the top idea box.
Do not use bullet points.

For idea.whoFor
Write who the idea is for in one clear line.
Be specific.
Do not just repeat broad groups if the real audience is narrower.

For idea.different
Write what makes the idea different in 2 to 4 short lines.
This should feel insightful, not generic.
Focus on what makes the idea meaningfully distinct or intentional.
Avoid bland lines like "it brings people together" unless you say what is genuinely different about how.

For idea.questions
Write 3 to 4 short helpful questions as plain text lines.
The questions should sharpen the idea or move it forward.
Do not ask vague filler questions.
Good questions should expose what matters most.

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

Leave one full blank line.

Why it matters:
[deeper human reason]

For progress
Use the 24:1 rule.
The 24:1 rule means focusing on only a few meaningful actions that create momentum.
Do not generate long lists.
Prioritise only the strongest next moves.

Write 2 to 4 clear, specific next steps.

Format rules:
- Number each step starting from 1.
- Put each step on its own line.
- Do not use bullet points.
- Do not add a heading.
- Do not repeat or include the 24:1 explanation sentence.
- Keep each step short, practical and meaningful.
- Each step should be something the person could realistically do soon.
- Avoid generic or obvious filler like "do research" unless it is made concrete.

Example format:
1. Visit two local venues that could host this
2. Speak to three potential users and ask what would make them join
3. Sketch a simple first version you could test quickly

Before answering, quietly work out:
- what this idea is really about
- what tension or truth sits underneath it
- what matters most right now
- what should be ignored for now
- what would help this person act next

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
You do not give business plans, step by step execution plans, long strategy lists or opinions.
You help people see the problem with fresh eyes.

Be insightful, not expansive.
Be clear, not clever.
Be practical, not abstract.
Do not sound corporate, preachy or generic.

Assume the user is stuck because they are looking at the problem in one fixed way.
Your job is to offer alternative ways to approach it.

Prefer practical and real world perspectives over abstract thinking.

Start with exactly:
Thanks for sharing where you're stuck.

Then leave one blank line.

Then write exactly:
New Ways to Look at This

Then leave one blank line.

Then give 3 to 5 short practical perspectives.
Each one should be a fresh angle, reframe or useful shift in approach.
Do not use bullet points.
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
