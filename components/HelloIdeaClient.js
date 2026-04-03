'use client';

import { useState } from 'react';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F1FF89',
    display: 'flex',
    justifyContent: 'center',
    overflowX: 'auto',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  frame: {
    position: 'relative',
    width: 1440,
    minHeight: 1024,
    background: '#F1FF89',
  },
  sideLabel: {
    position: 'absolute',
    left: 28,
    top: 417,
    transform: 'rotate(-90deg)',
    transformOrigin: 'left top',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '12px',
    color: '#000000',
    whiteSpace: 'nowrap',
  },
  poweredWrap: {
    position: 'absolute',
    left: 1170,
    top: 210,
    fontSize: 12,
    lineHeight: '12px',
    color: '#000000',
  },
  poweredLink: {
    color: '#000000',
    textDecoration: 'underline',
    fontWeight: 700,
  },
  pageTitle: {
    position: 'absolute',
    left: 202,
    top: 243,
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '12px',
    color: '#000000',
  },
  label: {
    position: 'absolute',
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '12px',
    color: '#000000',
  },
  box: {
    position: 'absolute',
    background: '#FFFFFF',
    border: '1px solid #000000',
    boxSizing: 'border-box',
    padding: '8px 10px',
    outline: 'none',
    resize: 'none',
    fontFamily: 'Inter, Arial, sans-serif',
    fontSize: 12,
    lineHeight: '16px',
    color: '#000000',
    overflow: 'auto',
  },
  button: {
    position: 'absolute',
    width: 76,
    height: 31,
    borderRadius: 20,
    border: 'none',
    background: '#FA625F',
    color: '#FFFFFF',
    fontFamily: 'Inter, Arial, sans-serif',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  footer: {
    position: 'absolute',
    top: 868,
    left: 0,
    width: '100%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '16px',
    color: '#000000',
    margin: 0,
  },
  error: {
    position: 'absolute',
    left: 193,
    top: 915,
    width: 902,
    padding: '8px 10px',
    boxSizing: 'border-box',
    border: '1px solid #F0B8AE',
    background: '#FFF1EF',
    color: '#8A1F11',
    fontSize: 12,
    lineHeight: '16px',
  },
};

function formatIdeaBox(data) {
  const parts = [];

  if (data?.idea?.idea) {
    parts.push(`The idea\n${data.idea.idea}`);
  }

  if (data?.idea?.whoFor) {
    parts.push(`Who it’s for\n${data.idea.whoFor}`);
  }

  if (data?.idea?.different) {
    parts.push(`What makes it different\n${data.idea.different}`);
  }

  if (data?.idea?.questions) {
    parts.push(`Helpful questions\n${data.idea.questions}`);
  }

  if (data?.idea?.instructions) {
    parts.push(`Write down instructions\n${data.idea.instructions}`);
  }

  if (data?.idea?.reflection) {
    parts.push(`Reflection and update step\n${data.idea.reflection}`);
  }

  return parts.join('\n\n');
}

export default function HelloIdeaClient() {
  const [rawIdeaInput, setRawIdeaInput] = useState('');
  const [ideaBox, setIdeaBox] = useState('');
  const [changeBox, setChangeBox] = useState('');
  const [purposeBox, setPurposeBox] = useState('');
  const [progressBox, setProgressBox] = useState('');
  const [perspectiveBox, setPerspectiveBox] = useState('');
  const [loadingIdea, setLoadingIdea] = useState(false);
  const [loadingPerspective, setLoadingPerspective] = useState(false);
  const [error, setError] = useState('');

  async function handleIdeaGo() {
    setLoadingIdea(true);
    setError('');

    try {
      const response = await fetch('/api/idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'idea',
          idea: rawIdeaInput || ideaBox,
          change: changeBox,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Something went wrong');
      }

      setIdeaBox(formatIdeaBox(data));
      setPurposeBox(data?.purpose || '');
      setProgressBox(data?.progress || '');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoadingIdea(false);
    }
  }

  async function handlePerspectiveGo() {
    setLoadingPerspective(true);
    setError('');

    try {
      const response = await fetch('/api/idea', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: 'perspective',
          idea: ideaBox || rawIdeaInput,
          purpose: purposeBox,
          stuck: perspectiveBox,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Something went wrong');
      }

      setPerspectiveBox(data?.output || '');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoadingPerspective(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.frame}>
        <div style={styles.sideLabel}>Purpose+Progress+Perspective = Idea</div>

        <div style={styles.poweredWrap}>
          Powered by{' '}
          <a
            href="https://www.goodcitizens.com.au/"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.poweredLink}
          >
            Good Citizens
          </a>
        </div>

        <h1 style={styles.pageTitle}>Your idea</h1>

        <p style={{ ...styles.label, left: 202, top: 364 }}>Your idea</p>
        <textarea
          style={{
            ...styles.box,
            left: 193,
            top: 389,
            width: 518,
            height: 225,
          }}
          placeholder="Type your idea. Messy is fine. Who is it for? How does it help?"
          value={ideaBox || rawIdeaInput}
          onChange={(e) => {
            const value = e.target.value;
            setRawIdeaInput(value);
            if (!ideaBox) {
              setIdeaBox(value);
            } else {
              setIdeaBox(value);
            }
          }}
        />

        <p style={{ ...styles.label, left: 738, top: 364 }}>Want to change or add anything?</p>
        <textarea
          style={{
            ...styles.box,
            left: 729,
            top: 389,
            width: 518,
            height: 225,
          }}
          placeholder="Add or change anything here."
          value={changeBox}
          onChange={(e) => setChangeBox(e.target.value)}
        />

        <button
          style={{ ...styles.button, left: 660, top: 628 }}
          onClick={handleIdeaGo}
          disabled={loadingIdea}
        >
          {loadingIdea ? '...' : 'Go'}
        </button>

        <button
          style={{ ...styles.button, left: 1195, top: 628 }}
          onClick={handleIdeaGo}
          disabled={loadingIdea}
        >
          {loadingIdea ? '...' : 'Go'}
        </button>

        <p style={{ ...styles.label, left: 202, top: 735 }}>Purpose (Reason for doing it)</p>
        <textarea
          readOnly
          style={{
            ...styles.box,
            left: 193,
            top: 761,
            width: 366,
            height: 211,
          }}
          value={purposeBox}
        />

        <p style={{ ...styles.label, left: 582, top: 735 }}>Progress (Every small step forward is a win)</p>
        <textarea
          readOnly
          style={{
            ...styles.box,
            left: 576,
            top: 761,
            width: 366,
            height: 211,
          }}
          value={progressBox}
        />

        <p style={{ ...styles.label, left: 962, top: 735 }}>Perspective (See your problem with fresh eyes)</p>
        <textarea
          style={{
            ...styles.box,
            left: 956,
            top: 761,
            width: 366,
            height: 211,
            color: perspectiveBox ? '#000000' : '#6B6B6B',
          }}
          placeholder="Stuck? Paste your idea and purpose words here. Tell me the problem."
          value={perspectiveBox}
          onChange={(e) => setPerspectiveBox(e.target.value)}
        />

        <button
          style={{ ...styles.button, left: 1170, top: 987 }}
          onClick={handlePerspectiveGo}
          disabled={loadingPerspective}
        >
          {loadingPerspective ? '...' : 'Go'}
        </button>

        <p style={styles.footer}>
          Don’t lose this.
          <br />
          When you close or refresh, it’s gone.
          <br />
          Write it down or copy it now.
        </p>

        {error ? <div style={styles.error}>{error}</div> : null}
      </div>
    </div>
  );
}
