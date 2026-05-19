import type { ThemeDefinition } from './types'

export const kanagawaWaveTheme: ThemeDefinition = {
  id: 'kanagawa-wave',
  name: 'Kanagawa Wave',
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
      canvas:       '#1f1f28',
      surface:      '#2a2a37',
      textInverse:  '#1f1f28',
      text:         '#dcd7ba',
      textMuted:    '#9e9b91',
      border:       '#363646',
      accent:       '#7fb4ca',
      accentHover:  '#7e9cd8',
      accentSubtle: '#2b313b',
      positive:     '#98bb6c',
      negative:     '#c34043',
    },
  },
}
