import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { ArrowLeft, Plus, Edit, Trash2, Trophy, CheckCircle, LayoutDashboard } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const AdminContestManage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [finalizing, setFinalizing] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchContests = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axiosClient.get('/contest/all');
      const rows = Array.isArray(res.data) ? res.data : [];
      setContests(rows);
    } catch (err) {
      setError(
        typeof err.response?.data === 'string'
          ? err.response.data
          : err.response?.data?.message || err.message || 'Failed to load contests'
      );
      setContests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  useEffect(() => {
    const msg = typeof location.state?.flash === 'string' ? location.state.flash : '';
    if (!msg) return undefined;
    setSuccess(msg);
    navigate('.', { replace: true, state: {} });
    const t = setTimeout(() => setSuccess(''), 6000);
    return () => clearTimeout(t);
  }, [location.state?.flash, navigate]);

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/contest/delete/${id}`);
      setContests(prev => prev.filter(c => c._id !== id));
      setDeleteConfirm(null);
      setSuccess('Contest deleted');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete contest');
    }
  };

  const handleFinalize = async (id) => {
    setFinalizing(id);
    try {
      await axiosClient.post(`/contest/finalize/${id}`);
      setSuccess('Contest finalized — ratings updated!');
      setTimeout(() => setSuccess(''), 3000);
      fetchContests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to finalize contest');
    } finally {
      setFinalizing(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[rgba(16,185,129,0.12)] text-[#34d399] border border-[rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
            Live
          </span>
        );
      case 'upcoming':
        return <span className="cc-badge cc-badge-primary">Upcoming</span>;
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
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[var(--cc-bg-primary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <NavLink
          to="/admin"
          className="inline-flex items-center gap-2 text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Admin</span>
        </NavLink>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-[rgba(6,182,212,0.12)]">
                <Trophy size={24} className="text-[#22d3ee]" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--cc-text-primary)]">
                Manage Contests
              </h1>
            </div>
            <p className="text-[var(--cc-text-secondary)] text-sm ml-[52px]">
              Create, edit, and manage coding contests
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/contest/create')}
            className="cc-btn-primary flex items-center gap-2"
          >
            <Plus size={16} />
            New Contest
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)] text-sm text-[#f87171]">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-lg bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)] text-sm text-[#34d399]">
            {success}
          </div>
        )}

        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="w-10 h-10 rounded-full border-[3px] border-[var(--cc-border)] border-t-[var(--cc-primary)] animate-spin" />
          </div>
        )}

        {!loading && contests.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Trophy size={40} className="text-[var(--cc-text-dimmed)] mb-4" />
            <h3 className="text-lg font-semibold text-[var(--cc-text-primary)] mb-2">No contests yet</h3>
            <p className="text-sm text-[var(--cc-text-muted)] mb-4">Create your first contest to get started</p>
            <button onClick={() => navigate('/admin/contest/create')} className="cc-btn-primary flex items-center gap-2">
              <Plus size={16} /> Create Contest
            </button>
          </div>
        )}

        {!loading && contests.length > 0 && (
          <div className="space-y-3">
            {contests.map((contest) => (
              <div key={contest._id} className="cc-card p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base font-semibold text-[var(--cc-text-primary)]">
                        {contest.title}
                      </h3>
                      {getStatusBadge(contest.status)}
                      {contest.isRated && (
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[rgba(245,158,11,0.12)] text-[#fbbf24]">
                          Rated
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[var(--cc-text-muted)]">
                      <span>Start: {formatDate(contest.startTime)}</span>
                      <span>End: {formatDate(contest.endTime)}</span>
                      <span>{contest.participantCount || 0} participants</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {contest.status === 'ended' && (
                      <button
                        onClick={() => handleFinalize(contest._id)}
                        disabled={finalizing === contest._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[rgba(16,185,129,0.1)] text-[#34d399] border border-[rgba(16,185,129,0.2)] hover:bg-[rgba(16,185,129,0.15)] transition-colors cursor-pointer"
                      >
                        {finalizing === contest._id ? (
                          <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                        ) : (
                          <CheckCircle size={13} />
                        )}
                        Finalize
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/admin/contest/edit/${contest._id}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--cc-text-secondary)] border border-[var(--cc-border)] hover:border-[var(--cc-border-hover)] hover:text-[var(--cc-text-primary)] transition-colors cursor-pointer"
                    >
                      <Edit size={13} />
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(contest._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--cc-error)] border border-[rgba(239,68,68,0.2)] hover:bg-[rgba(239,68,68,0.08)] transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Delete confirmation */}
                {deleteConfirm === contest._id && (
                  <div className="mt-4 pt-4 border-t border-[var(--cc-border)] flex items-center gap-3">
                    <p className="text-sm text-[var(--cc-text-secondary)]">Are you sure you want to delete this contest?</p>
                    <button
                      onClick={() => handleDelete(contest._id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--cc-error)] text-white cursor-pointer"
                    >
                      Confirm Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--cc-text-muted)] border border-[var(--cc-border)] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContestManage;
