import type { ThemeDefinition } from './types'

export const draculaTheme: ThemeDefinition = {
  id: 'dracula',
  name: 'Dracula',
  palettes: {
    light: {
      canvas:       '#DEDCCF',
      surface:      '#BCBAB3',
      textInverse:  '#DEDCCF',
      text:         '#1F1F1F',
      textMuted:    '#3d362a',
      border:       '#CECCC0',
      accent:       '#036A96',
      accentHover:  '#025578',
      accentSubtle: '#c4cec8',
      positive:     '#14710A',
      negative:     '#CB3A2A',
    },
    dark: {
      canvas:       '#191A21',
      surface:      '#343746',
      textInverse:  '#191A21',
      text:         '#F8F8F2',
      textMuted:    '#a0acd8',
      border:       '#282A36',
      accent:       '#8BE9FD',
      accentHover:  '#97ebfd',
      accentSubtle: '#27333b',
      positive:     '#50FA7B',
      negative:     '#FF5555',
    },
  },
}
