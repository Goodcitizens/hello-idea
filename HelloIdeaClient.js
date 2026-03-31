'use client';

import { useState } from 'react';

const panelStyle = {
  background: '#ffffff',
  border: '1px solid rgba(0,0,0,0.08)',
  borderRadius: 24,
  padding: 20,
  boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
};

const textareaStyle = {
  width: '100%',
  minHeight: 260,
  resize: 'vertical',
  borderRadius: 18,
  border: '1px solid rgba(0,0,0,0.1)',
  background: '#fcfaf6',
  padding: 16,
  outline: 'none',
};

const buttonStyle = {
  border: 'none',
  borderRadius: 999,
  padding: '10px 18px',
  background: '#171717',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 600,
};

export default function HelloIdeaClient() {
  const [idea, setIdea] = useState('');
  const [change, setChange] = useState('');
  const [stuck, setStuck] = useState('');
  const [output, setOutput] = useState('');
  const [perspective, setPerspective] = useState('');
  const [loadingIdea, setLoadingIdea] = useState(false);
  const [loadingPerspective, setLoadingPerspective] = useState(false);
  const [error, setError] = useState('');

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

      setOutput(data.output);
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
          idea: output,
          purpose: '',
          stuck,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      setPerspective(data.output);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoadingPerspective(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', padding: '32px 20px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ marginBottom: 28 }}>
          <p style={{ margin: 0, letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 12, opacity: 0.55 }}>
            hello idea
          </p>
          <h1 style={{ margin: '10px 0 12px', fontSize: 'clamp(36px, 6vw, 68px)', lineHeight: 1, maxWidth: 860 }}>
            Get your idea out of your head.
          </h1>
          <p style={{ margin: 0, maxWidth: 760, fontSize: 18, lineHeight: 1.6, opacity: 0.7 }}>
            Write it messy. We’ll help make it clearer, surface the purpose, and give you a fresh perspective when you get stuck.
          </p>
        </div>

        <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          <section style={panelStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 24 }}>Your idea</h2>
              <button style={buttonStyle} onClick={handleIdeaSubmit} disabled={loadingIdea}>
                {loadingIdea ? 'Working...' : 'Go'}
              </button>
            </div>
            <textarea
              style={textareaStyle}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Write here. Messy is fine."
            />
          </section>

          <section style={panelStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 24 }}>Want to change or add anything?</h2>
              <button style={buttonStyle} onClick={handleIdeaSubmit} disabled={loadingIdea}>
                {loadingIdea ? 'Working...' : 'Go'}
              </button>
            </div>
            <textarea
              style={textareaStyle}
              value={change}
              onChange={(e) => setChange(e.target.value)}
              placeholder="Add or change anything"
            />
          </section>

          <section style={panelStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <h2 style={{ margin: 0, fontSize: 24 }}>Stuck? Get new perspective</h2>
              <button style={buttonStyle} onClick={handlePerspectiveSubmit} disabled={loadingPerspective}>
                {loadingPerspective ? 'Working...' : 'Go'}
              </button>
            </div>
            <textarea
              style={textareaStyle}
              value={stuck}
              onChange={(e) => setStuck(e.target.value)}
              placeholder="Where are you stuck?"
            />
          </section>
        </div>

        {error && (
          <div style={{ marginTop: 18, color: '#8a1f11', background: '#fff1ef', borderRadius: 16, padding: 14 }}>
            {error}
          </div>
        )}

        {/* OUTPUT */}
        {output && (
          <section style={{ ...panelStyle, marginTop: 20 }}>
            <h3 style={{ marginBottom: 12 }}>Your idea</h3>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
              {output}
            </div>
          </section>
        )}

        {/* PERSPECTIVE */}
        {perspective && (
          <section style={{ ...panelStyle, marginTop: 20 }}>
            <h3 style={{ marginBottom: 12 }}>Fresh perspective</h3>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
              {perspective}
            </div>
          </section>
        )}

        <div style={{ ...panelStyle, marginTop: 20 }}>
          Keep it simple. Write anything down. Then keep building.
        </div>
      </div>
    </main>
  );
}
