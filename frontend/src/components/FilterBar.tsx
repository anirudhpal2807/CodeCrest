import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import FilterListIcon from '@mui/icons-material/FilterList';

const FilterContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  background: theme.palette.background.paper,
  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  border: `1px solid ${theme.palette.grey[200]}`
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  minWidth: 160,
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: theme.palette.background.paper,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.main
    }
  }
}));

interface FilterBarProps {
  filters: {
    difficulty: string;
    tag: string;
    status: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange }) => {
  return (
    <FilterContainer>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <FilterListIcon sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Filter Problems
        </Typography>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 3, 
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <StyledFormControl size="small">
          <InputLabel>Status</InputLabel>
          <Select
            value={filters.status}
            label="Status"
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <MenuItem value="all">All Problems</MenuItem>
            <MenuItem value="solved">Solved Problems</MenuItem>
          </Select>
        </StyledFormControl>

        <StyledFormControl size="small">
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={filters.difficulty}
            label="Difficulty"
            onChange={(e) => onFilterChange('difficulty', e.target.value)}
          >
            <MenuItem value="all">All Difficulties</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </StyledFormControl>

        <StyledFormControl size="small">
          <InputLabel>Tag</InputLabel>
          <Select
            value={filters.tag}
            label="Tag"
            onChange={(e) => onFilterChange('tag', e.target.value)}
          >
            <MenuItem value="all">All Tags</MenuItem>
            <MenuItem value="array">Array</MenuItem>
            <MenuItem value="linkedList">Linked List</MenuItem>
            <MenuItem value="graph">Graph</MenuItem>
            <MenuItem value="dp">Dynamic Programming</MenuItem>
          </Select>
        </StyledFormControl>
      </Box>
    </FilterContainer>
  );
};

export default FilterBar;