import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, Trash2, AlertCircle } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

function getDifficultyBadge(difficulty) {
  const d = (difficulty || '').toLowerCase();
  if (d === 'easy') return 'cc-badge-easy';
  if (d === 'medium') return 'cc-badge-medium';
  return 'cc-badge-hard';
}

const AdminDelete = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get('/problem/getAllProblem');
      setProblems(data);
    } catch (err) {
      setError('Failed to fetch problems');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this problem?')) return;

    try {
      await axiosClient.delete(`/problem/delete/${id}`);
      setProblems(problems.filter((problem) => problem._id !== id));
    } catch (err) {
      setError('Failed to delete problem');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cc-bg-primary)] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-[var(--cc-primary)]"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--cc-bg-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <NavLink
          to="/admin"
          className="inline-flex items-center gap-2 text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Admin</span>
        </NavLink>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--cc-text-primary)] mb-2">
            Delete Problems
          </h1>
          <p className="text-[var(--cc-text-secondary)]">
            Select a problem to permanently remove it from the platform
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] rounded-xl px-5 py-4">
            <AlertCircle size={20} className="text-[var(--cc-error)] shrink-0" />
            <p className="text-sm text-[#f87171]">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="cc-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--cc-bg-secondary)]">
                  <th className="text-left text-xs font-semibold text-[var(--cc-text-muted)] uppercase tracking-wider px-6 py-4 w-16">
                    #
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--cc-text-muted)] uppercase tracking-wider px-6 py-4">
                    Title
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--cc-text-muted)] uppercase tracking-wider px-6 py-4 w-32">
                    Difficulty
                  </th>
                  <th className="text-left text-xs font-semibold text-[var(--cc-text-muted)] uppercase tracking-wider px-6 py-4 w-40">
                    Tags
                  </th>
                  <th className="text-right text-xs font-semibold text-[var(--cc-text-muted)] uppercase tracking-wider px-6 py-4 w-32">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--cc-border)]">
                {problems.map((problem, index) => (
                  <tr
                    key={problem._id}
                    className="hover:bg-[var(--cc-bg-elevated)] transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-[var(--cc-text-muted)]">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-[var(--cc-text-primary)]">
                      {problem.title}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`cc-badge ${getDifficultyBadge(problem.difficulty)}`}>
                        {problem.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="cc-badge cc-badge-primary">{problem.tags}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(problem._id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-[#f87171] bg-[rgba(239,68,68,0.1)] hover:bg-[rgba(239,68,68,0.2)] border border-[rgba(239,68,68,0.2)] transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {problems.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-[var(--cc-text-muted)]">
                      No problems found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDelete;
