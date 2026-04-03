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
  poweredWrap: {
    position: 'absolute',
    right: 193,
    top: 160,
    fontSize: 12,
    lineHeight: '12px',
    color: '#000000',
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
    fontFamily: 'Inter, Arial, sans-serif',
    fontSize: 12,
    lineHeight: '16px',
    color: '#000000',
    overflow: 'auto',
  },
  textarea: {
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
  plainInput: {
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    resize: 'none',
    fontFamily: 'Inter, Arial, sans-serif',
    fontSize: 12,
    lineHeight: '16px',
    color: '#000000',
    background: 'transparent',
    padding: 0,
    margin: 0,
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
  const sections = [];

  if (data?.idea?.idea) {
    sections.push({
      heading: 'The Idea',
      body: data.idea.idea,
    });
  }

  if (data?.idea?.whoFor) {
    sections.push({
      heading: "Who it's for",
      body: data.idea.whoFor,
    });
  }

  if (data?.idea?.different) {
    sections.push({
      heading: 'What makes it different',
      body: data.idea.different,
    });
  }

  if (data?.idea?.questions) {
    sections.push({
      heading: 'Helpful questions',
      body: data.idea.questions
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean),
    });
  }

  if (data?.idea?.instructions) {
    sections.push({
      heading: 'Write down instructions',
      body: data.idea.instructions,
    });
  }

  return sections;
}

function renderIdeaContent(ideaSections) {
  return ideaSections.map((section, index) => (
    <div key={`${section.heading}-${index}`} style={{ marginBottom: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 2 }}>{section.heading}</div>

      {Array.isArray(section.body) ? (
        section.body.map((line, lineIndex) => (
          <div key={`${section.heading}-${lineIndex}`}>{line}</div>
        ))
      ) : (
        <div style={{ whiteSpace: 'pre-wrap' }}>{section.body}</div>
      )}
    </div>
  ));
}

function renderProgressLines(progressBox) {
  return progressBox
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => <div key={`${line}-${index}`}>{line}</div>);
}

export default function HelloIdeaClient() {
  const [rawIdeaInput, setRawIdeaInput] = useState('');
  const [ideaSections, setIdeaSections] = useState([]);
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
          idea: rawIdeaInput,
          change: changeBox,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Something went wrong');
      }

      setIdeaSections(formatIdeaBox(data));
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
          idea:
            ideaSections.length > 0
              ? ideaSections
                  .map((section) =>
                    Array.isArray(section.body)
                      ? `${section.heading}\n${section.body.join('\n')}`
                      : `${section.heading}\n${section.body}`
                  )
                  .join('\n\n')
              : rawIdeaInput,
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
        <p style={{ ...styles.label, left: 193, top: 160 }}>
          Purpose+Progress+Perspective = Idea
        </p>

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

        <p style={{ ...styles.label, left: 193, top: 208 }}>The Idea</p>

        <div
          style={{
            ...styles.box,
            left: 193,
            top: 389,
            width: 518,
            height: 225,
          }}
        >
          {ideaSections.length > 0 ? (
            renderIdeaContent(ideaSections)
          ) : (
            <textarea
              style={styles.plainInput}
              placeholder="Type your idea. Messy is fine. Who is it for? How does it help?"
              value={rawIdeaInput}
              onChange={(e) => setRawIdeaInput(e.target.value)}
            />
          )}
        </div>

        <p style={{ ...styles.label, left: 738, top: 364 }}>
          Want to change or add anything?
        </p>
        <textarea
          style={{
            ...styles.textarea,
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
          style={{ ...styles.button, left: 635, top: 628 }}
          onClick={handleIdeaGo}
          disabled={loadingIdea}
        >
          {loadingIdea ? '...' : 'Go'}
        </button>

        <button
          style={{ ...styles.button, left: 1171, top: 628 }}
          onClick={handleIdeaGo}
          disabled={loadingIdea}
        >
          {loadingIdea ? '...' : 'Go'}
        </button>

        <p style={{ ...styles.label, left: 202, top: 735 }}>
          Purpose (Reason for doing it)
        </p>
        <textarea
          readOnly
          style={{
            ...styles.textarea,
            left: 193,
            top: 761,
            width: 289,
            height: 166,
          }}
          value={purposeBox}
        />

        <p style={{ ...styles.label, left: 496, top: 735 }}>
          Progress (Every small step forward is a win)
        </p>
        <div
          style={{
            ...styles.box,
            left: 496,
            top: 761,
            width: 289,
            height: 166,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8 }}>
            24:1 means this: what is one thing you can do today that 24 hours from now
            your future self will thank you for?
          </div>
          {renderProgressLines(progressBox)}
        </div>

        <p
          style={{
            position: 'absolute',
            left: 496,
            top: 943,
            width: 289,
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 700,
            lineHeight: '16px',
            color: '#000000',
            margin: 0,
          }}
        >
          Don’t lose this.
          <br />
          When you close or refresh, it’s gone.
          <br />
          Write it down or copy it now.
        </p>

        <p style={{ ...styles.label, left: 799, top: 735 }}>
          Perspective (See your problem with fresh eyes)
        </p>
        <textarea
          style={{
            ...styles.textarea,
            left: 799,
            top: 761,
            width: 428,
            height: 166,
            color: perspectiveBox ? '#000000' : '#6B6B6B',
          }}
          placeholder="Stuck? Paste your idea and purpose words here. Tell me the problem."
          value={perspectiveBox}
          onChange={(e) => setPerspectiveBox(e.target.value)}
        />

        <button
          style={{ ...styles.button, left: 1151, top: 943 }}
          onClick={handlePerspectiveGo}
          disabled={loadingPerspective}
        >
          {loadingPerspective ? '...' : 'Go'}
        </button>

        {error ? <div style={styles.error}>{error}</div> : null}
      </div>
    </div>
  );
}
