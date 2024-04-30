import { useCallback, useEffect } from "react";
import "./app.scss";
import { animate, motion } from "framer-motion";
import { useSetState } from "react-use";
import JSConfetti from "js-confetti";
import "./lib/xo";

const wins = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
] as const;

function App() {
  const [state, setState] = useSetState({
    folded: false,
    board: [0, 0, 0, 0, 0, 0, 0, 0, 0] as (0 | 1 | -1)[],
    turn: 1 as 1 | -1,
    winner: 0 as 0 | 1 | -1,
    winStreak: null as null | typeof wins[number],
    //x1, x2, y1, y2
    guidePosition: [0, 0, 0, 0] as [number, number, number, number],
  });

  function reset() {
    setState({
      board: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      winner: 0,
      turn: 1,
      winStreak: null,
      guidePosition: [0, 0, 0, 0],
    });
    (document.querySelector("dialog.modal")! as HTMLDialogElement).close();
    const line = document.querySelector("svg.guide line");
    if (line) {
      line.setAttribute("x1", "0");
      line.setAttribute("x2", "0");
      line.setAttribute("y1", "0");
      line.setAttribute("y2", "0");
    }
  }

  const setBoardValue = useCallback((index: number, value: 1 | -1) => {
    if (state.board[index] !== 0) return state.board;
    if (state.winner) return state.board;
    const newBorad = state.board.map((b, i) => (i === index ? value : b));
    setState({ board: newBorad });
    return newBorad;
  }, [state, setState]);

  useEffect(() => {
    if (state.winner) {
      (document.querySelector("dialog.modal")! as HTMLDialogElement)
        .showModal();
    }
  }, [state.winner]);

  useEffect(() => {
    if (state.winStreak) {
      const firstElement = document.querySelector(
        `[data-index="${state.winStreak[0]}"]`,
      );
      const lastElement = document.querySelector(
        `[data-index="${state.winStreak[2]}"]`,
      );
      const lineElement = document.querySelector("svg.guide line");
      console.log(lineElement);

      if (!firstElement || !lastElement || !lineElement) {
        //fallback to another win animation
        return;
      }
      const firstElementRect = firstElement.getBoundingClientRect();
      const lastElementRect = lastElement.getBoundingClientRect();
      lineElement.setAttribute(
        "x1",
        String(firstElementRect.x + firstElementRect.width / 2),
      );
      lineElement.setAttribute(
        "x2",
        String(firstElementRect.x + firstElementRect.width / 2),
      );
      lineElement.setAttribute(
        "y1",
        String(firstElementRect.y + firstElementRect.width / 2),
      );
      lineElement.setAttribute(
        "y2",
        String(firstElementRect.y + firstElementRect.height / 2),
      );
      animate(lineElement, {
        x1: firstElementRect.x + firstElementRect.width / 2,
        x2: lastElementRect.x + lastElementRect.width / 2,
        y1: firstElementRect.y + firstElementRect.height / 2,
        y2: lastElementRect.y + lastElementRect.height / 2,
      });
      const jsConfetti = new JSConfetti();

      jsConfetti.addConfetti();
    }
  }, [state.winStreak]);

  const move = useCallback((index: number) => {
    if (state.board[index] !== 0) return;
    const lastBoard = setBoardValue(index, state.turn);
    //calculate for current turn
    wins.forEach((win) => {
      if (win.every((index) => lastBoard[index] === state.turn)) {
        setState({ winner: state.turn, winStreak: win });
      }
    }, [state.board, state.turn]);

    setState({ turn: state.turn === 1 ? -1 : 1 });
  }, [state, setState, setBoardValue]);

  return (
    <>
      <dialog className="modal">
        <h1>{state.winner === 0 ? "Draw" : state.winner === 1 ? "X" : "O"}</h1>
        <button
          onClick={reset}
        >
          Play Again
        </button>
      </dialog>

      <main className="main">
        <svg className="guide">
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="0"
            stroke="black"
            strokeWidth={4}
          />
        </svg>
        <motion.div
          layout
          className={`grid`}
        >
          {Array.from(
            { length: 9 },
            (_, i) => (
              <motion.button
                data-index={i}
                onClick={() => move(i)}
                className={`box ${
                  state.board[i] === 1 ? "x" : state.board[i] === -1 ? "o" : ""
                }`}
                key={i}
              >
                {/* {i} */}
              </motion.button>
            ),
          )}
        </motion.div>
      </main>
    </>
  );
}

export default App;
