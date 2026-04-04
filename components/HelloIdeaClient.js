'use client';

import { useState } from 'react';

function buildIdeaText(data) {
  const ideaText =
    data?.yourIdea ||
    data?.idea?.idea ||
    data?.idea ||
    '';

  const whoForText = data?.idea?.whoFor || '';
  const differentText = data?.idea?.different || '';
  const questionsText = data?.idea?.questions || '';

  const parts = [];

  if (ideaText) {
    parts.push(`The Idea\n${ideaText}`);
  }

  if (whoForText) {
    parts.push(`\nWho It's For\n${whoForText}`);
  }

  if (differentText) {
    parts.push(`\nWhat Makes It Different\n${differentText}`);
  }

  if (questionsText) {
    parts.push(`\nHelpful questions\n${questionsText}`);
  }

  parts.push(`\nTime to write down the below in your notebook

- The Idea
- The Purpose
- Who It's For
- What Makes It Different`);

  return parts.join('\n');
}

function buildPurposeText(data) {
  return data?.yourPurpose || data?.purpose || '';
}

function buildProgressText(data) {
  const progressText = data?.progress || '';

  return String(progressText)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

function buildPerspectiveText(data) {
  return data?.perspective || data?.output || '';
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

      const builtIdea = buildIdeaText(data);
      const builtPurpose = buildPurposeText(data);
      const builtProgress = buildProgressText(data);

      setIdeaBox(builtIdea || rawIdeaInput || '');
      setPurposeBox(builtPurpose);
      setProgressBox(builtProgress);
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

      setPerspectiveBox(buildPerspectiveText(data));
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoadingPerspective(false);
    }
  }

  return (
    <>
      <div className="ppp-page">
        <div className="ppp-shell">
          <header className="ppp-topbar">
            <div className="ppp-top-left">Purpose+Progress+Perspective</div>
            <div className="ppp-top-right">
              Powered by{' '}
              <a
                href="https://www.goodcitizens.com.au/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Good Citizens
              </a>
            </div>
          </header>

          <main className="ppp-main">
            <section className="ppp-section ppp-section-wide">
              <label className="ppp-label">Your idea</label>
              <textarea
                className="ppp-box ppp-box-lg"
                placeholder="Type your idea. Messy is fine. Who is it for? How does it help?"
                value={ideaBox || rawIdeaInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setRawIdeaInput(value);
                  setIdeaBox(value);
                }}
              />
              <div className="ppp-button-row">
                <button
                  className="ppp-button"
                  onClick={handleIdeaGo}
                  disabled={loadingIdea}
                  type="button"
                >
                  {loadingIdea ? '...' : 'Go'}
                </button>
              </div>
            </section>

            <section className="ppp-section ppp-section-wide">
              <label className="ppp-label">Want to change or add anything?</label>
              <textarea
                className="ppp-box ppp-box-md"
                placeholder="Add or change anything here."
                value={changeBox}
                onChange={(e) => setChangeBox(e.target.value)}
              />
              <div className="ppp-button-row">
                <button
                  className="ppp-button"
                  onClick={handleIdeaGo}
                  disabled={loadingIdea}
                  type="button"
                >
                  {loadingIdea ? '...' : 'Go'}
                </button>
              </div>
            </section>

            <section className="ppp-section">
              <label className="ppp-label">Purpose (Reason for doing it)</label>
              <textarea
                readOnly
                className="ppp-box ppp-box-sm"
                value={purposeBox}
              />
            </section>

            <section className="ppp-section">
              <label className="ppp-label">Progress (Every small step forward is a win)</label>
              <textarea
                readOnly
                className="ppp-box ppp-box-sm"
                value={progressBox}
              />
            </section>

            <section className="ppp-section">
              <label className="ppp-label">Perspective (See your problem with fresh eyes)</label>
              <textarea
                className="ppp-box ppp-box-sm"
                placeholder="Stuck? Paste your idea and purpose words here.

Tell me the problem."
                value={perspectiveBox}
                onChange={(e) => setPerspectiveBox(e.target.value)}
              />
              <div className="ppp-button-row">
                <button
                  className="ppp-button"
                  onClick={handlePerspectiveGo}
                  disabled={loadingPerspective}
                  type="button"
                >
                  {loadingPerspective ? '...' : 'Go'}
                </button>
              </div>
            </section>

            <div className="ppp-footer-note">
              Don’t lose this.
              <br />
              Close or refresh the browser and it’s gone.
              <br />
              Write it down or copy it now.
            </div>

            <div className="ppp-footer-copy">
              Good Citizens had 2,503 failed attempts that led to this process, later shared through TEDx, with our thinking now part of school and higher education curricula.
            </div>

            {error ? <div className="ppp-error">{error}</div> : null}
          </main>
        </div>
      </div>

      <style jsx>{`
        .ppp-page {
          min-height: 100vh;
          background: #f1ff89;
          font-family: Inter, Arial, sans-serif;
          color: #000;
        }

        .ppp-shell {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 24px 16px 32px;
          box-sizing: border-box;
        }

        .ppp-topbar {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 56px;
        }

        .ppp-top-left,
        .ppp-top-right {
          font-size: 12px;
          line-height: 1.2;
          font-weight: 500;
        }

        .ppp-top-right {
          text-align: right;
          max-width: 220px;
        }

        .ppp-top-right a {
          color: #000;
          text-decoration: underline;
          font-weight: 700;
        }

        .ppp-main {
          display: grid;
          grid-template-columns: 1fr;
          gap: 22px;
          max-width: 390px;
          margin: 0 auto;
        }

        .ppp-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ppp-section-wide {
          gap: 10px;
        }

        .ppp-label {
          font-size: 12px;
          line-height: 1.2;
          font-weight: 700;
        }

        .ppp-box {
          width: 100%;
          background: #f5f5f5;
          border: 1px solid #000;
          box-sizing: border-box;
          padding: 12px 10px;
          resize: none;
          outline: none;
          border-radius: 0;
          font-family: Inter, Arial, sans-serif;
          font-size: 12px;
          line-height: 1.35;
          font-weight: 400;
          color: #000;
          white-space: pre-wrap;
        }

        .ppp-box::placeholder {
          color: #6b6b6b;
          font-weight: 400;
        }

        .ppp-box-lg {
          min-height: 180px;
        }

        .ppp-box-md {
          min-height: 92px;
        }

        .ppp-box-sm {
          min-height: 86px;
        }

        .ppp-button-row {
          display: flex;
          justify-content: flex-end;
        }

        .ppp-button {
          width: 66px;
          height: 31px;
          border: none;
          border-radius: 999px;
          background: #fa625f;
          color: #fff;
          font-family: Inter, Arial, sans-serif;
          font-size: 12px;
          line-height: 1;
          font-weight: 700;
          cursor: pointer;
        }

        .ppp-button:hover:not(:disabled) {
          background: #5ffab2;
        }

        .ppp-button:disabled {
          opacity: 0.7;
          cursor: default;
        }

        .ppp-footer-note {
          margin-top: 8px;
          text-align: center;
          font-size: 12px;
          line-height: 1.3;
          font-weight: 700;
        }

        .ppp-footer-copy {
          text-align: center;
          font-size: 9px;
          line-height: 1.25;
          font-weight: 400;
          max-width: 320px;
          margin: 0 auto;
        }

        .ppp-error {
          border: 1px solid #f0b8ae;
          background: #fff1ef;
          color: #8a1f11;
          padding: 10px 12px;
          font-size: 12px;
          line-height: 1.4;
        }

        @media (min-width: 900px) {
          .ppp-shell {
            padding: 40px 60px 60px;
          }

          .ppp-topbar {
            margin-bottom: 120px;
          }

          .ppp-main {
            max-width: 1040px;
            grid-template-columns: repeat(6, 1fr);
            gap: 28px 24px;
          }

          .ppp-section-wide {
            grid-column: span 3;
          }

          .ppp-section:not(.ppp-section-wide) {
            grid-column: span 2;
          }

          .ppp-box-lg {
            min-height: 165px;
          }

          .ppp-box-md {
            min-height: 110px;
          }

          .ppp-box-sm {
            min-height: 168px;
          }

          .ppp-footer-note {
            grid-column: 1 / -1;
            margin-top: 6px;
          }

          .ppp-footer-copy {
            grid-column: 1 / -1;
            max-width: 560px;
          }

          .ppp-error {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </>
  );
}
