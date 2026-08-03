import { useState, useEffect } from 'react';
import errorDetector from './ErrorDetector';

/**
 * Custom hook for using the ErrorDetector in React components
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoInit - Auto-initialize the detector (default: true)
 * @param {number} options.historyLimit - Number of errors to keep in history (default: 50)
 * @returns {Object} Error detector interface
 */
const useErrorDetector = (options = {}) => {
  const {
    autoInit = true,
    historyLimit = 50
  } = options;

  const [errors, setErrors] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    warnings: 0,
    errors: 0,
    apiErrors: 0,
    bySource: {}
  });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let unsubscribe = null;

    if (autoInit) {
      // Initialize the error detector
      errorDetector.init();
      setIsActive(true);

      // Subscribe to new errors
      unsubscribe = errorDetector.subscribe((error) => {
        setErrors(prev => {
          const updated = [error, ...prev];
          return updated.slice(0, historyLimit);
        });

        // Update statistics
        setStatistics(errorDetector.getStatistics());
      });

      // Get initial statistics
      setStatistics(errorDetector.getStatistics());
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [autoInit, historyLimit]);

  /**
   * Manually initialize the detector
   */
  const init = () => {
    if (!isActive) {
      errorDetector.init();
      setIsActive(true);
    }
  };

  /**
   * Stop the detector
   */
  const stop = () => {
    if (isActive) {
      errorDetector.destroy();
      setIsActive(false);
      setErrors([]);
      setStatistics({
        total: 0,
        warnings: 0,
        errors: 0,
        apiErrors: 0,
        bySource: {}
      });
    }
  };

  /**
   * Clear all stored errors
   */
  const clearErrors = () => {
    errorDetector.clearErrors();
    setErrors([]);
    setStatistics(errorDetector.getStatistics());
  };

  /**
   * Get errors by type
   */
  const getErrorsByType = (type) => {
    return errors.filter(error => error.type === type);
  };

  /**
   * Manually trigger a test error
   */
  const triggerTestError = (type) => {
    switch (type) {
      case 'warning':
        console.warn('Test warning triggered by ErrorDetector');
        break;
      case 'error':
        console.error('Test error triggered by ErrorDetector');
        break;
      case 'api':
        // Trigger a fake API error
        fetch('https://jsonplaceholder.typicode.com/posts/999999')
          .catch(() => {});
        break;
      default:
        console.error('Unknown test error type');
    }
  };

  /**
   * Export errors to JSON
   */
  const exportErrors = () => {
    const data = {
      timestamp: new Date().toISOString(),
      statistics,
      errors: errors.map(error => ({
        ...error,
        stack: undefined // Remove stack traces for cleaner export
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    // State
    errors,
    statistics,
    isActive,

    // Methods
    init,
    stop,
    clearErrors,
    getErrorsByType,
    triggerTestError,
    exportErrors,

    // Direct access to detector instance (for advanced usage)
    detector: errorDetector
  };
};

export default useErrorDetector;