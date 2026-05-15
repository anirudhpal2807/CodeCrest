import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import { registerUser } from '../authSlice';

const signupSchema = z.object({
  firstName: z.string().min(3, 'Minimum 3 characters'),
  emailId: z.string().email('Invalid Email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    typeof location.state?.from === 'string' && location.state.from.startsWith('/')
      ? location.state.from
      : '/';
  const { isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0b0f1a 0%, #111827 50%, #0f172a 100%)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 rounded-full opacity-[0.04]" style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        <div className="cc-card p-8 md:p-10" style={{ background: 'rgba(21, 28, 44, 0.8)', backdropFilter: 'blur(20px) saturate(180%)' }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{ background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[var(--cc-text-primary)] mb-1">Create your account</h1>
            <p className="text-sm text-[var(--cc-text-muted)]">Start your coding journey with CodeCrest</p>
          </div>

          {error && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-lg animate-fade-in" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm text-red-300">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-1.5">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className={`cc-input w-full ${errors.firstName ? '!border-red-500/50 focus:!shadow-[0_0_0_3px_rgba(239,68,68,0.15)]' : ''}`}
                {...register('firstName')}
              />
              {errors.firstName && (
                <p className="mt-1.5 text-xs text-red-400">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`cc-input w-full ${errors.emailId ? '!border-red-500/50 focus:!shadow-[0_0_0_3px_rgba(239,68,68,0.15)]' : ''}`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <p className="mt-1.5 text-xs text-red-400">{errors.emailId.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--cc-text-secondary)] mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters"
                  className={`cc-input w-full pr-10 ${errors.password ? '!border-red-500/50 focus:!shadow-[0_0_0_3px_rgba(239,68,68,0.15)]' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 -translate-y-1/2 text-[var(--cc-text-dimmed)] hover:text-[var(--cc-text-secondary)] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="cc-btn-primary w-full py-3 text-sm mt-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--cc-border)' }}>
            <p className="text-center text-sm text-[var(--cc-text-muted)]">
              Already have an account?{' '}
              <NavLink to="/login" className="text-[var(--cc-primary-light)] hover:text-[var(--cc-primary)] font-medium transition-colors">
                Sign in
              </NavLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
