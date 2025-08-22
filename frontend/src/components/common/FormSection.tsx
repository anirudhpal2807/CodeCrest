import React from 'react';
import { Paper, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledFormSection = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: '16px',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    boxShadow: theme.shadows[4],
  }
}));

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({ title, children, icon }) => {
  return (
    <StyledFormSection elevation={2}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          {icon}
          <Typography variant="h5" fontWeight={600} color="text.primary">
            {title}
          </Typography>
        </Stack>
        {children}
      </Stack>
    </StyledFormSection>
  );
};