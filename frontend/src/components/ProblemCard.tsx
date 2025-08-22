import React from 'react';
import { Card, CardContent, Typography, Box, Chip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavLink } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Problem } from '../types/schema';

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  transition: 'all 0.3s ease',
  border: `1px solid ${theme.palette.grey[200]}`,
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
    borderColor: theme.palette.primary.light
  }
}));

const ProblemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.primary,
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: theme.palette.primary.main
  }
}));

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case 'easy': return 'success';
    case 'medium': return 'warning';
    case 'hard': return 'error';
    default: return 'default';
  }
};

const getTagColor = (tag: string) => {
  switch (tag) {
    case 'array': return 'primary';
    case 'linkedList': return 'secondary';
    case 'graph': return 'info';
    case 'dp': return 'warning';
    default: return 'default';
  }
};

interface ProblemCardProps {
  problem: Problem;
  isSolved: boolean;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, isSolved }) => {
  return (
    <StyledCard>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <NavLink to={`/problem/${problem._id}`} style={{ textDecoration: 'none' }}>
              <ProblemTitle variant="h6">
                {problem.title}
              </ProblemTitle>
            </NavLink>
            
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, lineHeight: 1.5 }}>
              {problem.description}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
            {isSolved && (
              <CheckCircleIcon sx={{ color: 'success.main', fontSize: '1.5rem' }} />
            )}
            
            <IconButton 
              component={NavLink}
              to={`/problem/${problem._id}`}
              sx={{ 
                backgroundColor: 'primary.main',
                color: 'white',
                width: 36,
                height: 36,
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
            >
              <PlayArrowIcon sx={{ fontSize: '1.2rem' }} />
            </IconButton>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label={problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
            color={getDifficultyColor(problem.difficulty) as any}
            size="small"
            variant="filled"
            sx={{ fontWeight: 500 }}
          />
          
          <Chip
            label={problem.tags === 'linkedList' ? 'Linked List' : 
                  problem.tags === 'dp' ? 'Dynamic Programming' :
                  problem.tags.charAt(0).toUpperCase() + problem.tags.slice(1)}
            color={getTagColor(problem.tags) as any}
            size="small"
            variant="outlined"
            sx={{ fontWeight: 500 }}
          />
          
          {isSolved && (
            <Chip
              label="Solved"
              color="success"
              size="small"
              variant="filled"
              icon={<CheckCircleIcon />}
              sx={{ fontWeight: 500 }}
            />
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default ProblemCard;