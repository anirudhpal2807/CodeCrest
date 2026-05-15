import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Play, Upload, Trophy } from 'lucide-react';
import axiosClient from '../utils/axiosClient';
import ContestTimer from '../components/ContestTimer';

const langMap = { cpp: 'C++', java: 'Java', javascript: 'JavaScript' };

const ContestArena = () => {
  const { contestId, problemId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const editorRef = useRef(null);

  const [contest, setContest] = useState(null);
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [codeByLanguage, setCodeByLanguage] = useState({ javascript: '', java: '', cpp: '' });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [contestRes, problemRes] = await Promise.all([
          axiosClient.get(`/contest/${contestId}`),
          axiosClient.get(`/problem/problemById/${problemId}`)
        ]);
        setContest(contestRes.data);
        setProblem(problemRes.data);

        const startArray = problemRes.data?.startCode || [];
        const js = startArray.find(sc => sc.language === 'JavaScript')?.initialCode || '';
        const java = startArray.find(sc => sc.language === 'Java')?.initialCode || '';
        const cpp = startArray.find(sc => sc.language === 'C++')?.initialCode || '';
        setCodeByLanguage({ javascript: js, java, cpp });
      } catch (err) {
        console.error('Error fetching arena data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [contestId, problemId]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axiosClient.get(`/contest/${contestId}/leaderboard`);
        setLeaderboard(res.data?.slice(0, 10) || []);
      } catch (err) { /* silent */ }
    };
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [contestId]);

  const handleEditorChange = (value) => {
    setCodeByLanguage(prev => ({ ...prev, [selectedLanguage]: value || '' }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const response = await axiosClient.post(`/contest/${contestId}/submit/${problemId}`, {
        code: codeByLanguage[selectedLanguage] || '',
        language: selectedLanguage
      });
      setSubmitResult(response.data);
    } catch (error) {
      setSubmitResult({
        accepted: false,
        error: error.response?.data?.message || 'Submission failed'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      default: return 'javascript';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen" style={{ background: 'var(--cc-bg-primary)' }}>
        <div className="w-10 h-10 rounded-full border-[3px] border-[var(--cc-border)] border-t-[var(--cc-primary)] animate-spin" />
        <p className="mt-4 text-sm text-[var(--cc-text-muted)]">Loading arena...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--cc-bg-primary)' }}>
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2 shrink-0"
        style={{ background: 'var(--cc-bg-secondary)', borderBottom: '1px solid var(--cc-border)' }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/contest/${contestId}`)}
            className="flex items-center gap-1.5 text-xs text-[var(--cc-text-muted)] hover:text-[var(--cc-text-primary)] transition-colors cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <span className="text-[var(--cc-border)]">|</span>
          <span className="text-sm font-semibold text-[var(--cc-text-primary)]">
            {contest?.title}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {contest?.endTime && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--cc-text-muted)]">Time Left:</span>
              <ContestTimer targetTime={contest.endTime} type="countdown" className="text-sm" />
            </div>
          )}
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              showLeaderboard
                ? 'bg-[var(--cc-primary)] text-white'
                : 'text-[var(--cc-text-muted)] hover:text-[var(--cc-text-secondary)] border border-[var(--cc-border)]'
            }`}
          >
            <Trophy size={13} />
            Rank
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex min-h-0">
        {/* Left panel - Problem */}
        <div className="w-[45%] flex flex-col min-h-0" style={{ borderRight: '1px solid var(--cc-border)' }}>
          <div className="flex-1 overflow-y-auto p-6">
            {problem && (
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-lg font-bold text-[var(--cc-text-primary)]">{problem.title}</h1>
                  {problem.difficulty && (
                    <span className={`cc-badge cc-badge-${problem.difficulty}`}>
                      {problem.difficulty}
                    </span>
                  )}
                </div>
                <div className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--cc-text-secondary)] mb-6">
                  {problem.description}
                </div>
                {(problem.visibleTestCases || []).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--cc-text-primary)] mb-3">Examples</h3>
                    <div className="space-y-3">
                      {problem.visibleTestCases.map((tc, i) => (
                        <div key={i} className="rounded-lg p-4 bg-[var(--cc-bg-card)] border border-[var(--cc-border)]">
                          <div className="text-xs font-semibold text-[var(--cc-text-muted)] mb-2">Example {i + 1}</div>
                          <div className="space-y-1.5 text-sm font-mono text-[var(--cc-text-secondary)]">
                            <div><span className="text-[var(--cc-text-muted)]">Input: </span><span className="text-[var(--cc-text-primary)]">{tc.input}</span></div>
                            <div><span className="text-[var(--cc-text-muted)]">Output: </span><span className="text-[var(--cc-text-primary)]">{tc.output}</span></div>
                            {tc.explanation && (
                              <div className="pt-1.5 border-t border-[var(--cc-border)]">
                                <span className="text-[var(--cc-text-muted)]">Explanation: </span>{tc.explanation}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right panel - Editor + Results */}
        <div className={`flex-1 flex flex-col min-h-0 ${showLeaderboard ? 'w-[35%]' : 'w-[55%]'}`}>
          {/* Language pills + Submit */}
          <div
            className="flex items-center justify-between px-4 py-2 shrink-0"
            style={{ background: 'var(--cc-bg-card)', borderBottom: '1px solid var(--cc-border)' }}
          >
            <div className="flex items-center gap-1.5">
              {['javascript', 'java', 'cpp'].map((lang) => {
                const active = selectedLanguage === lang;
                return (
                  <button
                    key={lang}
                    className="px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer"
                    style={{
                      background: active ? 'var(--cc-primary)' : 'transparent',
                      color: active ? '#fff' : 'var(--cc-text-muted)',
                      border: active ? 'none' : '1px solid var(--cc-border)',
                    }}
                    onClick={() => setSelectedLanguage(lang)}
                  >
                    {langMap[lang]}
                  </button>
                );
              })}
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="cc-btn-primary flex items-center gap-1.5 !py-1.5 !px-4 !text-xs !rounded-md"
              style={submitting ? { opacity: 0.6 } : {}}
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              ) : (
                <Upload size={13} />
              )}
              Submit
            </button>
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              language={getLanguageForMonaco(selectedLanguage)}
              value={codeByLanguage[selectedLanguage] || ''}
              onChange={handleEditorChange}
              onMount={(editor) => { editorRef.current = editor; }}
              theme="vs-dark"
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on',
                lineNumbers: 'on',
                glyphMargin: false,
                padding: { top: 12 },
              }}
            />
          </div>

          {/* Submit result */}
          {submitResult && (
            <div
              className="shrink-0 p-4"
              style={{ borderTop: '1px solid var(--cc-border)', background: 'var(--cc-bg-secondary)' }}
            >
              <div className={`flex items-center gap-3 p-3 rounded-lg ${
                submitResult.accepted
                  ? 'bg-[rgba(16,185,129,0.08)] border border-[rgba(16,185,129,0.2)]'
                  : 'bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)]'
              }`}>
                <div>
                  <p className={`text-sm font-semibold ${submitResult.accepted ? 'text-[#34d399]' : 'text-[#f87171]'}`}>
                    {submitResult.accepted ? 'Accepted!' : (submitResult.error || 'Wrong Answer')}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[var(--cc-text-muted)]">
                    {submitResult.passedTestCases !== undefined && (
                      <span>Tests: {submitResult.passedTestCases}/{submitResult.totalTestCases}</span>
                    )}
                    {submitResult.points !== undefined && (
                      <span>Points: +{submitResult.points}</span>
                    )}
                    {submitResult.runtime && <span>Runtime: {submitResult.runtime}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Leaderboard sidebar */}
        {showLeaderboard && (
          <div
            className="w-[20%] min-w-[200px] flex flex-col min-h-0 overflow-y-auto p-3"
            style={{ borderLeft: '1px solid var(--cc-border)', background: 'var(--cc-bg-secondary)' }}
          >
            <h3 className="text-xs font-semibold text-[var(--cc-text-muted)] uppercase tracking-wider mb-3">
              Top 10
            </h3>
            <div className="space-y-1.5">
              {leaderboard.map((entry, idx) => (
                <div
                  key={entry.userId || idx}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs ${
                    entry.userId === user?._id ? 'bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-[var(--cc-text-muted)] font-medium">{entry.rank}</span>
                    <span className="text-[var(--cc-text-primary)] font-medium truncate max-w-[80px]">
                      {entry.firstName}
                    </span>
                  </div>
                  <span className="text-[var(--cc-primary-light)] font-semibold">{entry.totalPoints}</span>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <p className="text-xs text-[var(--cc-text-dimmed)] text-center py-4">No submissions yet</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestArena;
