'use client';

import { useState } from 'react';

export default function HelloIdeaClient() {
  const [idea, setIdea] = useState('');
  const [change, setChange] = useState('');

  const [ideaBox, setIdeaBox] = useState('');
  const [purpose, setPurpose] = useState('');
  const [progress, setProgress] = useState('');
  const [perspective, setPerspective] = useState('');

  const handleIdea = async () => {
    const res = await fetch('/api/idea', {
      method: 'POST',
      body: JSON.stringify({ idea, extra: change }),
    });

    const data = await res.json();

    setIdeaBox(`
• ${data.idea.idea}

• ${data.idea.whoFor}

• ${data.idea.different}

• ${data.idea.questions}

• ${data.idea.instructions}

• ${data.idea.reflection}
    `);

    setPurpose(data.purpose);
    setProgress(data.progress);
  };

  const handlePerspective = async () => {
    const res = await fetch('/api/perspective', {
      method: 'POST',
      body: JSON.stringify({ input: perspective }),
    });

    const data = await res.json();
    setPerspective(data.output);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        <div style={styles.powered}>
          Powered by <a href="https://www.goodcitizens.com.au/" style={styles.link}>Good Citizens</a>
        </div>

        <div style={styles.side}>
          Purpose + Progress + Perspective = Idea
        </div>

        <h1 style={styles.title}>Your idea</h1>

        <div style={styles.row}>
          <div style={styles.block}>
            <label style={styles.label}>Your idea</label>
            <textarea
              style={styles.textarea}
              placeholder="Type your idea. Messy is fine. Who is it for? How does it help?"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
            <button style={styles.button} onClick={handleIdea}>Go</button>
          </div>

          <div style={styles.block}>
            <label style={styles.label}>Want to change or add anything?</label>
            <textarea
              style={styles.textarea}
              placeholder="Add or change anything here."
              value={change}
              onChange={(e) => setChange(e.target.value)}
            />
            <button style={styles.button} onClick={handleIdea}>Go</button>
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.block}>
            <label style={styles.label}>Purpose (Reason for doing it)</label>
            <textarea style={styles.textarea} value={purpose} readOnly />
          </div>

          <div style={styles.block}>
            <label style={styles.label}>Progress (Every small step forward is a win)</label>
            <textarea style={styles.textarea} value={progress} readOnly />
          </div>

          <div style={styles.block}>
            <label style={styles.label}>Perspective (See your problem with fresh eyes)</label>
            <textarea
              style={styles.textarea}
              placeholder="Stuck? Paste your idea and purpose words here. Tell me the problem."
              value={perspective}
              onChange={(e) => setPerspective(e.target.value)}
            />
            <button style={styles.button} onClick={handlePerspective}>Go</button>
          </div>
        </div>

        <div style={styles.output}>
          <label style={styles.label}>The idea</label>
          <textarea style={styles.textarea} value={ideaBox} readOnly />
        </div>

        <div style={styles.footer}>
          Don’t lose this.  
          When you close or refresh, it’s gone.  
          Write it down or copy it now.
        </div>

      </div>
    </div>
  );
}

const styles = {
  page: {
    background: '#F1FF89',
    minHeight: '100vh',
    fontFamily: 'Inter, sans-serif',
    padding: '40px',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    position: 'relative',
  },
  powered: {
    position: 'absolute',
    top: 0,
    right: 0,
    fontSize: '12px',
  },
  link: {
    textDecoration: 'underline',
    color: 'black',
  },
  side: {
    position: 'absolute',
    left: '-140px',
    top: '200px',
    transform: 'rotate(-90deg)',
    fontSize: '12px',
  },
  title: {
    fontSize: '28px',
    marginBottom: '20px',
  },
  row: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
  },
  block: {
    flex: 1,
    position: 'relative',
  },
  label: {
    fontSize: '12px',
    fontWeight: 'bold',
  },
  textarea: {
    width: '100%',
    height: '180px',
    border: '1px solid black',
    background: '#E6E6E6',
    padding: '10px',
    fontSize: '12px',
    marginTop: '6px',
  },
  button: {
    position: 'absolute',
    bottom: '-15px',
    right: '10px',
    width: '76px',
    height: '31px',
    borderRadius: '20px',
    background: '#FA625F',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  output: {
    marginTop: '30px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '40px',
    fontSize: '12px',
  },
};
