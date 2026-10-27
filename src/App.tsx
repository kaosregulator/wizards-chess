import { useEffect, useRef, useState } from 'react';
import { initWizardChess } from './wizardChessEngine.js';

export default function App() {
  const initializedRef = useRef(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    initWizardChess();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileSheetOpen(false);
      }
    };
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileSheetOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleRestoreUI = () => {
    const win = window as unknown as { wizardChess?: { toggleUI?: (force?: boolean) => void } };
    if (win.wizardChess?.toggleUI) {
      win.wizardChess.toggleUI(false);
    } else {
      document.body.classList.remove('cinematic-ui-hidden');
      const btnHide = document.getElementById('btn-hide-ui');
      if (btnHide) btnHide.textContent = 'Hide UI [H]';
    }
  };

  return (
    <>
      <div id="loading-overlay">
        <div className="loader-title">Wizard Chess</div>
        <div className="loader-bar-wrap">
          <div className="loader-bar" id="loader-bar"></div>
        </div>
        <div id="loader-text">Summoning Sanctum Architecture &amp; Sculpted Pieces...</div>
      </div>

      <div id="canvas-container"></div>

      <button
        type="button"
        className="hud-btn mobile-only-restore-ui"
        id="btn-mobile-show-ui"
        onClick={handleRestoreUI}
        title="Show HUD Controls"
      >
        Show UI
      </button>

      <div id="hud-top">
        <div className="hud-group" id="hud-left">
          <div className="brand-pill">
            <span className="brand-title">Wizard Chess</span>
          </div>
          <div className="status-pill" id="status-pill">
            <span className="turn-dot" id="turn-dot"></span>
            <span id="turn-text">White to Move</span>
            <span className="mode-badge" id="mode-badge">Playing as White</span>
          </div>
        </div>

        <button
          type="button"
          className={`hud-btn mobile-controls-trigger ${mobileSheetOpen ? 'active' : ''}`}
          id="btn-mobile-controls"
          aria-expanded={mobileSheetOpen}
          aria-controls="hud-right"
          onClick={() => setMobileSheetOpen((prev) => !prev)}
        >
          {mobileSheetOpen ? 'Close' : 'Controls'}
        </button>

        <div
          className={`mobile-sheet-backdrop ${mobileSheetOpen ? 'open' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setMobileSheetOpen(false);
          }}
          aria-hidden="true"
        ></div>

        <div
          className={`hud-group ${mobileSheetOpen ? 'mobile-sheet-open' : ''}`}
          id="hud-right"
        >
          <div
            className="mobile-sheet-handle-wrap"
            onClick={(e) => {
              e.stopPropagation();
              setMobileSheetOpen(false);
            }}
            aria-hidden="true"
          >
            <div className="mobile-sheet-handle"></div>
          </div>

          <div className="mobile-sheet-header">
            <span className="mobile-sheet-title">Controls</span>
            <button
              type="button"
              className="mobile-sheet-close"
              id="btn-mobile-sheet-close"
              onClick={(e) => {
                e.stopPropagation();
                setMobileSheetOpen(false);
              }}
              aria-label="Close Controls"
            >
              Close ✕
            </button>
          </div>

          <div className="mobile-sheet-section-label">Game Actions</div>

          <button
            className="hud-btn"
            id="btn-side-toggle"
            title="Switch between Playing as White and Playing as Black"
            onClick={() => setMobileSheetOpen(false)}
          >
            Play as Black
          </button>
          <button
            className="hud-btn"
            id="btn-ai-move"
            title="Let the AI make the next move immediately"
            onClick={() => setMobileSheetOpen(false)}
          >
            AI Move
          </button>
          <button
            className="hud-btn"
            id="btn-reset"
            title="Start a fresh game on the altar"
            onClick={() => setMobileSheetOpen(false)}
          >
            New Game
          </button>

          <div className="hud-divider" aria-hidden="true"></div>
          <div className="mobile-sheet-section-label">
            <span>Camera Views</span>
            <span className="mobile-sheet-section-sub">Tap active view to flip</span>
          </div>

          <button
            className="hud-btn active"
            id="btn-cam-player"
            title="Player Camera (Click again to flip White / Black view)"
          >
            Player Cam
          </button>
          <button
            className="hud-btn"
            id="btn-cam-top"
            title="Overhead Board View (Click again to flip White / Black orientation)"
          >
            Overhead
          </button>
          <button
            className="hud-btn"
            id="btn-cam-side"
            title="Side Profile View (Click again to switch East / West side)"
          >
            Side
          </button>
          <button
            className="hud-btn"
            id="btn-cam-wide"
            title="Wide Cathedral View (Click again to switch North Rose / South Narthex)"
          >
            Cathedral
          </button>

          <div className="hud-divider" aria-hidden="true"></div>
          <div className="mobile-sheet-section-label">Display &amp; Gestures</div>

          <button
            className="hud-btn"
            id="btn-sound-toggle"
            title="Toggle Stone Sliding &amp; Sanctum Sound Effects"
          >
            Sound: On
          </button>

          <button
            className="hud-btn"
            id="btn-hide-ui"
            title="Toggle HUD visibility (Shortcut: H)"
            onClick={() => setMobileSheetOpen(false)}
          >
            Hide UI [H]
          </button>

          <div className="mobile-sheet-hint">
            <strong>Touch:</strong> Tap Piece for Emotes / Move &nbsp;•&nbsp; 1-Finger Drag: Orbit &nbsp;•&nbsp; 2-Finger Drag: Pan &nbsp;•&nbsp; Pinch: Zoom
          </div>
        </div>
      </div>

      {/* Clean Move History Log Window */}
      <aside id="move-history-window" aria-label="Move History Log">
        <div className="move-history-header" id="move-history-header">
          <div className="move-history-title-wrap">
            <span className="move-history-title">Move Log</span>
            <span className="move-history-count" id="move-history-count">0</span>
          </div>
          <div className="move-history-actions">
            <button
              type="button"
              className="move-history-action-btn"
              id="btn-move-history-undo"
              title="Undo last move"
              disabled
            >
              ↩ Undo
            </button>
            <button
              type="button"
              className="move-history-action-btn icon-only"
              id="btn-move-history-collapse"
              title="Collapse or expand Move Log"
              aria-expanded="true"
            >
              ▾
            </button>
          </div>
        </div>
        <div className="move-history-body" id="move-history-body">
          <div className="move-history-cols" aria-hidden="true">
            <span className="col-turn">#</span>
            <span className="col-side">White</span>
            <span className="col-side">Black</span>
          </div>
          <div className="move-history-list" id="move-history-list" role="log" aria-live="polite">
            <div className="move-history-empty">No moves recorded yet. Click any piece to move or emote.</div>
          </div>
        </div>
      </aside>

      {/* Radial 5-Animation Emote Wheel for Idle Pieces */}
      <div
        id="piece-anim-wheel"
        className="piece-anim-wheel"
        role="menu"
        aria-label="Piece Animations"
        aria-hidden="true"
      >
        <div className="wheel-ring-decor" aria-hidden="true"></div>
        <div className="wheel-center-hub" id="piece-wheel-hub">
          <span className="wheel-piece-glyph" id="wheel-piece-glyph">♘</span>
          <span className="wheel-piece-label" id="wheel-piece-label">Knight</span>
          <button
            type="button"
            className="wheel-close-btn"
            id="btn-wheel-close"
            title="Close Animation Wheel"
            aria-label="Close Animation Wheel"
          >
            ✕
          </button>
        </div>

        <button
          type="button"
          className="wheel-emote-btn pos-top"
          id="btn-emote-dance"
          data-emote="dance"
          role="menuitem"
          title="Royal Stone Boogie Dance"
        >
          <span className="wheel-emote-icon" aria-hidden="true">♪</span>
          <span className="wheel-emote-text">Dance</span>
        </button>

        <button
          type="button"
          className="wheel-emote-btn pos-top-right"
          id="btn-emote-float"
          data-emote="float"
          role="menuitem"
          title="Mystic Arcane Levitation"
        >
          <span className="wheel-emote-icon" aria-hidden="true">✦</span>
          <span className="wheel-emote-text">Float</span>
        </button>

        <button
          type="button"
          className="wheel-emote-btn pos-bottom-right"
          id="btn-emote-angry"
          data-emote="angry"
          role="menuitem"
          title="Furious Stone War-Stomp"
        >
          <span className="wheel-emote-icon" aria-hidden="true">⚡</span>
          <span className="wheel-emote-text">Angry</span>
        </button>

        <button
          type="button"
          className="wheel-emote-btn pos-bottom-left"
          id="btn-emote-spin"
          data-emote="spin"
          role="menuitem"
          title="Whirlwind 1080° Pirouette Spin"
        >
          <span className="wheel-emote-icon" aria-hidden="true">↻</span>
          <span className="wheel-emote-text">Spin</span>
        </button>

        <button
          type="button"
          className="wheel-emote-btn pos-top-left"
          id="btn-emote-groove"
          data-emote="groove"
          role="menuitem"
          title="Breakdance Flip &amp; Groove"
        >
          <span className="wheel-emote-icon" aria-hidden="true">★</span>
          <span className="wheel-emote-text">Groove</span>
        </button>
      </div>

      <div id="hud-bottom">
        <div className="hint-pill" id="controls-hint">
          <strong>Controls:</strong> Click Piece to Move or Emote &nbsp;•&nbsp; Left-Drag: Orbit &nbsp;•&nbsp; Right-Drag: Pan &nbsp;•&nbsp; Scroll: Zoom &nbsp;•&nbsp; WASD + R/F: Fly Cam &nbsp;•&nbsp; H: Hide UI
        </div>
        <div className="captured-pill" id="captured-tray"></div>
      </div>

      <div id="checkmate-overlay" role="status" aria-live="polite">
        <div className="checkmate-banner">
          <div className="checkmate-ornament">✦ &nbsp; Sanctum Judgment &nbsp; ✦</div>
          <div className="checkmate-crown" id="checkmate-crown">♔</div>
          <div className="checkmate-title" id="checkmate-title">Checkmate</div>
          <div className="checkmate-rule"></div>
          <div className="checkmate-subtitle" id="checkmate-subtitle">
            White Triumphs • The Black King Has Fallen
          </div>
          <div className="checkmate-actions">
            <button className="checkmate-btn" id="btn-checkmate-replay">
              Replay King Fall
            </button>
            <button className="checkmate-btn" id="btn-checkmate-newgame">
              New Game
            </button>
            <button className="checkmate-btn secondary" id="btn-checkmate-dismiss">
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
