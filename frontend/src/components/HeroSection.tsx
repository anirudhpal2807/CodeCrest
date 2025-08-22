import React from 'react';
import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import CodeIcon from '@mui/icons-material/Code';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`;

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const HeroContainer = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, 
      rgba(102, 126, 234, 0.9) 0%, 
      rgba(118, 75, 162, 0.9) 100%)`,
    zIndex: 1
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    width: '200%',
    height: '200%',
    background: `radial-gradient(circle, 
      rgba(255, 255, 255, 0.1) 0%, 
      transparent 70%)`,
    animation: `${float} 6s ease-in-out infinite`,
    zIndex: 1
  }
}));

const HeroContent = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  color: theme.palette.common.white,
  textAlign: 'center',
  animation: `${slideInUp} 1s ease-out`,
  maxWidth: '900px !important'
}));

const BackgroundPattern = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
  zIndex: 0
}));

const FloatingElement = styled(Box)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.1)',
  animation: `${float} 4s ease-in-out infinite`,
  zIndex: 1
}));

const BrandTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Space Grotesk", "Inter", sans-serif',
  fontWeight: 800,
  background: 'linear-gradient(45deg, #ffffff 30%, #e0e7ff 90%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
  letterSpacing: '-2px',
  lineHeight: 1.1
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Poppins", "Inter", sans-serif',
  fontWeight: 600,
  color: 'rgba(255, 255, 255, 0.95)',
  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
  letterSpacing: '-0.5px'
}));

const CTAButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #ffffff 30%, #f8fafc 90%)',
  color: '#4f46e5',
  padding: theme.spacing(2, 5),
  fontSize: '1.2rem',
  fontWeight: 700,
  borderRadius: '60px',
  textTransform: 'none',
  boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
  transition: 'all 0.3s ease',
  fontFamily: '"Space Grotesk", "Inter", sans-serif',
  '&:hover': {
    background: 'linear-gradient(45deg, #f8fafc 30%, #ffffff 90%)',
    transform: 'translateY(-3px)',
    boxShadow: '0 15px 50px rgba(0,0,0,0.3)'
  }
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'rgba(255, 255, 255, 0.15)',
  backdropFilter: 'blur(10px)',
  marginBottom: theme.spacing(3),
  animation: `${pulse} 2s ease-in-out infinite`
}));

interface HeroSectionProps {
  onStartCoding: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartCoding }) => {
  return (
    <HeroContainer>
      <BackgroundPattern />
      
      {/* Floating Elements */}
      <FloatingElement 
        sx={{ 
          top: '10%', 
          left: '10%', 
          width: '100px', 
          height: '100px',
          animationDelay: '0s'
        }} 
      />
      <FloatingElement 
        sx={{ 
          top: '20%', 
          right: '15%', 
          width: '60px', 
          height: '60px',
          animationDelay: '2s'
        }} 
      />
      <FloatingElement 
        sx={{ 
          bottom: '15%', 
          left: '20%', 
          width: '80px', 
          height: '80px',
          animationDelay: '1s'
        }} 
      />
      
      <HeroContent>
        <Stack spacing={5} alignItems="center">
          <IconWrapper>
            <CodeIcon sx={{ fontSize: '2.5rem', color: 'white' }} />
          </IconWrapper>
          
          <BrandTitle variant="h1" sx={{ fontSize: { xs: '3rem', md: '4.5rem' } }}>
            CodeCrest
          </BrandTitle>
          
          <SubTitle variant="h3" sx={{ fontSize: { xs: '1.5rem', md: '2.2rem' } }}>
            Master Your Coding Skills
          </SubTitle>
          
          <Typography variant="h6" sx={{ 
            color: 'rgba(255, 255, 255, 0.9)', 
            maxWidth: '700px',
            lineHeight: 1.7,
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            fontFamily: '"Poppins", "Inter", sans-serif',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            Practice coding problems and ace your technical interviews with our comprehensive platform. 
            Join thousands of developers improving their skills every day.
          </Typography>
          
          <Box sx={{ mt: 6 }}>
            <CTAButton
              onClick={onStartCoding}
              endIcon={<RocketLaunchIcon />}
              size="large"
            >
              Start Your Journey
            </CTAButton>
          </Box>
          
          <Typography variant="body2" sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            mt: 3,
            fontFamily: '"Inter", sans-serif'
          }}>
            ✨ Free to start • 🚀 Instant access • 💡 Expert solutions
          </Typography>
        </Stack>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroSection;