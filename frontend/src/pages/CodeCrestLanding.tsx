import React from 'react';
import { Box, ThemeProvider } from '@mui/material';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import MatrixHeroSection from '../components/MatrixHeroSection';
import StatisticsSection from '../components/StatisticsSection';
import theme from '../theme/theme';

const CodeCrestLanding: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);

  const handleSignIn = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  const handleStartCoding = () => {
    // Always navigate to problems page
    navigate('/problems');
  };

  const handleExploreProblems = () => {
    // Always navigate to problems page
    navigate('/problems');
  };

  const handleLogout = () => {
    // This will be handled by the parent component
  };

  const handleSearch = (query: string) => {
    // Handle search functionality
    console.log('Search query:', query);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', backgroundColor: '#0a0e0a' }}>
        <Header />
        
        <MatrixHeroSection
          onStartCoding={handleStartCoding}
          onExploreProblems={handleExploreProblems}
        />
        
        <StatisticsSection
          problems={2000}
          users="500K"
          successRate={95}
        />
      </Box>
    </ThemeProvider>
  );
};

export default CodeCrestLanding;