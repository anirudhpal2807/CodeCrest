import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import axiosClient from "../utils/axiosClient"
import SubmissionHistory from "../components/SubmissionHistory"
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';

const langMap = {
        cpp: 'C++',
        java: 'Java',
        javascript: 'JavaScript'
};

const leftTabs = [
  { key: 'description', label: 'Description', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { key: 'editorial', label: 'Editorial', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { key: 'solutions', label: 'Solutions', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { key: 'submissions', label: 'Submissions', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4' },
  { key: 'chatAI', label: 'ChatAI', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
];

const rightTabs = [
  { key: 'code', label: 'Code' },
  { key: 'testcase', label: 'Testcase' },
  { key: 'result', label: 'Result' },
];

const TabIcon = ({ d }) => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d={d} />
  </svg>
);

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [codeByLanguage, setCodeByLanguage] = useState({ javascript: '', java: '', cpp: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState('description');
  const [activeRightTab, setActiveRightTab] = useState('code');
  const editorRef = useRef(null);
  let {problemId}  = useParams();

 useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        
        const response = await axiosClient.get(`/problem/problemById/${problemId}`);
       
        const fetched = response.data || null;
        setProblem(fetched);
        const startArray = fetched?.startCode || [];
        const js = startArray.find(sc => sc.language === 'JavaScript')?.initialCode || '';
        const java = startArray.find(sc => sc.language === 'Java')?.initialCode || '';
        const cpp = startArray.find(sc => sc.language === 'C++')?.initialCode || '';
        setCodeByLanguage({ javascript: js, java, cpp });
        setLoading(false);
        setError(null);
        
      } catch (error) {
        console.error('Error fetching problem:', error);
        setError('Failed to load problem.');
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  useEffect(() => {
    // noop; preserve current codeByLanguage
  }, [selectedLanguage]);

  const handleEditorChange = (value) => {
    const v = value || '';
    setCodeByLanguage(prev => ({ ...prev, [selectedLanguage]: v }));
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);
    
    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code: codeByLanguage[selectedLanguage] || '',
        language: selectedLanguage
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab('testcase');
      
    } catch (error) {
      console.error('Error running code:', error);
      
      let errorMessage = 'Failed to run code. Please try again.';
      
      if (error.response?.status === 503) {
        const d = error.response.data;
        errorMessage =
          (typeof d?.error === 'string' && d.error) ||
          (typeof d?.message === 'string' && d.message) ||
          'Code execution service is temporarily unavailable. Please try again later.';
      } else if (error.response?.status === 429) {
        errorMessage = error.response.data?.message || 'Rate limit exceeded. Please wait a few minutes before trying again.';
      } else if (error.response?.status === 408) {
        errorMessage = error.response.data?.message || 'Code execution timeout. Please try with simpler code or try again later.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid request. Please check your code and try again.';
      }
      
      setRunResult({
        success: false,
        error: errorMessage,
        message: errorMessage
      });
      setLoading(false);
      setActiveRightTab('testcase');
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);
    
    try {
        const response = await axiosClient.post(`/submission/submit/${problemId}`, {
        code: codeByLanguage[selectedLanguage] || '',
        language: selectedLanguage
      });

       setSubmitResult(response.data);
       setLoading(false);
       setActiveRightTab('result');
      
    } catch (error) {
      console.error('Error submitting code:', error);
      
      let errorMessage = 'Failed to submit code. Please try again.';
      
      if (error.response?.status === 503) {
        const d = error.response.data;
        errorMessage =
          (typeof d?.error === 'string' && d.error) ||
          (typeof d?.message === 'string' && d.message) ||
          'Code execution service is temporarily unavailable. Please try again later.';
      } else if (error.response?.status === 429) {
        errorMessage = error.response.data?.message || 'Rate limit exceeded. Please wait a few minutes before trying again.';
      } else if (error.response?.status === 408) {
        errorMessage = error.response.data?.message || 'Code execution timeout. Please try with simpler code or try again later.';
      } else if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Invalid request. Please check your code and try again.';
      }
      
      setSubmitResult({
        accepted: false,
        error: errorMessage,
        message: errorMessage
      });
      setLoading(false);
      setActiveRightTab('result');
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case 'javascript': return 'javascript';
      case 'java': return 'java';
      case 'cpp': return 'cpp';
      default: return 'javascript';
    }
  };

  const getDifficultyBadge = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'cc-badge cc-badge-easy';
      case 'medium': return 'cc-badge cc-badge-medium';
      case 'hard': return 'cc-badge cc-badge-hard';
      default: return 'cc-badge';
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen" style={{ background: 'var(--cc-bg-primary)' }}>
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-[3px] border-[var(--cc-border)] border-t-[var(--cc-primary)] animate-spin" />
        </div>
        <p className="mt-4 text-sm" style={{ color: 'var(--cc-text-muted)' }}>Loading problem...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col" style={{ background: 'var(--cc-bg-primary)' }}>

      {/* ── Main split layout ── */}
      <div className="flex-1 flex min-h-0">

        {/* ═══════════ LEFT PANEL ═══════════ */}
        <div
          className="w-1/2 flex flex-col min-h-0"
          style={{ borderRight: '1px solid var(--cc-border)' }}
        >
          {/* Left tab bar */}
          <div
            className="flex items-center gap-1 px-2 shrink-0"
            style={{ background: 'var(--cc-bg-secondary)', borderBottom: '1px solid var(--cc-border)' }}
          >
            {leftTabs.map(tab => {
              const active = activeLeftTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveLeftTab(tab.key)}
                  className="relative flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer"
                  style={{
                    color: active ? 'var(--cc-text-primary)' : 'var(--cc-text-muted)',
                    background: 'transparent',
                    border: 'none',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--cc-text-secondary)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--cc-text-muted)'; }}
                >
                  <TabIcon d={tab.icon} />
                  {tab.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-[2px]"
                      style={{ background: 'var(--cc-primary)' }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Left content — chat tab fills height; other tabs scroll */}
          <div
            className={`flex-1 min-h-0 flex flex-col ${activeLeftTab === 'chatAI' ? 'overflow-hidden p-3 sm:p-4' : 'overflow-y-auto p-6'}`}
            style={{ background: 'var(--cc-bg-primary)' }}
          >
            {error && (
              <div
                className="flex items-center gap-3 p-3 rounded-lg mb-4 text-sm"
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#f87171',
                }}
              >
                <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {problem && (
              <>
                {/* ── DESCRIPTION TAB ── */}
                {activeLeftTab === 'description' && (
                  <div className="animate-fade-in">
                    {/* Title + badges */}
                    <div className="flex items-center gap-3 mb-6">
                      <h1 className="text-xl font-bold" style={{ color: 'var(--cc-text-primary)' }}>
                        {problem.title}
                      </h1>
                      <span className={getDifficultyBadge(problem.difficulty)}>
                        {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                      </span>
                      <span className="cc-badge cc-badge-primary">{problem.tags}</span>
                    </div>

                    {/* Description */}
                    <div
                      className="whitespace-pre-wrap text-sm leading-relaxed mb-8"
                      style={{ color: 'var(--cc-text-secondary)' }}
                    >
                      {problem.description}
                    </div>

                    {/* Examples */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--cc-text-primary)' }}>
                        Examples
                      </h3>
                      <div className="space-y-3">
                        {(problem.visibleTestCases || []).map((example, index) => (
                          <div
                            key={index}
                            className="rounded-lg p-4"
                            style={{
                              background: 'var(--cc-bg-card)',
                              border: '1px solid var(--cc-border)',
                            }}
                          >
                            <div
                              className="text-xs font-semibold mb-2"
                              style={{ color: 'var(--cc-text-muted)' }}
                            >
                              Example {index + 1}
                            </div>
                            <div className="space-y-1.5 text-sm font-mono" style={{ color: 'var(--cc-text-secondary)' }}>
                              <div>
                                <span style={{ color: 'var(--cc-text-muted)' }}>Input: </span>
                                <span style={{ color: 'var(--cc-text-primary)' }}>{example.input}</span>
                              </div>
                              <div>
                                <span style={{ color: 'var(--cc-text-muted)' }}>Output: </span>
                                <span style={{ color: 'var(--cc-text-primary)' }}>{example.output}</span>
                              </div>
                              {example.explanation && (
                                <div className="pt-1.5" style={{ borderTop: '1px solid var(--cc-border)' }}>
                                  <span style={{ color: 'var(--cc-text-muted)' }}>Explanation: </span>
                                  <span style={{ color: 'var(--cc-text-secondary)' }}>{example.explanation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── EDITORIAL TAB ── */}
                {activeLeftTab === 'editorial' && (
                  <div className="animate-fade-in">
                    <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--cc-text-primary)' }}>Editorial</h2>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--cc-text-secondary)' }}>
                      <Editorial secureUrl={problem.secureUrl} thumbnailUrl={problem.thumbnailUrl} duration={problem.duration}/>
                    </div>
                  </div>
                )}

                {/* ── SOLUTIONS TAB ── */}
                {activeLeftTab === 'solutions' && (
                  <div className="animate-fade-in">
                    <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--cc-text-primary)' }}>Solutions</h2>
                    <div className="space-y-4">
                      {problem.referenceSolution?.map((solution, index) => (
                        <div
                          key={index}
                          className="rounded-lg overflow-hidden"
                          style={{ border: '1px solid var(--cc-border)' }}
                        >
                          <div
                            className="px-4 py-2.5 flex items-center gap-2"
                            style={{
                              background: 'var(--cc-bg-secondary)',
                              borderBottom: '1px solid var(--cc-border)',
                            }}
                          >
                            <svg className="w-4 h-4" style={{ color: 'var(--cc-primary-light)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            <span className="text-sm font-medium" style={{ color: 'var(--cc-text-primary)' }}>
                              {problem?.title} — {solution?.language}
                            </span>
                          </div>
                          <div className="p-4" style={{ background: 'var(--cc-bg-card)' }}>
                            <pre
                              className="text-sm overflow-x-auto font-mono rounded-md p-4"
                              style={{
                                background: 'var(--cc-bg-input)',
                                color: 'var(--cc-text-secondary)',
                                border: '1px solid var(--cc-border)',
                              }}
                            >
                              <code>{solution?.completeCode}</code>
                            </pre>
                          </div>
                        </div>
                      )) || (
                        <p className="text-sm" style={{ color: 'var(--cc-text-muted)' }}>
                          Solutions will be available after you solve the problem.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* ── SUBMISSIONS TAB ── */}
                {activeLeftTab === 'submissions' && (
                  <div className="animate-fade-in">
                    <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--cc-text-primary)' }}>My Submissions</h2>
                    <SubmissionHistory problemId={problemId} />
                  </div>
                )}

                {/* ── CHAT AI TAB ── */}
                {activeLeftTab === 'chatAI' && (
                  <div className="animate-fade-in flex-1 flex flex-col min-h-0 h-full">
                    <ChatAi problem={problem} />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ═══════════ RIGHT PANEL ═══════════ */}
        <div className="w-1/2 flex flex-col min-h-0">
          {/* Right tab bar */}
          <div
            className="flex items-center justify-between shrink-0"
            style={{ background: 'var(--cc-bg-secondary)', borderBottom: '1px solid var(--cc-border)' }}
          >
            <div className="flex items-center gap-1 px-2">
              {rightTabs.map(tab => {
                const active = activeRightTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveRightTab(tab.key)}
                    className="relative px-3 py-2.5 text-xs font-medium transition-colors cursor-pointer"
                    style={{
                      color: active ? 'var(--cc-text-primary)' : 'var(--cc-text-muted)',
                      background: 'transparent',
                      border: 'none',
                    }}
                    onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--cc-text-secondary)'; }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--cc-text-muted)'; }}
                  >
                    {tab.label}
                    {active && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-[2px]"
                        style={{ background: 'var(--cc-primary)' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Run / Submit always visible in right panel header */}
            <div className="flex items-center gap-2 pr-3">
              <button
                className="cc-btn-ghost flex items-center gap-1.5 !py-1.5 !px-3 !text-xs !rounded-md"
                onClick={handleRun}
                disabled={loading}
                style={loading ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                Run
              </button>
              <button
                className="cc-btn-primary flex items-center gap-1.5 !py-1.5 !px-4 !text-xs !rounded-md"
                onClick={handleSubmitCode}
                disabled={loading}
                style={loading ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
              >
                {loading ? (
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                )}
                Submit
              </button>
            </div>
          </div>

          {/* Right content area */}
          <div className="flex-1 flex flex-col min-h-0">

            {/* ── CODE TAB ── */}
            {activeRightTab === 'code' && (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Language pills */}
                <div
                  className="flex items-center gap-1.5 px-4 py-2 shrink-0"
                  style={{ background: 'var(--cc-bg-card)', borderBottom: '1px solid var(--cc-border)' }}
                >
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
                          boxShadow: active ? '0 2px 8px rgba(99, 102, 241, 0.3)' : 'none',
                        }}
                        onClick={() => handleLanguageChange(lang)}
                        onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--cc-border-hover)'; e.currentTarget.style.color = 'var(--cc-text-secondary)'; }}}
                        onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--cc-border)'; e.currentTarget.style.color = 'var(--cc-text-muted)'; }}}
                      >
                        {langMap[lang]}
                      </button>
                    );
                  })}
                </div>

                {/* Monaco editor */}
                <div className="flex-1 min-h-0">
                  <Editor
                    height="100%"
                    language={getLanguageForMonaco(selectedLanguage)}
                    value={codeByLanguage[selectedLanguage] || ''}
                    onChange={handleEditorChange}
                    onMount={handleEditorDidMount}
                    theme="vs-dark"
                    options={{
                      fontSize: 14,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      glyphMargin: false,
                      folding: true,
                      lineDecorationsWidth: 10,
                      lineNumbersMinChars: 3,
                      renderLineHighlight: 'line',
                      selectOnLineNumbers: true,
                      roundedSelection: false,
                      readOnly: false,
                      cursorStyle: 'line',
                      mouseWheelZoom: true,
                      padding: { top: 12 },
                    }}
                  />
                </div>

                {/* Bottom bar with Console shortcut */}
                <div
                  className="flex items-center justify-between px-4 py-2 shrink-0"
                  style={{ background: 'var(--cc-bg-secondary)', borderTop: '1px solid var(--cc-border)' }}
                >
                  <button
                    className="flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
                    style={{ color: 'var(--cc-text-muted)', background: 'transparent', border: 'none' }}
                    onClick={() => setActiveRightTab('testcase')}
                    onMouseEnter={e => { e.currentTarget.style.color = 'var(--cc-text-secondary)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'var(--cc-text-muted)'; }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Console
                  </button>
                  <span className="text-xs" style={{ color: 'var(--cc-text-dimmed)' }}>
                    {langMap[selectedLanguage]}
                  </span>
                </div>
              </div>
            )}

            {/* ── TESTCASE TAB ── */}
            {activeRightTab === 'testcase' && (
              <div className="flex-1 overflow-y-auto p-5" style={{ background: 'var(--cc-bg-primary)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--cc-text-primary)' }}>
                  Test Results
                </h3>

                {runResult ? (
                  <div className="space-y-4">
                    {/* Status banner */}
                    <div
                      className="flex items-center gap-3 rounded-lg p-4"
                      style={{
                        background: runResult.success ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                        border: `1px solid ${runResult.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                      }}
                    >
                      {runResult.success ? (
                        <svg className="w-5 h-5 shrink-0" style={{ color: 'var(--cc-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 shrink-0" style={{ color: 'var(--cc-error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <div>
                        <div className="text-sm font-semibold" style={{ color: runResult.success ? '#34d399' : '#f87171' }}>
                          {runResult.success ? 'All test cases passed!' : (runResult.error || 'Error')}
                        </div>
                        {runResult.success && (
                          <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: 'var(--cc-text-muted)' }}>
                            <span>Runtime: {runResult.runtime + " sec"}</span>
                            <span>Memory: {runResult.memory + " KB"}</span>
                          </div>
                        )}
                        {!runResult.success && runResult.message && (
                          <p className="text-xs mt-1" style={{ color: 'var(--cc-text-muted)' }}>{runResult.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Test case cards */}
                    {(runResult?.testCases || []).length > 0 ? (
                      <div className="space-y-2">
                        {(runResult.testCases).map((tc, i) => {
                          const passed = runResult.success ? true : tc.status_id == 3;
                          return (
                            <div
                              key={i}
                              className="rounded-lg p-3"
                              style={{
                                background: 'var(--cc-bg-card)',
                                border: '1px solid var(--cc-border)',
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-semibold" style={{ color: 'var(--cc-text-muted)' }}>
                                  Case {i + 1}
                                </span>
                                <span
                                  className="text-xs font-semibold"
                                  style={{ color: passed ? 'var(--cc-success)' : 'var(--cc-error)' }}
                                >
                                  {passed ? '✓ Passed' : '✗ Failed'}
                                </span>
                              </div>
                              <div className="space-y-1 text-xs font-mono" style={{ color: 'var(--cc-text-secondary)' }}>
                                <div><span style={{ color: 'var(--cc-text-muted)' }}>Input:    </span>{tc.stdin}</div>
                                <div><span style={{ color: 'var(--cc-text-muted)' }}>Expected: </span>{tc.expected_output}</div>
                                <div>
                                  <span style={{ color: 'var(--cc-text-muted)' }}>Output:   </span>
                                  <span style={{ color: passed ? 'var(--cc-success)' : 'var(--cc-error)' }}>{tc.stdout}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      !runResult.success && (
                        <p className="text-sm" style={{ color: 'var(--cc-text-muted)' }}>
                          No test case results available. Please try running again.
                        </p>
                      )
                    )}
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center py-16 text-center"
                    style={{ color: 'var(--cc-text-muted)' }}
                  >
                    <svg className="w-10 h-10 mb-3" style={{ color: 'var(--cc-text-dimmed)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-sm">Click <strong style={{ color: 'var(--cc-text-secondary)' }}>Run</strong> to test your code with the example test cases.</p>
                  </div>
                )}
              </div>
            )}

            {/* ── RESULT TAB ── */}
            {activeRightTab === 'result' && (
              <div className="flex-1 overflow-y-auto p-5" style={{ background: 'var(--cc-bg-primary)' }}>
                <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--cc-text-primary)' }}>
                  Submission Result
                </h3>

                {submitResult ? (
                  <div
                    className="rounded-lg p-5"
                    style={{
                      background: submitResult.accepted ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                      border: `1px solid ${submitResult.accepted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    }}
                  >
                    {submitResult.accepted ? (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <svg className="w-6 h-6" style={{ color: 'var(--cc-success)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h4 className="text-lg font-bold" style={{ color: '#34d399' }}>Accepted</h4>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="rounded-lg p-3" style={{ background: 'var(--cc-bg-card)', border: '1px solid var(--cc-border)' }}>
                            <div className="text-xs mb-1" style={{ color: 'var(--cc-text-muted)' }}>Test Cases</div>
                            <div className="text-sm font-semibold" style={{ color: 'var(--cc-text-primary)' }}>
                              {submitResult.passedTestCases}/{submitResult.totalTestCases}
                            </div>
                          </div>
                          <div className="rounded-lg p-3" style={{ background: 'var(--cc-bg-card)', border: '1px solid var(--cc-border)' }}>
                            <div className="text-xs mb-1" style={{ color: 'var(--cc-text-muted)' }}>Runtime</div>
                            <div className="text-sm font-semibold" style={{ color: 'var(--cc-text-primary)' }}>
                              {submitResult.runtime + " sec"}
                            </div>
                          </div>
                          <div className="rounded-lg p-3" style={{ background: 'var(--cc-bg-card)', border: '1px solid var(--cc-border)' }}>
                            <div className="text-xs mb-1" style={{ color: 'var(--cc-text-muted)' }}>Memory</div>
                            <div className="text-sm font-semibold" style={{ color: 'var(--cc-text-primary)' }}>
                              {submitResult.memory + "KB"}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-6 h-6" style={{ color: 'var(--cc-error)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h4 className="text-lg font-bold" style={{ color: '#f87171' }}>
                            {submitResult.error || 'Wrong Answer'}
                          </h4>
                        </div>
                        {submitResult.message && (
                          <p className="text-sm mb-3" style={{ color: 'var(--cc-text-muted)' }}>{submitResult.message}</p>
                        )}
                        <div className="space-y-2">
                          {submitResult.passedTestCases !== undefined && submitResult.totalTestCases !== undefined && (
                            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--cc-text-secondary)' }}>
                              <span style={{ color: 'var(--cc-text-muted)' }}>Test Cases:</span>
                              {submitResult.passedTestCases}/{submitResult.totalTestCases}
                            </div>
                          )}
                          {submitResult.runtime && (
                            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--cc-text-secondary)' }}>
                              <span style={{ color: 'var(--cc-text-muted)' }}>Runtime:</span>
                              {submitResult.runtime + " sec"}
                            </div>
                          )}
                          {submitResult.memory && (
                            <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--cc-text-secondary)' }}>
                              <span style={{ color: 'var(--cc-text-muted)' }}>Memory:</span>
                              {submitResult.memory + "KB"}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="flex flex-col items-center justify-center py-16 text-center"
                    style={{ color: 'var(--cc-text-muted)' }}
                  >
                    <svg className="w-10 h-10 mb-3" style={{ color: 'var(--cc-text-dimmed)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-sm">Click <strong style={{ color: 'var(--cc-text-secondary)' }}>Submit</strong> to submit your solution for evaluation.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemPage;
