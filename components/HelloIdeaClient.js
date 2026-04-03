'use client';

import { useState } from 'react';

const IDEA_BOX = {
  left: 193,
  top: 389,
  width: 518,
  height: 225,
};

const CHANGE_BOX = {
  left: 729,
  top: 389,
  width: 518,
  height: 225,
};

const PURPOSE_BOX = {
  left: 193,
  top: 761,
  width: 289,
  height: 166,
};

const PROGRESS_BOX = {
  left: 496,
  top: 761,
  width: 289,
  height: 166,
};

const PERSPECTIVE_BOX = {
  left: 799,
  top: 761,
  width: 428,
  height: 166,
};

const BUTTON_WIDTH = 76;
const BUTTON_HEIGHT = 31;
const BUTTON_OFFSET_Y = 12;

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
  topLeftNote: {
    position: 'absolute',
    left: 96,
    top: 160,
    margin: 0,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: '12px',
    color: '#000000',
    whiteSpace: 'nowrap',
  },
  poweredWrap: {
    position: 'absolute',
    right: 118,
    top: 160,
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
  pageTitle: {
    position: 'absolute',
    left: 193,
    top: 208,
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
    padding: '10px',
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
    padding: '10px',
    outline: 'none',
    resize: 'none',
    fontFamily: 'Inter, Arial, sans-serif',
    fontSize: 12,
    lineHeight: '16px',
    color: '#000000',
    overflow: 'auto',
  },
  staticBox: {
    whiteSpace: 'pre-wrap',
  },
  richSection: {
    marginBottom: 12,
  },
  richHeading: {
    fontWeight: 700,
    marginBottom: 2,
  },
  richText: {
    fontWeight: 400,
  },
  progressIntro: {
    fontWeight: 700,
    marginBottom: 10,
  },
  progressBody: {
    whiteSpace: 'pre-wrap',
  },
  saveNote: {
    position: 'absolute',
    margin: 0,
    fontSize: 12,
    lineHeight: '16px',
    color: '#000000',
    textAlign: 'center',
    fontWeight: 700,
    whiteSpace: 'pre-line',
  },
  button: {
    position: 'absolute',
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
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
    top: 955,
    width: 1034,
    padding: '8px 10px',
    boxSizing: 'border-box',
    border: '1px solid #F0B8AE',
    background: '#FFF1EF',
    color: '#8A1F11',
    fontSize: 12,
    lineHeight: '16px',
  },
};

function buttonPositionForBox(box) {
  return {
    left: box.left + box.width - BUTTON_WIDTH,
    top: box.top + box.height + BUTTON_OFFSET_Y,
  };
}

function splitLines(text = '') {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatIdeaSections(data) {
  const sections = [];

  if (data?.idea?.idea) {
    sections.push({
      heading: 'The Idea',
      body: data.idea.idea,
    });
  }

  if (data?.idea?.whoFor) {
    sections.push({
      heading: 'Who it’s for',
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
      body: splitLines(data.idea.questions).join('\n'),
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

function parseIdeaTextToSections(text) {
  if (!text.trim()) return [];

  const headings = [
    'The Idea',
    'Who it’s for',
    'What makes it different',
    'Helpful questions',
    'Write down instructions',
  ];

  const lines = text.split('\n');
  const sections = [];
  let currentHeading = '';
  let currentBody = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (headings.includes(line)) {
      if (currentHeading) {
        sections.push({
          heading: currentHeading,
          body: currentBody.join('\n').trim(),
        });
      }
      currentHeading = line;
      currentBody = [];
    } else {
      currentBody.push(rawLine);
    }
  }

  if (currentHeading) {
    sections.push({
      heading: currentHeading,
      body: currentBody.join('\n').trim(),
    });
  }

  if (sections.length) return sections;

  return [
    {
      heading: 'The Idea',
      body: text,
    },
  ];
}

function formatProgressText(progress = '') {
  const intro =
    '24:1 means this: what is one thing you can do today that 24 hours from now your future self will thank you for?';

  const cleaned = progress
    .replace(/^What is the one thing you could do today that 24 hours from now you will thank yourself for\??/i, '')
    .trim();

  const lines = splitLines(cleaned);

  return {
    intro,
    lines,
  };
}

function renderIdeaSections(sections) {
  return sections.map((section) => (
    <div key={section.heading} style={styles.richSection}>
      <div style={styles.richHeading}>{section.heading}</div>
      <div style={{ ...styles.richText, whiteSpace: 'pre-wrap' }}>{section.body}</div>
    </div>
  ));
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

  const ideaButton = buttonPositionForBox(IDEA_BOX);
  const changeButton = buttonPositionForBox(CHANGE_BOX);
  const perspectiveButton = buttonPositionForBox(PERSPECTIVE_BOX);

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

      setIdeaSections(formatIdeaSections(data));
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
          idea: ideaSections.length
            ? ideaSections.map((s) => `${s.heading}\n${s.body}`).join('\n\n')
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

  const displayIdeaSections =
    ideaSections.length > 0 ? ideaSections : parseIdeaTextToSections(rawIdeaInput);

  const progressData = formatProgressText(progressBox);

  return (
    <div style={styles.page}>
      <div style={styles.frame}>
        <p style={styles.topLeftNote}>Purpose+Progress+Perspective = Idea</p>

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

        <h1 style={styles.pageTitle}>The Idea</h1>

        <div
          style={{
            ...styles.box,
            ...IDEA_BOX,
          }}
        >
          {displayIdeaSections.length > 0 ? (
            renderIdeaSections(displayIdeaSections)
          ) : (
            <textarea
              style={{
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
              }}
              placeholder="Type your idea. Messy is fine. Who is it for? How does it help?"
              value={rawIdeaInput}
              onChange={(e) => setRawIdeaInput(e.target.value)}
            />
          )}
        </div>

        <p style={{ ...styles.label, left: CHANGE_BOX.left, top: 364 }}>
          Want to change or add anything?
        </p>
        <textarea
          style={{
            ...styles.textarea,
            ...CHANGE_BOX,
          }}
          placeholder="Add or change anything here."
          value={changeBox}
          onChange={(e) => setChangeBox(e.target.value)}
        />

        <button
          style={{ ...styles.button, ...ideaButton }}
          onClick={handleIdeaGo}
          disabled={loadingIdea}
        >
          {loadingIdea ? '...' : 'Go'}
        </button>

        <button
          style={{ ...styles.button, ...changeButton }}
          onClick={handleIdeaGo}
          disabled={loadingIdea}
        >
          {loadingIdea ? '...' : 'Go'}
        </button>

        <p style={{ ...styles.label, left: PURPOSE_BOX.left, top: 735 }}>
          Purpose (Reason for doing it)
        </p>
        <div
          style={{
            ...styles.box,
            ...PURPOSE_BOX,
            ...styles.staticBox,
          }}
        >
          {purposeBox}
        </div>

        <p style={{ ...styles.label, left: PROGRESS_BOX.left, top: 735 }}>
          Progress (Every small step forward is a win)
        </p>
        <div
          style={{
            ...styles.box,
            ...PROGRESS_BOX,
          }}
        >
          <div style={styles.progressIntro}>{progressData.intro}</div>
          <div style={styles.progressBody}>
            {progressData.lines.map((line, index) => (
              <div key={`${line}-${index}`}>{line}</div>
            ))}
          </div>
        </div>

        <p
          style={{
            ...styles.saveNote,
            left: PROGRESS_BOX.left,
            top: PROGRESS_BOX.top + PROGRESS_BOX.height + 18,
            width: PROGRESS_BOX.width,
          }}
        >
          {`Don’t lose this.
When you close or refresh, it’s gone.
Write it down or copy it now.`}
        </p>

        <p style={{ ...styles.label, left: PERSPECTIVE_BOX.left, top: 735 }}>
          Perspective (See your problem with fresh eyes)
        </p>
        <textarea
          style={{
            ...styles.textarea,
            ...PERSPECTIVE_BOX,
            color: perspectiveBox ? '#000000' : '#6B6B6B',
          }}
          placeholder="Stuck? Paste your idea and purpose words here. Tell me the problem."
          value={perspectiveBox}
          onChange={(e) => setPerspectiveBox(e.target.value)}
        />

        <button
          style={{ ...styles.button, ...perspectiveButton }}
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
