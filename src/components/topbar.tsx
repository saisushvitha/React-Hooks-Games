import { useId } from "react";
import { Search, Loader2, Home } from "lucide-react";

interface TopBarProps {
  search: string;
  onSearch: (v: string) => void;
  onHome: () => void;
  pending: boolean;
}

const TopBar = ({
  search,
  onSearch,
  onHome,
  pending,
}: TopBarProps) => {
  const id = useId();

  return (
    <div className="flex items-center gap-3">
      {/* Home button */}
      <button
        onClick={onHome}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold hover:bg-white/10"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Home</span>
      </button>

      {/* Status */}
      <div className="hidden sm:flex items-center gap-2 text-xs text-white/60">
        {pending ? (
          <>
            <Loader2 className="h-3 w-3 animate-spin" />
            Switching…
          </>
        ) : (
          "Ready"
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <label htmlFor={id} className="sr-only">
          Search games
        </label>

        <input
          id={id}
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search games…"
          className="w-[240px] rounded-xl border border-white/10 bg-black/20 px-9 py-2 text-sm outline-none placeholder:text-white/40 focus:border-white/25"
        />

        {/* Left icon */}
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
      </div>
    </div>
  );
}

export default TopBar;