import { useState, useEffect, useRef, useCallback } from 'react';

/* ============================================================
   SNAKE GAME — Modern themed game page
   Matches the portfolio's wine/lavender aesthetic
   Mobile-responsive with swipe & on-screen controls
   ============================================================ */

const GRID = 20;           // 20×20 grid
const CELL_SIZE_VW = 4.2;  // each cell is 4.2vmin for mobile fit
const TICK_MS = 120;        // game speed

type Pos = { x: number; y: number };
type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const opposite: Record<Dir, Dir> = {
  UP: 'DOWN',
  DOWN: 'UP',
  LEFT: 'RIGHT',
  RIGHT: 'LEFT',
};

const dirVec: Record<Dir, Pos> = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

function randomFood(snake: Pos[]): Pos {
  let pos: Pos;
  do {
    pos = {
      x: Math.floor(Math.random() * GRID),
      y: Math.floor(Math.random() * GRID),
    };
  } while (snake.some((s) => s.x === pos.x && s.y === pos.y));
  return pos;
}

export default function SnakeGame() {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [snake, setSnake] = useState<Pos[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Pos>({ x: 15, y: 10 });
  const [dir, setDir] = useState<Dir>('RIGHT');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('snake-high-score') || '0', 10);
  });
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; dx: number; dy: number }[]
  >([]);

  const dirRef = useRef<Dir>(dir);
  const nextDirRef = useRef<Dir | null>(null);
  const gameStateRef = useRef(gameState);
  const boardRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const particleIdRef = useRef(0);

  useEffect(() => {
    dirRef.current = dir;
  }, [dir]);
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  /* ---------- Start / Restart ---------- */
  const startGame = useCallback(() => {
    const initial: Pos[] = [{ x: 10, y: 10 }];
    setSnake(initial);
    setFood(randomFood(initial));
    setDir('RIGHT');
    dirRef.current = 'RIGHT';
    nextDirRef.current = null;
    setScore(0);
    setGameState('playing');
    setParticles([]);
  }, []);

  /* ---------- Change direction ---------- */
  const changeDir = useCallback((newDir: Dir) => {
    if (gameStateRef.current !== 'playing') return;
    if (newDir === dirRef.current) return;
    if (newDir === opposite[dirRef.current]) return;
    nextDirRef.current = newDir;
  }, []);

  /* ---------- Keyboard ---------- */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = {
        ArrowUp: 'UP',
        ArrowDown: 'DOWN',
        ArrowLeft: 'LEFT',
        ArrowRight: 'RIGHT',
        w: 'UP',
        s: 'DOWN',
        a: 'LEFT',
        d: 'RIGHT',
      };
      const d = map[e.key];
      if (d) {
        e.preventDefault();
        if (gameStateRef.current === 'idle' || gameStateRef.current === 'over') {
          startGame();
        }
        changeDir(d);
      }
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (gameStateRef.current !== 'playing') startGame();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [changeDir, startGame]);

  /* ---------- Touch / Swipe ---------- */
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    const onStart = (e: TouchEvent) => {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    };
    const onEnd = (e: TouchEvent) => {
      if (!touchStartRef.current) return;
      const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
      const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
      touchStartRef.current = null;
      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        changeDir(dx > 0 ? 'RIGHT' : 'LEFT');
      } else {
        changeDir(dy > 0 ? 'DOWN' : 'UP');
      }
    };
    board.addEventListener('touchstart', onStart, { passive: true });
    board.addEventListener('touchend', onEnd, { passive: true });
    return () => {
      board.removeEventListener('touchstart', onStart);
      board.removeEventListener('touchend', onEnd);
    };
  }, [changeDir]);

  /* ---------- Game loop ---------- */
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setSnake((prev) => {
        if (nextDirRef.current) {
          dirRef.current = nextDirRef.current;
          setDir(nextDirRef.current);
          nextDirRef.current = null;
        }
        const head = prev[0];
        const v = dirVec[dirRef.current];
        const newHead: Pos = { x: head.x + v.x, y: head.y + v.y };

        // Wall collision
        if (newHead.x < 0 || newHead.x >= GRID || newHead.y < 0 || newHead.y >= GRID) {
          setGameState('over');
          return prev;
        }

        // Self collision
        if (prev.some((s) => s.x === newHead.x && s.y === newHead.y)) {
          setGameState('over');
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Eat food
        setFood((currentFood) => {
          if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
            setScore((s) => {
              const ns = s + 1;
              setHighScore((hs) => {
                if (ns > hs) {
                  localStorage.setItem('snake-high-score', String(ns));
                  return ns;
                }
                return hs;
              });
              return ns;
            });
            // Spawn particles
            const newParticles = Array.from({ length: 6 }, () => ({
              id: ++particleIdRef.current,
              x: currentFood.x,
              y: currentFood.y,
              dx: (Math.random() - 0.5) * 3,
              dy: (Math.random() - 0.5) * 3,
            }));
            setParticles((p) => [...p, ...newParticles]);
            setTimeout(() => {
              setParticles((p) =>
                p.filter((pp) => !newParticles.some((np) => np.id === pp.id))
              );
            }, 600);
            return randomFood(newSnake);
          }
          return currentFood;
        });

        // If didn't eat, remove tail
        if (
          newHead.x !== food.x ||
          newHead.y !== food.y
        ) {
          newSnake.pop();
        }

        return newSnake;
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [gameState, food]);

  /* ---------- Render ---------- */
  const boardSize = `min(${GRID * CELL_SIZE_VW}vmin, 400px)`;

  return (
    <div className="sg-page">
      {/* Background effects */}
      <div className="sg-bg-grad" />
      <div className="sg-bg-grain" />

      {/* Back button */}
      <a href="/" className="sg-back">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Portfolio
      </a>

      <div className="sg-container">
        {/* Header */}
        <div className="sg-header">
          <div className="sg-title-row">
            <h1 className="sg-title">
              <span className="sg-title-icon">🐍</span>
              Snake<span className="sg-accent">Game</span>
            </h1>
          </div>
          <p className="sg-subtitle">Classic arcade game · Use arrow keys or swipe to play</p>
        </div>

        {/* Score bar */}
        <div className="sg-scorebar">
          <div className="sg-score-item">
            <span className="sg-score-label">Score</span>
            <span className="sg-score-value">{score}</span>
          </div>
          <div className="sg-score-divider" />
          <div className="sg-score-item">
            <span className="sg-score-label">High Score</span>
            <span className="sg-score-value sg-hi">{highScore}</span>
          </div>
        </div>

        {/* Game Board */}
        <div className="sg-board-wrap">
          <div
            ref={boardRef}
            className="sg-board"
            style={{
              width: boardSize,
              height: boardSize,
              gridTemplateColumns: `repeat(${GRID}, 1fr)`,
              gridTemplateRows: `repeat(${GRID}, 1fr)`,
            }}
          >
            {/* Grid cells (subtle grid lines) */}
            {Array.from({ length: GRID * GRID }).map((_, i) => (
              <div key={i} className="sg-cell" />
            ))}

            {/* Snake */}
            {snake.map((seg, i) => (
              <div
                key={`s-${i}`}
                className={`sg-snake ${i === 0 ? 'sg-head' : ''}`}
                style={{
                  gridColumn: seg.x + 1,
                  gridRow: seg.y + 1,
                  opacity: 1 - i * 0.02,
                }}
              />
            ))}

            {/* Food */}
            <div
              className="sg-food"
              style={{
                gridColumn: food.x + 1,
                gridRow: food.y + 1,
              }}
            />

            {/* Particles */}
            {particles.map((p) => (
              <div
                key={p.id}
                className="sg-particle"
                style={{
                  gridColumn: p.x + 1,
                  gridRow: p.y + 1,
                  '--pdx': `${p.dx * 20}px`,
                  '--pdy': `${p.dy * 20}px`,
                } as React.CSSProperties}
              />
            ))}

            {/* Overlays */}
            {gameState === 'idle' && (
              <div className="sg-overlay">
                <div className="sg-overlay-content">
                  <div className="sg-overlay-icon">🎮</div>
                  <h2>Ready to Play?</h2>
                  <p>Press any arrow key or tap Start</p>
                  <button className="sg-btn" onClick={startGame}>
                    Start Game
                  </button>
                </div>
              </div>
            )}

            {gameState === 'over' && (
              <div className="sg-overlay sg-overlay-over">
                <div className="sg-overlay-content">
                  <div className="sg-overlay-icon">💀</div>
                  <h2>Game Over!</h2>
                  <p className="sg-final-score">
                    Score: <strong>{score}</strong>
                  </p>
                  {score >= highScore && score > 0 && (
                    <p className="sg-new-hi">🏆 New High Score!</p>
                  )}
                  <button className="sg-btn" onClick={startGame}>
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile D-pad Controls */}
        <div className="sg-controls">
          <div className="sg-dpad">
            <button
              className="sg-dpad-btn sg-dpad-up"
              onClick={() => {
                if (gameState !== 'playing') startGame();
                changeDir('UP');
              }}
              aria-label="Up"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
            <div className="sg-dpad-mid">
              <button
                className="sg-dpad-btn sg-dpad-left"
                onClick={() => {
                  if (gameState !== 'playing') startGame();
                  changeDir('LEFT');
                }}
                aria-label="Left"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7 7M12 5l-7 7" />
                </svg>
              </button>
              <div className="sg-dpad-center" />
              <button
                className="sg-dpad-btn sg-dpad-right"
                onClick={() => {
                  if (gameState !== 'playing') startGame();
                  changeDir('RIGHT');
                }}
                aria-label="Right"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <button
              className="sg-dpad-btn sg-dpad-down"
              onClick={() => {
                if (gameState !== 'playing') startGame();
                changeDir('DOWN');
              }}
              aria-label="Down"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* How to play */}
        <div className="sg-howto">
          <h3>How to Play</h3>
          <div className="sg-howto-grid">
            <div className="sg-howto-item">
              <span className="sg-howto-key">⬆ ⬇ ⬅ ➡</span>
              <span>Arrow keys to move</span>
            </div>
            <div className="sg-howto-item">
              <span className="sg-howto-key">W A S D</span>
              <span>Alternative controls</span>
            </div>
            <div className="sg-howto-item">
              <span className="sg-howto-key">👆 Swipe</span>
              <span>Mobile touch controls</span>
            </div>
            <div className="sg-howto-item">
              <span className="sg-howto-key">🍎 Food</span>
              <span>Eat to grow & score</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
