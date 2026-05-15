import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  Tabs,
  Tab,
  Stack
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../authSlice';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const StyledDialog = styled(Dialog)(() => ({
  '& .MuiDialog-paper': {
    background: '#151c2c',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(148, 163, 184, 0.12)',
    borderRadius: '20px',
    minWidth: '420px',
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5), 0 0 1px rgba(148, 163, 184, 0.1)',
  },
  '& .MuiBackdrop-root': {
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(8px)',
  },
}));

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(30, 41, 59, 0.5)',
    borderRadius: '10px',
    fontSize: '0.95rem',
    fontFamily: '"Inter", system-ui, sans-serif',
    transition: 'all 0.25s ease-in-out',
    '& fieldset': {
      borderColor: 'rgba(148, 163, 184, 0.12)',
      transition: 'all 0.25s ease-in-out',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(148, 163, 184, 0.25)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#6366f1',
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.12)',
    },
  },
  '& .MuiInputBase-input': {
    color: '#f1f5f9',
    '&::placeholder': {
      color: '#64748b',
      opacity: 1,
    },
  },
  '& .MuiInputLabel-root': {
    color: '#64748b',
    fontFamily: '"Inter", system-ui, sans-serif',
    '&.Mui-focused': {
      color: '#818cf8',
    },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: '"Inter", system-ui, sans-serif',
  },
}));

const loginSchema = z.object({
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode: 'signin' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, initialMode }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch() as any;
  const { isAuthenticated, loading, error } = useSelector((state: any) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(mode === 'signin' ? loginSchema : signupSchema)
  });

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    if (!open || !isAuthenticated) return;
    // Close modal only when user completes auth from this dialog.
    // Do NOT navigate('/') here — Header keeps AuthModal mounted with open=false;
    // an unconditional navigate would hijack routes like /interview, /contest, etc.
    onClose();
  }, [open, isAuthenticated, onClose]);

  const handleModeChange = (event: React.SyntheticEvent, newMode: 'signin' | 'signup') => {
    setMode(newMode);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: any) => {
    if (mode === 'signin') {
      dispatch(loginUser(data));
    } else {
      dispatch(registerUser(data));
    }
  };

  const password = watch('password');

  return (
    <StyledDialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 1,
          pt: 3,
          px: 3.5,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: '"Inter", system-ui, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          CodeCrest
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: '#64748b',
            transition: 'all 0.2s ease',
            '&:hover': {
              color: '#94a3b8',
              background: 'rgba(148, 163, 184, 0.08)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0, px: 3.5, pb: 3.5 }}>
        <Tabs
          value={mode}
          onChange={handleModeChange}
          sx={{
            mb: 3,
            '& .MuiTab-root': {
              color: '#64748b',
              fontWeight: 500,
              textTransform: 'none',
              fontSize: '0.95rem',
              fontFamily: '"Inter", system-ui, sans-serif',
              transition: 'color 0.2s ease',
              '&.Mui-selected': {
                color: '#818cf8',
              },
            },
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(90deg, #6366f1, #06b6d4)',
              height: '2px',
              borderRadius: '1px',
            },
          }}
        >
          <Tab label="Sign In" value="signin" />
          <Tab label="Sign Up" value="signup" />
        </Tabs>

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2.5,
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              color: '#fca5a5',
              fontFamily: '"Inter", system-ui, sans-serif',
              '& .MuiAlert-icon': {
                color: '#ef4444',
              },
            }}
          >
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2.5}>
            {mode === 'signup' && (
              <>
                <StyledTextField
                  label="First Name"
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message as string}
                  fullWidth
                />
                <StyledTextField
                  label="Last Name"
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message as string}
                  fullWidth
                />
              </>
            )}

            <StyledTextField
              label="Email"
              type="email"
              {...register('emailId')}
              error={!!errors.emailId}
              helperText={errors.emailId?.message as string}
              fullWidth
            />

            <StyledTextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message as string}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{
                        color: '#64748b',
                        '&:hover': { color: '#94a3b8' },
                      }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {mode === 'signup' && (
              <StyledTextField
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message as string}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{
                          color: '#64748b',
                          '&:hover': { color: '#94a3b8' },
                        }}
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Stack>

          <DialogActions sx={{ pt: 3.5, px: 0, pb: 0 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                borderRadius: '10px',
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                fontFamily: '"Inter", system-ui, sans-serif',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                  transform: 'translateY(-1px)',
                },
                '&.Mui-disabled': {
                  background: 'rgba(99, 102, 241, 0.3)',
                  color: 'rgba(241, 245, 249, 0.4)',
                },
              }}
            >
              {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'}
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </StyledDialog>
  );
};

export default AuthModal;
