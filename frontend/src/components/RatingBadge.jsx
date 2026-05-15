import { useMemo } from 'react';

const getRatingInfo = (rating) => {
  if (rating >= 2400) return { title: 'Grandmaster', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.12)' };
  if (rating >= 2100) return { title: 'Master', color: '#f97316', bg: 'rgba(249, 115, 22, 0.12)' };
  if (rating >= 1900) return { title: 'Candidate Master', color: '#a855f7', bg: 'rgba(168, 85, 247, 0.12)' };
  if (rating >= 1600) return { title: 'Expert', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.12)' };
  if (rating >= 1400) return { title: 'Specialist', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.12)' };
  if (rating >= 1200) return { title: 'Pupil', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)' };
  return { title: 'Newbie', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.12)' };
};

const RatingBadge = ({ rating, showTitle = true, size = 'md' }) => {
  const info = useMemo(() => getRatingInfo(rating || 0), [rating]);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClasses[size]}`}
      style={{ background: info.bg, color: info.color, border: `1px solid ${info.color}33` }}
    >
      <span>{rating || 0}</span>
      {showTitle && (
        <span className="opacity-80 font-medium">· {info.title}</span>
      )}
    </span>
  );
};

export { getRatingInfo };
export default RatingBadge;
