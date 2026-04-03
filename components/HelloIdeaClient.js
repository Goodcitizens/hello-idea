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
    position: 'fixed',
    left: 38,
    top: 40,
    fontSize: 12,
    fontWeight: 500,
    color: '#000000',
    transform: 'rotate(-90deg) translateX(-100%)',
    transformOrigin: 'top left',
    whiteSpace: 'nowrap',
  },
  poweredWrap: {
    position: 'fixed',
    right: 40,
    top: 40,
    fontSize: 12,
    color: '#000000',
    whiteSpace: 'nowrap',
  },
  poweredLink: {
    color: '#000000',
    textDecoration: 'underline',
    fontWeight: 700,
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
  saveNote: {
    position: 'absolute',
    left: 636,
    top: 986,
    width: 366,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '16px',
    color: '#000000',
    margin: 0,
  },
  error: {
    position: 'absolute',
    left: 230,
    top: 930,
    width: 1080,
    padding: '8px 10px',
    boxSizing: 'border-box',
    border: '1px solid #F0B8AE',
    background: '#FFF1EF',
    color: '#8A1F11',
    fontSize: 12,
    lineHeight: '16px',
  },
};

function buildIdeaText(data) {
  const parts = [];

  if (data?.idea?.idea) {
    parts.push(`The Idea\n${data.idea.idea}`);
  }

  if (data?.idea?.whoFor) {
    parts.push(`\nWho it's for\n${data.idea.whoFor}`);
  }

  if (data?.idea?.different) {
    parts.push(`\nWhat makes it different\n${data.idea.different}`);
  }

  if (data?.idea?.questions) {
    const questions = data.idea.questions
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .join('\n');
    parts.push(`\nHelpful questions\n${questions}`);
  }

  if (data?.idea?.instructions) {
    parts.push(`\nWrite down instructions\n${data.idea.instructions}`);
  }

  return parts.join('\n');
}

function buildProgressText(progress) {
  const intro =
    '24:1 means this: what is one thing you can do today that 24 hours from now your future self will thank you for?';

  const cleaned = (progress || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');

  return cleaned ? `${intro}\n\n${cleaned}` : intro;
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

      setIdeaBox(buildIdeaText(data));
      setPurposeBox(data?.purpose || '');
      setProgressBox(buildProgressText(data?.progress || ''));
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
        <div style={styles.sideLabel}>Purpose+Progress+Perspective = IDEA</div>

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

        <p style={{ ...styles.label, left: 231, top: 378 }}>Your idea</p>
        <textarea
          style={{
            ...styles.box,
            left: 224,
            top: 395,
            width: 510,
            height: 225,
            fontWeight: 400,
          }}
          placeholder="Type your idea. Messy is fine. Who is it for? How does it help?"
          value={ideaBox || rawIdeaInput}
          onChange={(e) => {
            const value = e.target.value;
            setRawIdeaInput(value);
            setIdeaBox(value);
          }}
        />

        <p style={{ ...styles.label, left: 752, top: 378 }}>Want to change or add anything?</p>
        <textarea
          style={{
            ...styles.box,
            left: 744,
            top: 395,
            width: 510,
            height: 225,
          }}
          placeholder="Add or change anything here."
          value={changeBox}
          onChange={(e) => setChangeBox(e.target.value)}
        />

        <button
          style={{ ...styles.button, left: 659, top: 635 }}
          onClick={handleIdeaGo}
          disabled={loadingIdea}
        >
          {loadingIdea ? '...' : 'Go'}
        </button>

        <button
          style={{ ...styles.button, left: 1179, top: 635 }}
          onClick={handleIdeaGo}
          disabled={loadingIdea}
        >
          {loadingIdea ? '...' : 'Go'}
        </button>

        <p style={{ ...styles.label, left: 231, top: 708 }}>Purpose (Reason for doing it)</p>
        <textarea
          readOnly
          style={{
            ...styles.box,
            left: 224,
            top: 726,
            width: 330,
            height: 222,
          }}
          value={purposeBox}
        />

        <p style={{ ...styles.label, left: 575, top: 708 }}>Progress (Every small step forward is a win)</p>
        <textarea
          readOnly
          style={{
            ...styles.box,
            left: 569,
            top: 726,
            width: 330,
            height: 222,
          }}
          value={progressBox}
        />

        <p style={{ ...styles.label, left: 921, top: 708 }}>Perspective (See your problem with fresh eyes)</p>
        <textarea
          style={{
            ...styles.box,
            left: 916,
            top: 726,
            width: 338,
            height: 222,
            color: perspectiveBox ? '#000000' : '#6B6B6B',
          }}
          placeholder="Stuck? Paste your idea and purpose words here.
Tell me the problem."
          value={perspectiveBox}
          onChange={(e) => setPerspectiveBox(e.target.value)}
        />

        <button
          style={{ ...styles.button, left: 1179, top: 962 }}
          onClick={handlePerspectiveGo}
          disabled={loadingPerspective}
        >
          {loadingPerspective ? '...' : 'Go'}
        </button>

        <p style={styles.saveNote}>
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
