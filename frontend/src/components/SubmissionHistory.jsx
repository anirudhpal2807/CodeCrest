import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get(`/problem/submittedProblem/${problemId}`);
        
        let submissionsData = [];
        if (Array.isArray(response.data)) {
          submissionsData = response.data;
        } else if (response.data && response.data.submissions) {
          submissionsData = response.data.submissions;
        }
        setSubmissions(Array.isArray(submissionsData) ? submissionsData : []);
      } catch (err) {
        console.error('Submission fetch error:', err);
        setError('Failed to fetch submission history. Please try again.');
        setSubmissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmissions();
  }, [problemId]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'accepted': return { bg: 'rgba(16, 185, 129, 0.12)', color: '#34d399', border: 'rgba(16, 185, 129, 0.2)' };
      case 'wrong': return { bg: 'rgba(239, 68, 68, 0.12)', color: '#f87171', border: 'rgba(239, 68, 68, 0.2)' };
      case 'error': return { bg: 'rgba(245, 158, 11, 0.12)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.2)' };
      case 'pending': return { bg: 'rgba(59, 130, 246, 0.12)', color: '#60a5fa', border: 'rgba(59, 130, 246, 0.2)' };
      default: return { bg: 'rgba(148, 163, 184, 0.12)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.2)' };
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <span className="loading loading-spinner loading-md" style={{ color: 'var(--cc-primary)' }}></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
        <span className="text-sm text-red-300">{error}</span>
      </div>
    );
  }

  return (
    <div>
      {submissions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 rounded-xl" style={{ background: 'var(--cc-bg-card)', border: '1px solid var(--cc-border)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="var(--cc-text-dimmed)" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="mt-3 text-sm" style={{ color: 'var(--cc-text-muted)' }}>No submissions yet for this problem</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--cc-border)' }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: 'var(--cc-bg-secondary)', borderBottom: '1px solid var(--cc-border)' }}>
                  <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--cc-text-muted)' }}>#</th>
                  <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--cc-text-muted)' }}>Language</th>
                  <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--cc-text-muted)' }}>Status</th>
                  <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--cc-text-muted)' }}>Runtime</th>
                  <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--cc-text-muted)' }}>Memory</th>
                  <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--cc-text-muted)' }}>Tests</th>
                  <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--cc-text-muted)' }}>Date</th>
                  <th className="px-4 py-3 text-left font-medium" style={{ color: 'var(--cc-text-muted)' }}>Code</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(submissions) && submissions.map((sub, index) => {
                  const statusStyle = getStatusStyle(sub.status);
                  return (
                    <tr 
                      key={sub._id} 
                      className="transition-colors"
                      style={{ 
                        borderBottom: '1px solid var(--cc-border)',
                        background: index % 2 === 0 ? 'transparent' : 'rgba(148, 163, 184, 0.02)'
                      }}
                    >
                      <td className="px-4 py-3 font-mono" style={{ color: 'var(--cc-text-muted)' }}>{index + 1}</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--cc-text-secondary)' }}>{sub.language}</td>
                      <td className="px-4 py-3">
                        <span 
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}
                        >
                          {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--cc-text-secondary)' }}>{sub.runtime}s</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--cc-text-secondary)' }}>{formatMemory(sub.memory)}</td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--cc-text-secondary)' }}>{sub.testCasesPassed}/{sub.testCasesTotal}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--cc-text-muted)' }}>{formatDate(sub.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button 
                          className="cc-btn-ghost !px-3 !py-1 !text-xs"
                          onClick={() => setSelectedSubmission(sub)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs" style={{ color: 'var(--cc-text-dimmed)' }}>
            {Array.isArray(submissions) ? submissions.length : 0} submissions
          </p>
        </>
      )}

      {selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="w-11/12 max-w-4xl max-h-[85vh] overflow-y-auto rounded-xl p-6" style={{ background: 'var(--cc-bg-card)', border: '1px solid var(--cc-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: 'var(--cc-text-primary)' }}>
                Submission — {selectedSubmission.language}
              </h3>
              <button 
                className="cc-btn-ghost !p-2"
                onClick={() => setSelectedSubmission(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {(() => {
                const s = getStatusStyle(selectedSubmission.status);
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>{selectedSubmission.status}</span>;
              })()}
              <span className="cc-badge cc-badge-primary">{selectedSubmission.runtime}s</span>
              <span className="cc-badge cc-badge-primary">{formatMemory(selectedSubmission.memory)}</span>
              <span className="cc-badge cc-badge-primary">{selectedSubmission.testCasesPassed}/{selectedSubmission.testCasesTotal} passed</span>
            </div>
            
            {selectedSubmission.errorMessage && (
              <div className="mb-4 px-4 py-3 rounded-lg" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <span className="text-sm text-red-300">{selectedSubmission.errorMessage}</span>
              </div>
            )}
            
            <pre className="p-4 rounded-lg overflow-x-auto text-sm font-mono" style={{ background: 'var(--cc-bg-primary)', color: 'var(--cc-text-primary)', border: '1px solid var(--cc-border)' }}>
              <code>{selectedSubmission.code}</code>
            </pre>
            
            <div className="flex justify-end mt-4">
              <button className="cc-btn-ghost" onClick={() => setSelectedSubmission(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
