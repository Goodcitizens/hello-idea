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
- nextPrompt

Rules:
- Keep it encouraging, simple and clear.
- Do not sound corporate.
- Do not say the idea is good or bad.
- Do not give steps, instructions, actions, recommendations, or suggestions.
- Do not write a numbered list.
- Do not tell the user what to do next.
- yourIdea should be a clean plain-English version of the user's idea in 2 to 4 sentences max.
- yourPurpose should explain why the idea matters and who it helps in 1 to 3 sentences max.
- nextPrompt must be this exact text and nothing else:

Time to write down the below in your notebook

- The Idea
- The Purpose
- Who It’s For
- What Makes It Different

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
            name: 'hello_idea_response',
            schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                yourIdea: { type: 'string' },
                yourPurpose: { type: 'string' },
                nextPrompt: { type: 'string' }
              },
              required: ['yourIdea', 'yourPurpose', 'nextPrompt']
            }
          }
        }
      });

      const content = JSON.parse(response.output_text);
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
