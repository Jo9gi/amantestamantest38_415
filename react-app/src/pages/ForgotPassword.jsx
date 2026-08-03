import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { authService } from '../services';
import { validationRules } from '../schemas';
import { ROUTES } from '../constants';

const AuthPanel = ({ title, subtitle }) => (
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
        <h1 className="text-4xl font-bold text-white leading-tight mb-4">{title}</h1>
        <p className="text-white/60 text-sm leading-relaxed max-w-xs">{subtitle}</p>
      </div>
    </div>
  </div>
);

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setServerError('');
    try {
      const response = await authService.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setSent(true);
      console.log('Reset token:', response.reset_token);
    } catch (err) {
      setServerError(err.response?.data?.email?.[0] || err.response?.data?.detail || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: '#F5F1EB' }}>
        <AuthPanel title={"Check your\ninbox."} subtitle="We've sent you instructions to reset your password." />
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
          <div className="w-full sm:max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-100 shadow-sm text-center">
              <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg, #14532d 0%, #15803d 100%)' }}>
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
              <p className="text-sm text-gray-500 mb-5">We've sent password reset instructions to <strong className="text-gray-700">{submittedEmail}</strong></p>
              <Link to={ROUTES.LOGIN} className="inline-flex items-center text-primary-700 hover:text-primary-600 font-medium text-sm"><ArrowLeftIcon className="w-4 h-4 mr-2" />Back to login</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F5F1EB' }}>
      <AuthPanel title={"Don't worry,\nwe've got you."} subtitle="Reset your password in just a few steps and get back on track." />
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full sm:max-w-md mx-auto">
          <div className="lg:hidden flex items-center gap-2.5 mb-6 justify-center">
            <div className="w-10 h-10 bg-primary-800 rounded-full flex items-center justify-center"><span className="text-white font-bold text-[18px]">C</span></div>
            <span className="text-xl font-bold text-gray-900">Customer Portal</span>
          </div>
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-gray-100 shadow-sm">
            <div className="text-center mb-5">
              <div className="mx-auto w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Forgot your password?</h2>
              <p className="text-sm text-gray-500">Enter your email and we'll send you a reset link.</p>
            </div>
            {serverError && (<div className="p-2.5 bg-error-50 border border-error-200 rounded-xl mb-3"><p className="text-sm text-error-600">{serverError}</p></div>)}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
              <Input label="Email address" type="email" placeholder="Enter your email" autoComplete="email" error={errors.email?.message} className="h-11" {...register('email', validationRules.email)} />
              <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full h-11">{isSubmitting ? 'Sending...' : 'Send reset link'}</Button>
            </form>
            <div className="mt-5 text-center">
              <Link to={ROUTES.LOGIN} className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 font-medium"><ArrowLeftIcon className="w-4 h-4 mr-2" />Back to login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
