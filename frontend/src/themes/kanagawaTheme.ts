import type { ThemeDefinition } from './types'

export const kanagawaTheme: ThemeDefinition = {
  id: 'kanagawa',
  name: 'Kanagawa',
  palettes: {
    light: {
      canvas:       '#f2ecbc',
      surface:      '#e4dfa8',
      textInverse:  '#f2ecbc',
      text:         '#545464',
      textMuted:    '#616054',
      border:       '#d4cfa0',
      accent:       '#4d699b',
      accentHover:  '#3d547c',
      accentSubtle: '#dedcb8',
      positive:     '#6f894e',
      negative:     '#c84053',
    },
    dark: {
      canvas:       '#181616',
      surface:      '#22231f',
      textInverse:  '#181616',
      text:         '#c5c9c5',
      textMuted:    '#a6a69c',
      border:       '#2d2b27',
      accent:       '#7fb4ca',
      accentHover:  '#8ba4b0',
      accentSubtle: '#24292c',
      positive:     '#8a9a7b',
      negative:     '#c4746e',
    },
  },
}
