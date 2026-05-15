import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Box } from '@mui/material';
import { ArrowLeft, Calendar, Clock, Users, Zap, FileText, Trophy, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import ContestTimer from '../components/ContestTimer';
import LeaderboardTable from '../components/LeaderboardTable';
import {
  fetchContestById,
  registerForContest,
  fetchLeaderboard,
  clearContestSliceErrors,
} from '../contestSlice';

const tabs = [
  { key: 'problems', label: 'Problems', icon: FileText },
  { key: 'leaderboard', label: 'Leaderboard', icon: Trophy },
];

const ContestDetail = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    currentContest,
    leaderboard,
    detailLoading,
    leaderboardLoading,
    detailError,
    registering,
  } = useSelector((state) => state.contest);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('problems');

  useEffect(() => {
    dispatch(clearContestSliceErrors());
    dispatch(fetchContestById(contestId));
    dispatch(fetchLeaderboard(contestId));
  }, [dispatch, contestId]);

  const handleRegister = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/contest/${contestId}` } });
      return;
    }
    dispatch(registerForContest(contestId));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m} minutes`;
    if (m === 0) return `${h} hour${h > 1 ? 's' : ''}`;
    return `${h}h ${m}m`;
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'cc-badge cc-badge-easy';
      case 'medium': return 'cc-badge cc-badge-medium';
      case 'hard': return 'cc-badge cc-badge-hard';
      default: return 'cc-badge cc-badge-primary';
    }
  };

  if (detailLoading && !currentContest) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--cc-bg-primary)' }}>
        <Header />
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <div className="w-10 h-10 rounded-full border-[3px] border-[var(--cc-border)] border-t-[var(--cc-primary)] animate-spin" />
          <p className="mt-4 text-sm text-[var(--cc-text-muted)]">Loading contest...</p>
        </div>
      </div>
    );
  }

  if (!detailLoading && detailError && !currentContest) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--cc-bg-primary)' }}>
        <Header />
        <Box sx={{ pt: '80px' }}>
          <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
            <p className="text-sm text-[#f87171] mb-4">{detailError}</p>
            <button
              type="button"
              onClick={() => navigate('/contest')}
              className="cc-btn-primary"
            >
              Back to contests
            </button>
          </Container>
        </Box>
      </div>
    );
  }

  if (!currentContest) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--cc-bg-primary)' }}>
        <Header />
        <div className="flex flex-col justify-center items-center min-h-[40vh]" style={{ paddingTop: '80px' }}>
          <div className="w-10 h-10 rounded-full border-[3px] border-[var(--cc-border)] border-t-[var(--cc-primary)] animate-spin mb-4" />
          <p className="text-sm text-[var(--cc-text-muted)]">Preparing contest…</p>
        </div>
      </div>
    );
  }

  const contest = currentContest;
  const canShowProblems = contest.isRegistered && (contest.status === 'live' || contest.status === 'ended');

  return (
    <div className="min-h-screen" style={{ background: 'var(--cc-bg-primary)' }}>
      <Header />
      <Box sx={{ pt: '80px' }}>
        <Container maxWidth="lg" sx={{ py: 5 }}>
          {/* Back button */}
          <button
            onClick={() => navigate('/contest')}
            className="inline-flex items-center gap-2 text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">All Contests</span>
          </button>

          {/* Contest header card */}
          <div className="cc-card p-6 mb-6 animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <h1 className="text-2xl font-bold text-[var(--cc-text-primary)]">
                    {contest.title}
                  </h1>
                  {contest.status === 'live' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(16,185,129,0.12)] text-[#34d399] border border-[rgba(16,185,129,0.2)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
                      LIVE
                    </span>
                  )}
                  {contest.status === 'upcoming' && (
                    <span className="cc-badge cc-badge-primary">Upcoming</span>
                  )}
                  {contest.isRated && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[rgba(245,158,11,0.12)] text-[#fbbf24] border border-[rgba(245,158,11,0.2)]">
                      <Zap size={10} /> Rated
                    </span>
                  )}
                </div>

                {contest.description && (
                  <p className="text-sm text-[var(--cc-text-secondary)] mb-4 max-w-2xl">
                    {contest.description}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--cc-text-secondary)]">
                  <span className="inline-flex items-center gap-2">
                    <Calendar size={14} className="text-[var(--cc-text-muted)]" />
                    {formatDate(contest.startTime)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Clock size={14} className="text-[var(--cc-text-muted)]" />
                    {formatDuration(contest.duration)}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Users size={14} className="text-[var(--cc-text-muted)]" />
                    {contest.participantCount || 0} registered
                  </span>
                </div>
              </div>

              {/* Timer & Register */}
              <div className="flex flex-col items-end gap-3">
                {contest.status === 'upcoming' && (
                  <div className="text-right">
                    <p className="text-xs text-[var(--cc-text-muted)] mb-1 uppercase tracking-wider">Starts in</p>
                    <ContestTimer targetTime={contest.startTime} type="countdown" className="text-xl" />
                  </div>
                )}
                {contest.status === 'live' && (
                  <div className="text-right">
                    <p className="text-xs text-[var(--cc-text-muted)] mb-1 uppercase tracking-wider">Ends in</p>
                    <ContestTimer targetTime={contest.endTime} type="countdown" className="text-xl" />
                  </div>
                )}

                {!contest.isRegistered && contest.status !== 'ended' && (
                  <button
                    onClick={handleRegister}
                    disabled={registering || detailLoading}
                    className="cc-btn-primary flex items-center gap-2 mt-2"
                    style={registering ? { opacity: 0.6 } : {}}
                  >
                    {registering ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    ) : (
                      <CheckCircle size={16} />
                    )}
                    {!isAuthenticated ? 'Sign in to register' : 'Register'}
                  </button>
                )}
                {contest.isRegistered && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[rgba(16,185,129,0.1)] text-[#34d399] border border-[rgba(16,185,129,0.2)]">
                    <CheckCircle size={14} />
                    Registered
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rules section */}
          {contest.rules && (
            <div className="cc-card p-5 mb-6">
              <h3 className="text-sm font-semibold text-[var(--cc-text-primary)] mb-2">Rules</h3>
              <p className="text-sm text-[var(--cc-text-secondary)] whitespace-pre-wrap">{contest.rules}</p>
              {contest.penaltyTime && (
                <p className="text-xs text-[var(--cc-text-muted)] mt-2">
                  Penalty: {contest.penaltyTime} minutes per wrong submission
                </p>
              )}
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--cc-bg-secondary)] border border-[var(--cc-border)] w-fit mb-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-[var(--cc-primary)] text-white shadow-lg shadow-[rgba(99,102,241,0.3)]'
                      : 'text-[var(--cc-text-muted)] hover:text-[var(--cc-text-secondary)]'
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Problems tab */}
          {activeTab === 'problems' && (
            <div className="animate-fade-in">
              {canShowProblems ? (
                <div className="space-y-3">
                  {(contest.problems || []).map((prob, idx) => (
                    <div
                      key={prob.problemId?._id || idx}
                      onClick={() => {
                        const pid = prob.problemId?._id;
                        if (!pid) return;
                        if (contest.status === 'live') {
                          navigate(`/contest/${contestId}/problem/${pid}`);
                        } else if (contest.status === 'ended') {
                          navigate(`/problem/${pid}`);
                        }
                      }}
                      className={`cc-card p-4 flex items-center justify-between ${contest.status === 'live' || contest.status === 'ended' ? 'cursor-pointer' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-[var(--cc-bg-secondary)] text-sm font-semibold text-[var(--cc-text-muted)]">
                          {prob.order || idx + 1}
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-[var(--cc-text-primary)]">
                            {prob.problemId?.title || `Problem ${idx + 1}`}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            {prob.problemId?.difficulty && (
                              <span className={getDifficultyBadge(prob.problemId.difficulty)}>
                                {prob.problemId.difficulty}
                              </span>
                            )}
                            {prob.problemId?.tags && (
                              <span className="text-xs text-[var(--cc-text-dimmed)]">{prob.problemId.tags}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-[var(--cc-primary-light)]">
                        {prob.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <FileText size={36} className="text-[var(--cc-text-dimmed)] mb-3" />
                  <p className="text-sm text-[var(--cc-text-muted)]">
                    {!contest.isRegistered
                      ? 'Register to see problems when the contest goes live.'
                      : 'Problems will be revealed when the contest starts.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Leaderboard tab */}
          {activeTab === 'leaderboard' && (
            <div className="animate-fade-in">
              {leaderboardLoading && leaderboard.length === 0 && (
                <div className="flex justify-center py-12 mb-4">
                  <div className="w-8 h-8 rounded-full border-[3px] border-[var(--cc-border)] border-t-[var(--cc-primary)] animate-spin" />
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-[var(--cc-text-primary)]">Rankings</h3>
                <button
                  onClick={() => navigate(`/contest/${contestId}/leaderboard`)}
                  className="text-xs text-[var(--cc-primary-light)] hover:text-[var(--cc-primary)] transition-colors cursor-pointer"
                >
                  View full leaderboard →
                </button>
              </div>
              <LeaderboardTable
                data={leaderboard}
                problems={contest.problems || []}
                currentUserId={user?._id}
              />
            </div>
          )}
        </Container>
      </Box>
    </div>
  );
};

export default ContestDetail;
