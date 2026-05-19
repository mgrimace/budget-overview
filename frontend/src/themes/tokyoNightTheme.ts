import type { ThemeDefinition } from './types'

export const tokyoNightTheme: ThemeDefinition = {
  id: 'tokyo-night',
  name: 'Tokyo Night',
  palettes: {
    light: {
      canvas:       '#e6e7ed',
      surface:      '#d6d8df',
      textInverse:  '#e6e7ed',
      text:         '#363c4d',
      textMuted:    '#595e71',
      border:       '#c1c2c7',
      accent:       '#2959aa',
      accentHover:  '#1d4a8a',
      accentSubtle: '#cfd6e5',
      positive:     '#2d7b74',
      negative:     '#bd4040',
    },
    dark: {
      canvas:       '#1a1b26',
      surface:      '#1e202e',
      textInverse:  '#1a1b26',
      text:         '#a9b1d6',
      textMuted:    '#8589a8',
      border:       '#2a2d40',
      accent:       '#7aa2f7',
      accentHover:  '#6183bb',
      accentSubtle: '#262b3f',
      positive:     '#9ece6a',
      negative:     '#f7768e',
    },
  },
}
