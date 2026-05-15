import { useEffect, useState } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { ArrowLeft, AlertCircle, Save } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import { useToast } from './Toast';

function AdminEdit() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    difficulty: 'easy',
    tags: 'array',
    visibleTestCases: [],
    hiddenTestCases: [],
    startCode: [
      { language: 'C++', initialCode: '' },
      { language: 'Java', initialCode: '' },
      { language: 'JavaScript', initialCode: '' },
    ],
    referenceSolution: [
      { language: 'C++', completeCode: '' },
      { language: 'Java', completeCode: '' },
      { language: 'JavaScript', completeCode: '' },
    ],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const { data } = await axiosClient.get(`/problem/problemById/${problemId}`);
        setForm({
          title: data.title || '',
          description: data.description || '',
          difficulty: (data.difficulty || '').toLowerCase() || 'easy',
          tags: data.tags || 'array',
          visibleTestCases: data.visibleTestCases || [],
          hiddenTestCases: data.hiddenTestCases || [],
          startCode: data.startCode || form.startCode,
          referenceSolution: data.referenceSolution || form.referenceSolution,
        });
      } catch (err) {
        setError('Failed to load problem');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProblem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problemId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await axiosClient.put(`/problem/update/${problemId}`, form);
      showToast('Problem updated successfully!', 'success');
      setTimeout(() => navigate('/admin/update'), 1500);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.response?.data || 'Failed to update';
      setError(errMsg);
      showToast(String(errMsg), 'error', 4000);
    } finally {
      setSaving(false);
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
      <ToastContainer />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <NavLink
          to="/admin/update"
          className="inline-flex items-center gap-2 text-[var(--cc-text-secondary)] hover:text-[var(--cc-text-primary)] transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-medium">Back to Problems</span>
        </NavLink>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[var(--cc-text-primary)] mb-2">
            Edit Problem
          </h1>
          <p className="text-[var(--cc-text-secondary)]">
            Update the details for this problem
          </p>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mb-6 flex items-center gap-3 bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] rounded-xl px-5 py-4">
            <AlertCircle size={20} className="text-[var(--cc-error)] shrink-0" />
            <p className="text-sm text-[#f87171]">{String(error)}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="cc-card p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-1.5">
                Title
              </label>
              <input
                name="title"
                className="cc-input w-full"
                value={form.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-1.5">
                Description
              </label>
              <textarea
                name="description"
                rows={6}
                className="cc-input w-full resize-y"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-1.5">
                  Difficulty
                </label>
                <select
                  name="difficulty"
                  className="cc-input w-full"
                  value={form.difficulty}
                  onChange={handleChange}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-1.5">
                  Tag
                </label>
                <select
                  name="tags"
                  className="cc-input w-full"
                  value={form.tags}
                  onChange={handleChange}
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="cc-btn-primary w-full text-base py-3 inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminEdit;
