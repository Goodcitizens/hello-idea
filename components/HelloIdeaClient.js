'use client';

import { useState } from 'react';

const PAGE_W = 1440;
const PAGE_H = 1024;

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F1FF89',
    fontFamily: 'Inter, Arial, sans-serif',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    overflowX: 'auto',
  },
  frame: {
    width: PAGE_W,
    minHeight: PAGE_H,
    position: 'relative',
    background: '#F1FF89',
  },
  sideLabel: {
    position: 'absolute',
    left: 28,
    top: 404,
    transform: 'rotate(-90deg)',
    transformOrigin: 'left top',
    fontSize: 12,
    fontWeight: 700,
    color: '#000000',
    whiteSpace: 'nowrap',
  },
  powered: {
    position: 'absolute',
    left: 1170,
    top: 210,
    fontSize: 12,
    fontWeight: 400,
    color: '#000000',
  },
  poweredLink: {
    color: '#000000',
    textDecoration: 'underline',
    fontWeight: 700,
  },
  title: {
    position: 'absolute',
    left: 202,
    top: 210,
    fontSize: 12,
    fontWeight: 700,
    color: '#000000',
    margin: 0,
  },
  label: {
    position: 'absolute',
    fontSize: 12,
    fontWeight: 700,
    color: '#000000',
    margin: 0,
    lineHeight: '12px',
  },
  box: {
    position: 'absolute',
    background: '#FFFFFF',
    border: '1px solid #000000',
    boxSizing: 'border-box',
    padding: '10px 10px 8px 10px',
    fontSize: 12,
    lineHeight: '16px',
    color: '#000000',
    resize: 'none',
    outline: 'none',
    overflow: 'auto',
  },
  placeholderBox: {
    color: '#6B6B6B',
  },
  button: {
    position: 'absolute',
    width: 76,
    height: 31,
    borderRadius: 20,
    background: '#FA625F',
    border: 'none',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    lineHeight: '31px',
    textAlign: 'center',
    padding: 0,
  },
  note: {
    position: 'absolute',
    left: 0,
    width: '100%',
    top: 868,
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
    top: 905,
    width: 1040,
    fontSize: 12,
    color: '#8A1F11',
    background: '#FFF1EF',
    border: '1px solid #F0B8AE',
    padding: '8px 10px',
    boxSizing: 'border-box',
  },
};

function normaliseBullets(text) {
  if (!text) return '';
  return text
    .replace(/\r/g, '')
    .replace(/^\s*[-•]\s*/gm, '• ')
    .trim();
}

function formatIdeaBox(data) {
  const sections = [];

  if (data?.idea?.idea) {
    sections.push(`The idea\n${data.idea.idea}`);
  }
  if (data?.idea?.whoFor) {
    sections.push(`Who it’s for\n${data.idea.whoFor}`);
  }
  if (data?.idea?.different) {
    sections.push(`What makes it different\n${data.idea.different}`);
  }
  if (data?.idea?.questions) {
    sections.push(`Helpful questions\n${normaliseBullets(data.idea.questions)}`);
  }
  if (data?.idea?.instructions) {
    sections.push(`Write down instructions\n${data.idea.instructions}`);
  }
  if (data?.idea?.reflection) {
    sections.push(`Reflection and update step\n${data.idea.reflection}`);
  }

  return sections.join('\n\n');
}

export default function HelloIdeaClient() {
  const [ideaInput, setIdeaInput] = useState('');
  const [changeInput, setChangeInput] = useState('');
  const [ideaBox, setIdeaBox] = useState('');
  const [purposeBox, setPurposeBox] = useState('');
  const [progressBox, setProgressBox] = useState('');
  const [perspectiveInput, setPerspectiveInput] = useState('');
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
          idea: ideaInput,
          extra: changeInput,
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
          idea: ideaBox || ideaInput,
          purpose: purposeBox,
          stuck: perspectiveInput,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Something went wrong');
      }

      setPerspectiveInput(data?.output || '');
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

        <div style={styles.powered}>
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

        <h1 style={styles.title}>Your idea</h1>

        <p style={{ ...styles.label, left: 202, top: 243 }}>Your idea</p>
        <textarea
          style={{
            ...styles.box,
            left: 193,
            top: 233,
            width: 518,
            height: 225,
          }}
          placeholder="Type your idea. Messy is fine. Who is it for? How does it help?"
          value={ideaInput}
          onChange={(e) => setIdeaInput(e.target.value)}
        />

        <p style={{ ...styles.label, left: 584, top: 243 }}>Want to change or add anything?</p>
        <textarea
          style={{
            ...styles.box,
            left: 577,
            top: 233,
            width: 518,
            height: 225,
          }}
          placeholder="Add or change anything here."
          value={changeInput}
          onChange={(e) => setChangeInput(e.target.value)}
        />

        <button
          style={{ ...styles.button, left: 635, top: 463 }}
          onClick={handleIdeaGo}
          disabled={loadingIdea}
        >
          {loadingIdea ? '...' : 'Go'}
        </button>

        <button
          style={{ ...styles.button, left: 1017, top: 463 }}
          onClick={handleIdeaGo}
          disabled={loadingIdea}
        >
          {loadingIdea ? '...' : 'Go'}
        </button>

        <p style={{ ...styles.label, left: 202, top: 564 }}>Purpose (Reason for doing it)</p>
        <textarea
          readOnly
          style={{
            ...styles.box,
            left: 193,
            top: 554,
            width: 366,
            height: 211,
          }}
          value={purposeBox}
        />

        <p style={{ ...styles.label, left: 583, top: 564 }}>Progress (Every small step forward is a win)</p>
        <textarea
          readOnly
          style={{
            ...styles.box,
            left: 576,
            top: 554,
            width: 366,
            height: 211,
          }}
          value={progressBox}
        />

        <p style={{ ...styles.label, left: 963, top: 564 }}>Perspective (See your problem with fresh eyes)</p>
        <textarea
          style={{
            ...styles.box,
            left: 956,
            top: 554,
            width: 366,
            height: 211,
            color: perspectiveInput ? '#000000' : '#6B6B6B',
          }}
          placeholder="Stuck? Paste your idea and purpose words here. Tell me the problem."
          value={perspectiveInput}
          onChange={(e) => setPerspectiveInput(e.target.value)}
        />

        <button
          style={{ ...styles.button, left: 1170, top: 780 }}
          onClick={handlePerspectiveGo}
          disabled={loadingPerspective}
        >
          {loadingPerspective ? '...' : 'Go'}
        </button>

        <p style={styles.note}>
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
