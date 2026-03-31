'use client';

import { useState } from 'react';

export default function HelloIdeaClient() {
  const [idea, setIdea] = useState('');
  const [extra, setExtra] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setOutput('');

    try {
      const res = await fetch('/api/idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, extra }),
      });

      const data = await res.json();

      console.log('API RESPONSE:', data); // 👈 debug

      setOutput(data.output); // 👈 THIS WAS THE ISSUE
    } catch (err) {
      console.error(err);
      setOutput('Something went wrong.');
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      
      <div>
        <textarea
          placeholder="Write your idea..."
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          className="w-full border p-4 rounded"
        />
        <button onClick={handleGenerate} className="mt-2 px-4 py-2 bg-black text-white rounded">
          Go
        </button>
      </div>

      <div>
        <textarea
          placeholder="Want to add or change anything?"
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          className="w-full border p-4 rounded"
        />
      </div>

      {loading && <p>Thinking...</p>}

      {output && (
        <div className="whitespace-pre-wrap border p-4 rounded bg-gray-50">
          {output}
        </div>
      )}

    </div>
  );
}
