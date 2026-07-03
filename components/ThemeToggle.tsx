"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { AppButton } from "@/components/ui"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <AppButton variant="ghost" size="icon" aria-label="Theme wird geladen">
         <span className="w-5 h-5 block" />
      </AppButton>
    )
  }

  return (
    <AppButton
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Moon size={20} /> : <Sun size={20} />}
    </AppButton>
  )
}
