import type { ThemeDefinition } from './types'

export const solarizedTheme: ThemeDefinition = {
  id: 'solarized',
  name: 'Solarized',
  palettes: {
    light: {
      canvas:       '#fdf6e3',
      surface:      '#eee8d5',
      textInverse:  '#fdf6e3',
      text:         '#657b83',
      textMuted:    '#586e75',
      border:       '#93a1a1',
      accent:       '#268bd2',
      accentHover:  '#1f74b3',
      accentSubtle: '#ddeef8',
      positive:     '#859900',
      negative:     '#dc322f',
    },
    dark: {
      canvas:       '#002b36',
      surface:      '#073642',
      textInverse:  '#002b36',
      text:         '#839496',
      textMuted:    '#93a1a1',
      border:       '#586e75',
      accent:       '#268bd2',
      accentHover:  '#1f74b3',
      accentSubtle: '#0a3040',
      positive:     '#859900',
      negative:     '#dc322f',
    },
  },
}
