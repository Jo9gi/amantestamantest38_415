import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { authService } from '../services';
import { validationRules } from '../schemas';
import { ROUTES } from '../constants';
import { useToggle } from '../hooks';

const AuthPanel = () => (
  <div className="hidden lg:flex lg:w-[620px] relative overflow-hidden" style={{
    background: 'linear-gradient(160deg, #091f13 0%, #0a2e17 20%, #14532d 50%, #1a5c2c 80%, #0f3d1e 100%)'
  }}>
    {/* Diagonal stripe pattern shapes */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute -top-16 -right-16 w-[280px] h-[280px] rounded-full opacity-[0.12] auth-float-1 auth-stripe-move" style={{ background: 'repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(255,255,255,0.15) 5px, rgba(255,255,255,0.15) 7px)' }} />
      <div className="absolute top-[15%] left-[12%] w-20 h-20 rounded-full bg-primary-500/15 auth-float-2" />
      <div className="absolute top-[35%] right-[8%] w-32 h-44 rounded-3xl opacity-[0.1] auth-float-3 auth-stripe-move" style={{ background: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.18) 4px, rgba(255,255,255,0.18) 6px)' }} />
      <div className="absolute bottom-[20%] left-[8%] w-28 h-36 rounded-3xl bg-primary-600/12 auth-float-4" />
      <div className="absolute top-[55%] left-[35%] w-24 h-24 rounded-2xl rotate-45 opacity-[0.1] auth-float-1 auth-stripe-move" style={{ background: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 6px)' }} />
      <div className="absolute bottom-[10%] right-[15%] w-16 h-16 rounded-full opacity-[0.12] auth-float-2 auth-stripe-move" style={{ background: 'repeating-linear-gradient(-45deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 5px)' }} />
      <div className="absolute top-[25%] right-[30%] w-4 h-4 rounded-full bg-green-400/20 auth-float-3" />
      <div className="absolute bottom-[35%] left-[25%] w-3 h-3 rounded-full bg-green-300/15 auth-float-1" />
      <div className="absolute top-[70%] right-[40%] w-5 h-5 rounded-full bg-primary-400/12 auth-float-4" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border-[12px] opacity-[0.06] auth-rotate" style={{ borderImage: 'repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 6px) 12' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full border border-white/[0.06]" />
    </div>
    <div className="relative z-10 flex flex-col justify-center p-10 w-full">
      <div className="flex items-center gap-2.5 mb-auto">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><span className="text-white font-bold text-[18px]">C</span></div>
        <span className="text-xl font-bold text-white">Customer Portal</span>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <h1 className="text-4xl font-bold text-white leading-tight mb-4">Almost there,<br />set a new<br />password.</h1>
        <p className="text-white/60 text-sm leading-relaxed max-w-xs">Choose a strong password to keep your account secure.</p>
      </div>
    </div>
  </div>
);

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const { value: showPassword, toggle: togglePassword } = useToggle(false);
  const { value: showConfirm, toggle: toggleConfirm } = useToggle(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { new_password: '', confirm_password: '' } });
  const newPassword = watch('new_password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError('');
    try {
      await authService.resetPassword(token, data.new_password, data.confirm_password);
      navigate(ROUTES.LOGIN, { state: { message: 'Password reset successfully. Please log in with your new password.' } });
    } catch (err) {
      const r = err.response?.data;
      if (r?.non_field_errors) setServerError(r.non_field_errors[0]);
      else if (typeof r === 'string') setServerError(r);
      else setServerError('An error occurred while resetting your password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F1EB' }}>
      <AuthPanel />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full sm:max-w-md mx-auto">
          <div className="lg:hidden flex items-center gap-2.5 mb-6 justify-center">
            <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center"><span className="text-white font-bold text-[18px]">C</span></div>
            <span className="text-xl font-bold text-gray-900">Customer Portal</span>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-100 shadow-sm">
            <div className="text-center mb-5">
              <div className="mx-auto w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Reset your password</h2>
              <p className="text-sm text-gray-500">Enter your new password below.</p>
            </div>
            {serverError && (<div className="p-2.5 bg-error-50 border border-error-200 rounded-xl mb-3"><p className="text-sm text-error-600">{serverError}</p></div>)}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <div className="relative">
                <Input label="New password" type={showPassword ? "text" : "password"} placeholder="Enter new password" className="pr-10 h-11" error={errors.new_password?.message} {...register('new_password', validationRules.passwordWithMin)} />
                <button type="button" onClick={togglePassword} className="absolute right-3 top-[2.35rem] flex items-center justify-center text-secondary-400 hover:text-secondary-600 focus:outline-none leading-none">{showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}</button>
              </div>
              <div className="relative">
                <Input label="Confirm new password" type={showConfirm ? "text" : "password"} placeholder="Confirm new password" className="pr-10 h-11" error={errors.confirm_password?.message} {...register('confirm_password', { ...validationRules.confirmPassword, validate: (value) => value === newPassword || "Passwords don't match" })} />
                <button type="button" onClick={toggleConfirm} className="absolute right-3 top-[2.35rem] flex items-center justify-center text-secondary-400 hover:text-secondary-600 focus:outline-none leading-none">{showConfirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}</button>
              </div>
              <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full h-11">{isSubmitting ? 'Resetting...' : 'Reset password'}</Button>
            </form>
            <div className="mt-5 text-center">
              <Link to={ROUTES.LOGIN} className="text-sm text-gray-500 hover:text-gray-700 font-medium">Remember your password? Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
