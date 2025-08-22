import React from 'react';
import { Box, Typography, Button, Stack, Container } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';
import PlayArrowOutlinedIcon from '@mui/icons-material/PlayArrowOutlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import MatrixBackground from './MatrixBackground';
import { matrixColors } from '../theme/colors';

const glow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 5px ${matrixColors.effects.glow.primary}, 0 0 10px ${matrixColors.effects.glow.primary}, 0 0 15px ${matrixColors.effects.glow.primary};
  }
  50% { 
    text-shadow: 0 0 10px ${matrixColors.effects.glow.strong}, 0 0 20px ${matrixColors.effects.glow.strong}, 0 0 30px ${matrixColors.effects.glow.strong};
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

const HeroContainer = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  backgroundColor: matrixColors.background.primary,
  overflow: 'hidden',
});

const HeroContent = styled(Container)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
  textAlign: 'center',
  maxWidth: '1000px !important',
  padding: theme.spacing(8, 2),
}));

const MainTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"JetBrains Mono", monospace',
  fontWeight: 700,
  color: matrixColors.text.primary,
  fontSize: '4rem',
  lineHeight: 1.1,
  letterSpacing: '3px',
  marginBottom: theme.spacing(3),
  animation: `${glow} 2s ease-in-out infinite`,
  [theme.breakpoints.down('md')]: {
    fontSize: '3rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

const SubTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Space Grotesk", sans-serif',
  fontWeight: 400,
  color: matrixColors.text.secondary,
  fontSize: '1.5rem',
  marginBottom: theme.spacing(4),
  letterSpacing: '1px',
  [theme.breakpoints.down('md')]: {
    fontSize: '1.3rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.1rem',
  },
}));

const Description = styled(Typography)(({ theme }) => ({
  fontFamily: '"Inter", sans-serif',
  color: matrixColors.text.tertiary,
  fontSize: '1.2rem',
  lineHeight: 1.6,
  maxWidth: '700px',
  margin: '0 auto',
  marginBottom: theme.spacing(6),
  [theme.breakpoints.down('md')]: {
    fontSize: '1.1rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1rem',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: '30px',
  padding: '15px 35px',
  fontSize: '1.1rem',
  fontWeight: 600,
  textTransform: 'none',
  fontFamily: '"Space Grotesk", sans-serif',
  transition: 'all 0.3s ease',
  animation: `${float} 3s ease-in-out infinite`,
}));

const PrimaryButton = styled(ActionButton)(({ theme }) => ({
  backgroundColor: matrixColors.primary.main,
  color: matrixColors.background.primary,
  '&:hover': {
    backgroundColor: matrixColors.primary.light,
    transform: 'translateY(-3px)',
    boxShadow: matrixColors.effects.shadow.button,
  },
}));

const SecondaryButton = styled(ActionButton)(({ theme }) => ({
  color: matrixColors.text.primary,
  borderColor: matrixColors.border.focus,
  backgroundColor: matrixColors.states.hover.background,
  animationDelay: '0.5s',
  '&:hover': {
    backgroundColor: matrixColors.states.active.background,
    borderColor: matrixColors.primary.light,
    transform: 'translateY(-3px)',
    boxShadow: matrixColors.effects.shadow.secondary,
  },
}));

const SilhouetteOverlay = styled(Box)({
  position: 'absolute',
  right: '10%',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '300px',
  height: '400px',
  background: 'linear-gradient(45deg, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 100%)',
  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
  zIndex: 1,
  opacity: 0.6,
  '@media (max-width: 1200px)': {
    display: 'none',
  },
});

const CodeWindow = styled(Box)(({ theme }) => ({
  position: 'absolute',
  right: '5%',
  bottom: '15%',
  width: '350px',
  height: '200px',
  backgroundColor: matrixColors.background.glass,
  border: `1px solid ${matrixColors.border.primary}`,
  borderRadius: '8px',
  padding: theme.spacing(2),
  fontFamily: '"JetBrains Mono", monospace',
  fontSize: '0.9rem',
  color: matrixColors.text.primary,
  zIndex: 1,
  boxShadow: matrixColors.effects.shadow.secondary,
  '@media (max-width: 1200px)': {
    display: 'none',
  },
}));

const CodeHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  marginBottom: '12px',
  paddingBottom: '8px',
  borderBottom: `1px solid ${matrixColors.border.secondary}`,
});

const CodeDot = styled(Box)<{ color: string }>(({ color }) => ({
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  backgroundColor: color,
  marginRight: '8px',
}));

interface MatrixHeroSectionProps {
  onStartCoding?: () => void;
  onExploreProblems?: () => void;
}

const MatrixHeroSection: React.FC<MatrixHeroSectionProps> = ({
  onStartCoding,
  onExploreProblems
}) => {
  return (
    <HeroContainer>
      <MatrixBackground />
      <SilhouetteOverlay />
      
      <CodeWindow>
        <CodeHeader>
          <CodeDot color="#ff5f56" />
          <CodeDot color="#ffbd2e" />
          <CodeDot color="#27ca3f" />
          <Typography variant="caption" sx={{ color: matrixColors.text.secondary, ml: 1 }}>
            solution.py
          </Typography>
        </CodeHeader>
        <Box sx={{ color: matrixColors.text.primary, lineHeight: 1.4 }}>
          <div><span style={{ color: matrixColors.syntax.keyword }}>class</span> <span style={{ color: matrixColors.syntax.class }}>ListNode</span>:</div>
          <div>&nbsp;&nbsp;<span style={{ color: matrixColors.syntax.keyword }}>def</span> <span style={{ color: matrixColors.syntax.function }}>__init__</span>(self):</div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;self.val = <span style={{ color: matrixColors.syntax.number }}>0</span></div>
          <div>&nbsp;&nbsp;&nbsp;&nbsp;self.next = <span style={{ color: matrixColors.syntax.operator }}>None</span></div>
        </Box>
      </CodeWindow>

      <HeroContent>
        <Stack spacing={4} alignItems="center">
          <MainTitle variant="h1">
            Master Coding
            <br />
            Interviews
          </MainTitle>
          
          <SubTitle variant="h3">
            Level up your coding skills with our comprehensive
            <br />
            collection of algorithm challenges, data structure
            <br />
            problems, and interview preparation.
          </SubTitle>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mt: 4 }}>
            <PrimaryButton
              variant="contained"
              startIcon={<PlayArrowOutlinedIcon />}
              onClick={onStartCoding}
            >
              Start Coding Now
            </PrimaryButton>
            
            <SecondaryButton
              variant="outlined"
              endIcon={<NearMeOutlinedIcon />}
              onClick={onExploreProblems}
            >
              Explore Problems
            </SecondaryButton>
          </Stack>
        </Stack>
      </HeroContent>
    </HeroContainer>
  );
};

export default MatrixHeroSection;