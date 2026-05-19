import type { ThemeDefinition } from './types'

export const moondustTheme: ThemeDefinition = {
  id: 'moondust',
  name: 'moondust',
  palettes: {
    light: {
      canvas:       '#ffffff',
      surface:      '#f6f7f8',
      textInverse:  '#ffffff',
      text:         '#24292d',
      textMuted:    '#434a51',
      border:       '#d7dcdf',
      accent:       '#3882c2',
      accentHover:  '#1f639e',
      accentSubtle: '#dceaf8',
      positive:     '#5f7556',
      negative:     '#E67C7C',
    },
    dark: {
      canvas:       '#161a1d',
      surface:      '#1e2225',
      textInverse:  '#161a1d',
      text:         '#d2d4d5',
      textMuted:    '#b1b6b9',
      border:       '#2c343a',
      accent:       '#4D8FDB',
      accentHover:  '#2769b4',
      accentSubtle: '#133358',
      positive:     '#87a07a',
      negative:     '#c45858',
    },
  },
}
