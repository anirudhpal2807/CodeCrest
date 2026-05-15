import { useState, useEffect, useMemo } from 'react';

const ContestTimer = ({ targetTime, type = 'countdown', className = '' }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeData = useMemo(() => {
    const target = new Date(targetTime).getTime();
    const diff = type === 'countdown' ? target - now : now - target;

    if (diff <= 0 && type === 'countdown') {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const absDiff = Math.abs(diff);
    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, total: absDiff };
  }, [now, targetTime, type]);

  const isUrgent = type === 'countdown' && timeData.total > 0 && timeData.total < 5 * 60 * 1000;

  const pad = (n) => String(n).padStart(2, '0');

  const formatTime = () => {
    const parts = [];
    if (timeData.days > 0) parts.push(`${timeData.days}d`);
    parts.push(`${pad(timeData.hours)}:${pad(timeData.minutes)}:${pad(timeData.seconds)}`);
    return parts.join(' ');
  };

  if (type === 'countdown' && timeData.total <= 0) {
    return (
      <span className={`font-mono font-semibold text-[var(--cc-success)] ${className}`}>
        Started!
      </span>
    );
  }

  return (
    <span
      className={`font-mono font-semibold ${isUrgent ? 'animate-pulse text-[var(--cc-error)]' : 'text-[var(--cc-text-primary)]'} ${className}`}
    >
      {formatTime()}
    </span>
  );
};

export default ContestTimer;
