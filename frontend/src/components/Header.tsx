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
import { NavLink, Link as RouterLink, useNavigate } from 'react-router-dom';
import ListItemButton from '@mui/material/ListItemButton';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import DataObjectIcon from '@mui/icons-material/DataObject';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { logoutUser } from '../authSlice';
import AuthModal from './AuthModal';
import { useThrottledNavigation } from '../utils/navigationUtils';

const GlassAppBar = styled(AppBar)(() => ({
  background: 'rgba(11, 15, 26, 0.85)',
  backdropFilter: 'blur(20px) saturate(180%)',
  WebkitBackdropFilter: 'blur(20px) saturate(180%)',
  borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease-in-out',
}));

const SearchField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(30, 41, 59, 0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '10px',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease-in-out',
    '& fieldset': {
      borderColor: 'rgba(148, 163, 184, 0.12)',
      transition: 'all 0.3s ease-in-out',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(148, 163, 184, 0.25)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.15)',
    },
  },
  '& .MuiInputBase-input': {
    color: '#f1f5f9',
    '&::placeholder': {
      color: '#64748b',
      opacity: 1,
    },
  },
}));

const LogoButton = styled(Button)(() => ({
  fontWeight: 700,
  fontSize: '1.4rem',
  textTransform: 'none',
  background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  transition: 'all 0.3s ease-in-out',
  letterSpacing: '-0.02em',
  fontFamily: '"Inter", system-ui, sans-serif',
  '&:hover': {
    background: 'linear-gradient(135deg, #818cf8 0%, #06b6d4 100%)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    transform: 'scale(1.02)',
    backgroundColor: 'transparent',
  },
}));

const Header: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [searchQuery, setSearchQuery] = useState('');

  const dispatch = useDispatch() as any;
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);
  const { throttledNavigate, clearNavigationTimeout } = useThrottledNavigation();

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

  const getInitials = (firstName?: string, lastName?: string) => {
    const firstLetter = (firstName && firstName.length > 0) ? firstName.charAt(0) : 'U';
    const lastLetter = (lastName && lastName.length > 0) ? lastName.charAt(0) : '';
    return `${firstLetter}${lastLetter}`.toUpperCase();
  };

  const mainNav = [
    { label: 'Problems', to: '/problems', hash: 'problems-section' },
    { label: 'Contest', to: '/contest' },
    { label: 'Interview', to: '/interview' },
  ] as const;

  const drawer = (
    <Stack
      sx={{
        width: 280,
        p: 2.5,
        background: '#111827',
        height: '100%',
        fontFamily: '"Inter", system-ui, sans-serif',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <DataObjectIcon sx={{ color: '#6366f1', fontSize: '1.5rem' }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: '"Inter", system-ui, sans-serif',
          }}
        >
          CodeCrest
        </Typography>
      </Stack>

      <Box component="form" onSubmit={handleSearchSubmit} sx={{ mb: 2 }}>
        <SearchField
          placeholder="Search problems..."
          size="small"
          value={searchQuery}
          onChange={handleSearchChange}
          fullWidth
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ color: '#64748b', mr: 1, fontSize: '1.1rem' }} />
            ),
            endAdornment: (
              <IconButton
                type="submit"
                size="small"
                disabled={!searchQuery.trim()}
                sx={{
                  color: searchQuery.trim() ? '#6366f1' : '#475569',
                }}
              >
                <SearchIcon fontSize="small" />
              </IconButton>
            ),
          }}
        />
      </Box>

      <List sx={{ flex: 1 }}>
        {mainNav.map(({ label, to, ...rest }) => {
          const href = 'hash' in rest && rest.hash ? `${to}#${rest.hash}` : to;
          const pathOnly = href.split('#')[0];
          const endNav =
            pathOnly === '/interview' || pathOnly === '/problems';
          return (
          <ListItem key={href} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={href}
              end={endNav}
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: '8px',
                px: 1.5,
                py: 1,
                color: '#94a3b8',
                '&:hover': { background: 'rgba(99, 102, 241, 0.08)' },
                '&.active': { color: '#818cf8', background: 'rgba(99, 102, 241, 0.08)' },
              }}
            >
              <ListItemText
                primary={label}
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    fontFamily: '"Inter", system-ui, sans-serif',
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.12)', my: 2 }} />

      {!isAuthenticated ? (
        <Stack spacing={1.5}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleSignInClick}
            sx={{
              color: '#94a3b8',
              borderColor: 'rgba(148, 163, 184, 0.25)',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500,
              py: 1,
              fontFamily: '"Inter", system-ui, sans-serif',
              '&:hover': {
                borderColor: '#6366f1',
                color: '#818cf8',
                background: 'rgba(99, 102, 241, 0.08)',
              },
            }}
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSignUpClick}
            sx={{
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              py: 1,
              fontFamily: '"Inter", system-ui, sans-serif',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
                boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
              },
            }}
          >
            Sign Up
          </Button>
        </Stack>
      ) : (
        <Box>
          <Typography
            variant="body2"
            sx={{
              mb: 1.5,
              color: '#64748b',
              fontFamily: '"Inter", system-ui, sans-serif',
            }}
          >
            Welcome, {user?.firstName || 'User'}
          </Typography>
          {user?.role === 'admin' && (
            <ListItemButton
              component={RouterLink}
              to="/admin"
              onClick={() => setMobileOpen(false)}
              sx={{
                borderRadius: '8px',
                mb: 1,
                color: '#94a3b8',
                '&:hover': { background: 'rgba(99, 102, 241, 0.08)' },
                '&.active': { color: '#818cf8', background: 'rgba(99, 102, 241, 0.08)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <AdminPanelSettingsIcon fontSize="small" sx={{ color: '#64748b' }} />
              </ListItemIcon>
              <ListItemText
                primary="Admin Panel"
                sx={{
                  '& .MuiListItemText-primary': {
                    fontWeight: 500,
                    fontSize: '0.95rem',
                    fontFamily: '"Inter", system-ui, sans-serif',
                  },
                }}
              />
            </ListItemButton>
          )}
          <Button
            variant="outlined"
            fullWidth
            onClick={handleLogout}
            sx={{
              color: '#ef4444',
              borderColor: 'rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 500,
              fontFamily: '"Inter", system-ui, sans-serif',
              '&:hover': {
                borderColor: '#ef4444',
                background: 'rgba(239, 68, 68, 0.08)',
              },
            }}
          >
            Logout
          </Button>
        </Box>
      )}
    </Stack>
  );

  return (
    <>
      <GlassAppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (t) => t.zIndex.appBar,
          isolation: 'isolate',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              py: 0.75,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr auto', md: 'auto minmax(0, 1fr) auto' },
              alignItems: 'center',
              gap: { xs: 1, md: 2 },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0 }}>
              <DataObjectIcon
                sx={{
                  color: '#6366f1',
                  fontSize: '1.75rem',
                  filter: 'drop-shadow(0 0 6px rgba(99, 102, 241, 0.4))',
                }}
              />
              <LogoButton component={RouterLink} to="/" disableRipple>
                CodeCrest
              </LogoButton>
            </Stack>

            {!isMobile && (
              <Stack
                direction="row"
                spacing={0.75}
                component="nav"
                aria-label="Main"
                justifyContent="center"
                flexWrap="wrap"
                sx={{ minWidth: 0 }}
              >
                {mainNav.map(({ label, to, ...rest }) => {
                  const href =
                    'hash' in rest && rest.hash ? `${to}#${rest.hash}` : to;
                  const pathOnly = href.split('#')[0];
                  const endNav =
                    pathOnly === '/interview' || pathOnly === '/problems';
                  return (
                    <Button
                      key={href}
                      component={NavLink}
                      to={href}
                      end={endNav}
                      color="inherit"
                      sx={{
                        textDecoration: 'none',
                        color: '#94a3b8',
                        fontWeight: 500,
                        textTransform: 'none',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontFamily: '"Inter", system-ui, sans-serif',
                        px: 1.75,
                        py: 0.75,
                        minWidth: 'auto',
                        position: 'relative',
                        '&.active': {
                          color: '#a5b4fc',
                          background: 'rgba(99, 102, 241, 0.1)',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 2,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '52%',
                            height: 2,
                            borderRadius: 1,
                            background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
                          },
                        },
                        '&:hover': {
                          background: 'rgba(99, 102, 241, 0.12)',
                          color: '#c7d2fe',
                        },
                      }}
                    >
                      {label}
                    </Button>
                  );
                })}
              </Stack>
            )}

            <Stack direction="row" alignItems="center" spacing={2} justifyContent="flex-end" sx={{ minWidth: 0 }}>
              {!isMobile && (
                <Box component="form" onSubmit={handleSearchSubmit}>
                  <SearchField
                    placeholder="Search problems..."
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <SearchIcon
                          sx={{ color: '#64748b', mr: 1, fontSize: '1.1rem' }}
                        />
                      ),
                      endAdornment: (
                        <IconButton
                          type="submit"
                          size="small"
                          disabled={!searchQuery.trim()}
                          sx={{
                            color: searchQuery.trim() ? '#6366f1' : '#475569',
                            '&:hover': {
                              color: '#818cf8',
                            },
                          }}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      ),
                    }}
                    sx={{ width: 280 }}
                  />
                </Box>
              )}

              {isMobile ? (
                <IconButton
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ color: '#94a3b8' }}
                >
                  <MenuIcon />
                </IconButton>
              ) : (
                <Stack direction="row" spacing={1.5} alignItems="center">
                  {!isAuthenticated ? (
                    <>
                      <Button
                        variant="outlined"
                        onClick={handleSignInClick}
                        sx={{
                          color: '#94a3b8',
                          borderColor: 'rgba(148, 163, 184, 0.25)',
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: 500,
                          fontSize: '0.875rem',
                          px: 2.5,
                          fontFamily: '"Inter", system-ui, sans-serif',
                          '&:hover': {
                            borderColor: '#6366f1',
                            color: '#818cf8',
                            background: 'rgba(99, 102, 241, 0.08)',
                          },
                        }}
                      >
                        Sign In
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleSignUpClick}
                        sx={{
                          background:
                            'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                          borderRadius: '10px',
                          textTransform: 'none',
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          px: 2.5,
                          fontFamily: '"Inter", system-ui, sans-serif',
                          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                          '&:hover': {
                            background:
                              'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
                            boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                          },
                        }}
                      >
                        Sign Up
                      </Button>
                    </>
                  ) : (
                    <IconButton onClick={handleProfileClick} sx={{ p: 0.5 }}>
                      <Avatar
                        sx={{
                          width: 34,
                          height: 34,
                          background:
                            'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          fontFamily: '"Inter", system-ui, sans-serif',
                        }}
                      >
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

      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            background: '#111827',
            borderLeft: '1px solid rgba(148, 163, 184, 0.08)',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            background: '#1e293b',
            border: '1px solid rgba(148, 163, 184, 0.12)',
            backdropFilter: 'blur(20px)',
            mt: 1.5,
            minWidth: 220,
            borderRadius: '14px',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.4)',
            overflow: 'visible',
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: -6,
              right: 18,
              width: 12,
              height: 12,
              background: '#1e293b',
              transform: 'rotate(45deg)',
              borderLeft: '1px solid rgba(148, 163, 184, 0.12)',
              borderTop: '1px solid rgba(148, 163, 184, 0.12)',
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2.5, py: 2 }}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: '#f1f5f9',
              fontFamily: '"Inter", system-ui, sans-serif',
            }}
          >
            {(user?.firstName || '')} {(user?.lastName || '')}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              fontSize: '0.8rem',
              fontFamily: '"Inter", system-ui, sans-serif',
            }}
          >
            {user?.email || ''}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.08)' }} />

        <MenuItem
          onClick={handleClose}
          sx={{
            py: 1.5,
            px: 2.5,
            color: '#94a3b8',
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: '0.9rem',
            '&:hover': {
              background: 'rgba(99, 102, 241, 0.08)',
              color: '#818cf8',
            },
          }}
        >
          <ListItemIcon>
            <PersonIcon fontSize="small" sx={{ color: '#64748b' }} />
          </ListItemIcon>
          Profile
        </MenuItem>

        {user?.role === 'admin' && (
          <MenuItem
            onClick={() => {
              handleClose();
              queueMicrotask(() => navigate('/admin'));
            }}
            sx={{
              py: 1.5,
              px: 2.5,
              color: '#94a3b8',
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: '0.9rem',
              textDecoration: 'none',
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.08)',
                color: '#818cf8',
              },
            }}
          >
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" sx={{ color: '#64748b' }} />
            </ListItemIcon>
            Admin Panel
          </MenuItem>
        )}

        <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.08)' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{
            py: 1.5,
            px: 2.5,
            color: '#ef4444',
            fontFamily: '"Inter", system-ui, sans-serif',
            fontSize: '0.9rem',
            '&:hover': {
              background: 'rgba(239, 68, 68, 0.08)',
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon fontSize="small" sx={{ color: '#ef4444' }} />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <AuthModal
        open={authModalOpen}
        onClose={handleAuthModalClose}
        initialMode={authMode}
      />
    </>
  );
};

export default Header;
