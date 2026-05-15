import { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box } from '@mui/material';
import { Trophy, Flame, Clock, History, Layers } from 'lucide-react';
import Header from '../components/Header';
import ContestCard from '../components/ContestCard';
import RatingBadge from '../components/RatingBadge';
import { fetchAllContests, fetchMyRating } from '../contestSlice';

const tabs = [
  { key: 'all', label: 'All', icon: Layers },
  { key: 'upcoming', label: 'Upcoming', icon: Clock },
  { key: 'live', label: 'Live', icon: Flame },
  { key: 'ended', label: 'Past', icon: History },
];

const ContestList = () => {
  const dispatch = useDispatch();
  const { contests, listLoading, listError, myRating } = useSelector((state) => state.contest);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    dispatch(fetchAllContests());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchMyRating());
  }, [dispatch, isAuthenticated]);

  const filteredContests = useMemo(() => {
    const list = Array.isArray(contests) ? contests : [];
    if (activeTab === 'all') return list;
    return list.filter((c) => c.status === activeTab);
  }, [contests, activeTab]);

  const liveCount = useMemo(
    () => (Array.isArray(contests) ? contests.filter((c) => c.status === 'live').length : 0),
    [contests]
  );

  return (
    <div className="min-h-screen" style={{ background: 'var(--cc-bg-primary)' }}>
      <Header />
      <Box sx={{ pt: '80px' }}>
        <Container maxWidth="lg" sx={{ py: 5 }}>
          {/* Page header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2.5 rounded-xl bg-[rgba(99,102,241,0.12)]">
                  <Trophy size={24} className="text-[var(--cc-primary-light)]" />
                </div>
                <h1 className="text-3xl font-bold text-[var(--cc-text-primary)]">
                  Contests
                </h1>
              </div>
              <p className="text-[var(--cc-text-secondary)] text-sm ml-[52px]">
                Compete in timed coding challenges and climb the leaderboard
              </p>
            </div>
            {myRating && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--cc-bg-card)] border border-[var(--cc-border)]">
                <span className="text-xs text-[var(--cc-text-muted)] uppercase tracking-wider font-medium">My Rating</span>
                <RatingBadge rating={myRating.rating} />
              </div>
            )}
          </div>

          {listError && (
            <div className="mb-6 p-4 rounded-lg bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-sm text-[#f87171]">
              {listError}
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] w-fit mb-8 flex-wrap">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-[var(--cc-primary)] text-white shadow-lg shadow-[rgba(99,102,241,0.3)]'
                      : 'text-[var(--cc-text-muted)] hover:text-[var(--cc-text-secondary)]'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                  {tab.key === 'live' && liveCount > 0 && (
                    <span className="ml-1 w-5 h-5 flex items-center justify-center rounded-full bg-[rgba(16,185,129,0.2)] text-[#34d399] text-[10px] font-bold">
                      {liveCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Loading state */}
          {listLoading && (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="w-10 h-10 rounded-full border-[3px] border-[var(--cc-border)] border-t-[var(--cc-primary)] animate-spin" />
              <p className="mt-4 text-sm text-[var(--cc-text-muted)]">Loading contests...</p>
            </div>
          )}

          {/* Contest grid */}
          {!listLoading && filteredContests.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
              {filteredContests.map((contest) => (
                <ContestCard key={contest._id} contest={contest} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!listLoading && filteredContests.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-2xl bg-[var(--cc-bg-card)] border border-[var(--cc-border)] flex items-center justify-center mb-4">
                <Trophy size={28} className="text-[var(--cc-text-dimmed)]" />
              </div>
              <h3 className="text-lg font-semibold text-[var(--cc-text-primary)] mb-2">
                {activeTab === 'all' ? 'No contests yet' : `No ${activeTab} contests`}
              </h3>
              <p className="text-sm text-[var(--cc-text-muted)] max-w-md">
                {activeTab === 'all' && 'Admins can create contests from Admin → Manage Contests.'}
                {activeTab === 'upcoming' && 'New contests will appear here once scheduled. Check back soon!'}
                {activeTab === 'live' && 'No contests are running right now. Check upcoming contests.'}
                {activeTab === 'ended' && 'Past contests will show here after they end.'}
              </p>
            </div>
          )}
        </Container>
      </Box>
    </div>
  );
};

export default ContestList;
