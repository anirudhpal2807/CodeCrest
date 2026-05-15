import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(() => ({
  background: '#151c2c',
  borderRadius: '14px',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '1px solid rgba(148, 163, 184, 0.12)',
  overflow: 'visible',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)',
    borderColor: 'rgba(148, 163, 184, 0.25)',
  },
}));

const IconContainer = styled(Box)(() => ({
  width: 48,
  height: 48,
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  progress?: number;
}

const colorMap: Record<string, string> = {
  primary: '#6366f1',
  secondary: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  success: '#10b981',
};

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color,
  progress,
}) => {
  const colorValue = colorMap[color] || colorMap.primary;

  return (
    <StyledCard>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <IconContainer sx={{ backgroundColor: `${colorValue}18` }}>
            <Box sx={{ color: colorValue, display: 'flex' }}>{icon}</Box>
          </IconContainer>

          {progress !== undefined && (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={100}
                size={44}
                thickness={3.5}
                sx={{ color: 'rgba(148, 163, 184, 0.12)', position: 'absolute' }}
              />
              <CircularProgress
                variant="determinate"
                value={progress}
                size={44}
                thickness={3.5}
                sx={{ color: colorValue }}
              />
              <Box
                sx={{
                  top: 0,
                  left: 0,
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="caption"
                  component="div"
                  sx={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    color: '#f1f5f9',
                    fontFamily: 'Inter, system-ui, sans-serif',
                  }}
                >
                  {`${Math.round(progress)}%`}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#f1f5f9',
            mb: 0.5,
            fontFamily: 'Inter, system-ui, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: '#94a3b8',
            fontWeight: 500,
            mb: 0.25,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '0.85rem',
          }}
        >
          {title}
        </Typography>

        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: '#64748b',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '0.75rem',
            }}
          >
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default StatsCard;
