import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../utils/axiosClient';

function AdminEdit(){
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
      { language: 'JavaScript', initialCode: '' }
    ],
    referenceSolution: [
      { language: 'C++', completeCode: '' },
      { language: 'Java', completeCode: '' },
      { language: 'JavaScript', completeCode: '' }
    ]
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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
          referenceSolution: data.referenceSolution || form.referenceSolution
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
      alert('Problem updated successfully');
      navigate('/admin/update');
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Edit Problem</h1>

      {error && (
        <div className="alert alert-error mb-4">
          <span>{String(error)}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="form-control">
          <label className="label"><span className="label-text">Title</span></label>
          <input name="title" className="input input-bordered" value={form.title} onChange={handleChange} />
        </div>
        <div className="form-control">
          <label className="label"><span className="label-text">Description</span></label>
          <textarea name="description" className="textarea textarea-bordered h-40" value={form.description} onChange={handleChange} />
        </div>
        <div className="flex gap-4">
          <div className="form-control w-1/2">
            <label className="label"><span className="label-text">Difficulty</span></label>
            <select name="difficulty" className="select select-bordered" value={form.difficulty} onChange={handleChange}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="form-control w-1/2">
            <label className="label"><span className="label-text">Tag</span></label>
            <select name="tags" className="select select-bordered" value={form.tags} onChange={handleChange}>
              <option value="array">Array</option>
              <option value="linkedList">Linked List</option>
              <option value="graph">Graph</option>
              <option value="dp">DP</option>
            </select>
          </div>
        </div>

        <button type="submit" className={`btn btn-primary ${saving ? 'loading' : ''}`} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}

export default AdminEdit;


