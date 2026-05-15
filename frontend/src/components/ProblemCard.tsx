import React from 'react';
import { Box, Typography } from '@mui/material';
import { NavLink } from 'react-router-dom';
import { Problem } from '../types/schema';

const difficultyConfig: Record<string, { label: string; color: string; bg: string }> = {
  easy: { label: 'Easy', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  hard: { label: 'Hard', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

const formatTag = (tag: string) => {
  switch (tag) {
    case 'linkedList': return 'Linked List';
    case 'dp': return 'Dynamic Programming';
    default: return tag.charAt(0).toUpperCase() + tag.slice(1);
  }
};

interface ProblemCardProps {
  problem: Problem;
  isSolved: boolean;
  index?: number;
}

const ProblemCard: React.FC<ProblemCardProps> = ({ problem, isSolved, index }) => {
  const diff = difficultyConfig[problem.difficulty] || difficultyConfig.easy;

  return (
    <NavLink to={`/problem/${problem._id}`} style={{ textDecoration: 'none', display: 'block' }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: { xs: 2, md: 3 },
        px: { xs: 2.5, md: 3 },
        py: 2,
        borderRadius: '12px',
        border: '1px solid rgba(148, 163, 184, 0.08)',
        background: 'transparent',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          background: '#151c2c',
          borderColor: 'rgba(99, 102, 241, 0.2)',
          '& .problem-title': { color: '#818cf8' },
          '& .play-icon': { opacity: 1, transform: 'translateX(0)' },
        },
      }}>
        {/* Solved indicator */}
        <Box sx={{ width: 22, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
          {isSolved ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="rgba(16, 185, 129, 0.15)" />
              <path d="M8 12.5l2.5 2.5L16 9.5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <Box sx={{ width: 18, height: 18, borderRadius: '50%', border: '1.5px solid rgba(148, 163, 184, 0.15)' }} />
          )}
        </Box>

        {/* Title + Description */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            className="problem-title"
            sx={{
              fontSize: '0.92rem',
              fontWeight: 600,
              color: '#e2e8f0',
              transition: 'color 0.2s',
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {problem.title}
          </Typography>
          <Typography sx={{
            fontSize: '0.78rem',
            color: '#64748b',
            mt: 0.25,
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: { xs: '100%', md: '500px' },
          }}>
            {problem.description}
          </Typography>
        </Box>

        {/* Tag */}
        <Box sx={{
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          px: 1.25,
          py: 0.35,
          borderRadius: '6px',
          background: 'rgba(99, 102, 241, 0.08)',
          border: '1px solid rgba(99, 102, 241, 0.15)',
          flexShrink: 0,
        }}>
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 500, color: '#818cf8', whiteSpace: 'nowrap' }}>
            {formatTag(problem.tags)}
          </Typography>
        </Box>

        {/* Difficulty */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.75,
          px: 1.25,
          py: 0.35,
          borderRadius: '6px',
          background: diff.bg,
          flexShrink: 0,
          minWidth: 64,
          justifyContent: 'center',
        }}>
          <Box sx={{ width: 5, height: 5, borderRadius: '50%', background: diff.color }} />
          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: diff.color }}>
            {diff.label}
          </Typography>
        </Box>

        {/* Arrow */}
        <Box
          className="play-icon"
          sx={{
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0,
            transform: 'translateX(-4px)',
            transition: 'all 0.2s ease',
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Box>
      </Box>
    </NavLink>
  );
};

export default ProblemCard;
