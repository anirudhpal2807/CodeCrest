import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { UserStats } from '../types/schema';
import { formatPercentage } from '../utils/stringFormatters';

interface ProgressDashboardProps {
  stats: UserStats;
}

const difficultyConfig = [
  { key: 'easy', label: 'Easy', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.25)' },
  { key: 'medium', label: 'Medium', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.25)' },
  { key: 'hard', label: 'Hard', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)', border: 'rgba(239, 68, 68, 0.25)' },
] as const;

const CircularRing: React.FC<{
  progress: number;
  size: number;
  strokeWidth: number;
  color: string;
  trackColor?: string;
  children?: React.ReactNode;
}> = ({ progress, size, strokeWidth, color, trackColor = 'rgba(148, 163, 184, 0.08)', children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
      </svg>
      <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </Box>
    </Box>
  );
};

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ stats }) => {
  const overallProgress = stats.totalProblems > 0 ? (stats.solvedCount / stats.totalProblems) * 100 : 0;

  const getDifficultyStat = (key: string) => {
    switch (key) {
      case 'easy': return { solved: stats.easySolved, total: stats.easyCount };
      case 'medium': return { solved: stats.mediumSolved, total: stats.mediumCount };
      case 'hard': return { solved: stats.hardSolved, total: stats.hardCount };
      default: return { solved: 0, total: 0 };
    }
  };

  return (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', lg: '340px 1fr' },
      gap: 3,
      mb: 2,
    }}>
      {/* Left: Big Ring */}
      <Box sx={{
        background: '#151c2c',
        borderRadius: '16px',
        border: '1px solid rgba(148, 163, 184, 0.1)',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2.5,
      }}>
        <CircularRing progress={overallProgress} size={160} strokeWidth={10} color="#6366f1">
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '2rem', fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              {stats.solvedCount}
            </Typography>
            <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500, mt: 0.25 }}>
              / {stats.totalProblems} solved
            </Typography>
          </Box>
        </CircularRing>

        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>
            Overall Progress
          </Typography>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#818cf8', letterSpacing: '-0.03em' }}>
            {formatPercentage(stats.solvedCount, stats.totalProblems)}
          </Typography>
        </Box>
      </Box>

      {/* Right: Difficulty Breakdown + Mini Stats */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Difficulty Bars */}
        <Box sx={{
          background: '#151c2c',
          borderRadius: '16px',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          p: 3.5,
        }}>
          <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#f1f5f9', mb: 3, letterSpacing: '-0.01em' }}>
            Difficulty Breakdown
          </Typography>

          <Stack spacing={2.5}>
            {difficultyConfig.map((diff) => {
              const { solved, total } = getDifficultyStat(diff.key);
              const pct = total > 0 ? (solved / total) * 100 : 0;
              return (
                <Box key={diff.key}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: diff.color, boxShadow: `0 0 8px ${diff.color}40` }} />
                      <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#f1f5f9' }}>
                        {diff.label}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5 }}>
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: diff.color }}>
                        {solved}
                      </Typography>
                      <Typography sx={{ fontSize: '0.7rem', color: '#475569' }}>
                        / {total}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{
                    height: 8,
                    borderRadius: '4px',
                    background: 'rgba(148, 163, 184, 0.06)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}>
                    <Box sx={{
                      height: '100%',
                      width: `${pct}%`,
                      borderRadius: '4px',
                      background: `linear-gradient(90deg, ${diff.color} 0%, ${diff.color}cc 100%)`,
                      boxShadow: pct > 0 ? `0 0 12px ${diff.color}30` : 'none',
                      transition: 'width 0.8s ease',
                    }} />
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>

        {/* Mini Stats Row */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          {[
            { label: 'Easy Completion', value: formatPercentage(stats.easySolved, stats.easyCount), color: '#10b981' },
            { label: 'Medium Completion', value: formatPercentage(stats.mediumSolved, stats.mediumCount), color: '#f59e0b' },
            { label: 'Hard Completion', value: formatPercentage(stats.hardSolved, stats.hardCount), color: '#ef4444' },
          ].map((item) => (
            <Box key={item.label} sx={{
              background: '#151c2c',
              borderRadius: '12px',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              p: 2.5,
              textAlign: 'center',
              transition: 'all 0.25s ease',
              '&:hover': { borderColor: 'rgba(148, 163, 184, 0.2)', transform: 'translateY(-2px)' },
            }}>
              <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: item.color, letterSpacing: '-0.03em', mb: 0.25 }}>
                {item.value}
              </Typography>
              <Typography sx={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500 }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressDashboard;
