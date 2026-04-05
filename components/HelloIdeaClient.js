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
    left: 224,
    top: 640,
    width: 1030,
    padding: '10px 12px',
    boxSizing: 'border-box',
    border: '1px solid #F0B8AE',
    background: '#FFF1EF',
    color: '#8A1F11',
    fontSize: 12,
    lineHeight: '16px',
  },
};

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
  const intro =
    '24:1 means this: what is one thing you can do today that 24 hours from now your future self will thank you for?';

  const progressText = data?.progress || '';

  const cleaned = String(progressText)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');

  return cleaned ? `${intro}\n\n${cleaned}` : intro;
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
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showPopup, setShowPopup] = useState(true);

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
      {showPopup ? (
        <div className="popupOverlay">
          <div className="popupBox popupDesktopBox">
            <div className="popupText">
              Your idea stays with you.
              <br />
              No login. No saving.
              <br />
              Close or refresh and it’s gone.
              <br />
              Keep anything useful.
              <br />
              Write it down or copy it now.
            </div>

            <button
              className="popupButton"
              type="button"
              onClick={() => setShowPopup(false)}
            >
              Got it
            </button>
          </div>

          <div className="popupBox popupMobileBox">
            <div className="popupText">
              Your idea stays with you.
              <br />
              No login. No saving.
              <br />
              Close or refresh and it’s gone.
              <br />
              Keep anything useful.
              <br />
              Write it down or copy it now.
            </div>

            <button
              className="popupButton"
              type="button"
              onClick={() => setShowPopup(false)}
            >
              Go it
            </button>
          </div>
        </div>
      ) : null}

      <div className="desktop-only">
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
              . 2,503 failed attempts led to this process, shared through TEDx, with our thinking now in school & higher education curriculum.
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
              style={{
                ...styles.button,
                left: 659,
                top: 635,
                background: hoveredButton === 'idea-left' ? '#5FFAB2' : '#FA625F',
              }}
              onMouseEnter={() => setHoveredButton('idea-left')}
              onMouseLeave={() => setHoveredButton(null)}
              onClick={handleIdeaGo}
              disabled={loadingIdea}
              type="button"
            >
              {loadingIdea ? '...' : 'Go'}
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
              disabled={loadingIdea}
              type="button"
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
              placeholder="Stuck? Paste your idea and purpose words here. Tell me the problem."
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
              disabled={loadingPerspective}
              type="button"
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
      </div>

      <div className="mobile-only">
        <div className="mobilePage">
          <div className="mobileFrame">
            <div className="mobileTopRow">
              <div className="mobileTopLeft">Purpose+Progress+Perspective</div>
              <div className="mobileTopRight">
                Powered by{' '}
                <a
                  href="https://www.goodcitizens.com.au/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Good Citizens
                </a>
              </div>
            </div>

            <div className="mobileSection">
              <p className="mobileLabel">Your idea</p>
              <textarea
                className="mobileBox mobileIdeaBox"
                placeholder="Type your idea. Messy is fine. Who is it for? How does it help?"
                value={ideaBox || rawIdeaInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setRawIdeaInput(value);
                  setIdeaBox(value);
                }}
              />
              <div className="mobileButtonRow">
                <button
                  className="mobileButton"
                  onClick={handleIdeaGo}
                  disabled={loadingIdea}
                  type="button"
                >
                  {loadingIdea ? '...' : 'Go'}
                </button>
              </div>
            </div>

            <div className="mobileSection">
              <p className="mobileLabel">Want to change or add anything?</p>
              <textarea
                className="mobileBox mobileChangeBox"
                placeholder="Add or change anything here."
                value={changeBox}
                onChange={(e) => setChangeBox(e.target.value)}
              />
              <div className="mobileButtonRow">
                <button
                  className="mobileButton"
                  onClick={handleIdeaGo}
                  disabled={loadingIdea}
                  type="button"
                >
                  {loadingIdea ? '...' : 'Go'}
                </button>
              </div>
            </div>

            <div className="mobileSection">
              <p className="mobileLabel">Purpose (Reason for doing it)</p>
              <textarea
                readOnly
                className="mobileBox mobileSmallBox"
                value={purposeBox}
              />
            </div>

            <div className="mobileSection">
              <p className="mobileLabel">Progress (Every small step forward is a win)</p>
              <textarea
                readOnly
                className="mobileBox mobileSmallBox"
                value={progressBox}
              />
            </div>

            <div className="mobileSection">
              <p className="mobileLabel">Perspective (See your problem with fresh eyes)</p>
              <textarea
                className="mobileBox mobilePerspectiveBox"
                placeholder={`Stuck? Paste your idea and purpose words here.\n\nTell me the problem.`}
                value={perspectiveBox}
                onChange={(e) => setPerspectiveBox(e.target.value)}
              />
              <div className="mobileButtonRow">
                <button
                  className="mobileButton"
                  onClick={handlePerspectiveGo}
                  disabled={loadingPerspective}
                  type="button"
                >
                  {loadingPerspective ? '...' : 'Go'}
                </button>
              </div>
            </div>

            <div className="mobileSaveNote">
              Don’t lose this.
              <br />
              Close or refresh the browser and it’s gone.
              <br />
              Write it down or copy it now.
            </div>

            <div className="mobileFooterCopy">
              Good Citizens had 2,503 failed attempts that led to this process, later shared through TEDx, with our thinking now part of school and higher education curricula.
            </div>

            {error ? <div className="mobileError">{error}</div> : null}
          </div>
        </div>
      </div>

      <style jsx>{`
        .popupOverlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(241, 255, 137, 0.96);
        }

        .popupBox {
          position: fixed;
          width: 302px;
          height: 259px;
          background: transparent;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
        }

        .popupDesktopBox {
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }

        .popupMobileBox {
          display: none;
        }

        .popupText {
          font-family: Inter, Arial, sans-serif;
          font-size: 20px;
          font-weight: 400;
          line-height: 1.35;
          color: #000000;
          margin: 0 0 18px 0;
        }

        .popupButton {
          width: 78px;
          height: 31px;
          border-radius: 20px;
          border: none;
          background: #fa625f;
          color: #ffffff;
          font-family: Inter, Arial, sans-serif;
          font-size: 12px;
          font-weight: 700;
          line-height: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .desktop-only {
          display: block;
        }

        .mobile-only {
          display: none;
        }

        .mobilePage {
          min-height: 100vh;
          background: #f1ff89;
          display: flex;
          justify-content: center;
          font-family: Inter, Arial, sans-serif;
        }

        .mobileFrame {
          width: 100%;
          min-height: 100vh;
          background: #f1ff89;
          padding: 24px 24px 24px;
          box-sizing: border-box;
        }

        .mobileTopRow {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 58px;
        }

        .mobileTopLeft,
        .mobileTopRight {
          font-size: 10px;
          line-height: 1.2;
          color: #000000;
        }

        .mobileTopRight {
          text-align: right;
        }

        .mobileTopRight a {
          color: #000000;
          text-decoration: underline;
          font-weight: 700;
        }

        .mobileSection {
          margin-bottom: 16px;
        }

        .mobileLabel {
          margin: 0 0 8px 8px;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.2;
          color: #000000;
        }

        .mobileBox {
          width: 100%;
          background: #ffffff;
          border: 1px solid #000000;
          box-sizing: border-box;
          padding: 10px;
          outline: none;
          resize: none;
          font-family: Inter, Arial, sans-serif;
          font-size: 12px;
          line-height: 16px;
          color: #000000;
          overflow: auto;
          white-space: pre-wrap;
          border-radius: 0;
        }

        .mobileBox::placeholder {
          color: #6b6b6b;
        }

        .mobileIdeaBox {
          height: 180px;
        }

        .mobileChangeBox {
          height: 86px;
        }

        .mobileSmallBox {
          height: 86px;
        }

        .mobilePerspectiveBox {
          height: 108px;
        }

        .mobileButtonRow {
          display: flex;
          justify-content: flex-end;
          margin-top: 10px;
        }

        .mobileButton {
          width: 66px;
          height: 31px;
          border-radius: 20px;
          border: none;
          background: #fa625f;
          color: #ffffff;
          font-family: Inter, Arial, sans-serif;
          font-size: 12px;
          font-weight: 700;
          line-height: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .mobileButton:disabled {
          opacity: 0.8;
          cursor: default;
        }

        .mobileSaveNote {
          margin: 30px auto 20px;
          width: 100%;
          max-width: 280px;
          padding: 0 8px;
          text-align: center;
          font-size: 12px;
          font-weight: 700;
          line-height: 16px;
          color: #000000;
          box-sizing: border-box;
        }

        .mobileFooterCopy {
          margin: 0 auto;
          width: 100%;
          max-width: 290px;
          padding: 0 8px;
          text-align: center;
          font-size: 9px;
          font-weight: 400;
          line-height: 11px;
          color: #000000;
          box-sizing: border-box;
        }

        .mobileError {
          margin-top: 16px;
          width: 100%;
          padding: 10px 12px;
          box-sizing: border-box;
          border: 1px solid #f0b8ae;
          background: #fff1ef;
          color: #8a1f11;
          font-size: 12px;
          line-height: 16px;
        }

        @media (max-width: 768px) {
          .desktop-only {
            display: none;
          }

          .mobile-only {
            display: block;
          }

          .popupDesktopBox {
            display: none;
          }

          .popupMobileBox {
            display: flex;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }

          .popupText {
            font-size: 20px;
            line-height: 1.35;
          }
        }
      `}</style>
    </>
  );
}
