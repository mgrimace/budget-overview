import type { ThemeDefinition } from './types'

export const everforestTheme: ThemeDefinition = {
  id: 'everforest',
  name: 'Everforest',
  palettes: {
    light: {
      canvas:       '#FDF6E3',
      surface:      '#F4F0D9',
      textInverse:  '#FDF6E3',
      text:         '#5C6A72',
      textMuted:    '#829181',
      border:       '#BDC3AF',
      accent:       '#3A94C5',
      accentHover:  '#2E7BA8',
      accentSubtle: '#E2EEF5',
      positive:     '#8DA101',
      negative:     '#F85552',
    },
    dark: {
      canvas:       '#2D353B',
      surface:      '#343F44',
      textInverse:  '#2D353B',
      text:         '#D3C6AA',
      textMuted:    '#9DA9A0',
      border:       '#4F585E',
      accent:       '#7FBBB3',
      accentHover:  '#6AA8A0',
      accentSubtle: '#2E4048',
      positive:     '#A7C080',
      negative:     '#E67E80',
    },
  },
}
