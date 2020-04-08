import { Theme } from '../theme'

const theme: Theme = {
  cell: {
    base: {
      opacity: '0.5',
      color: '#4a5568',
      fontSize: '0.875rem'
    },
    currentMonth: {
      borderColor: '#e2e8f0'
    },
    selectable: {
      cursor: 'pointer',
      opacity: '1'
    },
    hovered: {
      zIndex: '3',
      borderColor: '#63b3ed',
      backgroundColor: '#bee3f8'
    },
    selected: {
      zIndex: '2',
      opacity: '1',
      cursor: 'pointer',
      borderColor: '#63b3ed',
      backgroundColor: '#bee3f8'
    },
    inSelection: {
      zIndex: '1',
      borderColor: '#90cdf4',
      backgroundColor: '#ebf8ff'
    }
  }
}

export default theme
