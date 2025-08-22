import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledValidationMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '0.875rem',
  marginTop: theme.spacing(0.5),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5)
}));

interface ValidationMessageProps {
  message?: string;
}

export const ValidationMessage: React.FC<ValidationMessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <StyledValidationMessage>
      {message}
    </StyledValidationMessage>
  );
};