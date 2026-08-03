export default function RegisterIllustration() {
  return (
    <div className="relative h-full flex items-center justify-center p-8">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-16 left-12 w-28 h-28 bg-gradient-to-r from-primary-200 to-primary-300 rounded-full blur-xl opacity-50 illustration-float"></div>
        <div className="absolute bottom-20 right-20 w-36 h-36 bg-gradient-to-r from-primary-300 to-primary-400 rounded-full blur-xl opacity-40 illustration-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-primary-300 to-primary-400 rounded-full blur-lg opacity-30 animate-pulse"></div>
      </div>

      {/* Main Illustration */}
      <div className="relative z-10 max-w-md w-full">
        {/* Growth Chart Visualization */}
        <div className="relative mx-auto w-80 h-80">
          {/* Chart Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl shadow-xl">
            {/* Grid Lines */}
            <div className="absolute inset-4 border-l-2 border-b-2 border-secondary-200">
              <div className="absolute bottom-0 left-0 w-full h-px bg-secondary-200 opacity-50" style={{ bottom: '25%' }}></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-secondary-200 opacity-50" style={{ bottom: '50%' }}></div>
              <div className="absolute bottom-0 left-0 w-full h-px bg-secondary-200 opacity-50" style={{ bottom: '75%' }}></div>

              <div className="absolute bottom-0 left-0 w-px h-full bg-secondary-200 opacity-50" style={{ left: '25%' }}></div>
              <div className="absolute bottom-0 left-0 w-px h-full bg-secondary-200 opacity-50" style={{ left: '50%' }}></div>
              <div className="absolute bottom-0 left-0 w-px h-full bg-secondary-200 opacity-50" style={{ left: '75%' }}></div>
            </div>

            {/* Growth Line */}
            <svg className="absolute inset-4" viewBox="0 0 100 100" preserveAspectRatio="none">
              <polyline
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="3"
                points="10,80 25,70 40,60 55,45 70,35 85,20"
                className="animate-pulse"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
              </defs>
            </svg>

            {/* Data Points */}
            <div className="absolute bottom-4 left-4 w-3 h-3 bg-primary-500 rounded-full illustration-pulse"></div>
            <div className="absolute bottom-8 left-1/4 w-3 h-3 bg-primary-600 rounded-full illustration-float"></div>
            <div className="absolute bottom-12 left-2/5 w-3 h-3 bg-primary-500 rounded-full illustration-pulse"></div>
            <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-primary-600 rounded-full illustration-float"></div>
            <div className="absolute bottom-24 right-1/4 w-3 h-3 bg-primary-700 rounded-full illustration-pulse"></div>
            <div className="absolute top-8 right-4 w-3 h-3 bg-success-500 rounded-full animate-bounce"></div>
          </div>

          {/* Floating Metrics */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-3 py-2 illustration-float">
            <div className="text-xs font-bold text-success-600">+24%</div>
          </div>

          <div className="absolute -right-8 top-1/3 bg-white rounded-lg shadow-lg px-3 py-2 illustration-pulse">
            <div className="text-xs font-bold text-primary-600">Growth</div>
          </div>

          <div className="absolute -left-6 bottom-1/3 bg-white rounded-lg shadow-lg px-3 py-2 animate-bounce">
            <div className="text-xs font-bold text-primary-600">Success</div>
          </div>

          {/* User Icon in Center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-xl">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center mt-8 space-y-4">
          <h3 className="text-2xl font-bold text-white mb-2">
            Start Your Journey
          </h3>
          <p className="text-primary-100 leading-relaxed">
            Join thousands of users who are growing their business
            with our powerful platform.
          </p>
        </div>
      </div>
    </div>
  );
}
