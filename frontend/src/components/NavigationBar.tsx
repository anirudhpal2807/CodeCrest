import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  TextField,
  Button,
  Box,
  InputAdornment,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavLink } from 'react-router';
import SearchIcon from '@mui/icons-material/Search';
import Header from './Header';
import { matrixColors } from '../theme/colors';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: matrixColors.background.overlay,
  backdropFilter: 'blur(10px)',
  borderBottom: `1px solid ${matrixColors.border.secondary}`,
  boxShadow: `0 2px 20px ${matrixColors.effects.glow.subtle}`,
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontFamily: '"JetBrains Mono", "Space Grotesk", monospace',
  fontWeight: 700,
  color: matrixColors.text.primary,
  textDecoration: 'none',
  fontSize: '1.5rem',
  letterSpacing: '2px',
  textShadow: `0 0 10px ${matrixColors.effects.glow.primary}`,
  '&:hover': {
    textShadow: `0 0 20px ${matrixColors.effects.glow.strong}`,
  }
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: matrixColors.background.glass,
    borderRadius: '25px',
    color: matrixColors.text.primary,
    '& fieldset': {
      borderColor: matrixColors.border.primary,
    },
    '&:hover fieldset': {
      borderColor: matrixColors.border.hover,
    },
    '&.Mui-focused fieldset': {
      borderColor: matrixColors.border.focus,
      boxShadow: matrixColors.effects.shadow.primary,
    },
  },
  '& .MuiInputBase-input': {
    color: matrixColors.text.primary,
    '&::placeholder': {
      color: matrixColors.text.muted,
    },
  },
}));

const AuthButton = styled(Button)(({ theme }) => ({
  borderRadius: '20px',
  padding: '8px 20px',
  fontWeight: 600,
  textTransform: 'none',
  fontFamily: '"Space Grotesk", sans-serif',
}));

const SignInButton = styled(AuthButton)(({ theme }) => ({
  color: matrixColors.text.primary,
  borderColor: matrixColors.border.focus,
  '&:hover': {
    backgroundColor: matrixColors.states.hover.background,
    borderColor: matrixColors.border.focus,
    boxShadow: `0 0 15px ${matrixColors.effects.glow.secondary}`,
  },
}));

const SignUpButton = styled(AuthButton)(({ theme }) => ({
  backgroundColor: matrixColors.primary.main,
  color: matrixColors.background.primary,
  '&:hover': {
    backgroundColor: matrixColors.primary.light,
    boxShadow: `0 0 20px ${matrixColors.effects.glow.primary}`,
  },
}));

interface NavigationBarProps {
  isAuthenticated?: boolean;
  user?: any;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onLogout?: () => void;
  onSearch?: (query: string) => void;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  isAuthenticated = false,
  user,
  onSignIn,
  onSignUp,
  onLogout,
  onSearch
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  return (
    <StyledAppBar position="fixed" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <NavLink to="/" style={{ textDecoration: 'none' }}>
          <LogoText variant="h5">
            CodeCrest
          </LogoText>
        </NavLink>

        {/* Search Bar */}
        <Box sx={{ flex: 1, maxWidth: 400, mx: 4 }}>
          <SearchField
            fullWidth
            placeholder="Search problems..."
            value={searchQuery}
            onChange={handleSearchChange}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: matrixColors.text.muted }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Auth Section */}
        <Header />
      </Toolbar>
    </StyledAppBar>
  );
};

export default NavigationBar;