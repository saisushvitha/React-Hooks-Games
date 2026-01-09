import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { useSettings } from "../context/settingContext";
import { useSound } from "../context/soundContext";
import { randInt } from "./guards";

type Phase = "idle" | "waiting" | "go" | "done";
type State = { phase: Phase; msg: string; best: number | null; last: number | null };
type Action =
  | { type: "START" }
  | { type: "GO" }
  | { type: "TOO_SOON" }
  | { type: "DONE"; ms: number }
  | { type: "RESET" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "START":
      return { ...state, phase: "waiting", msg: "Wait for GREEN...", last: null };
    case "GO":
      return { ...state, phase: "go", msg: "GO! Click now!" };
    case "TOO_SOON":
      return { ...state, phase: "done", msg: "Too soon Try again.", last: null };
    case "DONE": {
      const best = state.best == null ? action.ms : Math.min(state.best, action.ms);
      return { ...state, phase: "done", msg: `Your time: ${action.ms} ms`, last: action.ms, best };
    }
    case "RESET":
      return { phase: "idle", msg: "Press Start", best: state.best, last: null };
    default:
      return state;
  }
}

const ReactionTimerGame = () => {
  const { state: settings } = useSettings();
  const { play } = useSound();

  const [state, dispatch] = useReducer(reducer, {
    phase: "idle",
    msg: "Press Start",
    best: null,
    last: null,
  });

  const timeoutRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  const delay = useMemo(() => {
    if (settings.difficulty === "easy") return [700, 1400] as const;
    if (settings.difficulty === "hard") return [900, 2600] as const;
    return [800, 2200] as const;
  }, [settings.difficulty]);

  const start = useCallback(() => {
    play("click");
    dispatch({ type: "START" });

    if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      startRef.current = performance.now();
      dispatch({ type: "GO" });
    }, randInt(delay[0], delay[1]));
  }, [delay, play]);

  const click = useCallback(() => {
    if (state.phase === "waiting") {
      play("error");
      if (timeoutRef.current != null) window.clearTimeout(timeoutRef.current);
      dispatch({ type: "TOO_SOON" });
      return;
    }

    if (state.phase === "go") {
      play("success");
      const ms = Math.round(performance.now() - startRef.current);
      dispatch({ type: "DONE", ms });
      return;
    }

    play("click");
  }, [state.phase, play]);

  const reset = useCallback(() => {
    play("click");
    dispatch({ type: "RESET" });
  }, [play]);

  return (
    <div className="grid gap-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold">Reaction Timer</h2>
          <p className="text-sm text-white/70">useEffect + useRef + useReducer</p>
        </div>
        <div className="text-xs text-white/70">
          Best: <b className="text-white">{state.best ?? "—"}</b>
        </div>
      </div>

      <div
        onClick={click}
        className={[
          "select-none cursor-pointer grid place-items-center h-44 rounded-2xl border border-white/10 text-lg font-black",
          state.phase === "go" ? "bg-emerald-500/90" : "bg-red-500/80",
        ].join(" ")}
      >
        {state.msg}
      </div>

      <div className="flex gap-2">
        <button
          onClick={start}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
        >
          Start
        </button>
        <button
          onClick={reset}
          className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
        >
          Reset
        </button>
      </div>

      <div className="text-sm text-white/70">
        Last: <b className="text-white">{state.last ?? "—"}</b> ms
      </div>
    </div>
  );
}

export default ReactionTimerGame;