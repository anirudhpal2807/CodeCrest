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
import { useNavigate } from 'react-router';
import { loginUser, registerUser } from '../authSlice';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: 'rgba(26, 26, 46, 0.95)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    minWidth: '400px'
  }
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
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
  const navigate = useNavigate();
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
    if (isAuthenticated) {
      onClose();
      navigate('/');
    }
  }, [isAuthenticated, onClose, navigate]);

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
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
          CodeCrest
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <Tabs 
          value={mode} 
          onChange={handleModeChange}
          sx={{ mb: 3 }}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Sign In" value="signin" />
          <Tab label="Sign Up" value="signup" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {mode === 'signup' && (
              <>
                <StyledTextField
                  label="First Name"
                  {...register('firstName')}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                  fullWidth
                />
                <StyledTextField
                  label="Last Name"
                  {...register('lastName')}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                  fullWidth
                />
              </>
            )}

            <StyledTextField
              label="Email"
              type="email"
              {...register('emailId')}
              error={!!errors.emailId}
              helperText={errors.emailId?.message}
              fullWidth
            />

            <StyledTextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
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
                helperText={errors.confirmPassword?.message}
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Stack>

          <DialogActions sx={{ pt: 3, px: 0 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ 
                py: 1.5,
                borderRadius: '8px',
                textTransform: 'none',
                fontSize: '1rem'
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
