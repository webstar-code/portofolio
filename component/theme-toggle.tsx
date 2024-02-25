"use client"

import { useTheme } from "next-themes";
import { Icons } from "./Icons";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className={`w-16 h-16 rounded-sm p-2 cursor-pointer bg-background`}>
      {theme === "light" ?
        <Icons.moon style={{width: 16, height: 16}} />
        :
        <Icons.sun style={{width: 16, height: 16}} />
      }
    </button>
  )
}