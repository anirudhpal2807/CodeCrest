import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ProblemCreationForm } from './components/problemCreation/ProblemCreationForm';
import { ProblemFormData } from './types/problemCreation';
import { mockRootProps } from './utils/problemCreationMockData';
import theme from './theme/theme';

function App() {
  const handleSubmit = async (data: ProblemFormData) => {
    console.log('Problem data submitted:', data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    alert('Problem created successfully!');
  };

  const handlePreview = (data: ProblemFormData) => {
    console.log('Previewing problem:', data);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ProblemCreationForm
        initialFormData={mockRootProps.initialFormData}
        onSubmit={handleSubmit}
        onPreview={handlePreview}
      />
    </ThemeProvider>
  );
}

export default App;