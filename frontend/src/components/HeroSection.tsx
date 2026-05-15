import React from 'react';
import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CodeIcon from '@mui/icons-material/Code';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const floatSlow = keyframes`
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 30px rgba(99, 102, 241, 0.4), 0 0 60px rgba(99, 102, 241, 0.1); }
  50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6), 0 0 80px rgba(99, 102, 241, 0.2); }
`;

const HeroContainer = styled(Box)(() => ({
  background: 'linear-gradient(160deg, #0b0f1a 0%, #111827 40%, #151c2c 70%, #0b0f1a 100%)',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
}));

const HeroContent = styled(Container)(() => ({
  position: 'relative',
  zIndex: 3,
  textAlign: 'center',
  animation: `${slideInUp} 1s ease-out`,
  maxWidth: '860px !important',
}));

const BackgroundPattern = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.04'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  zIndex: 0,
}));

const FloatingOrb = styled(Box)(() => ({
  position: 'absolute',
  borderRadius: '50%',
  filter: 'blur(60px)',
  zIndex: 1,
  pointerEvents: 'none',
}));

const GradientOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `
    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.12) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 80% 50%, rgba(6, 182, 212, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse 60% 50% at 20% 80%, rgba(99, 102, 241, 0.05) 0%, transparent 60%)
  `,
  zIndex: 1,
  pointerEvents: 'none',
}));

const BrandTitle = styled(Typography)(() => ({
  fontFamily: '"Inter", system-ui, sans-serif',
  fontWeight: 800,
  background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 40%, #06b6d4 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  letterSpacing: '-0.03em',
  lineHeight: 1.1,
}));

const SubTitle = styled(Typography)(() => ({
  fontFamily: '"Inter", system-ui, sans-serif',
  fontWeight: 600,
  color: '#f1f5f9',
  letterSpacing: '-0.02em',
}));

const CTAButton = styled(Button)(() => ({
  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  color: '#ffffff',
  padding: '14px 40px',
  fontSize: '1.1rem',
  fontWeight: 600,
  borderRadius: '14px',
  textTransform: 'none',
  boxShadow: '0 8px 30px rgba(99, 102, 241, 0.35)',
  transition: 'all 0.3s ease',
  fontFamily: '"Inter", system-ui, sans-serif',
  letterSpacing: '-0.01em',
  animation: `${glowPulse} 3s ease-in-out infinite`,
  '&:hover': {
    background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
    transform: 'translateY(-3px)',
    boxShadow: '0 12px 40px rgba(99, 102, 241, 0.5)',
  },
}));

const IconWrapper = styled(Box)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '72px',
  height: '72px',
  borderRadius: '20px',
  background: 'rgba(99, 102, 241, 0.1)',
  border: '1px solid rgba(99, 102, 241, 0.2)',
  backdropFilter: 'blur(10px)',
  marginBottom: '8px',
  animation: `${pulse} 3s ease-in-out infinite`,
}));

interface HeroSectionProps {
  onStartCoding: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartCoding }) => {
  return (
    <HeroContainer>
      <BackgroundPattern />
      <GradientOverlay />

      <FloatingOrb
        sx={{
          top: '8%',
          left: '8%',
          width: '300px',
          height: '300px',
          background: 'rgba(99, 102, 241, 0.08)',
          animation: `${floatSlow} 8s ease-in-out infinite`,
        }}
      />
      <FloatingOrb
        sx={{
          top: '15%',
          right: '10%',
          width: '200px',
          height: '200px',
          background: 'rgba(6, 182, 212, 0.06)',
          animation: `${float} 6s ease-in-out infinite`,
          animationDelay: '2s',
        }}
      />
      <FloatingOrb
        sx={{
          bottom: '10%',
          left: '15%',
          width: '250px',
          height: '250px',
          background: 'rgba(99, 102, 241, 0.06)',
          animation: `${floatSlow} 10s ease-in-out infinite`,
          animationDelay: '1s',
        }}
      />
      <FloatingOrb
        sx={{
          bottom: '20%',
          right: '20%',
          width: '180px',
          height: '180px',
          background: 'rgba(6, 182, 212, 0.05)',
          animation: `${float} 7s ease-in-out infinite`,
          animationDelay: '3s',
        }}
      />

      <HeroContent>
        <Stack spacing={4} alignItems="center">
          <IconWrapper>
            <CodeIcon sx={{ fontSize: '2rem', color: '#818cf8' }} />
          </IconWrapper>

          <BrandTitle
            variant="h1"
            sx={{ fontSize: { xs: '3rem', sm: '3.5rem', md: '4.5rem' } }}
          >
            CodeCrest
          </BrandTitle>

          <SubTitle
            variant="h3"
            sx={{ fontSize: { xs: '1.3rem', sm: '1.6rem', md: '2rem' } }}
          >
            Master Your Coding Skills
          </SubTitle>

          <Typography
            variant="h6"
            sx={{
              color: '#94a3b8',
              maxWidth: '640px',
              lineHeight: 1.8,
              fontSize: { xs: '1rem', md: '1.15rem' },
              fontFamily: '"Inter", system-ui, sans-serif',
              fontWeight: 400,
            }}
          >
            Practice coding problems and ace your technical interviews with our
            comprehensive platform. Join thousands of developers improving their
            skills every day.
          </Typography>

          <Box sx={{ mt: 3 }}>
            <CTAButton
              onClick={onStartCoding}
              endIcon={<RocketLaunchIcon />}
              size="large"
            >
              Start Your Journey
            </CTAButton>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: '#64748b',
              mt: 2,
              fontFamily: '"Inter", system-ui, sans-serif',
              fontSize: '0.9rem',
              letterSpacing: '0.02em',
            }}
          >
            Free to start &nbsp;•&nbsp; Instant access &nbsp;•&nbsp; Expert
            solutions
          </Typography>
        </Stack>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection;
