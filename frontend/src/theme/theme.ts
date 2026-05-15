import { createTheme } from '@mui/material/styles';
import { ccColors } from './colors';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: ccColors.primary.main,
      light: ccColors.primary.light,
      dark: ccColors.primary.dark,
    },
    secondary: {
      main: ccColors.accent.main,
      light: ccColors.accent.light,
      dark: ccColors.accent.dark,
    },
    background: {
      default: ccColors.background.primary,
      paper: ccColors.background.card,
    },
    text: {
      primary: ccColors.text.primary,
      secondary: ccColors.text.secondary,
    },
    success: {
      main: ccColors.status.success,
      light: ccColors.status.successLight,
    },
    warning: {
      main: ccColors.status.warning,
      light: ccColors.status.warningLight,
    },
    error: {
      main: ccColors.status.error,
      light: ccColors.status.errorLight,
    },
    info: {
      main: ccColors.status.info,
      light: ccColors.status.infoLight,
    },
    divider: ccColors.border.default,
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
      900: '#0f172a',
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    h1: { fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 },
    h2: { fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15 },
    h3: { fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2 },
    h4: { fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25 },
    h5: { fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.3 },
    h6: { fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.35 },
    subtitle1: { fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontWeight: 500, lineHeight: 1.5 },
    body1: { lineHeight: 1.6 },
    body2: { lineHeight: 1.5, color: ccColors.text.secondary },
    button: { fontWeight: 600, letterSpacing: '0.01em' },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: ccColors.background.primary,
          color: ccColors.text.primary,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          padding: '8px 20px',
        },
        contained: {
          boxShadow: `0 2px 8px ${ccColors.primary.glow}`,
          '&:hover': {
            boxShadow: `0 4px 16px ${ccColors.primary.glow}`,
          },
        },
        outlined: {
          borderColor: ccColors.border.hover,
          '&:hover': {
            borderColor: ccColors.primary.main,
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: ccColors.background.card,
          border: `1px solid ${ccColors.border.default}`,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: ccColors.background.card,
          border: `1px solid ${ccColors.border.default}`,
          borderRadius: 14,
          transition: 'all 0.25s ease',
          '&:hover': {
            backgroundColor: ccColors.background.cardHover,
            borderColor: ccColors.border.hover,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4), 0 6px 10px rgba(0, 0, 0, 0.2)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: ccColors.background.input,
            '& fieldset': {
              borderColor: ccColors.border.default,
            },
            '&:hover fieldset': {
              borderColor: ccColors.border.hover,
            },
            '&.Mui-focused fieldset': {
              borderColor: ccColors.primary.main,
              boxShadow: `0 0 0 3px ${ccColors.primary.glow}`,
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: ccColors.background.input,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: ccColors.background.elevated,
          border: `1px solid ${ccColors.border.default}`,
          backdropFilter: 'blur(16px)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(99, 102, 241, 0.08)',
          },
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: ccColors.border.default,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: ccColors.primary.main,
          fontWeight: 600,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: ccColors.background.secondary,
          borderColor: ccColors.border.default,
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: ccColors.primary.main,
        },
      },
    },
  },
});

export default theme;
