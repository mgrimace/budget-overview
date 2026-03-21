export type ThemeMode = 'light' | 'dark'

export interface ThemePalette {
  canvas: string
  surface: string
  textInverse: string
  text: string
  textMuted: string
  border: string
  accent: string
  accentHover: string
  accentSubtle: string
  positive: string
  negative: string
}

export interface ThemeDefinition {
  id: string
  name: string
  palettes: {
    light: ThemePalette
    dark: ThemePalette
  }
}
