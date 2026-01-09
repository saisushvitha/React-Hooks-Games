import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { useSettings } from "../context/settingContext";
import type { Difficulty } from "../types";
import { randInt } from "./guards";
import { Check } from "lucide-react";

type State = { target: string; typed: string; score: number; status: "typing" | "win" };
type Action =
  | { type: "NEW_TARGET"; value: string }
  | { type: "TYPE"; value: string }
  | { type: "WIN" }
  | { type: "CLEAR" };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "NEW_TARGET":
      return { ...state, target: action.value, typed: "", status: "typing" };
    case "TYPE":
      return { ...state, typed: action.value };
    case "WIN":
      return { ...state, score: state.score + 1, status: "win" };
    case "CLEAR":
      return { ...state, typed: "", status: "typing" };
    default:
      return state;
  }
}

const makeTarget = (d: Difficulty) => {
  const easy = ["asd", "jkl", "qwe", "zxc"];
  const med = ["react", "hooks", "types", "memo"];
  const hard = ["usecallback", "usememo", "reducer", "deferred"];
  const pool = d === "easy" ? easy : d === "hard" ? hard : med;
  return pool[randInt(0, pool.length - 1)];
}

const KeySequenceGame = () => {
  const { state: settings } = useSettings();
  const [state, dispatch] = useReducer(reducer, {
    target: makeTarget(settings.difficulty),
    typed: "",
    score: 0,
    status: "typing",
  });

  const typedRef = useRef("");

  useEffect(() => {
    dispatch({ type: "NEW_TARGET", value: makeTarget(settings.difficulty) });
    typedRef.current = "";
  }, [settings.difficulty]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Backspace") {
        typedRef.current = typedRef.current.slice(0, -1);
        dispatch({ type: "TYPE", value: typedRef.current });
        return;
      }
      if (e.key.length !== 1) return;
      const ch = e.key.toLowerCase();
      if (!/[a-z]/.test(ch)) return;

      typedRef.current = (typedRef.current + ch).slice(0, 24);
      dispatch({ type: "TYPE", value: typedRef.current });

      if (typedRef.current === state.target) dispatch({ type: "WIN" });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [state.target]);

  const next = useCallback(() => {
    typedRef.current = "";
    dispatch({ type: "NEW_TARGET", value: makeTarget(settings.difficulty) });
  }, [settings.difficulty]);

  const clear = useCallback(() => {
    typedRef.current = "";
    dispatch({ type: "CLEAR" });
  }, []);

  const progress = useMemo(() => {
    let ok = 0;
    for (let i = 0; i < Math.min(state.target.length, state.typed.length); i++) {
      if (state.target[i] === state.typed[i]) ok++;
      else break;
    }
    return `${ok}/${state.target.length}`;
  }, [state.target, state.typed]);

  return (
    <div className="grid gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-lg font-extrabold">Key Sequence</h2>
          <p className="text-sm text-white/60">useEffect + useRef buffer + useReducer</p>
        </div>
        <div className="text-sm text-white/70">
          Score <b className="text-white">{state.score}</b>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
        <div className="text-xs text-white/60">Type exactly:</div>
        <div className="mt-1 text-xl font-black tracking-wide">{state.target}</div>

        <div className="mt-4 text-xs text-white/60">You typed:</div>
        <div className="mt-1 text-lg font-black">{state.typed || "—"}</div>

        <div className="mt-3 text-sm text-white/70">Progress: {progress} {state.status === "win" ? <Check /> : ""}</div>

        <div className="mt-4 flex gap-2">
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10" onClick={clear}>
            Clear
          </button>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold hover:bg-white/10" onClick={next}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default KeySequenceGame;
