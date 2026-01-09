import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { useSound } from "../context/soundContext";

type Cell = "X" | "O" | null;
type State = { board: Cell[]; turn: "X" | "O" };
type Action = { type: "PLAY"; i: number } | { type: "RESET" };

const LINES: ReadonlyArray<readonly [number, number, number]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const reducer = (state: State, action: Action): State =>  {
  switch (action.type) {
    case "PLAY": {
      if (state.board[action.i]) return state;
      const next = state.board.slice();
      next[action.i] = state.turn;
      return { board: next, turn: state.turn === "X" ? "O" : "X" };
    }
    case "RESET":
      return { board: Array(9).fill(null), turn: "X" };
    default:
      return state;
  }
}

const calcWinner = (board: Cell[]): Cell => {
  for (const [a, b, c] of LINES) {
    const v = board[a];
    if (v && v === board[b] && v === board[c]) return v;
  }
  return null;
}

const botPick = (board: Cell[]): number => {
  const empty = board.map((v, i) => (v ? -1 : i)).filter((i) => i !== -1);

  for (const i of empty) {
    const test = board.slice();
    test[i] = "O";
    if (calcWinner(test) === "O") return i;
  }

  // block X
  for (const i of empty) {
    const test = board.slice();
    test[i] = "X";
    if (calcWinner(test) === "X") return i;
  }

  
  if (!board[4]) return 4;

  // corners
  const corners = [0, 2, 6, 8].filter((i) => !board[i]);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];

  // fallback
  return empty.length ? empty[0] : -1;
}

const TicTacToeGame = () => {
  const { play } = useSound();
  const [state, dispatch] = useReducer(reducer, { board: Array(9).fill(null), turn: "X" });

  const winner = useMemo(() => calcWinner(state.board), [state.board]);
  const draw = useMemo(() => !winner && state.board.every(Boolean), [winner, state.board]);
  const gameOver = winner !== null || draw;

  const endSoundPlayedRef = useRef(false);
  useEffect(() => {
    if (gameOver && !endSoundPlayedRef.current) {
      play("success");
      endSoundPlayedRef.current = true;
    }
    if (!gameOver) endSoundPlayedRef.current = false;
  }, [gameOver, play]);

  const botTimerRef = useRef<number | null>(null);
  useEffect(() => {
    if (botTimerRef.current != null) {
      window.clearTimeout(botTimerRef.current);
      botTimerRef.current = null;
    }

    if (gameOver) return;
    if (state.turn !== "O") return;

    botTimerRef.current = window.setTimeout(() => {
      const i = botPick(state.board);
      if (i >= 0) {
        play("click");
        dispatch({ type: "PLAY", i });
      }
    }, 350);

    return () => {
      if (botTimerRef.current != null) window.clearTimeout(botTimerRef.current);
    };
  }, [state.turn, state.board, gameOver, play]);

  const playCell = useCallback(
    (i: number) => {
      if (gameOver) {
        play("error");
        return;
      }
      if (state.turn !== "X") {
        play("error");
        return;
      }
      if (state.board[i]) {
        play("error");
        return;
      }

      play("click");
      dispatch({ type: "PLAY", i });
    },
    [gameOver, state.turn, state.board, play]
  );

  const reset = useCallback(() => {
    play("click");
    dispatch({ type: "RESET" });
  }, [play]);

  return (
    <div className="grid gap-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">Tic-Tac-Toe (vs Bot)</h2>
          <p className="text-sm text-white/70">You are X • Bot is O • useEffect bot + sounds</p>
        </div>
        <button
          onClick={reset}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
        >
          Reset
        </button>
      </div>

      <div className="text-sm text-white/80">
        {winner ? (
          <>
            Winner: <b>{winner}</b>
          </>
        ) : draw ? (
          "Draw!"
        ) : (
          <>
            Turn: <b>{state.turn}</b> {state.turn === "O" ? "(Bot thinking…)" : "(Your move)"}
          </>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {state.board.map((v, i) => (
          <button
            key={i}
            onClick={() => playCell(i)}
            className="h-24 rounded-2xl border border-white/10 bg-white/5 text-3xl font-black hover:bg-white/10 disabled:opacity-60"
            disabled={gameOver || state.turn !== "X"}
          >
            {v ?? ""}
          </button>
        ))}
      </div>
    </div>
  );
}

export default TicTacToeGame;