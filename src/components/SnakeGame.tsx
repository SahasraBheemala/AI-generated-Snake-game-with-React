import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 150;

export default function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const directionRef = useRef(direction);
  directionRef.current = direction;
  
  const lastProcessedDirectionRef = useRef(INITIAL_DIRECTION);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setFood(generateFood());
    setHasStarted(true);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }
      
      if (!hasStarted && !gameOver && e.key !== ' ') {
        setHasStarted(true);
      }

      if (e.key === ' ') {
        setIsPaused(p => !p);
        return;
      }

      const currentDir = lastProcessedDirectionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused || !hasStarted) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        lastProcessedDirectionRef.current = directionRef.current;

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, hasStarted, generateFood]);

  return (
    <div className="flex flex-col items-center bg-black p-6 border-2 border-cyan-glitch shadow-[4px_4px_0px_#FF00FF] relative">
      <div className="flex justify-between w-full mb-4 px-2 font-pixel text-[10px] md:text-xs">
        <div className="text-cyan-glitch">
          DATA_HARVESTED: {score.toString().padStart(4, '0')}
        </div>
        <div className="text-magenta-glitch animate-pulse">
          {isPaused ? 'SYSTEM_HALTED' : 'EXECUTING'}
        </div>
      </div>

      <div 
        className="relative bg-black border-2 border-cyan-glitch overflow-hidden"
        style={{ 
          width: `${GRID_SIZE * CELL_SIZE}px`, 
          height: `${GRID_SIZE * CELL_SIZE}px`,
          backgroundImage: 'linear-gradient(rgba(0, 255, 255, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
        }}
      >
        {!hasStarted && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
            <button 
              onClick={() => setHasStarted(true)}
              className="px-4 py-3 bg-transparent text-cyan-glitch border-2 border-cyan-glitch hover:bg-cyan-glitch hover:text-black transition-none font-pixel text-xs uppercase"
            >
              INITIALIZE_SEQUENCE
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10">
            <div className="text-magenta-glitch text-lg md:text-xl font-pixel mb-4 text-center glitch-text" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</div>
            <div className="text-cyan-glitch text-xs font-pixel mb-8">FINAL_DATA: {score}</div>
            <button 
              onClick={resetGame}
              className="px-4 py-3 bg-transparent text-magenta-glitch border-2 border-magenta-glitch hover:bg-magenta-glitch hover:text-black transition-none font-pixel text-xs uppercase"
            >
              REBOOT_SEQUENCE
            </button>
          </div>
        )}

        {/* Food */}
        <div 
          className="absolute bg-magenta-glitch"
          style={{
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            left: `${food.x * CELL_SIZE}px`,
            top: `${food.y * CELL_SIZE}px`,
            boxShadow: '0 0 10px #FF00FF'
          }}
        />

        {/* Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div 
              key={`${segment.x}-${segment.y}-${index}`}
              className={`absolute ${isHead ? 'bg-white z-10' : 'bg-cyan-glitch'}`}
              style={{
                width: `${CELL_SIZE}px`,
                height: `${CELL_SIZE}px`,
                left: `${segment.x * CELL_SIZE}px`,
                top: `${segment.y * CELL_SIZE}px`,
                boxShadow: isHead ? '0 0 10px #FFFFFF' : '0 0 5px #00FFFF',
                opacity: isHead ? 1 : Math.max(0.4, 1 - index * 0.03)
              }}
            />
          );
        })}
      </div>
      
      <div className="mt-6 text-cyan-glitch/70 text-xl font-vt flex gap-4 uppercase tracking-widest">
        <span><kbd className="bg-black px-2 py-1 border border-cyan-glitch/50">W_A_S_D</kbd> // VECTOR</span>
        <span><kbd className="bg-black px-2 py-1 border border-cyan-glitch/50">SPC</kbd> // INTERRUPT</span>
      </div>
    </div>
  );
}
