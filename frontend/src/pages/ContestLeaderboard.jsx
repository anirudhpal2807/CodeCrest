import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box } from '@mui/material';
import { ArrowLeft, RefreshCw, Share2, Trophy } from 'lucide-react';
import Header from '../components/Header';
import LeaderboardTable from '../components/LeaderboardTable';
import ContestTimer from '../components/ContestTimer';
import {
  fetchContestById,
  fetchLeaderboard,
  clearContestSliceErrors,
} from '../contestSlice';

const ContestLeaderboard = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    currentContest,
    leaderboard,
    detailLoading,
    leaderboardLoading,
    detailError,
  } = useSelector((state) => state.contest);
  const { user } = useSelector((state) => state.auth);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    dispatch(clearContestSliceErrors());
    dispatch(fetchContestById(contestId));
    dispatch(fetchLeaderboard(contestId));
  }, [dispatch, contestId]);

  useEffect(() => {
    if (!autoRefresh || currentContest?.status !== 'live') return;
    const interval = setInterval(() => {
      dispatch(fetchLeaderboard(contestId));
      setLastRefresh(Date.now());
    }, 30000);
    return () => clearInterval(interval);
  }, [dispatch, contestId, autoRefresh, currentContest?.status]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchLeaderboard(contestId));
    setLastRefresh(Date.now());
  }, [dispatch, contestId]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
  };

  const getTimeSinceRefresh = () => {
    const seconds = Math.floor((Date.now() - lastRefresh) / 1000);
    if (seconds < 5) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    return `${Math.floor(seconds / 60)}m ago`;
  };

  if (!detailLoading && detailError && !currentContest) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--cc-bg-primary)' }}>
        <Header />
        <Box sx={{ pt: '80px' }}>
          <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
            <p className="text-sm text-[#f87171] mb-4">{detailError}</p>
            <button type="button" onClick={() => navigate('/contest')} className="cc-btn-primary">
              Back to contests
            </button>
          </Container>
        </Box>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--cc-bg-primary)' }}>
      <Header />
      <Box sx={{ pt: '80px' }}>
        <Container maxWidth="xl" sx={{ py: 5 }}>
          {/* Back button */}
          <button
            onClick={() => navigate(`/contest/${contestId}`)}
            className="inline-flex items-center gap-2 text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Contest</span>
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Trophy size={22} className="text-[var(--cc-primary-light)]" />
                <h1 className="text-2xl font-bold text-[var(--cc-text-primary)]">
                  {currentContest?.title || 'Contest'} — Leaderboard
                </h1>
                {currentContest?.status === 'live' && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(16,185,129,0.12)] text-[#34d399] border border-[rgba(16,185,129,0.2)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>
              {currentContest?.status === 'live' && currentContest?.endTime && (
                <p className="text-sm text-[var(--cc-text-muted)] ml-[34px]">
                  Ends in <ContestTimer targetTime={currentContest.endTime} type="countdown" className="!text-sm" />
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--cc-text-dimmed)]">Updated {getTimeSinceRefresh()}</span>
              <button
                onClick={handleRefresh}
                disabled={leaderboardLoading}
                className="cc-btn-ghost flex items-center gap-1.5 !py-1.5 !px-3 !text-xs"
              >
                <RefreshCw size={13} className={leaderboardLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
              <button
                onClick={handleShare}
                className="cc-btn-ghost flex items-center gap-1.5 !py-1.5 !px-3 !text-xs"
              >
                <Share2 size={13} />
                Share
              </button>
              {currentContest?.status === 'live' && (
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    autoRefresh
                      ? 'bg-[rgba(16,185,129,0.1)] text-[#34d399] border border-[rgba(16,185,129,0.2)]'
                      : 'text-[var(--cc-text-muted)] border border-[var(--cc-border)]'
                  }`}
                >
                  Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
                </button>
              )}
            </div>
          </div>

          {detailLoading && !currentContest && (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="w-10 h-10 rounded-full border-[3px] border-[var(--cc-border)] border-t-[var(--cc-primary)] animate-spin" />
            </div>
          )}

          {leaderboardLoading && !leaderboard.length && currentContest && (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="w-10 h-10 rounded-full border-[3px] border-[var(--cc-border)] border-t-[var(--cc-primary)] animate-spin" />
            </div>
          )}

          <div className="animate-fade-in">
            <LeaderboardTable
              data={leaderboard}
              problems={currentContest?.problems || []}
              currentUserId={user?._id}
            />
          </div>
        </Container>
      </Box>
    </div>
  );
};

export default ContestLeaderboard;
