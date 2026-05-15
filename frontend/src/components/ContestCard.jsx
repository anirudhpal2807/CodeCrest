import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, Zap } from 'lucide-react';
import ContestTimer from './ContestTimer';

const ContestCard = ({ contest }) => {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    switch (contest.status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(16,185,129,0.12)] text-[#34d399] border border-[rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            LIVE
          </span>
        );
      case 'upcoming':
        return (
          <span className="cc-badge cc-badge-primary">Upcoming</span>
        );
      case 'ended':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(100,116,139,0.12)] text-[var(--cc-text-muted)] border border-[rgba(100,116,139,0.2)]">
            Ended
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    if (!minutes) return '';
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
  };

  return (
    <div
      onClick={() => navigate(`/contest/${contest._id}`)}
      className="cc-card p-5 cursor-pointer group relative overflow-hidden"
    >
      {contest.status === 'live' && (
        <div className="absolute inset-0 rounded-[var(--cc-radius-lg)] border border-[rgba(16,185,129,0.3)] animate-pulse pointer-events-none" />
      )}

      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-semibold text-[var(--cc-text-primary)] group-hover:text-[var(--cc-primary-light)] transition-colors line-clamp-1">
          {contest.title}
        </h3>
        {getStatusBadge()}
      </div>

      {contest.description && (
        <p className="text-sm text-[var(--cc-text-muted)] mb-4 line-clamp-2">
          {contest.description}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--cc-text-secondary)]">
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={13} className="text-[var(--cc-text-muted)]" />
          {formatDate(contest.startTime)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={13} className="text-[var(--cc-text-muted)]" />
          {formatDuration(contest.duration)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users size={13} className="text-[var(--cc-text-muted)]" />
          {contest.participantCount || 0}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[var(--cc-border)]">
        {contest.isRated && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[rgba(245,158,11,0.12)] text-[#fbbf24] border border-[rgba(245,158,11,0.2)]">
            <Zap size={10} />
            Rated
          </span>
        )}
        {contest.status === 'upcoming' && (
          <span className="text-xs text-[var(--cc-text-muted)] ml-auto">
            Starts in <ContestTimer targetTime={contest.startTime} type="countdown" className="!text-xs" />
          </span>
        )}
        {contest.status === 'live' && (
          <span className="text-xs text-[var(--cc-text-muted)] ml-auto">
            Ends in <ContestTimer targetTime={contest.endTime} type="countdown" className="!text-xs" />
          </span>
        )}
        {contest.createdBy && (
          <span className="text-xs text-[var(--cc-text-dimmed)] ml-auto">
            by {contest.createdBy.firstName} {contest.createdBy.lastName}
          </span>
        )}
      </div>
    </div>
  );
};

export default ContestCard;
