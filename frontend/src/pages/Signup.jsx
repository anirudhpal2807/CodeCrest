import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { registerUser } from '../authSlice';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth); // Removed error as it wasn't used

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="card w-full max-w-sm bg-white dark:bg-gray-800 shadow-2xl rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="card-body p-8">
          <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-2">CodeCrest</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-6">Create your account</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-gray-700 dark:text-gray-300">First Name</span>
              </label>
              <input
                type="text"
                placeholder="John"
                className={`input input-bordered w-full transition-colors duration-200 ${errors.firstName ? 'input-error' : 'focus:input-primary'}`} 
                {...register('firstName')}
              />
              {errors.firstName && (
                <span className="text-error text-sm mt-1">{errors.firstName.message}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-gray-700 dark:text-gray-300">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered w-full transition-colors duration-200 ${errors.emailId ? 'input-error' : 'focus:input-primary'}`}
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-error text-sm mt-1">{errors.emailId.message}</span>
              )}
            </div>

            {/* Password Field with Toggle */}
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-gray-700 dark:text-gray-300">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full pr-12 transition-colors duration-200 ${errors.password ? 'input-error' : 'focus:input-primary'}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-sm mt-1">{errors.password.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary w-full transition-all duration-300"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="loading loading-spinner mr-2"></span>
                    Signing Up...
                  </span>
                ) : (
                  'Sign Up'
                )}
              </button>
            </div>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-6 text-gray-500 dark:text-gray-400">
            <span className="text-sm">
              Already have an account?{' '}
              <NavLink to="/login" className="link link-primary font-medium">
                Login
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;