import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import StatsCard from './StatsCard';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';
import GpsFixedOutlinedIcon from '@mui/icons-material/GpsFixedOutlined';
import { UserStats } from '../types/schema';
import { formatPercentage } from '../utils/stringFormatters';

interface ProgressDashboardProps {
  stats: UserStats;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ stats }) => {
  const overallProgress = stats.totalProblems > 0 ? (stats.solvedCount / stats.totalProblems) * 100 : 0;
  
  const difficultyData = [
    {
      id: 'Easy',
      value: stats.easySolved,
      label: `Easy (${stats.easySolved}/${stats.easyCount})`,
      color: '#10b981'
    },
    {
      id: 'Medium', 
      value: stats.mediumSolved,
      label: `Medium (${stats.mediumSolved}/${stats.mediumCount})`,
      color: '#f59e0b'
    },
    {
      id: 'Hard',
      value: stats.hardSolved, 
      label: `Hard (${stats.hardSolved}/${stats.hardCount})`,
      color: '#ef4444'
    }
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: 'text.primary' }}>
        Your Progress
      </Typography>
      
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>
        {/* Stats Cards */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ flex: 1 }}>
          <StatsCard
            title="Problems Solved"
            value={stats.solvedCount}
            subtitle={`out of ${stats.totalProblems} total`}
            icon={<EmojiEventsOutlinedIcon sx={{ fontSize: '1.5rem' }} />}
            color="primary"
            progress={overallProgress}
          />
          
          <StatsCard
            title="Success Rate"
            value={formatPercentage(stats.solvedCount, stats.totalProblems)}
            subtitle="Overall completion"
            icon={<GpsFixedOutlinedIcon sx={{ fontSize: '1.5rem' }} />}
            color="success"
          />
          
          <StatsCard
            title="Total Problems"
            value={stats.totalProblems}
            subtitle="Available to solve"
            icon={<InsertChartOutlinedIcon sx={{ fontSize: '1.5rem' }} />}
            color="info"
          />
        </Stack>
        
        {/* Difficulty Breakdown Chart */}
        <Box sx={{ 
          minWidth: 300,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          p: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid',
          borderColor: 'grey.200'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Difficulty Distribution
          </Typography>
          
          {stats.solvedCount > 0 && difficultyData.filter(item => item.value > 0).length > 0 ? (
            <PieChart
              series={[
                {
                  data: difficultyData.filter(item => item.value > 0),
                }
              ]}
              width={250}
              height={200}
            />
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              height: 200,
              color: 'text.secondary'
            }}>
              <InsertChartOutlinedIcon sx={{ fontSize: '3rem', mb: 1, opacity: 0.5 }} />
              <Typography variant="body2">
                Start solving problems to see your progress!
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Box>
  );
};

export default ProgressDashboard;