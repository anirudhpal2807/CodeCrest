import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import {
  Code, Terminal, Zap, Brain, Trophy, Users, BookOpen,
  ChevronRight, ArrowRight, Play, Star, GitBranch, Cpu,
  Sparkles, Shield, Clock, TrendingUp, CheckCircle2,
  Monitor, Braces, Layers, Rocket, MessageSquare
} from 'lucide-react';

const MotionDiv = motion.div;

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  })
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
};

function AnimatedCounter({ target, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

function TypewriterCode() {
  const lines = [
    { text: 'function twoSum(nums, target) {', color: '#c792ea' },
    { text: '  const map = new Map();', color: '#82aaff' },
    { text: '  for (let i = 0; i < nums.length; i++) {', color: '#c792ea' },
    { text: '    const complement = target - nums[i];', color: '#f78c6c' },
    { text: '    if (map.has(complement)) {', color: '#c792ea' },
    { text: '      return [map.get(complement), i];', color: '#c3e88d' },
    { text: '    }', color: '#c792ea' },
    { text: '    map.set(nums[i], i);', color: '#82aaff' },
    { text: '  }', color: '#c792ea' },
    { text: '  return [];', color: '#c3e88d' },
    { text: '}', color: '#c792ea' },
  ];

  const [visibleLines, setVisibleLines] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const timer = setInterval(() => {
      setVisibleLines(prev => {
        if (prev >= lines.length) { clearInterval(timer); return prev; }
        return prev + 1;
      });
    }, 200);
    return () => clearInterval(timer);
  }, [isInView, lines.length]);

  return (
    <div ref={ref} className="font-mono text-sm leading-relaxed">
      {lines.map((line, idx) => (
        <div
          key={idx}
          style={{
            opacity: idx < visibleLines ? 1 : 0.15,
            transform: idx < visibleLines ? 'translateX(0)' : 'translateX(-8px)',
            transition: 'all 0.3s ease',
            color: idx < visibleLines ? line.color : '#334155',
          }}
        >
          <span style={{ color: '#475569', marginRight: 16, userSelect: 'none', fontSize: '0.75rem' }}>
            {String(idx + 1).padStart(2, ' ')}
          </span>
          {line.text}
        </div>
      ))}
    </div>
  );
}

function GlowingOrb({ size, color, top, left, right, bottom, delay = 0 }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size, height: size, top, left, right, bottom,
        background: color,
        filter: 'blur(80px)',
        animation: `float ${6 + delay}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Hints',
    desc: 'Get intelligent hints and approach suggestions powered by AI when you\'re stuck on a problem.',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'rgba(139, 92, 246, 0.15)',
  },
  {
    icon: Code,
    title: 'Rich Code Editor',
    desc: 'Full-featured Monaco editor with syntax highlighting, auto-completion, and multiple language support.',
    gradient: 'from-blue-500 to-cyan-500',
    glow: 'rgba(59, 130, 246, 0.15)',
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    desc: 'Run your code against test cases and get immediate results with detailed execution analysis.',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'rgba(245, 158, 11, 0.15)',
  },
  {
    icon: Trophy,
    title: 'Contests & Rankings',
    desc: 'Compete in timed coding contests, climb the leaderboard, and earn your rating badges.',
    gradient: 'from-emerald-500 to-green-500',
    glow: 'rgba(16, 185, 129, 0.15)',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    desc: 'Visual dashboards to track your coding journey across difficulty levels and topics.',
    gradient: 'from-pink-500 to-rose-500',
    glow: 'rgba(236, 72, 153, 0.15)',
  },
  {
    icon: BookOpen,
    title: 'Video Editorials',
    desc: 'Watch detailed video explanations for every problem to master the underlying concepts.',
    gradient: 'from-indigo-500 to-blue-500',
    glow: 'rgba(99, 102, 241, 0.15)',
  },
];

const stats = [
  { value: 500, suffix: '+', label: 'Coding Problems', icon: Braces },
  { value: 10000, suffix: '+', label: 'Active Users', icon: Users },
  { value: 50, suffix: '+', label: 'Contest Rounds', icon: Trophy },
  { value: 98, suffix: '%', label: 'Satisfaction Rate', icon: Star },
];

const steps = [
  {
    step: '01',
    title: 'Create Your Account',
    desc: 'Sign up in seconds and get instant access to our entire problem library.',
    icon: Rocket,
    color: '#818cf8',
  },
  {
    step: '02',
    title: 'Practice & Solve',
    desc: 'Pick problems by difficulty or topic. Write code in our powerful editor.',
    icon: Terminal,
    color: '#06b6d4',
  },
  {
    step: '03',
    title: 'Level Up & Compete',
    desc: 'Track your progress, join contests, and climb the leaderboard.',
    icon: TrendingUp,
    color: '#10b981',
  },
];

const testimonials = [
  {
    name: 'Arjun Mehta',
    role: 'SDE @ Google',
    text: 'CodeCrest helped me crack my Google interview. The problem quality and editorial depth is unmatched.',
    rating: 5,
    avatar: 'AM',
    gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
  },
  {
    name: 'Priya Sharma',
    role: 'Full Stack Developer',
    text: 'The AI hints feature is a game changer. It teaches you to think algorithmically instead of just giving answers.',
    rating: 5,
    avatar: 'PS',
    gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  },
  {
    name: 'Rahul Verma',
    role: 'CS Student, IIT Delhi',
    text: 'Best platform for competitive programming. The contest system and rating engine keep me motivated.',
    rating: 5,
    avatar: 'RV',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },
  {
    name: 'Sneha Kapoor',
    role: 'Backend Engineer @ Amazon',
    text: 'The contest rating system is addictive! It pushed me to solve harder problems consistently. Highly recommend.',
    rating: 5,
    avatar: 'SK',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  },
  {
    name: 'Vikram Singh',
    role: 'Software Architect',
    text: 'Video editorials are top-notch. Finally a platform that explains the "why" behind each approach, not just the code.',
    rating: 5,
    avatar: 'VS',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  },
  {
    name: 'Ananya Desai',
    role: 'CS Student, NIT Trichy',
    text: 'Went from struggling with arrays to solving dynamic programming in 3 months. The progress tracking kept me going.',
    rating: 5,
    avatar: 'AD',
    gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  },
];

function TestimonialCard({ t }) {
  return (
    <div
      className="flex-shrink-0 w-[350px] p-6 rounded-2xl transition-all duration-300"
      style={{
        background: '#0f1524',
        border: '1px solid rgba(148, 163, 184, 0.08)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(245,158,11,0.2)';
        e.currentTarget.style.boxShadow = '0 20px 50px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(148,163,184,0.08)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} size={16} fill="#fbbf24" stroke="#fbbf24" />
        ))}
      </div>
      <p className="text-sm leading-relaxed mb-5" style={{ color: '#cbd5e1' }}>
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white"
          style={{ background: t.gradient }}
        >
          {t.avatar}
        </div>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#f1f5f9' }}>{t.name}</p>
          <p className="text-xs" style={{ color: '#64748b' }}>{t.role}</p>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, direction = 'left', speed = 25 }) {
  const duplicated = [...items, ...items];
  const totalWidth = items.length * (350 + 24);

  return (
    <div className="relative overflow-hidden w-full group">
      <motion.div
        className="flex gap-6"
        animate={{ x: direction === 'left' ? [0, -totalWidth] : [-totalWidth, 0] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          },
        }}
        style={{ width: 'max-content' }}
        whileHover={{ animationPlayState: 'paused' }}
      >
        {duplicated.map((t, idx) => (
          <TestimonialCard key={`${t.name}-${idx}`} t={t} />
        ))}
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#0b0f1a', color: '#f1f5f9' }}>

      {/* ============ NAVBAR ============ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'rgba(11, 15, 26, 0.8)',
          backdropFilter: 'blur(20px) saturate(180%)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.08)',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99, 102, 241, 0.25)' }}
            >
              <Code size={18} style={{ color: '#818cf8' }} />
            </div>
            <span
              className="text-xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              CodeCrest
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {['Features', 'How it Works', 'Testimonials'].map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{ color: '#94a3b8' }}
                onMouseEnter={e => { e.target.style.color = '#818cf8'; e.target.style.background = 'rgba(99,102,241,0.08)'; }}
                onMouseLeave={e => { e.target.style.color = '#94a3b8'; e.target.style.background = 'transparent'; }}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
              style={{ color: '#94a3b8', border: '1px solid rgba(148, 163, 184, 0.2)' }}
              onMouseEnter={e => { e.target.style.borderColor = '#6366f1'; e.target.style.color = '#818cf8'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(148,163,184,0.2)'; e.target.style.color = '#94a3b8'; }}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
              }}
              onMouseEnter={e => { e.target.style.boxShadow = '0 8px 25px rgba(99,102,241,0.5)'; e.target.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.target.style.boxShadow = '0 4px 15px rgba(99,102,241,0.35)'; e.target.style.transform = 'translateY(0)'; }}
            >
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      {/* ============ HERO SECTION ============ */}
      <motion.section
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden"
      >
        {/* Background grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(99,102,241,0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(99,102,241,0.03) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Radial glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px]"
            style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)' }} />
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px]"
            style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 left-0 w-[600px] h-[400px]"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />
        </div>

        <GlowingOrb size="350px" color="rgba(99,102,241,0.06)" top="5%" left="5%" delay={0} />
        <GlowingOrb size="250px" color="rgba(6,182,212,0.05)" top="20%" right="8%" delay={2} />
        <GlowingOrb size="200px" color="rgba(139,92,246,0.05)" bottom="15%" left="20%" delay={1} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: Text content */}
            <MotionDiv
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="text-center lg:text-left"
            >
              <MotionDiv variants={fadeInUp} custom={0}>
                <div
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6"
                  style={{
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    color: '#a5b4fc',
                  }}
                >
                  <Sparkles size={14} />
                  AI-Powered Coding Platform
                </div>
              </MotionDiv>

              <MotionDiv variants={fadeInUp} custom={1}>
                <h1
                  className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.05] tracking-tight mb-6"
                  style={{ letterSpacing: '-0.04em' }}
                >
                  <span style={{ color: '#f1f5f9' }}>Master Code.</span>
                  <br />
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 30%, #06b6d4 70%, #22d3ee 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Crack Interviews.
                  </span>
                </h1>
              </MotionDiv>

              <MotionDiv variants={fadeInUp} custom={2}>
                <p className="text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0" style={{ color: '#94a3b8' }}>
                  The ultimate coding practice platform with AI hints, real-time contests,
                  and a powerful code editor. Level up your algorithmic skills and land
                  your dream job.
                </p>
              </MotionDiv>

              <MotionDiv variants={fadeInUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => navigate('/signup')}
                  className="group px-8 py-4 rounded-2xl text-base font-semibold text-white flex items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4), 0 0 60px rgba(99, 102, 241, 0.1)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.5), 0 0 80px rgba(99,102,241,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.1)'; }}
                >
                  Start Coding Now
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('features');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-4 rounded-2xl text-base font-medium flex items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    color: '#94a3b8',
                    border: '1px solid rgba(148, 163, 184, 0.15)',
                    background: 'rgba(15, 23, 42, 0.5)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = '#c7d2fe'; e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.15)'; e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.background = 'rgba(15,23,42,0.5)'; }}
                >
                  <Play size={16} />
                  Explore Features
                </button>
              </MotionDiv>

              <MotionDiv variants={fadeInUp} custom={4} className="mt-8 flex items-center gap-6 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {['#6366f1', '#06b6d4', '#10b981', '#f59e0b'].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: c, borderColor: '#0b0f1a', zIndex: 4 - i }}>
                      {['A', 'R', 'S', 'P'][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#fbbf24" stroke="#fbbf24" />)}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
                    Loved by <span style={{ color: '#94a3b8', fontWeight: 600 }}>10,000+</span> developers
                  </p>
                </div>
              </MotionDiv>
            </MotionDiv>

            {/* Right: Code Editor Preview */}
            <MotionDiv
              variants={scaleIn}
              initial="hidden"
              animate="visible"
              className="relative hidden lg:block"
            >
              <div className="absolute -inset-4 rounded-3xl opacity-50"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(6,182,212,0.1))', filter: 'blur(40px)' }} />

              <div
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: '#0d1117',
                  border: '1px solid rgba(148, 163, 184, 0.1)',
                  boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.08)',
                }}
              >
                {/* Editor top bar */}
                <div className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.08)', background: 'rgba(13, 17, 23, 0.8)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f56' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: '#27c93f' }} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 rounded-md text-xs font-medium"
                      style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.2)' }}>
                      twoSum.js
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                      EASY
                    </div>
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold"
                      style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
                      JavaScript
                    </div>
                  </div>
                </div>

                {/* Code area */}
                <div className="p-5 min-h-[300px]" style={{ background: '#0d1117' }}>
                  <TypewriterCode />
                </div>

                {/* Bottom bar */}
                <div className="flex items-center justify-between px-4 py-2.5"
                  style={{ borderTop: '1px solid rgba(148, 163, 184, 0.08)', background: 'rgba(13, 17, 23, 0.8)' }}>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} style={{ color: '#10b981' }} />
                      <span className="text-xs font-medium" style={{ color: '#34d399' }}>All test cases passed</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px]" style={{ color: '#475569' }}>Runtime: 52ms</span>
                    <span className="text-[10px]" style={{ color: '#475569' }}>Memory: 42.1MB</span>
                  </div>
                </div>
              </div>

              {/* Floating AI hint card */}
              <MotionDiv
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
                className="absolute -right-6 top-16 w-56"
              >
                <div className="rounded-xl p-3"
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                  }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(139, 92, 246, 0.2)' }}>
                      <Sparkles size={12} style={{ color: '#a78bfa' }} />
                    </div>
                    <span className="text-xs font-semibold" style={{ color: '#a78bfa' }}>AI Hint</span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: '#94a3b8' }}>
                    Try using a HashMap for O(n) lookup. Store complement as key...
                  </p>
                </div>
              </MotionDiv>

              {/* Floating performance card */}
              <MotionDiv
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="absolute -left-4 bottom-20 w-48"
              >
                <div className="rounded-xl p-3"
                  style={{
                    background: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    backdropFilter: 'blur(16px)',
                    boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
                  }}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <TrendingUp size={14} style={{ color: '#34d399' }} />
                    <span className="text-xs font-semibold" style={{ color: '#34d399' }}>Performance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="text-lg font-bold" style={{ color: '#f1f5f9' }}>95%</p>
                      <p className="text-[10px]" style={{ color: '#64748b' }}>Faster than</p>
                    </div>
                    <div className="flex-1 h-8 rounded-lg overflow-hidden" style={{ background: 'rgba(16,185,129,0.1)' }}>
                      <div className="h-full rounded-lg" style={{ width: '95%', background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
                    </div>
                  </div>
                </div>
              </MotionDiv>
            </MotionDiv>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          >
            <ChevronRight size={20} style={{ color: '#475569', transform: 'rotate(90deg)' }} />
          </motion.div>
        </div>
      </motion.section>

      {/* ============ STATS BAR ============ */}
      <section className="relative py-16" style={{ borderTop: '1px solid rgba(148,163,184,0.06)', borderBottom: '1px solid rgba(148,163,184,0.06)' }}>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(99,102,241,0.02) 0%, transparent 100%)' }} />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <MotionDiv
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, idx) => (
              <MotionDiv key={idx} variants={fadeInUp} custom={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3"
                  style={{ background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <stat.icon size={20} style={{ color: '#818cf8' }} />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold mb-1" style={{ letterSpacing: '-0.03em' }}>
                  <span style={{
                    background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </span>
                </div>
                <p className="text-sm font-medium" style={{ color: '#64748b' }}>{stat.label}</p>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </section>

      {/* ============ FEATURES SECTION ============ */}
      <section id="features" className="py-24 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <MotionDiv
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <MotionDiv variants={fadeInUp} custom={0}>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{
                  background: 'rgba(6, 182, 212, 0.1)',
                  border: '1px solid rgba(6, 182, 212, 0.2)',
                  color: '#22d3ee',
                }}
              >
                <Layers size={14} />
                Platform Features
              </div>
            </MotionDiv>
            <MotionDiv variants={fadeInUp} custom={1}>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ letterSpacing: '-0.03em' }}>
                Everything You Need to{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #818cf8 0%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Level Up
                </span>
              </h2>
            </MotionDiv>
            <MotionDiv variants={fadeInUp} custom={2}>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#94a3b8' }}>
                From beginner arrays to advanced graph algorithms, CodeCrest provides every tool
                you need to become an exceptional problem solver.
              </p>
            </MotionDiv>
          </MotionDiv>

          <MotionDiv
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, idx) => (
              <MotionDiv key={idx} variants={fadeInUp} custom={idx}>
                <div
                  className="group relative p-6 rounded-2xl h-full transition-all duration-300 cursor-default"
                  style={{
                    background: '#0f1524',
                    border: '1px solid rgba(148, 163, 184, 0.08)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)';
                    e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.3), 0 0 30px ${feature.glow}`;
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(148,163,184,0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${feature.glow}, transparent 70%)` }} />

                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${feature.gradient}`}
                      style={{ opacity: 0.9, boxShadow: `0 4px 15px ${feature.glow}` }}>
                      <feature.icon size={22} color="white" />
                    </div>
                    <h3 className="text-lg font-bold mb-2" style={{ color: '#f1f5f9', letterSpacing: '-0.01em' }}>
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="py-24 relative">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent, rgba(99,102,241,0.02), transparent)' }} />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <MotionDiv
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <MotionDiv variants={fadeInUp} custom={0}>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  color: '#34d399',
                }}
              >
                <GitBranch size={14} />
                Simple Process
              </div>
            </MotionDiv>
            <MotionDiv variants={fadeInUp} custom={1}>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ letterSpacing: '-0.03em' }}>
                Get Started in{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  3 Easy Steps
                </span>
              </h2>
            </MotionDiv>
          </MotionDiv>

          <MotionDiv
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            {/* Connector line */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-[2px]"
              style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.3), rgba(6,182,212,0.3), rgba(16,185,129,0.3))' }} />

            {steps.map((step, idx) => (
              <MotionDiv key={idx} variants={fadeInUp} custom={idx} className="relative">
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6"
                    style={{
                      background: `rgba(${step.color === '#818cf8' ? '129,140,248' : step.color === '#06b6d4' ? '6,182,212' : '16,185,129'}, 0.1)`,
                      border: `1px solid rgba(${step.color === '#818cf8' ? '129,140,248' : step.color === '#06b6d4' ? '6,182,212' : '16,185,129'}, 0.2)`,
                    }}>
                    <step.icon size={28} style={{ color: step.color }} />
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
                      {step.step.slice(-1)}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: '#f1f5f9' }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{step.desc}</p>
                </div>
              </MotionDiv>
            ))}
          </MotionDiv>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section id="testimonials" className="py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />

        <div className="relative z-10">
          <MotionDiv
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16 px-6"
          >
            <MotionDiv variants={fadeInUp} custom={0}>
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
                style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                }}
              >
                <MessageSquare size={14} />
                Testimonials
              </div>
            </MotionDiv>
            <MotionDiv variants={fadeInUp} custom={1}>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ letterSpacing: '-0.03em' }}>
                Loved by{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  Developers
                </span>
              </h2>
            </MotionDiv>
            <MotionDiv variants={fadeInUp} custom={2}>
              <p className="text-lg max-w-2xl mx-auto" style={{ color: '#94a3b8' }}>
                See what our community has to say about their CodeCrest experience.
              </p>
            </MotionDiv>
          </MotionDiv>

          {/* Row 1: moves left */}
          <div className="mb-6">
            <MarqueeRow items={testimonials.slice(0, 3)} direction="left" speed={30} />
          </div>

          {/* Row 2: moves right */}
          <div>
            <MarqueeRow items={testimonials.slice(3, 6)} direction="right" speed={35} />
          </div>
        </div>

        {/* Fade edges */}
        <div className="absolute top-0 bottom-0 left-0 w-24 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #0b0f1a 0%, transparent 100%)' }} />
        <div className="absolute top-0 bottom-0 right-0 w-24 z-20 pointer-events-none"
          style={{ background: 'linear-gradient(270deg, #0b0f1a 0%, transparent 100%)' }} />
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <MotionDiv
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div
              className="relative rounded-3xl p-12 md:p-16 text-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(6,182,212,0.05) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
              }}
            >
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]"
                  style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
              </div>

              <div className="relative z-10">
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
                  style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
                >
                  <Cpu size={28} style={{ color: '#818cf8' }} />
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ letterSpacing: '-0.03em' }}>
                  Ready to{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #818cf8 0%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    Start Building?
                  </span>
                </h2>

                <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: '#94a3b8' }}>
                  Join thousands of developers who are already sharpening their skills on CodeCrest.
                  Your journey to coding mastery starts here.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate('/signup')}
                    className="px-10 py-4 rounded-2xl text-base font-semibold text-white transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                      boxShadow: '0 8px 30px rgba(99, 102, 241, 0.4)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(99,102,241,0.5)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(99,102,241,0.4)'; }}
                  >
                    Create Free Account
                  </button>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-10 py-4 rounded-2xl text-base font-medium transition-all duration-300"
                    style={{
                      color: '#94a3b8',
                      border: '1px solid rgba(148, 163, 184, 0.2)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)'; e.currentTarget.style.color = '#c7d2fe'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'; e.currentTarget.style.color = '#94a3b8'; }}
                  >
                    Sign In
                  </button>
                </div>

                <p className="text-xs mt-6" style={{ color: '#475569' }}>
                  No credit card required &nbsp;·&nbsp; Free forever &nbsp;·&nbsp; Cancel anytime
                </p>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer style={{ borderTop: '1px solid rgba(148, 163, 184, 0.06)' }}>
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(99, 102, 241, 0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
                >
                  <Code size={16} style={{ color: '#818cf8' }} />
                </div>
                <span className="text-lg font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                  CodeCrest
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                The modern platform for mastering algorithms, data structures, and coding interviews.
              </p>
            </div>

            {/* Links */}
            {[
              { title: 'Platform', links: ['Problems', 'Contests', 'Leaderboard', 'Editorial'] },
              { title: 'Resources', links: ['Documentation', 'Blog', 'Community', 'FAQ'] },
              { title: 'Company', links: ['About', 'Careers', 'Contact', 'Privacy'] },
            ].map((col, idx) => (
              <div key={idx}>
                <h4 className="text-sm font-semibold mb-4" style={{ color: '#f1f5f9' }}>{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link, i) => (
                    <li key={i}>
                      <a href="#" className="text-sm transition-colors duration-200"
                        style={{ color: '#64748b' }}
                        onMouseEnter={e => e.target.style.color = '#818cf8'}
                        onMouseLeave={e => e.target.style.color = '#64748b'}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: '1px solid rgba(148, 163, 184, 0.06)' }}>
            <p className="text-xs" style={{ color: '#475569' }}>
              &copy; {new Date().getFullYear()} CodeCrest. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Twitter', 'GitHub', 'Discord'].map(s => (
                <a key={s} href="#" className="text-xs transition-colors duration-200"
                  style={{ color: '#475569' }}
                  onMouseEnter={e => e.target.style.color = '#818cf8'}
                  onMouseLeave={e => e.target.style.color = '#475569'}>
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* Float animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}
