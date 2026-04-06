import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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

    if (mode === 'idea') {
      const input = `Original idea:\n${idea}\n\nExtra detail or change:\n${change}`;

      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL,
        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text: `You are the Hello Idea helper. The user has an idea. Your job is to help them express it more clearly without judging whether it is good or bad.

Return valid JSON with exactly these keys:
- yourIdea
- yourPurpose
- progress
- nextPrompt

Rules:
- Keep it encouraging, simple and clear.
- Do not sound corporate.
- Do not say the idea is good or bad.
- Do not give steps, instructions, actions, recommendations, or suggestions in yourIdea or yourPurpose.
- Do not write a numbered list.
- Do not tell the user what to do next in yourIdea or yourPurpose.
- Do not use markdown.

For yourIdea:
- Write a clean plain-English version of the user's idea in 2 to 4 sentences max.
- Then include these exact section headings in this order:
Who It's For
What Makes It Different
Helpful questions
Time to write down the below in your notebook
- Under Who It's For, write 1 short paragraph.
- Under What Makes It Different, write 1 short paragraph.
- Under Helpful questions, write 3 to 4 short questions, each on a new line.
- After Time to write down the below in your notebook, include exactly these lines:

- The Idea
- The Purpose
- Who It's For
- What Makes It Different

For yourPurpose:
- Explain why the idea matters and who it helps in 1 to 3 short paragraphs max.

For progress:
- Write 3 to 4 short practical next steps, each on its own new line.

- Then leave a blank line and write exactly:
Let’s imagine, just for a moment, this is up and running. Not perfectly. Just real.

- Then leave a blank line and write 2 to 3 short lines about what has actually happened.

- Then leave a blank line and write exactly:
A message you receive:

- Then on the next line write one short believable message in quote marks.

- Then leave a blank line and end with exactly these two lines:
What is the smallest version of this that proves it’s real?
If this existed, would that be enough to be proud of?

For nextPrompt:
- nextPrompt must be this exact text and nothing else:

What would make this feel simple enough to start?`
              }
            ]
          },
          {
            role: 'user',
            content: [{ type: 'input_text', text: input }]
          }
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'hello_idea_response',
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                yourIdea: { type: 'string' },
                yourPurpose: { type: 'string' },
                progress: { type: 'string' },
                nextPrompt: { type: 'string' }
              },
              required: ['yourIdea', 'yourPurpose', 'progress', 'nextPrompt']
            }
          }
        }
      });

      const content = JSON.parse(response.output_text);

      // 🔥 THIS IS THE FIX
      if (
        content.progress &&
        !content.progress.includes('Let’s imagine, just for a moment, this is up and running. Not perfectly. Just real.')
      ) {
        content.progress = `${content.progress}

Let’s imagine, just for a moment, this is up and running. Not perfectly. Just real.

- Someone has experienced it
- You have real feedback
- It exists outside your head

A message you receive:

"I didn’t think I could do this, but I did."

What is the smallest version of this that proves it’s real?
If this existed, would that be enough to be proud of?`;
      }

      return jsonResponse(content);
    }

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
                text: `You are the Hello Idea perspective helper. The user is stuck and needs fresh perspective.

Return valid JSON with exactly these keys:
- perspective
- nextPrompt

Rules:
- Never judge the idea.
- Help them see the problem differently.
- Give practical, fresh perspective in plain English.
- Write in short paragraphs.
- Put each idea on a new line.
- Avoid long blocks of text.
- Each paragraph should be 1 to 2 sentences max.
- Be clear and direct. No fluff.
- perspective should be 3 short paragraphs max.
- nextPrompt should be one simple question that gets them moving again.
- Do not use markdown.`
              }
            ]
          },
          {
            role: 'user',
            content: [{ type: 'input_text', text: input }]
          }
        ],
        text: {
          format: {
            type: 'json_schema',
            name: 'hello_idea_perspective',
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                perspective: { type: 'string' },
                nextPrompt: { type: 'string' }
              },
              required: ['perspective', 'nextPrompt']
            }
          }
        }
      });

      const content = JSON.parse(response.output_text);
      return jsonResponse(content);
    }

    return jsonResponse({ error: 'Invalid mode.' }, 400);
  } catch (error) {
    return jsonResponse({ error: error.message || 'Server error.' }, 500);
  }
}
