import type { ThemeDefinition, ThemeMode } from './types'

const tokenToCssVarMap: Record<string, string[]> = {
  canvas:       ['--color-canvas'],
  surface:      ['--color-surface'],
  textInverse:  ['--color-text-inverse'],
  text:         ['--color-text'],
  textMuted:    ['--color-text-muted'],
  border:       ['--color-border'],
  accent:       ['--color-accent'],
  accentHover:  ['--color-accent-hover'],
  accentSubtle: ['--color-accent-subtle'],
  positive:     ['--color-positive'],
  negative:     ['--color-negative'],
}

export function applyTheme(theme: ThemeDefinition, mode: ThemeMode) {
  const root = document.documentElement
  const palette = theme.palettes[mode]

  root.setAttribute('data-theme', mode)
  root.setAttribute('data-theme-id', theme.id)

  for (const [token, value] of Object.entries(palette)) {
    const cssVars = tokenToCssVarMap[token]
    if (!cssVars) continue
    for (const cssVar of cssVars) {
      root.style.setProperty(cssVar, value)
    }
  }
}
