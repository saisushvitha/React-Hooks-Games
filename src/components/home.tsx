import type { GameKey, GameMeta } from "../types";

interface HomeProps {
  games: GameMeta[];
  onOpen: (g: GameKey) => void;
}

const Home = ({
  games,
  onOpen,
}: HomeProps) => {
  return (
    <div className="grid gap-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
        <div className="text-xl font-black tracking-tight">Hooks Games Dashboard</div>
        <div className="mt-2 text-sm text-white/65">
          Mini-games built to show <b>useReducer</b>, <b>useEffect</b>, <b>useRef</b>, <b>useMemo</b>,{" "}
          <b>useCallback</b>, <b>useContext</b>, <b>useTransition</b>, <b>useDeferredValue</b>, <b>useId</b>.
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {games.map((g) => {
          const Icon = g.icon;
          return (
            <div
              key={g.key}
              className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur hover:bg-white/8 transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-sm font-extrabold">
                    <Icon className="h-5 w-5 text-white/80" />
                    <span>{g.title}</span>
                  </div>
                  <div className="mt-1 text-xs text-white/60">{g.desc}</div>
                </div>

                <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] text-white/60">
                  {g.badge}
                </span>
              </div>

              <button
                onClick={() => onOpen(g.key)}
                className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
              >
                Play
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;