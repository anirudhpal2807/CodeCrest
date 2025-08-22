import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  TextField,
  Stack,
  Container,
  Avatar,
  Menu,
  MenuItem,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
  ListItemIcon
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import DataObjectIcon from '@mui/icons-material/DataObject';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { logoutUser } from '../authSlice';
import AuthModal from './AuthModal';

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(26, 26, 46, 0.8)',
  backdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    '& fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    }
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 1
    }
  }
}));

const LogoButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: '1.5rem',
  textTransform: 'none',
  '&:hover': {
    background: 'rgba(255, 107, 53, 0.1)'
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 500,
  textTransform: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.05)',
    color: theme.palette.primary.main
  }
}));

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const dispatch = useDispatch() as any;
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSignInClick = () => {
    setAuthMode('signin');
    setAuthModalOpen(true);
  };

  const handleSignUpClick = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
  };

  const handleAuthModalClose = () => {
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    handleClose();
    navigate('/');
  };

  const getInitials = (firstName?: string, lastName?: string) => {
    const firstLetter = (firstName && firstName.length > 0) ? firstName.charAt(0) : 'U';
    const lastLetter = (lastName && lastName.length > 0) ? lastName.charAt(0) : '';
    return `${firstLetter}${lastLetter}`.toUpperCase();
  };

  const navItems = ['Problems', 'Contest', 'Discuss', 'Interview'];

  const drawer = (
    <Stack sx={{ width: 250, p: 2, bgcolor: 'background.paper', height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
        CodeCrest
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item} sx={{ px: 0 }}>
            <ListItemText 
              primary={item} 
              sx={{ 
                '& .MuiListItemText-primary': { 
                  color: 'text.primary',
                  fontWeight: 500
                } 
              }} 
            />
          </ListItem>
        ))}
      </List>
      {!isAuthenticated ? (
        <Stack spacing={2} sx={{ mt: 'auto' }}>
          <Button variant="outlined" color="primary" fullWidth onClick={handleSignInClick}>
            Sign In
          </Button>
          <Button variant="contained" color="primary" fullWidth onClick={handleSignUpClick}>
            Sign Up
          </Button>
        </Stack>
      ) : (
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            Welcome, {user?.firstName || 'User'}
          </Typography>
          <Button variant="outlined" color="error" fullWidth onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      )}
    </Stack>
  );

  return (
    <>
      <GlassAppBar position="fixed" elevation={0}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            {/* Logo */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <DataObjectIcon sx={{ color: 'primary.main', fontSize: '2rem' }} />
              <LogoButton>
                CodeCrest
              </LogoButton>
            </Stack>

            {/* Desktop Navigation */}
            {!isMobile && (
              <Stack direction="row" spacing={1}>
                {navItems.map((item) => (
                  <NavButton key={item}>
                    {item}
                  </NavButton>
                ))}
              </Stack>
            )}

            {/* Search and User Actions */}
            <Stack direction="row" alignItems="center" spacing={2}>
              {!isMobile && (
                <SearchField
                  placeholder="Search problems..."
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                    ),
                  }}
                  sx={{ width: 300 }}
                />
              )}

              {isMobile ? (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              ) : (
                <Stack direction="row" spacing={1}>
                  {!isAuthenticated ? (
                    <>
                      <Button variant="outlined" color="primary" onClick={handleSignInClick}>
                        Sign In
                      </Button>
                      <Button variant="contained" color="primary" onClick={handleSignUpClick}>
                        Sign Up
                      </Button>
                    </>
                  ) : (
                    <IconButton onClick={handleProfileClick}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                        {getInitials(user?.firstName, user?.lastName)}
                      </Avatar>
                    </IconButton>
                  )}
                </Stack>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </GlassAppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {drawer}
      </Drawer>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {(user?.firstName || '')} {(user?.lastName || '')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email || ''}
          </Typography>
        </Box>
        
        <Divider />
        
        <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        
        {user?.role === 'admin' && (
          <MenuItem 
            component={NavLink} 
            to="/admin" 
            onClick={handleClose}
            sx={{ py: 1.5 }}
          >
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" />
            </ListItemIcon>
            Admin Panel
          </MenuItem>
        )}
        
        <Divider />
        
        <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={handleAuthModalClose}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;