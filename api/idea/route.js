import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function buildProgressString(progress) {
  const steps = Array.isArray(progress?.steps) ? progress.steps.filter(Boolean) : [];
  const reality = Array.isArray(progress?.reality) ? progress.reality.filter(Boolean) : [];
  const message = String(progress?.message || '').trim();

  const parts = [];

  if (steps.length) {
    parts.push(steps.map((step) => `- ${step}`).join('\n\n'));
  }

  parts.push('Let’s imagine, just for a moment, this is up and running. Not perfectly. Just real.');

  if (reality.length) {
    parts.push(reality.map((line) => `- ${line}`).join('\n'));
  }

  parts.push('A message you receive:');

  if (message) {
    parts.push(`"${message}"`);
  }

  parts.push('What is the smallest version of this that proves it’s real?');
  parts.push('If this existed, would that be enough to be proud of?');

  return parts.join('\n\n');
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
- Do not use markdown.
- Do not write a numbered list.
- Keep everything in plain English.
- Avoid hype, fluff, or motivational language.
- Keep it grounded and believable.

For yourIdea:
- Write a clean plain-English version of the user's idea in 2 to 4 sentences max.
- Then include these sections in this exact order:
Who It's For
What Makes It Different
Helpful questions
Time to write down the below in your notebook
- For Who It's For, write 1 short paragraph.
- For What Makes It Different, write 1 short paragraph.
- For Helpful questions, write 3 to 4 short useful questions, each on a new line.
- After Time to write down the below in your notebook, include exactly these lines:

- The Idea
- The Purpose
- Who It's For
- What Makes It Different

For yourPurpose:
- Explain why the idea matters and who it helps.
- Keep it to 1 to 3 short paragraphs max.

For progress:
Return an object with exactly these keys:
- steps
- reality
- message

For progress.steps:
- Return 3 to 4 simple, practical next steps.
- Each step should be short and achievable.
- Do not number them.

For progress.reality:
- Return 2 to 3 short lines describing what has actually happened once a first real version exists.
- Keep it grounded, specific, and believable.
- This is not a huge success story.
- It is just enough proof that the idea is now real.

For progress.message:
- Return one short believable message that someone might send after experiencing the idea.
- Do not include quote marks in the value.

For nextPrompt:
- Make it one short simple question that helps the user keep building.
- Do not tell them to do multiple things.`
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
                progress: {
                  type: 'object',
                  additionalProperties: false,
                  properties: {
                    steps: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    reality: {
                      type: 'array',
                      items: { type: 'string' }
                    },
                    message: { type: 'string' }
                  },
                  required: ['steps', 'reality', 'message']
                },
                nextPrompt: { type: 'string' }
              },
              required: ['yourIdea', 'yourPurpose', 'progress', 'nextPrompt']
            }
          }
        }
      });

      const rawContent = JSON.parse(response.output_text);

      const content = {
        ...rawContent,
        progress: buildProgressString(rawContent.progress),
      };

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
