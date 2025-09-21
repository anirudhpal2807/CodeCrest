import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container,
  Stack,
  CircularProgress,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { NavLink, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';

// Components
import HeroSection from '../components/HeroSection';
import ProgressDashboard from '../components/ProgressDashboard';
import FilterBar from '../components/FilterBar';
import ProblemCard from '../components/ProblemCard';
import Header from '../components/Header';


// Types
import { Problem, SolvedProblem, UserStats } from '../types/schema';

const ProblemsSection = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(8)
}));

const ModernHomepage: React.FC = () => {
  const dispatch = useDispatch() as any;
  const { user, isAuthenticated, loading } = useSelector((state: any) => state.auth);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<SolvedProblem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });

  // Debug search query
  console.log('Current search query:', searchQuery);
  console.log('All search params:', Object.fromEntries(searchParams.entries()));



  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        // Always fetch problems
        const problemsResponse = await axiosClient.get('/problem/getAllProblem');
        console.log('Problems fetched:', problemsResponse.data);
        setProblems(problemsResponse.data || []);

        // Only fetch solved problems if user is authenticated
        if (isAuthenticated && user) {
          try {
            const solvedResponse = await axiosClient.get('/problem/problemSolvedByUser');
            setSolvedProblems(solvedResponse.data || []);
          } catch (error) {
            console.error('Error fetching solved problems:', error);
            setSolvedProblems([]);
          }
        } else {
          setSolvedProblems([]);
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
        setProblems([]);
        setSolvedProblems([]);
      } finally {
        setDataLoading(false);
      }
    };

    if (!loading) {
      fetchData();
    }
  }, [user, isAuthenticated, loading]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleStartCoding = () => {
    const problemsSection = document.getElementById('problems-section');
    if (problemsSection) {
      problemsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' || 
                      (filters.status === 'solved' && solvedProblems.some(sp => sp._id === problem._id));
    
    // Add search functionality
    const searchMatch = !searchQuery || 
      (problem.title && problem.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (problem.description && problem.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (problem.tags && problem.tags.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (problem.problemTitle && problem.problemTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (problem.problemDescription && problem.problemDescription.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Debug logging
    if (searchQuery) {
      console.log('Search query:', searchQuery);
      console.log('Problem title:', problem.title);
      console.log('Search match:', searchMatch);
    }
    
    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

  // Calculate user stats
  const stats: UserStats = {
    totalProblems: problems.length,
    solvedCount: solvedProblems.length,
    easyCount: problems.filter(p => p.difficulty === 'easy').length,
    easySolved: solvedProblems.filter(sp => 
      problems.find(p => p._id === sp._id)?.difficulty === 'easy'
    ).length,
    mediumCount: problems.filter(p => p.difficulty === 'medium').length,
    mediumSolved: solvedProblems.filter(sp => 
      problems.find(p => p._id === sp._id)?.difficulty === 'medium'
    ).length,
    hardCount: problems.filter(p => p.difficulty === 'hard').length,
    hardSolved: solvedProblems.filter(sp => 
      problems.find(p => p._id === sp._id)?.difficulty === 'hard'
    ).length
  };

  // Show loading spinner while authentication or data is loading
  if (loading || dataLoading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'background.default'
      }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Navigation */}
      <Header />



      {/* Hero Section */}
      <HeroSection onStartCoding={handleStartCoding} />

      {/* Problems Section */}
      <ProblemsSection id="problems-section">
        <Container maxWidth="xl">
          {isAuthenticated && user && (
            <ProgressDashboard stats={stats} />
          )}
          
          <FilterBar 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
          
          <Box sx={{ mt: 4 }}>
            {searchQuery && (
              <Box sx={{ mb: 2, p: 2, bgcolor: 'primary.main', borderRadius: 2, color: 'white' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Search results for: "{searchQuery}"
                  <Typography component="span" sx={{ ml: 1, opacity: 0.8 }}>
                    ({filteredProblems.length} results)
                  </Typography>
                </Typography>
              </Box>
            )}
            
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
              {searchQuery ? 'Search Results' : (filters.status === 'solved' ? 'Solved Problems' : 'All Problems')}
              <Typography component="span" variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>
                ({filteredProblems.length} problems)
              </Typography>
            </Typography>
            
            <Stack spacing={2}>
              {filteredProblems.map(problem => (
                <ProblemCard
                  key={problem._id}
                  problem={problem}
                  isSolved={solvedProblems.some(sp => sp._id === problem._id)}
                />
              ))}
              
              {filteredProblems.length === 0 && !dataLoading && (
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 8,
                  color: 'text.secondary'
                }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No problems found
                  </Typography>
                  <Typography variant="body2">
                    {problems.length === 0 
                      ? 'No problems available at the moment' 
                      : 'Try adjusting your filters to see more problems'
                    }
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>
        </Container>
      </ProblemsSection>
    </Box>
  );
};

export default ModernHomepage;