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
    left: '50%',
    transform: 'translateX(-50%)',
    top: 986,
    width: 420,
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

  if (data?.yourIdea) {
    parts.push(`The Idea\n${data.yourIdea}`);
  }

  if (data?.yourPurpose) {
    parts.push(`\nThe Purpose\n${data.yourPurpose}`);
  }

  if (data?.nextPrompt) {
    parts.push(`\n${data.nextPrompt}`);
  }

  return parts.join('\n');
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
  const [hoveredButton, setHoveredButton] = useState(null);

  async function handleIdeaGo() {
    setLoadingIdea(true);
    setError('');

    try {
      const response = await fetch('/api/idea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      setPurposeBox(data?.yourPurpose || '');

      // clear progress box for now
      setProgressBox('');
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
        headers: { 'Content-Type': 'application/json' },
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
        <div style={styles.sideLabel}>Purpose + Progress + Perspective = IDEA</div>

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
          }}
          placeholder="Type your idea. Messy is fine."
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
          placeholder="Add or change anything."
          value={changeBox}
          onChange={(e) => setChangeBox(e.target.value)}
        />

        <button
          style={{
            ...styles.button,
            left: 659,
            top: 635,
            background: hoveredButton === 'idea-left' ? '#5FFAB2' : '#FA625F',
          }}
          onMouseEnter={() => setHoveredButton('idea-left')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={handleIdeaGo}
        >
          Go
        </button>

        <button
          style={{
            ...styles.button,
            left: 1179,
            top: 635,
            background: hoveredButton === 'idea-right' ? '#5FFAB2' : '#FA625F',
          }}
          onMouseEnter={() => setHoveredButton('idea-right')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={handleIdeaGo}
        >
          Go
        </button>

        <p style={{ ...styles.label, left: 231, top: 708 }}>Purpose</p>
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

        <p style={{ ...styles.label, left: 575, top: 708 }}>Progress</p>
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

        <p style={{ ...styles.label, left: 921, top: 708 }}>Perspective</p>
        <textarea
          style={{
            ...styles.box,
            left: 916,
            top: 726,
            width: 338,
            height: 222,
          }}
          placeholder="Stuck? Tell me the problem."
          value={perspectiveBox}
          onChange={(e) => setPerspectiveBox(e.target.value)}
        />

        <button
          style={{
            ...styles.button,
            left: 1179,
            top: 962,
            background: hoveredButton === 'perspective' ? '#5FFAB2' : '#FA625F',
          }}
          onMouseEnter={() => setHoveredButton('perspective')}
          onMouseLeave={() => setHoveredButton(null)}
          onClick={handlePerspectiveGo}
        >
          Go
        </button>

        <p style={styles.saveNote}>
          Don’t lose this.
          <br />
          Write it down or copy it now.
        </p>

        {error ? <div style={styles.error}>{error}</div> : null}
      </div>
    </div>
  );
}
