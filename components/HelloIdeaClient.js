'use client';

import { useState } from 'react';

const pageStyle = {
  minHeight: '100vh',
  background: '#f1ff89',
  padding: '70px 20px 90px',
};

const wrapStyle = {
  maxWidth: 540,
  margin: '0 auto',
};

const labelStyle = {
  margin: '0 0 10px',
  fontSize: 18,
  fontWeight: 700,
  color: '#111',
};

const textareaBaseStyle = {
  width: '100%',
  borderRadius: 24,
  border: '1.5px solid rgba(0,0,0,0.25)',
  background: '#f3f3f3',
  padding: '18px 22px',
  outline: 'none',
  resize: 'vertical',
  fontSize: 16,
  lineHeight: 1.55,
  color: '#111',
  boxSizing: 'border-box',
};

const bigBoxStyle = {
  ...textareaBaseStyle,
  minHeight: 390,
};

const midBoxStyle = {
  ...textareaBaseStyle,
  minHeight: 118,
};

const lowerBoxStyle = {
  ...textareaBaseStyle,
  minHeight: 150,
};

const buttonWrapStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: 12,
  marginBottom: 34,
};

const buttonStyle = {
  border: 'none',
  borderRadius: 999,
  padding: '10px 24px',
  background: '#000',
  color: '#fff',
  cursor: 'pointer',
  fontWeight: 700,
  fontSize: 18,
  lineHeight: 1,
};

const helperStyle = {
  margin: '0 0 26px',
  fontSize: 15,
  lineHeight: 1.6,
  color: 'rgba(0,0,0,0.72)',
};

// ✅ TRUST LINE STYLE
const trustStyle = {
  marginTop: 8,
  fontSize: 11,
  lineHeight: 1.4,
  color: 'rgba(0,0,0,0.55)',
};

export default function HelloIdeaClient() {
  const [sourceIdea, setSourceIdea] = useState('');
  const [ideaBox, setIdeaBox] = useState('');
  const [changeBox, setChangeBox] = useState('');
  const [stuckBox, setStuckBox] = useState('');
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
        body: JSON.stringify({
          mode: 'idea',
          idea: sourceIdea || ideaBox,
          change: changeBox,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      setIdeaBox(data.output || '');
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
          idea: ideaBox,
          purpose: '',
          stuck: stuckBox,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Something went wrong');

      setStuckBox(data.output || '');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoadingPerspective(false);
    }
  }

  function handleTopBoxChange(e) {
    const value = e.target.value;
    setIdeaBox(value);
    setSourceIdea(value);
  }

  return (
    <main style={pageStyle}>
      <div style={wrapStyle}>
        <p style={helperStyle}>
          Write it messy. We’ll help make it clearer, surface the purpose, and give you a fresh perspective when you get stuck.
        </p>

        <section>
          <h2 style={labelStyle}>Your idea</h2>

          <textarea
            style={bigBoxStyle}
            value={ideaBox}
            onChange={handleTopBoxChange}
            placeholder="Write here. Messy is fine. Tip: include who its for and why helps."
          />

          {/* ✅ TRUST LINE HERE */}
          <p style={trustStyle}>
            No logins. No storage. Your idea stays yours.
          </p>

          <div style={buttonWrapStyle}>
            <button style={buttonStyle} onClick={handleIdeaSubmit} disabled={loadingIdea}>
              {loadingIdea ? '...' : 'Go'}
            </button>
          </div>
        </section>

        <section>
          <h2 style={labelStyle}>Want to change or add anything?</h2>
          <textarea
            style={midBoxStyle}
            value={changeBox}
            onChange={(e) => setChangeBox(e.target.value)}
            placeholder="Write here... oh yes i forgot to mention..."
          />
          <div style={buttonWrapStyle}>
            <button style={buttonStyle} onClick={handleIdeaSubmit} disabled={loadingIdea}>
              {loadingIdea ? '...' : 'Go'}
            </button>
          </div>
        </section>

        <section>
          <h2 style={labelStyle}>Stuck? Get new perspective</h2>
          <textarea
            style={lowerBoxStyle}
            value={stuckBox}
            onChange={(e) => setStuckBox(e.target.value)}
            placeholder="Copy and paste the words from Your Idea & Your Purpose. Hit ‘Go’"
          />
          <div style={buttonWrapStyle}>
            <button style={buttonStyle} onClick={handlePerspectiveSubmit} disabled={loadingPerspective}>
              {loadingPerspective ? '...' : 'Go'}
            </button>
          </div>
        </section>

        {error ? (
          <div
            style={{
              marginTop: 6,
              borderRadius: 16,
              padding: '12px 16px',
              background: '#fff1ef',
              border: '1px solid #f0b8ae',
              color: '#8a1f11',
              fontSize: 14,
            }}
          >
            {error}
          </div>
        ) : null}
      </div>
    </main>
  );
}
