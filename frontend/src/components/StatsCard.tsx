import React from 'react';
import { Card, CardContent, Typography, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.grey[200]}`,
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
  }
}));

const IconContainer = styled(Box)(({ theme }) => ({
  width: 48,
  height: 48,
  borderRadius: theme.spacing(1.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2)
}));

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  progress?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  color,
  progress 
}) => {
  const getColorValue = (colorName: string) => {
    const colorMap: Record<string, string> = {
      primary: '#6366f1',
      secondary: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
      success: '#10b981'
    };
    return colorMap[colorName] || colorMap.primary;
  };

  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <IconContainer sx={{ backgroundColor: `${getColorValue(color)}15` }}>
            <Box sx={{ color: getColorValue(color) }}>
              {icon}
            </Box>
          </IconContainer>
          
          {progress !== undefined && (
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress
                variant="determinate"
                value={progress}
                size={40}
                thickness={4}
                sx={{ color: getColorValue(color) }}
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
                <Typography variant="caption" component="div" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>
                  {`${Math.round(progress)}%`}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
        
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
          {value}
        </Typography>
        
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, mb: 0.5 }}>
          {title}
        </Typography>
        
        {subtitle && (
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </StyledCard>
  );
};

export default StatsCard;