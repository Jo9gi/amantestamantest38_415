import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth, useToggle } from '../hooks';
import { validationRules } from '../schemas';
import { ROUTES } from '../constants';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const AuthPanel = ({ children }) => (
  <div className="hidden lg:flex lg:w-[620px] relative overflow-hidden" style={{
    background: 'linear-gradient(160deg, #091f13 0%, #0a2e17 20%, #14532d 50%, #1a5c2c 80%, #0f3d1e 100%)'
  }}>
    {/* Diagonal stripe pattern shapes */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Large striped circle - top right */}
      <div className="absolute -top-16 -right-16 w-[280px] h-[280px] rounded-full opacity-[0.12] auth-float-1 auth-stripe-move" style={{ background: 'repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,0.15) 5px, rgba(255,255,255,0.15) 7px)' }} />
      {/* Small solid green circle */}
      <div className="absolute top-[15%] left-[12%] w-20 h-20 rounded-full bg-primary-500/15 auth-float-2" />
      {/* Medium striped rounded-rect */}
      <div className="absolute top-[35%] right-[8%] w-32 h-44 rounded-3xl opacity-[0.1] auth-float-3 auth-stripe-move" style={{ background: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.18) 4px, rgba(255,255,255,0.18) 6px)' }} />
      {/* Large solid green rounded-rect */}
      <div className="absolute bottom-[20%] left-[8%] w-28 h-36 rounded-3xl bg-primary-600/12 auth-float-4" />
      {/* Striped diamond / rotated square */}
      <div className="absolute top-[55%] left-[35%] w-24 h-24 rounded-2xl rotate-45 opacity-[0.1] auth-float-1 auth-stripe-move" style={{ background: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 6px)' }} />
      {/* Small striped circle - bottom right */}
      <div className="absolute bottom-[10%] right-[15%] w-16 h-16 rounded-full opacity-[0.12] auth-float-2 auth-stripe-move" style={{ background: 'repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 5px)' }} />
      {/* Tiny solid accent dots */}
      <div className="absolute top-[25%] right-[30%] w-4 h-4 rounded-full bg-green-400/20 auth-float-3" />
      <div className="absolute bottom-[35%] left-[25%] w-3 h-3 rounded-full bg-green-300/15 auth-float-1" />
      <div className="absolute top-[70%] right-[40%] w-5 h-5 rounded-full bg-primary-400/12 auth-float-4" />
      {/* Large slow-rotating striped ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border-[12px] opacity-[0.06] auth-rotate" style={{ borderImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 6px) 12' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full border border-white/[0.06]" />
    </div>
    <div className="relative z-10 flex flex-col justify-between p-10 w-full">
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-[18px]">C</span>
        </div>
        <span className="text-xl font-bold text-white">Customer Portal</span>
      </div>
      <div className="flex-1 flex flex-col justify-center">{children}</div>
      <div className="flex gap-8">
        <div><p className="text-3xl font-bold text-white">24k+</p><p className="text-white/50 text-xs mt-1">Active Users</p></div>
        <div><p className="text-3xl font-bold text-white">98%</p><p className="text-white/50 text-xs mt-1">Satisfaction</p></div>
        <div><p className="text-3xl font-bold text-white">150+</p><p className="text-white/50 text-xs mt-1">Countries</p></div>
      </div>
    </div>
  </div>
);

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { value: showPassword, toggle: togglePassword } = useToggle(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError('');
    try {
      await login(data.email, data.password);
      navigate(ROUTES.HOME);
    } catch (err) {
      setServerError(err.response?.data?.detail || 'Unable to login. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F1EB' }}>
      <AuthPanel>
        <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">Welcome back<br />to your<br />customer portal.</h1>
        <p className="text-white/60 text-sm leading-relaxed max-w-xs">Manage your account and access your personalized dashboard with ease.</p>
      </AuthPanel>
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full sm:max-w-md mx-auto">
          <div className="lg:hidden flex items-center gap-2.5 mb-6 justify-center">
            <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center"><span className="text-white font-bold text-[18px]">C</span></div>
            <span className="text-xl font-bold text-gray-900">Customer Portal</span>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-100 shadow-sm">
            <div className="text-center mb-5">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Welcome back</h2>
              <p className="text-sm text-gray-500">Sign in to your account</p>
            </div>
            {serverError && (<div className="p-2.5 bg-error-50 border border-error-200 rounded-xl mb-3 animate-fade-in"><p className="text-sm text-error-600">{serverError}</p></div>)}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <Input label="Email address" type="email" placeholder="Enter your email" autoComplete="email" error={errors.email?.message} className="h-11" {...register('email', validationRules.email)} />
              <div className="relative">
                <Input label="Password" type={showPassword ? "text" : "password"} placeholder="Enter your password" className="pr-10 h-11" autoComplete="current-password" error={errors.password?.message} {...register('password', validationRules.password)} />
                <button type="button" onClick={togglePassword} className="absolute right-3 top-[2.35rem] flex items-center justify-center text-secondary-400 hover:text-secondary-600 focus:outline-none leading-none">
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500" />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-500">Remember me</label>
                </div>
                <Link to={ROUTES.FORGOT_PASSWORD} className="text-sm text-primary-700 hover:text-primary-600 font-medium">Forgot password?</Link>
              </div>
              <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full h-11">{isSubmitting ? 'Signing in...' : 'Sign in'}</Button>
            </form>
            <div className="mt-5 text-center">
              <p className="text-sm text-gray-500">Don't have an account?{' '}<Link to={ROUTES.REGISTER} className="font-semibold text-primary-700 hover:text-primary-600">Create account</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
