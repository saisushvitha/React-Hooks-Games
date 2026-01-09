import { createContext, useContext, useReducer } from "react";
import type { Difficulty } from "../types";

type SettingsState = { difficulty: Difficulty; soundOn: boolean };

type SettingsAction =
  | { type: "SET_DIFFICULTY"; value: Difficulty }
  | { type: "TOGGLE_SOUND" };

const SettingsContext = createContext<{
  state: SettingsState;
  dispatch: React.Dispatch<SettingsAction>;
} | null>(null);

function reducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case "SET_DIFFICULTY":
      return { ...state, difficulty: action.value };
    case "TOGGLE_SOUND":
      return { ...state, soundOn: !state.soundOn };
    default:
      return state;
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { difficulty: "medium", soundOn: true });
  return <SettingsContext.Provider value={{ state, dispatch }}>{children}</SettingsContext.Provider>;
}


export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
