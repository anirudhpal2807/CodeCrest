import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import theme from './theme/theme';
import HeroSection from './components/HeroSection';

const createEmotionCache = () => {
  return createCache({
    key: "mui",
    prepend: true,
  });
};

const emotionCache = createEmotionCache();

const CodeCrestApp: React.FC = () => {
  const handleStartCoding = () => {
    console.log('Start coding clicked');
  };

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <HeroSection onStartCoding={handleStartCoding} />
      </ThemeProvider>
    </CacheProvider>
  );
};

export default CodeCrestApp;