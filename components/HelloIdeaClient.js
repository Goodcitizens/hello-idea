'use client';

import { useMemo, useState } from 'react';

const pageStyle = {
  minHeight: '100vh',
  padding: '24px 20px 40px',
  background: '#e9e5dc',
};

const wrapStyle = {
  maxWidth: 1280,
  margin: '0 auto',
};

const topNoteStyle = {
  margin: 0,
  fontSize: 12,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  opacity: 0.55,
};

const introStyle = {
  margin: '10px 0 18px',
  maxWidth: 760,
  fontSize: 16,
  lineHeight: 1.6,
  color: 'rgba(0,0,0,0.68)',
};

const grid3Style = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 18,
};

const inputCardStyle = {
  background: '#f5f2eb',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 22,
  padding: 18,
};

const outputCardStyle = {
  background: '#f5f2eb',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 22,
  padding: 18,
  minHeight: 220,
};

const textareaStyle = {
  width: '100%',
  minHeight: 270,
  resize: 'vertical',
  borderRadius: 18,
  border: '1px solid rgba(0,0,0,0.12)',
  background: '#f1ede6',
  padding: 16,
  outline: 'none',
  fontSize: 16,
  lineHeight: 1.5,
};

const outputBoxStyle = {
  background: '#f1ede6',
  borderRadius: 18,
  padding: 16,
  lineHeight: 1.65,
  whiteSpace: 'pre-wrap',
  minHeight: 110,
};

const buttonStyle = {
  border: 'none',
  borderRadius: 999,
  padding: '9px 16px',
  background: '#111111',
  color: '#ffffff',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: 15,
  minWidth: 64,
};

const smallLabelStyle = {
  margin: 0,
  fontSize: 12,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  opacity: 0.45,
};

const titleStyle = {
  margin: 0,
  fontSize: 24,
  lineHeight: 1.05,
};

function extractSection(text, heading, nextHeadings) {
  if (!text) return '';

  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const nextPattern = nextHeadings
    .map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('|');

  const regex = new RegExp(
    `${escapedHeading}\\s*\\n([\\s\\S]*?)(?=\\n(?:${nextPattern})\\s*\\n|$)`,
    'i'
  );

  const match = text.match(regex);
  return match ? match[1].trim() : '';
}

function parseIdeaOutput(text) {
  const headings = [
    'The Idea',
    'The Purpose',
    'Who It’s For',
    'What Makes It Different',
    'Helpful Questions',
    'Write It Down',
    'Reflection and Update Step',
    'The 24:1 Rule',
  ];

  const get = (heading) =>
    extractSection(
      text,
      heading,
      headings.filter((h) => h !== heading)
    );

  const idea = get('The Idea');
  const purpose = get('The Purpose');

  const nextPrompt =
    get('Helpful Questions') ||
    get('Reflection and Update Step') ||
    get('The 24:1 Rule');

  return {
    idea,
    purpose,
    nextPrompt,
    full: text,
  };
}

export default function HelloIdeaClient() {
  const [idea, setIdea] = useState('');
  const [change, setChange] = useState('');
  const [stuck, setStuck] = useState('');
  const [output, setOutput] = useState('');
  const [perspective, setPerspective] = useState('');
  const [loadingIdea, setLoadingIdea] = useState(false);
  const [loadingPerspective, setLoadingPerspective] = useState(false);
  const [error, setError] = useState('');

  const parsed = useMemo(() => parseIdeaOutput(output), [output]);

  async function handleIdeaSubmit() {
    setLoadingIdea(true);
    setError('');

    try {
      const response = await fetch('/api/idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'idea', idea, change }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      setOutput(data.output || '');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoadingIdea(false);
    }
  }

  async function handlePerspectiveSubmit() {
    setLoadingPerspective(true);
    setError('');

    try {
      const response = await fetch('/api/idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'perspective',
          idea: parsed.idea || output,
          purpose: parsed.purpose || '',
          stuck,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      setPerspective(data.output || '');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoadingPerspective(false);
    }
  }

  return (
    <main style={pageStyle}>
      <div style={wrapStyle}>
        <p style={topNoteStyle}>hello idea</p>
        <p style={introStyle}>
          Write it messy. We’ll help make it clearer, surface the purpose, and give you a fresh perspective when you get stuck.
        </p>

        <div style={grid3Style}>
          <section style={inputCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12, marginBottom: 14 }}>
              <h2 style={titleStyle}>Your idea</h2>
              <button style={buttonStyle} onClick={handleIdeaSubmit} disabled={loadingIdea}>
                {loadingIdea ? '...' : 'Go'}
              </button>
            </div>
            <textarea
              style={textareaStyle}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Write here. Messy is fine. Tip: include who it’s for and why it helps."
            />
          </section>

          <section style={inputCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12, marginBottom: 14 }}>
              <h2 style={titleStyle}>Want to change or add anything?</h2>
              <button style={buttonStyle} onClick={handleIdeaSubmit} disabled={loadingIdea}>
                {loadingIdea ? '...' : 'Go'}
              </button>
            </div>
            <textarea
              style={textareaStyle}
              value={change}
              onChange={(e) => setChange(e.target.value)}
              placeholder="I forgot to mention..."
            />
          </section>

          <section style={inputCardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12, marginBottom: 14 }}>
              <h2 style={titleStyle}>Stuck? Get new perspective</h2>
              <button style={buttonStyle} onClick={handlePerspectiveSubmit} disabled={loadingPerspective}>
                {loadingPerspective ? '...' : 'Go'}
              </button>
            </div>
            <textarea
              style={textareaStyle}
              value={stuck}
              onChange={(e) => setStuck(e.target.value)}
              placeholder="Copy and paste the words from Your Idea & Your Purpose. Hit ‘Go’. Then add where you feel stuck."
            />
          </section>
        </div>

        {error ? (
          <div
            style={{
              marginTop: 16,
              color: '#8a1f11',
              background: '#fff1ef',
              border: '1px solid #f3c6bf',
              borderRadius: 16,
              padding: 14,
            }}
          >
            {error}
          </div>
        ) : null}

        <div style={{ ...grid3Style, marginTop: 18 }}>
          <section style={outputCardStyle}>
            <p style={smallLabelStyle}>Output</p>
            <h3 style={{ margin: '8px 0 14px', fontSize: 22 }}>Your idea</h3>
            <div style={outputBoxStyle}>
              {parsed.idea || 'Your clarified idea will appear here.'}
            </div>
          </section>

          <section style={outputCardStyle}>
            <p style={smallLabelStyle}>Output</p>
            <h3 style={{ margin: '8px 0 14px', fontSize: 22 }}>Your purpose</h3>
            <div style={outputBoxStyle}>
              {parsed.purpose || 'Your purpose will appear here.'}
            </div>
          </section>

          <section style={outputCardStyle}>
            <p style={smallLabelStyle}>Keep going</p>
            <h3 style={{ margin: '8px 0 14px', fontSize: 22 }}>Next prompt</h3>
            <div style={outputBoxStyle}>
              {parsed.nextPrompt || 'Your next question or prompt will appear here.'}
            </div>
          </section>
        </div>

        <section style={{ ...outputCardStyle, marginTop: 18 }}>
          <p style={smallLabelStyle}>Output</p>
          <h3 style={{ margin: '8px 0 14px', fontSize: 22 }}>Fresh perspective</h3>
          <div style={{ ...outputBoxStyle, minHeight: 140 }}>
            {perspective || 'Fresh perspective will appear here when you get stuck.'}
          </div>
        </section>

        <div
          style={{
            ...inputCardStyle,
            marginTop: 18,
            color: 'rgba(0,0,0,0.68)',
            lineHeight: 1.7,
          }}
        >
          Keep it simple. Write down anything you like. Copy the words from Your Idea & Your Purpose into your notebook so you’ve got them when you need them.
        </div>
      </div>
    </main>
  );
}
