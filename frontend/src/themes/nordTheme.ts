import type { ThemeDefinition } from './types'

export const nordTheme: ThemeDefinition = {
  id: 'nord',
  name: 'Nord',
  palettes: {
    light: {
      canvas:       '#ECEFF4',
      surface:      '#E5E9F0',
      textInverse:  '#ECEFF4',
      text:         '#2E3440',
      textMuted:    '#4C566A',
      border:       '#D8DEE9',
      accent:       '#5E81AC',
      accentHover:  '#4C6E96',
      accentSubtle: '#D8E8F2',
      positive:     '#A3BE8C',
      negative:     '#BF616A',
    },
    dark: {
      canvas:       '#2E3440',
      surface:      '#3B4252',
      textInverse:  '#2E3440',
      text:         '#ECEFF4',
      textMuted:    '#D8DEE9',
      border:       '#4C566A',
      accent:       '#88C0D0',
      accentHover:  '#81A1C1',
      accentSubtle: '#374060',
      positive:     '#A3BE8C',
      negative:     '#BF616A',
    },
  },
}
