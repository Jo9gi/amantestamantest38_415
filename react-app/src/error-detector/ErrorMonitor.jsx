import React, { useState, useEffect } from 'react';
import ErrorFixPopup from './ErrorFixPopup';
import ErrorDetectorPortal from './ErrorDetectorPortal';
import errorDetector from './ErrorDetector';

const ErrorMonitor = ({
  maxErrors = 10,
  showStatistics = true,
  autoShowPopup = true
}) => {
  const [errors, setErrors] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [isMinimized, setIsMinimized] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Initialize error detector
    errorDetector.init();

    // Subscribe to errors
    const unsubscribe = errorDetector.subscribe((error) => {
      const errorWithId = {
        ...error,
        id: `${Date.now()}-${Math.random()}`
      };

      setErrors(prev => {
        const updated = [errorWithId, ...prev];
        const limited = updated.slice(0, maxErrors);

        // Auto-show popup when new error arrives
        if (autoShowPopup && !showPopup) {
          setShowPopup(true);
        }

        return limited;
      });
    });

    // Update statistics periodically
    const statsInterval = setInterval(() => {
      setStatistics(errorDetector.getStatistics());
    }, 1000);

    // Cleanup
    return () => {
      unsubscribe();
      clearInterval(statsInterval);
    };
  }, [maxErrors, autoShowPopup, showPopup]);

  const dismissErrors = (errorIds) => {
    setErrors(prev => prev.filter(e => !errorIds.includes(e.id)));
    errorDetector.clearErrors();
  };

  const clearAll = () => {
    setErrors([]);
    errorDetector.clearErrors();
    setShowPopup(false);
  };

  const getErrorCount = () => {
    const counts = errors.reduce((acc, error) => {
      acc[error.type] = (acc[error.type] || 0) + 1;
      return acc;
    }, {});
    return counts;
  };

  const errorCounts = getErrorCount();

  return (
    <ErrorDetectorPortal>
      {/* Error Fix Popup */}
      {showPopup && errors.length > 0 && (
        <ErrorFixPopup
          errors={errors}
          onClose={() => setShowPopup(false)}
          onDismiss={dismissErrors}
        />
      )}

      {/* Statistics Panel with Error Indicator */}
      {showStatistics && statistics && !showPopup && (
        <div className={`fixed bottom-4 left-4 z-50 ${isMinimized ? 'w-12' : 'w-64'} font-sans`}>
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white p-3 flex justify-between items-center">
              <h3 className={`text-sm font-semibold ${isMinimized ? 'hidden' : ''}`}>
                AutoSDLC Error Monitor
              </h3>
              <div className="flex items-center space-x-2">
                {/* Error Indicator Icon */}
                {errors.length > 0 && (
                  <button
                    onClick={() => setShowPopup(true)}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white hover:text-gray-200"
                >
                  {isMinimized ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {!isMinimized && (
              <div className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Total Events</span>
                    <span className="text-sm font-semibold">{statistics.total}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-rose-50 rounded p-2">
                      <p className="text-xs text-rose-600">Errors</p>
                      <p className="text-lg font-semibold text-rose-700">
                        {statistics.errors}
                        {errorCounts.error > 0 && (
                          <span className="text-xs ml-1">({errorCounts.error})</span>
                        )}
                      </p>
                    </div>
                    <div className="bg-violet-50 rounded p-2">
                      <p className="text-xs text-violet-600">API</p>
                      <p className="text-lg font-semibold text-violet-700">
                        {statistics.apiErrors}
                        {errorCounts['api-error'] > 0 && (
                          <span className="text-xs ml-1">({errorCounts['api-error']})</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {Object.keys(statistics.bySource).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-2">By Source</p>
                      <div className="space-y-1">
                        {Object.entries(statistics.bySource).map(([source, count]) => (
                          <div key={source} className="flex justify-between text-xs">
                            <span className="text-gray-600 capitalize">{source}</span>
                            <span className="font-semibold">{count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-2 mt-3">
                    {errors.length > 0 && (
                      <button
                        onClick={() => setShowPopup(true)}
                        className="flex-1 px-3 py-1 bg-slate-700 hover:bg-slate-800 text-white text-xs rounded transition-colors font-medium shadow-sm"
                      >
                        View & Fix ({errors.length})
                      </button>
                    )}
                    <button
                      onClick={clearAll}
                      className="flex-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Minimized State - Show error indicator */}
          {isMinimized && errors.length > 0 && (
            <button
              onClick={() => setShowPopup(true)}
              className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md animate-pulse font-medium text-sm"
            >
              {errors.length}
            </button>
          )}
        </div>
      )}

      {/* Floating Action Button (when statistics panel is hidden) */}
      {!showStatistics && errors.length > 0 && !showPopup && (
        <button
          onClick={() => setShowPopup(true)}
          className="fixed bottom-4 right-4 z-50 bg-slate-700 hover:bg-slate-800 text-white rounded-full p-4 shadow-lg transition-all hover:scale-105 font-sans"
        >
          <div className="relative">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
              {errors.length}
            </span>
          </div>
        </button>
      )}
    </ErrorDetectorPortal>
  );
};

export default ErrorMonitor;