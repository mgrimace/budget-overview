import type { ThemeDefinition } from './types'

export const catppuccinTheme: ThemeDefinition = {
  id: 'catppuccin',
  name: 'Catppuccin',
  palettes: {
    light: {
      canvas:       '#EFF1F5',
      surface:      '#DCE0E8',
      textInverse:  '#EFF1F5',
      text:         '#4C4F69',
      textMuted:    '#5C5F77',
      border:       '#BCC0CC',
      accent:       '#1E66F5',
      accentHover:  '#1553CC',
      accentSubtle: '#DCE0F5',
      positive:     '#3a9226',
      negative:     '#D20F39',
    },
    dark: {
      canvas:       '#1E1E2E',
      surface:      '#313244',
      textInverse:  '#1E1E2E',
      text:         '#CDD6F4',
      textMuted:    '#A6ADC8',
      border:       '#45475A',
      accent:       '#89B4FA',
      accentHover:  '#74A0F6',
      accentSubtle: '#2A3555',
      positive:     '#A6E3A1',
      negative:     '#F38BA8',
    },
  },
}
