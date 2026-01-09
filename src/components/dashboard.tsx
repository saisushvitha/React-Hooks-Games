import { useCallback, useDeferredValue, useMemo, useReducer, useTransition } from "react";
import type { GameKey, GameMeta } from "../types";
import  TopBar  from "./topbar";
import Sidebar  from "./sidebar";
import  Home  from "./home";
import ReactionTimerGame  from "../games/reactionTimer";
import  TicTacToeGame  from "../games/ticToc";
import  WhackAMoleGame  from "../games/whackMole";
import KeySequenceGame  from "../games/keySequence";
import {  Grid3x3, Target, Keyboard, Zap } from "lucide-react";

type NavState = { active: GameKey; search: string };
type NavAction = { type: "GO"; game: GameKey } | { type: "SEARCH"; value: string };

const navReducer = (state: NavState, action: NavAction): NavState => {
  switch (action.type) {
    case "GO":
      return { ...state, active: action.game };
    case "SEARCH":
      return { ...state, search: action.value };
    default:
      return state;
  }
}


const Dashboard = () => {
  const [nav, navDispatch] = useReducer(navReducer, { active: "home", search: "" });
  const [pending, startTransition] = useTransition();
  const deferredSearch = useDeferredValue(nav.search);

  const games = useMemo<GameMeta[]>(
    () => [
      { key: "reaction", title: "Reaction Timer", desc: "Click when it turns green", badge: "effect+ref+reducer", icon: Zap },
      { key: "tictactoe", title: "Tic-Tac-Toe", desc: "Classic 3×3 strategy", badge: "memo+callback+reducer", icon: Grid3x3 },
      { key: "whack", title: "Whack-a-Mole", desc: "Hit the mole fast", badge: "effect loop+reducer", icon: Target },
      { key: "sequence", title: "Key Sequence", desc: "Type the target string", badge: "effect+ref buffer", icon: Keyboard },
    ],
    []
  );

  const filtered = useMemo(() => {
    const q = deferredSearch.trim().toLowerCase();
    if (!q) return games;
    return games.filter((g) => (g.title + " " + g.desc + " " + g.badge).toLowerCase().includes(q));
  }, [games, deferredSearch]);

  const go = useCallback((game: GameKey) => {
    startTransition(() => navDispatch({ type: "GO", game }));
  }, []);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-5 py-4">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-black tracking-tight">Hooks Games Dashboard</h1>
            <span className="hidden sm:inline text-xs text-white/60">TypeScript • Tailwind • no useState</span>
          </div>

          <TopBar
            search={nav.search}
            onSearch={(val) => navDispatch({ type: "SEARCH", value: val })}
            onHome={() => go("home")}
            pending={pending}
          />
        </div>
      </header>

      <div className="mx-auto grid max-w-[1200px] gap-4 px-5 py-5 lg:grid-cols-[340px_1fr]">
        <div className="lg:sticky lg:top-[92px] lg:max-h-[calc(100vh-110px)] lg:overflow-auto">
          <Sidebar active={nav.active} games={filtered} onGo={go} />
        </div>

        <main className="min-h-[520px] rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          {nav.active === "home" && <Home games={filtered} onOpen={go} />}
          {nav.active === "reaction" && <ReactionTimerGame />}
          {nav.active === "tictactoe" && <TicTacToeGame />}
          {nav.active === "whack" && <WhackAMoleGame />}
          {nav.active === "sequence" && <KeySequenceGame />}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;