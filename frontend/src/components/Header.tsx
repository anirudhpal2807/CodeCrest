import React, { useState, useEffect } from 'react';
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
import { useThrottledNavigation } from '../utils/navigationUtils';

const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: 'rgba(15, 27, 15, 0.95)',
  backdropFilter: 'blur(20px)',
  borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(0, 255, 159, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
  boxShadow: theme.palette.mode === 'dark' 
    ? '0 8px 32px rgba(0, 255, 159, 0.15)' 
    : '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease-in-out',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: theme.palette.mode === 'dark' 
      ? 'linear-gradient(135deg, rgba(0, 255, 159, 0.05) 0%, rgba(0, 212, 255, 0.02) 100%)'
      : 'linear-gradient(135deg, rgba(103, 126, 234, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)',
    pointerEvents: 'none',
    zIndex: -1
  }
}));

const SearchField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(0, 255, 159, 0.08)' 
      : 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    transition: 'all 0.3s ease-in-out',
    '& fieldset': {
      borderColor: theme.palette.mode === 'dark' 
        ? 'rgba(0, 255, 159, 0.3)' 
        : 'rgba(203, 213, 225, 0.5)',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.mode === 'dark' 
        ? 'rgba(0, 255, 159, 0.5)' 
        : theme.palette.primary.light,
      boxShadow: theme.palette.mode === 'dark' 
        ? '0 0 10px rgba(0, 255, 159, 0.2)' 
        : '0 0 10px rgba(103, 126, 234, 0.2)',
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: theme.palette.mode === 'dark' 
        ? '0 0 15px rgba(0, 255, 159, 0.3)' 
        : '0 0 15px rgba(103, 126, 234, 0.3)',
    }
  },
  '& .MuiInputBase-input': {
    color: theme.palette.text.primary,
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.8
    }
  }
}));

const LogoButton = styled(Button)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 700,
  fontSize: '1.5rem',
  textTransform: 'none',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(0, 255, 159, 0.1)' 
      : 'rgba(103, 126, 234, 0.1)',
    transform: 'scale(1.02)',
    textShadow: theme.palette.mode === 'dark' 
      ? '0 0 10px rgba(0, 255, 159, 0.5)' 
      : '0 0 10px rgba(103, 126, 234, 0.3)',
  }
}));

const NavButton = styled(Button)(({ theme }) => ({
  color: '#ffffff',
  fontWeight: 500,
  textTransform: 'none',
  padding: '8px 16px',
  borderRadius: '8px',
  position: 'relative',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    background: theme.palette.mode === 'dark' 
      ? 'rgba(0, 255, 159, 0.08)' 
      : 'rgba(103, 126, 234, 0.08)',
    color: theme.palette.primary.main,
    transform: 'translateY(-1px)',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      height: '2px',
      background: theme.palette.primary.main,
      borderRadius: '1px',
      opacity: theme.palette.mode === 'dark' ? 0.8 : 0.6,
    }
  }
}));

const Header: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch() as any;
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const { throttledNavigate, clearNavigationTimeout, forceNavigate } = useThrottledNavigation();

  // Cleanup navigation timeout on unmount
  useEffect(() => {
    return () => {
      clearNavigationTimeout();
    };
  }, [clearNavigationTimeout]);

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
    throttledNavigate('/');
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      throttledNavigate(`/problems?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleNavItemClick = (item: string) => {
    switch (item.toLowerCase()) {
      case 'problems':
        throttledNavigate('/problems');
        break;
      case 'contest':
        throttledNavigate('/contest');
        break;
      case 'discuss':
        throttledNavigate('/discuss');
        break;
      case 'interview':
        throttledNavigate('/interview');
        break;
      default:
        break;
    }
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
      
      {/* Mobile Search */}
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 2 }}>
        <SearchField
          placeholder="Search problems..."
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            ),
            endAdornment: (
              <IconButton
                type="submit"
                size="small"
                disabled={!searchQuery.trim()}
                sx={{ 
                  color: searchQuery.trim() ? 'primary.main' : 'text.disabled'
                }}
              >
                <SearchIcon />
              </IconButton>
            ),
          }}
        />
      </Box>
      
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item} 
            sx={{ px: 0, cursor: 'pointer' }}
            onClick={() => {
              handleNavItemClick(item);
              setMobileOpen(false);
            }}
          >
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
          <Button 
            variant="outlined" 
            color="primary" 
            fullWidth 
            onClick={handleSignInClick}
          >
            Sign In
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            fullWidth 
            onClick={handleSignUpClick}
          >
            Sign Up
          </Button>
        </Stack>
      ) : (
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
            Welcome, {user?.firstName || 'User'}
          </Typography>
          <Button 
            variant="outlined" 
            color="error" 
            fullWidth 
            onClick={handleLogout}
          >
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
                  <NavButton key={item} onClick={() => handleNavItemClick(item)}>
                    {item}
                  </NavButton>
                ))}
              </Stack>
            )}

            {/* Search and User Actions */}
            <Stack direction="row" alignItems="center" spacing={2}>
              {!isMobile && (
                <Box component="form" onSubmit={handleSearchSubmit}>
                  <SearchField
                    placeholder="Search problems..."
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
                      ),
                      endAdornment: (
                        <IconButton
                          type="submit"
                          size="small"
                          disabled={!searchQuery.trim()}
                          sx={{ 
                            color: searchQuery.trim() ? 'primary.main' : 'text.disabled',
                            '&:hover': {
                              color: 'primary.main'
                            }
                          }}
                        >
                          <SearchIcon />
                        </IconButton>
                      ),
                    }}
                    sx={{ width: 300 }}
                  />
                </Box>
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
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        onClick={handleSignInClick}
                      >
                        Sign In
                      </Button>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSignUpClick}
                      >
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
            bgcolor: theme => theme.palette.mode === 'dark' 
              ? 'rgba(15, 27, 15, 0.95)' 
              : 'background.paper',
            border: theme => theme.palette.mode === 'dark' 
              ? '1px solid rgba(0, 255, 159, 0.2)' 
              : '1px solid rgba(203, 213, 225, 0.3)',
            backdropFilter: 'blur(20px)',
            mt: 1,
            minWidth: 200,
            borderRadius: 2,
            boxShadow: theme => theme.palette.mode === 'dark' 
              ? '0 8px 32px rgba(0, 255, 159, 0.15)' 
              : '0 8px 32px rgba(0, 0, 0, 0.1)',
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
            onClick={() => {
              handleClose();
              
              // Use forceNavigate for admin panel to bypass throttling
              setTimeout(() => {
                forceNavigate('/admin');
              }, 200);
            }}
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