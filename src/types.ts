import type { LucideIcon } from "lucide-react";
export type GameKey =
  | "home"
  | "reaction"
  | "tictactoe"
  | "whack"
  | "sequence"
  | "aim"
  | "memory"
  | "dice";

export type Difficulty = "easy" | "medium" | "hard";

export type GameMeta = {
  key: Exclude<GameKey, "home">;
  title: string;
  desc: string;
  badge: string;
  icon: LucideIcon;
};
