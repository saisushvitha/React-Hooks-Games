import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { PiggyBank } from "lucide-react";
import { useSettings } from "../context/settingContext";
import { useSound } from "../context/soundContext";
import { randInt } from "./guards";

type State = { running: boolean; score: number; timeLeft: number; active: number };
type Action =
  | { type: "START"; duration: number }
  | { type: "TICK" }
  | { type: "SPAWN"; i: number }
  | { type: "HIT"; i: number };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "START":
      return { running: true, score: 0, timeLeft: action.duration, active: -1 };
    case "TICK": {
      const t = state.timeLeft - 1;
      return t <= 0 ? { ...state, running: false, timeLeft: 0, active: -1 } : { ...state, timeLeft: t };
    }
    case "SPAWN":
      return state.running ? { ...state, active: action.i } : state;
    case "HIT":
      if (!state.running) return state;
      if (action.i !== state.active) return state;
      return { ...state, score: state.score + 1, active: -1 };
    default:
      return state;
  }
}

const WhackAMoleGame = () => {
  const { state: settings } = useSettings();
  const { play } = useSound();

  const duration = useMemo(
    () => (settings.difficulty === "easy" ? 20 : settings.difficulty === "hard" ? 12 : 15),
    [settings.difficulty]
  );
  const spawnMs = useMemo(
    () => (settings.difficulty === "easy" ? 700 : settings.difficulty === "hard" ? 450 : 600),
    [settings.difficulty]
  );

  const [state, dispatch] = useReducer(reducer, { running: false, score: 0, timeLeft: duration, active: -1 });

  useEffect(() => {
    if (!state.running) return;
    const spawnId = window.setInterval(() => dispatch({ type: "SPAWN", i: randInt(0, 8) }), spawnMs);
    const tickId = window.setInterval(() => dispatch({ type: "TICK" }), 1000);
    return () => {
      window.clearInterval(spawnId);
      window.clearInterval(tickId);
    };
  }, [state.running, spawnMs]);


  const endSoundPlayedRef = useRef(false);
  useEffect(() => {
    const gameEnded = !state.running && state.timeLeft === 0;
    if (gameEnded && !endSoundPlayedRef.current) {
      play("success");
      endSoundPlayedRef.current = true;
    }
    if (!gameEnded) endSoundPlayedRef.current = false;
  }, [state.running, state.timeLeft, play]);

  const start = useCallback(() => {
    play("click");
    dispatch({ type: "START", duration });
  }, [duration, play]);

  // ✅ click handler with hit/miss sound
  const hit = useCallback(
    (i: number) => {
      if (!state.running) {
        play("error");
        return;
      }

      if (i === state.active) {
        play("click"); // hit
        dispatch({ type: "HIT", i });
      } else {
        play("error"); // miss
      }
    },
    [state.running, state.active, play]
  );

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-extrabold">Whack-a-Pig</h2>
          <p className="text-sm text-white/60">useEffect loop + useReducer + sound</p>
        </div>
        <div className="text-sm text-white/70">
          Score <b className="text-white">{state.score}</b> · Time{" "}
          <b className="text-white">{state.timeLeft}s</b>
        </div>
      </div>

      <button
        onClick={start}
        disabled={state.running}
        className="w-fit rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10 disabled:opacity-60"
      >
        {state.running ? "Running…" : "Start"}
      </button>

      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 9 }).map((_, i) => {
          const active = i === state.active;
          return (
            <button
              key={i}
              onClick={() => hit(i)}
              className={[
                "h-24 rounded-3xl border text-2xl font-black transition flex items-center justify-center",
                active
                  ? "border-white/25 bg-amber-400/90 text-black"
                  : "border-white/10 bg-white/5 hover:bg-white/10",
              ].join(" ")}
            >
              {active ? <PiggyBank className="h-8 w-8" /> : <span className="text-white/40">·</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WhackAMoleGame;