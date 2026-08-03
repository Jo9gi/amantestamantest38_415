export default function LoginIllustration() {
  return (
    <div className="relative h-full flex items-center justify-center p-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-primary-200 to-accent-200 rounded-full blur-xl opacity-60 illustration-float"></div>
        <div className="absolute bottom-32 right-16 w-40 h-40 bg-gradient-to-r from-accent-200 to-primary-200 rounded-full blur-xl opacity-40 illustration-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-r from-primary-300 to-primary-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
      </div>

      {/* Main Illustration */}
      <div className="relative z-10 max-w-md w-full">
        {/* Security Shield */}
        <div className="relative mx-auto w-72 h-72">
          {/* Outer Ring */}
          <div className="absolute inset-0 border-4 border-primary-200 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>

          {/* Middle Ring */}
          <div className="absolute inset-4 border-2 border-accent-200 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>

          {/* Inner Content */}
          <div className="absolute inset-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-2xl">
            <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Floating Icons */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center illustration-float">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-primary-400 rounded-full flex items-center justify-center illustration-pulse">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-2a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
            </svg>
          </div>

          <div className="absolute -left-4 bottom-1/4 w-8 h-8 bg-success-500 rounded-full flex items-center justify-center animate-bounce">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mt-8 space-y-4">
          <h3 className="text-2xl font-bold text-white mb-2">
            Secure Access
          </h3>
          <p className="text-primary-100 leading-relaxed">
            Your data is protected with enterprise-grade security.
            Sign in securely to access your dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
