// Centralized Matrix Theme Color System
export const matrixColors = {
  // Primary Matrix Green Palette
  primary: {
    main: '#00ff9f',
    light: '#4fffb0',
    dark: '#00cc7f',
    darker: '#00a366',
    contrastText: '#0a0e0a'
  },

  // Secondary Cyan Palette
  secondary: {
    main: '#00d4ff',
    light: '#4de0ff',
    dark: '#00a8cc',
    darker: '#007a99',
    contrastText: '#0a0e0a'
  },

  // Background Colors
  background: {
    primary: '#0a0e0a',      // Very dark green-black
    secondary: '#0f1b0f',    // Slightly lighter dark green
    tertiary: '#15271a',     // Card/paper background
    overlay: 'rgba(10, 14, 10, 0.95)',
    glass: 'rgba(15, 27, 15, 0.8)',
    transparent: 'rgba(0, 0, 0, 0.4)'
  },

  // Text Colors
  text: {
    primary: '#00ff9f',      // Main Matrix green
    secondary: '#4fffb0',    // Lighter green
    tertiary: 'rgba(79, 255, 176, 0.8)',
    muted: 'rgba(0, 255, 159, 0.6)',
    disabled: 'rgba(0, 255, 159, 0.3)'
  },

  // Border Colors
  border: {
    primary: 'rgba(0, 255, 159, 0.3)',
    secondary: 'rgba(0, 255, 159, 0.2)',
    hover: 'rgba(0, 255, 159, 0.6)',
    focus: '#00ff9f',
    divider: 'rgba(0, 255, 159, 0.15)'
  },

  // Shadow and Glow Effects
  effects: {
    glow: {
      primary: 'rgba(0, 255, 159, 0.5)',
      secondary: 'rgba(0, 255, 159, 0.3)',
      strong: 'rgba(0, 255, 159, 0.8)',
      subtle: 'rgba(0, 255, 159, 0.2)'
    },
    shadow: {
      primary: '0 0 10px rgba(0, 255, 159, 0.3)',
      secondary: '0 0 20px rgba(0, 255, 159, 0.2)',
      strong: '0 0 30px rgba(0, 255, 159, 0.5)',
      button: '0 10px 30px rgba(0, 255, 159, 0.4)'
    }
  },

  // State Colors
  states: {
    hover: {
      background: 'rgba(0, 255, 159, 0.1)',
      border: 'rgba(0, 255, 159, 0.6)',
      text: '#4fffb0'
    },
    active: {
      background: 'rgba(0, 255, 159, 0.2)',
      border: '#00ff9f',
      text: '#00ff9f'
    },
    disabled: {
      background: 'rgba(15, 27, 15, 0.3)',
      border: 'rgba(0, 255, 159, 0.1)',
      text: 'rgba(0, 255, 159, 0.3)'
    }
  },

  // Code Syntax Colors
  syntax: {
    keyword: '#ff6b6b',
    string: '#a8e6cf',
    function: '#ffe66d',
    class: '#4ecdc4',
    number: '#a8e6cf',
    comment: '#4fffb0',
    operator: '#ff8b94'
  },

  // Status Colors (maintaining some contrast)
  status: {
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    success: '#00ff9f'
  }
} as const;

// Color utility functions
export const getMatrixColor = (path: string) => {
  const keys = path.split('.');
  let value: any = matrixColors;
  
  for (const key of keys) {
    value = value[key];
    if (value === undefined) return '#00ff9f'; // fallback
  }
  
  return value;
};

export const withOpacity = (color: string, opacity: number) => {
  if (color.startsWith('rgba')) {
    return color.replace(/[\d.]+\)$/g, `${opacity})`);
  }
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  return color;
};

export default matrixColors;