import React from 'react';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import Header from './components/Header';
import theme from './theme/theme';

// Mock Redux store for preview
const mockStore = {
  getState: () => ({
    auth: {
      user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'user'
      },
      isAuthenticated: true
    }
  }),
  subscribe: () => {},
  dispatch: () => {}
};

const createEmotionCache = () => {
  return createCache({
    key: "mui",
    prepend: true,
  });
};

const emotionCache = createEmotionCache();

const HeaderPreview: React.FC = () => {
  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={mockStore as any}>
          <BrowserRouter>
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
              <Header />
              
              {/* Content to show header visibility */}
              <Box sx={{ 
                pt: 10, 
                px: 3, 
                minHeight: '200vh',
                background: theme => theme.palette.mode === 'dark' 
                  ? 'linear-gradient(135deg, rgba(10, 14, 10, 1) 0%, rgba(15, 27, 15, 1) 50%, rgba(21, 39, 26, 1) 100%)'
                  : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 50%, #e2e8f0 100%)'
              }}>
                <Box sx={{ 
                  maxWidth: 1200, 
                  mx: 'auto',
                  py: 8,
                  textAlign: 'center'
                }}>
                  <Box sx={{ 
                    typography: 'h2', 
                    mb: 4,
                    color: 'text.primary',
                    textShadow: theme => theme.palette.mode === 'dark' 
                      ? '0 0 20px rgba(0, 255, 159, 0.3)' 
                      : 'none'
                  }}>
                    Header Fixed - Matrix Theme
                  </Box>
                  
                  <Box sx={{ 
                    typography: 'body1', 
                    mb: 6,
                    color: 'text.secondary',
                    maxWidth: 600,
                    mx: 'auto',
                    lineHeight: 1.8
                  }}>
                    The header now uses proper matrix theme colors with improved opacity and glassmorphism effects. 
                    Scroll to see the fixed header behavior with enhanced visibility and color matching.
                  </Box>

                  {/* Demo content blocks */}
                  {[1, 2, 3, 4, 5].map((item) => (
                    <Box
                      key={item}
                      sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 3,
                        background: theme => theme.palette.mode === 'dark'
                          ? 'rgba(0, 255, 159, 0.05)'
                          : 'rgba(255, 255, 255, 0.8)',
                        border: theme => theme.palette.mode === 'dark'
                          ? '1px solid rgba(0, 255, 159, 0.2)'
                          : '1px solid rgba(203, 213, 225, 0.3)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: theme => theme.palette.mode === 'dark'
                          ? '0 8px 32px rgba(0, 255, 159, 0.1)'
                          : '0 8px 32px rgba(0, 0, 0, 0.05)',
                      }}
                    >
                      <Box sx={{ 
                        typography: 'h4', 
                        mb: 2,
                        color: 'primary.main'
                      }}>
                        Demo Section {item}
                      </Box>
                      <Box sx={{ 
                        typography: 'body2', 
                        color: 'text.secondary'
                      }}>
                        This is demo content to showcase the fixed header with proper matrix theme integration.
                        The header maintains visibility and uses consistent colors throughout the interface.
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </BrowserRouter>
        </Provider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default HeaderPreview;