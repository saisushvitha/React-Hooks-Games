# React Hooks Games Dashboard (TypeScript + Tailwind)

A mini dashboard of small games built with **React + TypeScript** to demonstrate **React Hooks** in practical, fun projects — with a clean UI, lucide-react icons, and sound effects.

> Goal: Learn hooks by building tiny games instead of boring demos.

---

##  Features

- Beautiful dashboard UI (sidebar + home cards + search)
- Multiple mini-games (each in its own component)
- Global settings:
  - Difficulty (easy / medium / hard)
  - Sound on/off (with icons)
- Lucide icons for consistent UI
- Sound effects (click / success / error)

---

##  Hooks Used (No `useState`)

This repository intentionally avoids `useState` and uses:

- `useReducer` → game state management
- `useEffect` → timers, intervals, cleanup, bot moves
- `useRef` → timers, sound refs, “play once” flags
- `useMemo` → derived values (winner, difficulty config, filtering)
- `useCallback` → stable event handlers
- `useContext` → global settings + sound provider
- `useTransition` → smooth navigation when switching games
- `useDeferredValue` → smooth filtering while typing search
- `useId` → accessible input id (search)

---

##  Games Included

- **Reaction Timer**
  - Click when the box turns green
  - Hooks: `useEffect`, `useRef`, `useReducer`

- **Tic-Tac-Toe (vs Bot)**
  - Player is X, bot plays O
  - Hooks: `useReducer`, `useMemo`, `useEffect`, `useRef`

- **Whack-a-Mole / Whack-a-Pig**
  - Hit the active tile before it moves
  - Hooks: `useEffect`, `useReducer`

- **Key Sequence**
  - Type the target string using keyboard events
  - Hooks: `useEffect`, `useRef`, `useReducer`

---

##  Sound System

Sound is implemented via a global `SoundProvider`:
- Uses `useRef` to keep audio objects alive
- Uses `useEffect` to initialize + unlock audio on first user click
- Controlled by the global `Sound` toggle in settings

---

## 🚀 Getting Started

### Install
```bash
npm install
npm run dev 
