import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { themes } from '../themes'
import { applyTheme } from '../themes/themeManager'
import type { ThemeDefinition, ThemeMode } from '../themes/types'

const MODE_STORAGE_KEY = 'budget_mode'
const THEME_STORAGE_KEY = 'budget_theme'
const DEFAULT_THEME_ID = 'default'

interface ThemeContextValue {
  themes: ThemeDefinition[]
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
  themeId: string
  setThemeId: (id: string) => void
  selectedTheme: ThemeDefinition
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const readStoredMode = (): ThemeMode | null => {
  try {
    const value = window.localStorage.getItem(MODE_STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

const readStoredThemeId = (): string | null => {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY)
    return themes.some(t => t.id === value) ? value : null
  } catch {
    return null
  }
}

const getInitialMode = (): ThemeMode => {
  const stored = readStoredMode()
  if (stored) return stored
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(getInitialMode)
  const [themeId, setThemeId] = useState(() => readStoredThemeId() || DEFAULT_THEME_ID)

  useEffect(() => {
    const selectedTheme = themes.find(t => t.id === themeId) || themes[0]
    applyTheme(selectedTheme, mode)

    try {
      window.localStorage.setItem(MODE_STORAGE_KEY, mode)
      window.localStorage.setItem(THEME_STORAGE_KEY, selectedTheme.id)
    } catch {
      // ignore storage failures in private/restricted browsing modes
    }
  }, [mode, themeId])

  const value = useMemo(() => {
    const selectedTheme = themes.find(t => t.id === themeId) || themes[0]
    const toggleMode = () => setMode(prev => (prev === 'dark' ? 'light' : 'dark'))
    return { themes, mode, setMode, toggleMode, themeId, setThemeId, selectedTheme }
  }, [mode, themeId])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within ThemeProvider')
  return context
}
