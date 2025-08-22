// Enhanced Matrix Theme with Organized Color System
import { createTheme } from '@mui/material/styles';
import { matrixColors } from './colors';

const theme = createTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          main: matrixColors.primary.main,
          light: matrixColors.primary.light,
          dark: matrixColors.primary.dark,
          contrastText: matrixColors.primary.contrastText
        },
        secondary: {
          main: matrixColors.secondary.main,
          light: matrixColors.secondary.light,
          dark: matrixColors.secondary.dark,
          contrastText: matrixColors.secondary.contrastText
        },
        error: {
          main: matrixColors.status.error,
          light: '#f87171',
          dark: '#dc2626',
          contrastText: '#ffffff'
        },
        warning: {
          main: matrixColors.status.warning,
          light: '#fbbf24',
          dark: '#d97706',
          contrastText: '#ffffff'
        },
        info: {
          main: matrixColors.status.info,
          light: '#60a5fa',
          dark: '#2563eb',
          contrastText: '#ffffff'
        },
        success: {
          main: matrixColors.status.success,
          light: matrixColors.primary.light,
          dark: matrixColors.primary.dark,
          contrastText: matrixColors.primary.contrastText
        },
        background: {
          default: matrixColors.background.primary,
          paper: matrixColors.background.secondary
        },
        text: {
          primary: matrixColors.text.primary,
          secondary: matrixColors.text.secondary
        },
        grey: {
          50: '#f0fff4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d'
        },
        divider: matrixColors.border.divider
      }
    }
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#667eea', // Modern gradient blue
      light: '#818cf8',
      dark: '#4f46e5',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#10b981', // Success green
      light: '#34d399', 
      dark: '#059669',
      contrastText: '#ffffff'
    },
    error: {
      main: '#ef4444', // Modern red
      light: '#f87171',
      dark: '#dc2626',
      contrastText: '#ffffff'
    },
    warning: {
      main: '#f59e0b', // Modern orange
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#ffffff'
    },
    info: {
      main: '#3b82f6', // Modern blue
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff'
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f8fafc', // Light gray background
      paper: '#ffffff'
    },
    text: {
      primary: '#1e293b', // Dark slate
      secondary: '#64748b' // Medium slate
    },
    grey: {
      50: '#f8fafc',
      100: '#f1f5f9', 
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    },
    divider: '#e2e8f0'
  },
  typography: {
    fontFamily: '"JetBrains Mono", "Space Grotesk", "Inter", monospace',
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '3.5rem',
      fontWeight: 700,
      lineHeight: 1.1,
      letterSpacing: '-0.02em'
    },
    h2: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2
    },
    h3: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5
    }
  },
  shape: {
    borderRadius: 12
  },
  shadows: [
    'none',
    `0 1px 3px 0 ${matrixColors.effects.glow.subtle}`,
    `0 4px 6px -1px ${matrixColors.effects.glow.subtle}`,
    `0 10px 15px -3px ${matrixColors.effects.glow.secondary}`,
    `0 20px 25px -5px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`,
    `0 25px 50px -12px ${matrixColors.effects.glow.primary}`
  ]
});

export default theme;