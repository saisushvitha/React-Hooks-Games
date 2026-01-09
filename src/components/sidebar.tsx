import { Volume2, VolumeX } from "lucide-react";
import { useSettings } from "../context/settingContext";
import type { GameKey, GameMeta } from "../types";

interface SidebarProps {
  active: GameKey;
  games: GameMeta[];
  onGo: (k: GameKey) => void;
}

const Sidebar = ({
  active,
  games,
  onGo,
}: SidebarProps) => {
  const { state, dispatch } = useSettings();

  return (
    <aside className="grid content-start gap-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="mb-3 text-xs font-extrabold uppercase tracking-wider text-white/70">
          Settings
        </div>

        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/75">Sound</span>

            <button
              onClick={() => dispatch({ type: "TOGGLE_SOUND" })}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
            >
              {state.soundOn ? (
                <Volume2 className="h-4 w-4 text-white/80" />
              ) : (
                <VolumeX className="h-4 w-4 text-white/80" />
              )}
              {state.soundOn ? "On" : "Off"}
            </button>
          </div>

          <div className="grid gap-2">
            <span className="text-sm text-white/75">Difficulty</span>
            <div className="flex gap-2">
              {(["easy", "medium", "hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => dispatch({ type: "SET_DIFFICULTY", value: d })}
                  className={[
                    "rounded-xl border px-3 py-2 text-sm font-semibold hover:bg-white/10",
                    state.difficulty === d
                      ? "border-white/25 bg-white/15"
                      : "border-white/10 bg-white/5",
                  ].join(" ")}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
        <div className="mb-3 text-xs font-extrabold uppercase tracking-wider text-white/70">
          Games
        </div>

        <div className="grid gap-2">
          {games.map((g) => {
            const isActive = active === g.key;
            const Icon = g.icon;

            return (
              <button
                key={g.key}
                onClick={() => onGo(g.key)}
                className={[
                  "group w-full rounded-2xl border p-3 text-left transition",
                  isActive
                    ? "border-white/25 bg-white/12"
                    : "border-white/10 bg-white/5 hover:bg-white/10",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-extrabold">
                      <Icon className="h-4 w-4 text-white/80" />
                      <span>{g.title}</span>
                    </div>
                    <div className="mt-1 text-xs text-white/60">{g.desc}</div>
                  </div>

                  <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1 text-[10px] text-white/60">
                    {g.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;