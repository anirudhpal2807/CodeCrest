import React from 'react';
import { Box, Typography, Container, Stack } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import { matrixColors } from '../theme/colors';

const countUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px ${matrixColors.effects.glow.secondary};
  }
  50% { 
    box-shadow: 0 0 30px ${matrixColors.effects.glow.primary};
  }
`;

const StatsContainer = styled(Box)({
  backgroundColor: matrixColors.background.primary,
  padding: '80px 0',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, transparent 0%, ${matrixColors.effects.glow.primary} 50%, transparent 100%)`,
  }
});

const StatCard = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4, 3),
  backgroundColor: matrixColors.background.tertiary,
  border: `1px solid ${matrixColors.border.secondary}`,
  borderRadius: '16px',
  backdropFilter: 'blur(10px)',
  transition: 'all 0.3s ease',
  animation: `${countUp} 0.8s ease-out`,
  '&:hover': {
    transform: 'translateY(-5px)',
    animation: `${glow} 2s ease-in-out infinite`,
    borderColor: matrixColors.border.hover,
  },
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontFamily: '"JetBrains Mono", monospace',
  fontWeight: 700,
  fontSize: '3rem',
  color: matrixColors.text.primary,
  lineHeight: 1,
  marginBottom: theme.spacing(1),
  textShadow: `0 0 10px ${matrixColors.effects.glow.primary}`,
  [theme.breakpoints.down('md')]: {
    fontSize: '2.5rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontFamily: '"Space Grotesk", sans-serif',
  fontWeight: 500,
  fontSize: '1.2rem',
  color: matrixColors.text.secondary,
  letterSpacing: '1px',
  [theme.breakpoints.down('md')]: {
    fontSize: '1.1rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

interface StatisticsSectionProps {
  problems?: number;
  users?: string;
  successRate?: number;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  problems = 2000,
  users = '500K',
  successRate = 95
}) => {
  return (
    <StatsContainer>
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={4}
          justifyContent="center"
          alignItems="center"
        >
          <StatCard sx={{ animationDelay: '0.1s' }}>
            <StatNumber variant="h2">
              {problems.toLocaleString()}+
            </StatNumber>
            <StatLabel>
              Problems
            </StatLabel>
          </StatCard>

          <StatCard sx={{ animationDelay: '0.3s' }}>
            <StatNumber variant="h2">
              {users}+
            </StatNumber>
            <StatLabel>
              Users
            </StatLabel>
          </StatCard>

          <StatCard sx={{ animationDelay: '0.5s' }}>
            <StatNumber variant="h2">
              {successRate}%
            </StatNumber>
            <StatLabel>
              Success Rate
            </StatLabel>
          </StatCard>
        </Stack>
      </Container>
    </StatsContainer>
  );
};

export default StatisticsSection;