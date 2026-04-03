'use client';

import { useState } from 'react';

const styles = {
  page: {
    minHeight: '100vh',
    background: '#F1FF89',
    display: 'flex',
    justifyContent: 'center',
    overflowX: 'auto',
    fontFamily: 'Arial, Helvetica, sans-serif',
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
    top: 420,
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
    top: 209,
    fontSize: 12,
    lineHeight: '12px',
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
    background: '#F2F2F2',
    border: '1px solid #000000',
    boxSizing: 'border-box',
    padding: '8px 10px',
    outline: 'none',
    resize: 'none',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 12,
    lineHeight: '16px',
    color: '#000000',
    overflow: 'auto',
  },
  saveNote: {
    position: 'absolute',
    left: 509,
    top: 858,
    width: 171,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '16px',
    color: '#000000',
    margin: 0,
  },
  error: {
    position: 'absolute',
    left: 164,
    top: 960,
    width: 1030,
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

function buildProgressLines(progress) {
  return (progress || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter(
      (line) =>
        line.toLowerCase() !==
        'what is the one thing you could do today that 24 hours from now you will thank yourself for?'
    );
}

function GoButton({ left, top, onClick, disabled, children = 'Go' }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        left,
        top,
        width: 76,
        height: 31,
        borderRadius: 20,
        border: 'none',
        background: hovered && !disabled ? '#FF7A72' : '#FA625F',
        color: '#FFF59B',
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: 12,
        fontWeight: 700,
        lineHeight: '12px',
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        boxShadow: hovered && !disabled ? '0 4px 10px rgba(0,0,0,0.12)' : 'none',
        transform: hovered && !disabled ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'background 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease',
        opacity: disabled ? 0.8 : 1,
      }}
    >
      {children}
    </button>
  );
}

export default function HelloIdeaClient() {
  const [ideaInput, setIdeaInput] = useState('');
  const [ideaBox, setIdeaBox] = useState('');
  const [changeBox, setChangeBox] = useState('');
  const [purposeBox, setPurposeBox] = useState('');
  const [progressLines, setProgressLines] = useState([]);
  const [perspectiveBox, setPerspectiveBox] = useState('');
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
          idea: ideaInput || ideaBox,
          change: changeBox,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Something went wrong');
      }

      setIdeaBox(buildIdeaText(data));
      setIdeaInput('');
      setPurposeBox(data?.purpose || '');
      setProgressLines(buildProgressLines(data?.progress || ''));
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
          idea: ideaBox || ideaInput,
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

        <p style={{ ...styles.label, left: 171, top: 378 }}>Your idea</p>
        <textarea
          style={{
            ...styles.box,
            left: 164,
            top: 395,
            width: 510,
            height: 225,
          }}
          placeholder="Type your idea. Messy is fine. Who is it for? How does it help?"
          value={ideaBox || ideaInput}
          onChange={(e) => {
            const value = e.target.value;
            setIdeaInput(value);
            setIdeaBox(value);
          }}
        />

        <p style={{ ...styles.label, left: 692, top: 378 }}>Want to change or add anything?</p>
        <textarea
          style={{
            ...styles.box,
            left: 684,
            top: 395,
            width: 510,
            height: 225,
          }}
          placeholder="Add or change anything here."
          value={changeBox}
          onChange={(e) => setChangeBox(e.target.value)}
        />

        <GoButton left={599} top={635} onClick={handleIdeaSubmit} disabled={loadingIdea}>
          {loadingIdea ? '...' : 'Go'}
        </GoButton>

        <GoButton left={1118} top={635} onClick={handleIdeaSubmit} disabled={loadingIdea}>
          {loadingIdea ? '...' : 'Go'}
        </GoButton>

        <p style={{ ...styles.label, left: 171, top: 708 }}>Purpose (Reason for doing it)</p>
        <textarea
          readOnly
          style={{
            ...styles.box,
            left: 164,
            top: 726,
            width: 330,
            height: 222,
          }}
          value={purposeBox}
        />

        <p style={{ ...styles.label, left: 515, top: 708 }}>
          Progress (Every small step forward is a win)
        </p>
        <div
          style={{
            ...styles.box,
            left: 509,
            top: 726,
            width: 330,
            height: 222,
            whiteSpace: 'pre-wrap',
          }}
        >
          <div style={{ marginBottom: 12 }}>
            What is the one thing you could do today that 24 hours from now you will thank yourself for?
          </div>

          {progressLines.map((line, index) => (
            <div key={index} style={{ marginBottom: 4 }}>
              {line}
            </div>
          ))}
        </div>

        <p style={{ ...styles.label, left: 861, top: 708 }}>
          Perspective (See your problem with fresh eyes)
        </p>
        <textarea
          style={{
            ...styles.box,
            left: 856,
            top: 726,
            width: 338,
            height: 222,
            color: perspectiveBox ? '#000000' : '#6B6B6B',
          }}
          placeholder={`Stuck? Paste your idea and purpose words here.
Tell me the problem.`}
          value={perspectiveBox}
          onChange={(e) => setPerspectiveBox(e.target.value)}
        />

        <GoButton left={1118} top={962} onClick={handlePerspectiveSubmit} disabled={loadingPerspective}>
          {loadingPerspective ? '...' : 'Go'}
        </GoButton>

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
