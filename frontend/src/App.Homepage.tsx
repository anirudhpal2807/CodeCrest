import React, { useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider, useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store/store';
import theme from './theme/theme';
import ModernHomepage from './pages/ModernHomepage';
import { checkAuth } from './authSlice';

// Component to handle authentication check
const AuthWrapper: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return <ModernHomepage />;
};

const AppHomepage: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthWrapper />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default AppHomepage;