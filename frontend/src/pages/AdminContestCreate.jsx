import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Search, Trophy, Save } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';

const AdminContestCreate = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(contestId);

  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    duration: 120,
    isRated: true,
    rules: '',
    penaltyTime: 10,
    problems: []
  });

  const [problemSearch, setProblemSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchFeedback, setSearchFeedback] = useState('');
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      const fetchContest = async () => {
        try {
          const res = await axiosClient.get(`/contest/${contestId}`);
          const c = res.data;
          setForm({
            title: c.title || '',
            description: c.description || '',
            startTime: c.startTime ? new Date(c.startTime).toISOString().slice(0, 16) : '',
            endTime: c.endTime ? new Date(c.endTime).toISOString().slice(0, 16) : '',
            duration: c.duration || 120,
            isRated: c.isRated ?? true,
            rules: c.rules || '',
            penaltyTime: c.penaltyTime || 10,
            problems: (c.problems || []).map(p => ({
              problemId: p.problemId?._id || p.problemId,
              title: p.problemId?.title || '',
              difficulty: p.problemId?.difficulty || '',
              points: p.points || 100,
              order: p.order || 1
            }))
          });
        } catch (err) {
          setError('Failed to load contest for editing');
        }
      };
      fetchContest();
    }
  }, [contestId, isEdit]);

  const handleSearchProblems = async () => {
    setSearching(true);
    setSearchFeedback('');
    try {
      const res = await axiosClient.get('/problem/getAllProblem');
      const problems = Array.isArray(res.data) ? res.data : [];
      const q = problemSearch.trim().toLowerCase();
      const filtered = q
        ? problems.filter((p) => (p.title || '').toLowerCase().includes(q))
        : problems;
      setSearchResults(filtered.slice(0, 25));
      if (filtered.length === 0) {
        setSearchResults([]);
        setSearchFeedback(
          q
            ? 'No problems match that title. Try another keyword or leave the box empty to list all.'
            : 'No problems in the database yet. Add them from Admin → Create Problem.'
        );
      }
    } catch (err) {
      setSearchResults([]);
      const msg =
        err.response?.status === 404
          ? 'No problems in the database yet. Create problems from Admin → Create Problem.'
          : err.response?.data?.message || err.message || 'Could not load problems.';
      setSearchFeedback(typeof msg === 'string' ? msg : 'Could not load problems.');
    } finally {
      setSearching(false);
    }
  };

  const addProblem = (problem) => {
    if (form.problems.some((p) => String(p.problemId) === String(problem._id))) return;
    setForm(prev => ({
      ...prev,
      problems: [...prev.problems, {
        problemId: problem._id,
        title: problem.title,
        difficulty: problem.difficulty,
        points: 100,
        order: prev.problems.length + 1
      }]
    }));
    setSearchResults([]);
    setProblemSearch('');
  };

  const removeProblem = (problemId) => {
    setForm(prev => ({
      ...prev,
      problems: prev.problems.filter(p => String(p.problemId) !== String(problemId))
        .map((p, i) => ({ ...p, order: i + 1 }))
    }));
  };

  const updateProblemPoints = (problemId, points) => {
    setForm(prev => ({
      ...prev,
      problems: prev.problems.map(p =>
        String(p.problemId) === String(problemId) ? { ...p, points: parseInt(points) || 0 } : p
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const payload = {
        ...form,
        startTime: form.startTime ? new Date(form.startTime).toISOString() : '',
        endTime: form.endTime ? new Date(form.endTime).toISOString() : '',
        problems: form.problems.map(p => ({
          problemId: p.problemId,
          points: p.points,
          order: p.order
        }))
      };

      if (isEdit) {
        await axiosClient.put(`/contest/update/${contestId}`, payload);
        setSuccess('Contest updated successfully!');
        setTimeout(() => {
          navigate('/admin/contest', {
            replace: true,
            state: { flash: 'Contest updated successfully.' },
          });
        }, 900);
      } else {
        await axiosClient.post('/contest/create', payload);
        setSuccess('Contest created successfully! Redirecting…');
        setTimeout(() => {
          navigate('/admin/contest', {
            replace: true,
            state: { flash: 'Contest created successfully.' },
          });
        }, 900);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save contest');
    } finally {
      setSaving(false);
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'cc-badge cc-badge-easy';
      case 'medium': return 'cc-badge cc-badge-medium';
      case 'hard': return 'cc-badge cc-badge-hard';
      default: return 'cc-badge cc-badge-primary';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--cc-bg-primary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <NavLink
          to="/admin/contest"
          className="inline-flex items-center gap-2 text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Contests</span>
        </NavLink>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-xl bg-[rgba(6,182,212,0.12)]">
              <Trophy size={24} className="text-[#22d3ee]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--cc-text-primary)]">
              {isEdit ? 'Edit Contest' : 'Create Contest'}
            </h1>
          </div>
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-2">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
              className="cc-input w-full"
              placeholder="Weekly Contest #1"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              className="cc-input w-full min-h-[100px] resize-y"
              placeholder="Describe the contest..."
              rows={3}
            />
          </div>

          {/* Time fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-2">Start Time</label>
              <input
                type="datetime-local"
                value={form.startTime}
                onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                className="cc-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-2">End Time</label>
              <input
                type="datetime-local"
                value={form.endTime}
                onChange={(e) => setForm(prev => ({ ...prev, endTime: e.target.value }))}
                className="cc-input w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-2">Duration (min)</label>
              <input
                type="number"
                value={form.duration}
                onChange={(e) => setForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                className="cc-input w-full"
                min="1"
                required
              />
            </div>
          </div>

          {/* Rated toggle + Penalty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-2">Penalty Time (min per wrong submission)</label>
              <input
                type="number"
                value={form.penaltyTime}
                onChange={(e) => setForm(prev => ({ ...prev, penaltyTime: parseInt(e.target.value) || 0 }))}
                className="cc-input w-full"
                min="0"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-[var(--cc-border)] bg-[var(--cc-bg-card)] w-full">
                <input
                  type="checkbox"
                  checked={form.isRated}
                  onChange={(e) => setForm(prev => ({ ...prev, isRated: e.target.checked }))}
                  className="w-4 h-4 rounded border-[var(--cc-border)] accent-[var(--cc-primary)]"
                />
                <span className="text-sm font-medium text-[var(--cc-text-primary)]">Rated Contest</span>
              </label>
            </div>
          </div>

          {/* Rules */}
          <div>
            <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-2">Rules</label>
            <textarea
              value={form.rules}
              onChange={(e) => setForm(prev => ({ ...prev, rules: e.target.value }))}
              className="cc-input w-full min-h-[120px] resize-y"
              placeholder="Contest rules..."
              rows={4}
            />
          </div>

          {/* Problem selector */}
          <div>
            <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-2">Problems</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={problemSearch}
                onChange={(e) => setProblemSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchProblems())}
                className="cc-input flex-1"
                placeholder="Search by title, or leave blank to list all problems"
              />
              <button
                type="button"
                onClick={handleSearchProblems}
                disabled={searching}
                className="cc-btn-ghost flex items-center gap-1.5 !px-4"
              >
                <Search size={14} />
                Search
              </button>
            </div>
            {searchFeedback && (
              <p className="text-xs text-[var(--cc-text-muted)] mb-3">{searchFeedback}</p>
            )}

            {/* Search results */}
            {searchResults.length > 0 && (
              <div className="mb-4 rounded-lg border border-[var(--cc-border)] overflow-hidden">
                {searchResults.map((prob) => (
                  <div
                    key={prob._id}
                    className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--cc-border)] last:border-b-0 hover:bg-[var(--cc-bg-card-hover)] transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--cc-text-primary)]">{prob.title}</span>
                      <span className={getDifficultyBadge(prob.difficulty)}>{prob.difficulty}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => addProblem(prob)}
                      className="flex items-center gap-1 text-xs text-[var(--cc-primary-light)] hover:text-[var(--cc-primary)] cursor-pointer"
                    >
                      <Plus size={13} /> Add
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Selected problems */}
            {form.problems.length > 0 && (
              <div className="space-y-2">
                {form.problems.map((prob, idx) => (
                  <div
                    key={prob.problemId}
                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--cc-bg-card)] border border-[var(--cc-border)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 flex items-center justify-center rounded-md bg-[var(--cc-bg-secondary)] text-xs font-semibold text-[var(--cc-text-muted)]">
                        {idx + 1}
                      </span>
                      <span className="text-sm text-[var(--cc-text-primary)]">{prob.title}</span>
                      {prob.difficulty && (
                        <span className={getDifficultyBadge(prob.difficulty)}>{prob.difficulty}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        value={prob.points}
                        onChange={(e) => updateProblemPoints(prob.problemId, e.target.value)}
                        className="cc-input !w-20 !py-1 !px-2 text-xs text-center"
                        min="1"
                        placeholder="Points"
                      />
                      <button
                        type="button"
                        onClick={() => removeProblem(prob.problemId)}
                        className="text-[var(--cc-error)] hover:text-[#f87171] cursor-pointer"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {form.problems.length === 0 && (
              <p className="text-xs text-[var(--cc-text-dimmed)] mt-2">No problems added yet. Search and add problems above.</p>
            )}
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="cc-btn-primary flex items-center gap-2"
              style={saving ? { opacity: 0.6 } : {}}
            >
              {saving ? (
                <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isEdit ? 'Update Contest' : 'Create Contest'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/contest')}
              className="cc-btn-ghost"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminContestCreate;
