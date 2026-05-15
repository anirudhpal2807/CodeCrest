import React, { useEffect, useMemo, useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import { useSearchParams, NavLink, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import { logoutUser } from '../authSlice';
import { fetchAllContests } from '../contestSlice';

import HeroSection from '../components/HeroSection';
import ProgressDashboard from '../components/ProgressDashboard';
import FilterBar from '../components/FilterBar';
import ProblemCard from '../components/ProblemCard';
import Header from '../components/Header';

import { Problem, SolvedProblem, UserStats } from '../types/schema';

const ModernHomepage: React.FC = () => {
  const dispatch = useDispatch() as any;
  const { user, isAuthenticated, loading } = useSelector((state: any) => state.auth);
  const { contests, listLoading: contestsLoading } = useSelector((state: any) => state.contest);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedProblems, setSolvedProblems] = useState<SolvedProblem[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const searchQuery = searchParams.get('search') || '';
  const [filters, setFilters] = useState({
    difficulty: 'all',
    tag: 'all',
    status: 'all'
  });

  const contestPreview = useMemo(() => {
    const list = Array.isArray(contests) ? contests : [];
    const interesting = list.filter((c: { status?: string }) => c.status === 'live' || c.status === 'upcoming');
    interesting.sort((a: { startTime?: string }, b: { startTime?: string }) =>
      new Date(a.startTime || 0).getTime() - new Date(b.startTime || 0).getTime()
    );
    return interesting.slice(0, 4);
  }, [contests]);

  useEffect(() => {
    if (!loading) {
      dispatch(fetchAllContests());
    }
  }, [dispatch, loading]);

  useEffect(() => {
    const fetchData = async () => {
      setDataLoading(true);
      try {
        const problemsResponse = await axiosClient.get('/problem/getAllProblem');
        setProblems(problemsResponse.data || []);

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

  useEffect(() => {
    if (loading || dataLoading || location.pathname !== '/problems') return;
    const anchorId = location.hash?.replace(/^#/, '').trim() || 'problems-section';
    const el = document.getElementById(anchorId) ?? document.getElementById('problems-section');
    if (!el) return;
    const id = window.setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
    return () => window.clearTimeout(id);
  }, [loading, dataLoading, location.pathname, location.hash]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleStartCoding = () => {
    const el = document.getElementById('problems-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredProblems = problems.filter(problem => {
    const difficultyMatch = filters.difficulty === 'all' || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === 'all' || problem.tags === filters.tag;
    const statusMatch = filters.status === 'all' ||
      (filters.status === 'solved' && solvedProblems.some(sp => sp._id === problem._id));

    const searchMatch = !searchQuery ||
      (problem.title && problem.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (problem.description && problem.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (problem.tags && problem.tags.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (problem.problemTitle && problem.problemTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (problem.problemDescription && problem.problemDescription.toLowerCase().includes(searchQuery.toLowerCase()));

    return difficultyMatch && tagMatch && statusMatch && searchMatch;
  });

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

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--cc-bg-primary)' }}>
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <span className="loading loading-spinner loading-lg" style={{ color: 'var(--cc-primary)' }}></span>
          <p className="text-sm" style={{ color: 'var(--cc-text-muted)' }}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--cc-bg-primary)' }}>
      <Header />
      <HeroSection onStartCoding={handleStartCoding} />

      <Container maxWidth="lg" sx={{ pt: 2, pb: 0, position: 'relative', zIndex: 2 }}>
        <Box
          sx={{
            p: 2.5,
            borderRadius: '14px',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            background: 'rgba(15, 21, 36, 0.85)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: contestPreview.length ? 2 : 0 }}>
            <Typography sx={{ fontSize: '0.95rem', fontWeight: 700, color: '#e2e8f0', letterSpacing: '-0.02em' }}>
              Contests
            </Typography>
            <Button
              component={NavLink}
              to="/contest"
              variant="outlined"
              size="small"
              sx={{
                textTransform: 'none',
                borderColor: 'rgba(99, 102, 241, 0.35)',
                color: '#a5b4fc',
                '&:hover': { borderColor: '#6366f1', background: 'rgba(99, 102, 241, 0.08)' },
              }}
            >
              View all
            </Button>
          </Box>
          {contestsLoading && contestPreview.length === 0 ? (
            <Typography sx={{ fontSize: '0.82rem', color: '#64748b' }}>Loading contests…</Typography>
          ) : (
            contestPreview.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {contestPreview.map((c: { _id: string; title?: string; status?: string; startTime?: string }) => (
                  <Box
                    key={c._id}
                    component={NavLink}
                    to={`/contest/${c._id}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 2,
                      py: 1.25,
                      px: 1.5,
                      borderRadius: '10px',
                      textDecoration: 'none',
                      border: '1px solid rgba(148, 163, 184, 0.06)',
                      '&:hover': { background: 'rgba(99, 102, 241, 0.06)', borderColor: 'rgba(99, 102, 241, 0.2)' },
                    }}
                  >
                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#f1f5f9', flex: 1, minWidth: 0 }} noWrap>
                      {c.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                      {c.status === 'live' && (
                        <Box
                          component="span"
                          sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: '6px',
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            color: '#34d399',
                            background: 'rgba(16, 185, 129, 0.12)',
                            border: '1px solid rgba(16, 185, 129, 0.25)',
                          }}
                        >
                          Live
                        </Box>
                      )}
                      <Typography sx={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {c.startTime ? new Date(c.startTime).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )
          )}
          {!contestsLoading && contestPreview.length === 0 && (
            <Typography sx={{ fontSize: '0.82rem', color: '#64748b' }}>
              No upcoming or live contests right now.{' '}
              <Box component={NavLink} to="/contest" sx={{ color: '#818cf8' }}>
                Browse all contests
              </Box>
              {' '}including finished ones.
            </Typography>
          )}
        </Box>
      </Container>

      {/* Main Content */}
      <Box id="problems-section" sx={{ pt: 8, pb: 14, position: 'relative' }}>
        {/* Gradient fade from hero */}
        <Box sx={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '160px',
          background: 'linear-gradient(180deg, #111827 0%, var(--cc-bg-primary) 100%)',
          pointerEvents: 'none',
        }} />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Progress Section */}
          {isAuthenticated && user && (
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{ width: 4, height: 24, borderRadius: '2px', background: 'linear-gradient(180deg, #6366f1 0%, #818cf8 100%)' }} />
                <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                  Your Progress
                </Typography>
              </Box>
              <ProgressDashboard stats={stats} />
            </Box>
          )}

          {/* Problems Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 4, height: 24, borderRadius: '2px', background: 'linear-gradient(180deg, #06b6d4 0%, #22d3ee 100%)' }} />
              <Typography sx={{ fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9', letterSpacing: '-0.02em' }}>
                Problems
              </Typography>
            </Box>

            {/* Filter */}
            <Box sx={{ mb: 3 }}>
              <FilterBar filters={filters} onFilterChange={handleFilterChange} />
            </Box>

            {/* Search result notice */}
            {searchQuery && (
              <Box sx={{
                mb: 2, px: 2.5, py: 1.5, borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.06)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
                display: 'flex', alignItems: 'center', gap: 1,
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <Typography sx={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                  Results for "<span style={{ color: '#818cf8', fontWeight: 600 }}>{searchQuery}</span>"
                  <span style={{ color: '#475569', marginLeft: 6 }}>({filteredProblems.length})</span>
                </Typography>
              </Box>
            )}

            {/* Problem List Header */}
            <Box sx={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              mb: 1, px: 3, py: 1.5,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#94a3b8' }}>
                  {searchQuery ? 'Search Results' : (filters.status === 'solved' ? 'Solved' : 'All Problems')}
                </Typography>
                <Box sx={{
                  px: 1, py: 0.15, borderRadius: '6px',
                  background: 'rgba(99, 102, 241, 0.1)',
                }}>
                  <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: '#818cf8' }}>
                    {filteredProblems.length}
                  </Typography>
                </Box>
              </Box>

              {/* Column labels */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: { sm: 80, md: 120 }, textAlign: 'center' }}>
                  Topic
                </Typography>
                <Typography sx={{ fontSize: '0.68rem', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.06em', minWidth: 64, textAlign: 'center' }}>
                  Difficulty
                </Typography>
                <Box sx={{ width: 16, display: { xs: 'none', md: 'block' } }} />
              </Box>
            </Box>

            {/* Problem List */}
            <Box sx={{
              background: '#0f1524',
              borderRadius: '14px',
              border: '1px solid rgba(148, 163, 184, 0.08)',
              overflow: 'hidden',
            }}>
              {filteredProblems.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {filteredProblems.map((problem, idx) => (
                    <Box
                      key={problem._id}
                      sx={{
                        borderBottom: idx < filteredProblems.length - 1 ? '1px solid rgba(148, 163, 184, 0.05)' : 'none',
                      }}
                    >
                      <ProblemCard
                        problem={problem}
                        isSolved={solvedProblems.some(sp => sp._id === problem._id)}
                        index={idx + 1}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="none" viewBox="0 0 24 24" stroke="#334155" strokeWidth={1.5} style={{ margin: '0 auto' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <Typography sx={{ mt: 2, color: '#64748b', fontWeight: 600, fontSize: '0.95rem' }}>
                    No problems found
                  </Typography>
                  <Typography sx={{ mt: 0.5, color: '#475569', fontSize: '0.82rem' }}>
                    {problems.length === 0
                      ? 'No problems available at the moment'
                      : 'Try adjusting your filters or search query'
                    }
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ModernHomepage;
