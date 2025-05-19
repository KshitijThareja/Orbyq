"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"
type ColorScheme = "teal" | "purple" | "sky" | "slate"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultColorScheme?: ColorScheme
  storageKey?: string
  colorSchemeKey?: string
}

interface ThemeContextType {
  theme: Theme
  colorScheme: ColorScheme
  setTheme: (theme: Theme) => void
  setColorScheme: (colorScheme: ColorScheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  defaultColorScheme = "teal",
  storageKey = "orbyq-theme",
  colorSchemeKey = "orbyq-color-scheme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem(storageKey)
      return (storedTheme as Theme) || defaultTheme
    }
    return defaultTheme
  })

  const [colorScheme, setColorScheme] = useState<ColorScheme>(() => {
    if (typeof window !== "undefined") {
      const storedColorScheme = localStorage.getItem(colorSchemeKey)
      return (storedColorScheme as ColorScheme) || defaultColorScheme
    }
    return defaultColorScheme
  })

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute("data-color-scheme", colorScheme)

    const root = document.documentElement
    let primaryColor = ""

    switch (colorScheme) {
      case "teal":
        primaryColor = "173 80% 40%"
        break
      case "purple":
        primaryColor = "270 80% 50%"
        break
      case "sky":
        primaryColor = "200 80% 50%"
        break
      case "slate":
        primaryColor = "215 20% 50%"
        break
      default:
        primaryColor = "173 80% 40%"
    }

    root.style.setProperty("--primary", primaryColor)
    root.style.setProperty("--ring", primaryColor)
  }, [colorScheme])

  const value = {
    theme,
    colorScheme,
    setTheme: (newTheme: Theme) => {
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
    setColorScheme: (newColorScheme: ColorScheme) => {
      localStorage.setItem(colorSchemeKey, newColorScheme)
      setColorScheme(newColorScheme)
    },
  }

  return (
    <ThemeContext.Provider {...props} value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
