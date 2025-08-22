import React from 'react';
import { BrowserRouter } from 'react-router';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import CodeCrestLanding from './pages/CodeCrestLanding';
import theme from './theme/theme';

// Mock store for preview
const mockStore = {
  getState: () => ({
    auth: {
      isAuthenticated: false,
      user: null,
      loading: false
    }
  }),
  subscribe: () => {},
  dispatch: () => {}
} as any;

const App: React.FC = () => {
  return (
    <Provider store={mockStore}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <CodeCrestLanding />
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;