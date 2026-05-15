import { useMemo } from 'react';
import { Trophy } from 'lucide-react';

const rankColors = {
  1: { text: '#fbbf24', bg: 'rgba(245, 158, 11, 0.12)' },
  2: { text: '#94a3b8', bg: 'rgba(148, 163, 184, 0.12)' },
  3: { text: '#d97706', bg: 'rgba(217, 119, 6, 0.12)' }
};

const LeaderboardTable = ({ data = [], problems = [], currentUserId }) => {
  const columns = useMemo(() => {
    const base = ['Rank', 'User', 'Score', 'Penalty'];
    const problemCols = problems.map((p, i) => p.title || `P${i + 1}`);
    return [...base, ...problemCols];
  }, [problems]);

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Trophy size={40} className="text-[var(--cc-text-dimmed)] mb-3" />
        <p className="text-sm text-[var(--cc-text-muted)]">No submissions yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--cc-border)]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[var(--cc-bg-secondary)]">
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--cc-text-muted)]"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => {
            const isCurrentUser = entry.userId === currentUserId;
            const rankColor = rankColors[entry.rank];

            return (
              <tr
                key={entry.userId || idx}
                className={`border-t border-[var(--cc-border)] transition-colors ${
                  isCurrentUser
                    ? 'bg-[rgba(99,102,241,0.08)] border-l-2 border-l-[var(--cc-primary)]'
                    : 'hover:bg-[var(--cc-bg-card-hover)]'
                }`}
              >
                <td className="px-4 py-3">
                  {rankColor ? (
                    <span
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold"
                      style={{ background: rankColor.bg, color: rankColor.text }}
                    >
                      {entry.rank}
                    </span>
                  ) : (
                    <span className="text-[var(--cc-text-secondary)] font-medium pl-2">
                      {entry.rank}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${isCurrentUser ? 'text-[var(--cc-primary-light)]' : 'text-[var(--cc-text-primary)]'}`}>
                    {entry.firstName} {entry.lastName}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-[var(--cc-text-primary)]">
                  {entry.totalPoints}
                </td>
                <td className="px-4 py-3 text-[var(--cc-text-secondary)]">
                  {entry.totalPenalty}
                </td>
                {problems.map((prob, pIdx) => {
                  const problemResult = entry.problems?.find(
                    p => p.problemId === (prob.problemId?._id || prob.problemId || prob._id)
                  );
                  return (
                    <td key={pIdx} className="px-4 py-3">
                      {problemResult ? (
                        <div className="text-center">
                          <span className={`text-xs font-semibold ${problemResult.accepted ? 'text-[var(--cc-success)]' : 'text-[var(--cc-error)]'}`}>
                            {problemResult.accepted ? `+${problemResult.points}` : `-${problemResult.attempts}`}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[var(--cc-text-dimmed)]">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
