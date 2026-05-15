import React from 'react';
import { Box, Typography } from '@mui/material';

interface FilterBarProps {
  filters: {
    difficulty: string;
    tag: string;
    status: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
}

const difficultyOptions = [
  { value: 'all', label: 'All', color: '#94a3b8' },
  { value: 'easy', label: 'Easy', color: '#10b981' },
  { value: 'medium', label: 'Medium', color: '#f59e0b' },
  { value: 'hard', label: 'Hard', color: '#ef4444' },
];

const tagOptions = [
  { value: 'all', label: 'All Topics' },
  { value: 'array', label: 'Array' },
  { value: 'linkedList', label: 'Linked List' },
  { value: 'graph', label: 'Graph' },
  { value: 'dp', label: 'Dynamic Prog.' },
];

const statusOptions = [
  { value: 'all', label: 'All' },
  { value: 'solved', label: 'Solved' },
];

const PillGroup: React.FC<{
  label: string;
  options: { value: string; label: string; color?: string }[];
  selected: string;
  onChange: (v: string) => void;
  colored?: boolean;
}> = ({ label, options, selected, onChange, colored }) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}
    </Typography>
    <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
      {options.map((opt) => {
        const isActive = selected === opt.value;
        const accentColor = colored && opt.color ? opt.color : '#6366f1';
        return (
          <Box
            key={opt.value}
            component="button"
            onClick={() => onChange(opt.value)}
            sx={{
              px: 1.75,
              py: 0.6,
              borderRadius: '8px',
              border: '1px solid',
              borderColor: isActive ? `${accentColor}50` : 'rgba(148, 163, 184, 0.1)',
              background: isActive ? `${accentColor}14` : 'transparent',
              color: isActive ? accentColor : '#94a3b8',
              fontSize: '0.8rem',
              fontWeight: isActive ? 600 : 500,
              fontFamily: 'Inter, system-ui, sans-serif',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              '&:hover': {
                borderColor: `${accentColor}40`,
                background: `${accentColor}0a`,
                color: isActive ? accentColor : '#cbd5e1',
              },
            }}
          >
            {colored && opt.value !== 'all' && (
              <Box sx={{
                width: 6, height: 6, borderRadius: '50%',
                background: opt.color,
                boxShadow: isActive ? `0 0 6px ${opt.color}60` : 'none',
              }} />
            )}
            {opt.label}
          </Box>
        );
      })}
    </Box>
  </Box>
);

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  return (
    <Box sx={{
      background: '#151c2c',
      borderRadius: '14px',
      border: '1px solid rgba(148, 163, 184, 0.1)',
      px: 3.5,
      py: 3,
    }}>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: { xs: 3, md: 5 },
        alignItems: 'flex-start',
      }}>
        <PillGroup
          label="Difficulty"
          options={difficultyOptions}
          selected={filters.difficulty}
          onChange={(v) => onFilterChange('difficulty', v)}
          colored
        />

        <Box sx={{ width: '1px', height: 52, background: 'rgba(148, 163, 184, 0.08)', display: { xs: 'none', md: 'block' } }} />

        <PillGroup
          label="Topic"
          options={tagOptions}
          selected={filters.tag}
          onChange={(v) => onFilterChange('tag', v)}
        />

        <Box sx={{ width: '1px', height: 52, background: 'rgba(148, 163, 184, 0.08)', display: { xs: 'none', md: 'block' } }} />

        <PillGroup
          label="Status"
          options={statusOptions}
          selected={filters.status}
          onChange={(v) => onFilterChange('status', v)}
        />
      </Box>
    </Box>
  );
};

export default FilterBar;
