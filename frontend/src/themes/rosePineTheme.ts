import type { ThemeDefinition } from './types'

export const rosePineTheme: ThemeDefinition = {
  id: 'rose-pine',
  name: 'Rosé Pine',
  palettes: {
    light: {
      canvas:       '#faf4ed',
      surface:      '#f2e9e1',
      textInverse:  '#faf4ed',
      text:         '#575279',
      textMuted:    '#686280',
      border:       '#dfdad9',
      accent:       '#286983',
      accentHover:  '#1f5470',
      accentSubtle: '#e1e3e0',
      positive:     '#4d878f',
      negative:     '#b4637a',
    },
    dark: {
      canvas:       '#191724',
      surface:      '#1f1d2e',
      textInverse:  '#191724',
      text:         '#e0def4',
      textMuted:    '#908caa',
      border:       '#26233a',
      accent:       '#31748f',
      accentHover:  '#6aabbf',
      accentSubtle: '#1c2231',
      positive:     '#9ccfd8',
      negative:     '#eb6f92',
    },
  },
}
