import React, { useState } from 'react';

const ErrorFixPopup = ({ errors, onClose, onDismiss }) => {
  const [additionalInstructions, setAdditionalInstructions] = useState('');
  const [isFixing, setIsFixing] = useState(false);
  const [fixResponse, setFixResponse] = useState(null);
  const [fixError, setFixError] = useState(null);
  const [expandedErrors, setExpandedErrors] = useState(new Set());
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [previousResponse, setPreviousResponse] = useState('');
  const [displayResponse, setDisplayResponse] = useState('');

  // Helper function to parse HTML and extract plain text
  const parseHtmlToText = (html) => {
    if (!html) return '';

    // Create a temporary div element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Get the text content (automatically strips all HTML tags)
    const textContent = tempDiv.textContent || tempDiv.innerText || '';

    // Clean up and return
    return textContent.trim();
  };

  // Check if content contains HTML tags
  const isHtmlContent = (content) => {
    if (!content) return false;
    const htmlTagPattern = /<[^>]+>/;
    return htmlTagPattern.test(content);
  };

  // Toggle individual error expansion
  const toggleError = (errorId) => {
    const newExpanded = new Set(expandedErrors);
    if (newExpanded.has(errorId)) {
      newExpanded.delete(errorId);
    } else {
      newExpanded.add(errorId);
    }
    setExpandedErrors(newExpanded);
  };

  // Group errors by type
  const groupedErrors = errors.reduce((acc, error) => {
    if (!acc[error.type]) {
      acc[error.type] = [];
    }
    acc[error.type].push(error);
    return acc;
  }, {});

  const getErrorTypeKey = (type) => {
    switch (type) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'api-error':
        return 'api_error';
      default:
        return 'unknown';
    }
  };

  const getErrorTypeConfig = (type) => {
    switch (type) {
      case 'warning':
        return {
          label: 'Console Warning',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-amber-50/50',
          borderColor: 'border-amber-300',
          textColor: 'text-amber-700',
          iconColor: 'text-amber-500',
          badgeColor: 'bg-amber-100/70 text-amber-600'
        };
      case 'error':
        return {
          label: 'Console Error',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ),
          bgColor: 'bg-rose-50/50',
          borderColor: 'border-rose-300',
          textColor: 'text-rose-700',
          iconColor: 'text-rose-400',
          badgeColor: 'bg-rose-100/70 text-rose-600'
        };
      case 'api-error':
        return {
          label: 'API Failure',
          icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 7a1 1 0 012 0v4a1 1 0 01-2 0V7zm1 7a1 1 0 100-2 1 1 0 000 2z" />
            </svg>
          ),
          bgColor: 'bg-violet-50/50',
          borderColor: 'border-violet-300',
          textColor: 'text-violet-700',
          iconColor: 'text-violet-400',
          badgeColor: 'bg-violet-100/70 text-violet-600'
        };
      default:
        return {
          label: 'Unknown Error',
          icon: null,
          bgColor: 'bg-gray-50/50',
          borderColor: 'border-gray-300',
          textColor: 'text-gray-700',
          iconColor: 'text-gray-400',
          badgeColor: 'bg-gray-100/70 text-gray-600'
        };
    }
  };

  const formatErrorData = (error) => {
    const baseInfo = {
      message: error.message,
      timestamp: error.timestamp,
      source: error.source,
      type: error.type
    };

    if (error.details) {
      baseInfo.details = error.details;
    }

    if (error.stack && error.type === 'error') {
      const stackLines = error.stack.split('\n').slice(0, 5);
      baseInfo.stackTrace = stackLines.join('\n');
    }

    return baseInfo;
  };

  // Convert all errors to a single string
  const convertErrorsToString = () => {
    let errorString = '';

    Object.entries(groupedErrors).forEach(([type, errorList]) => {
      const config = getErrorTypeConfig(type);
      errorString += `\n\n=== ${config.label} (${errorList.length} issues) ===\n`;

      errorList.forEach((error, idx) => {
        errorString += `\n${idx + 1}. ${error.message}\n`;
        errorString += `   Time: ${new Date(error.timestamp).toLocaleString()}\n`;
        errorString += `   Source: ${error.source}\n`;

        // Add response body if available (for API errors)
        if (error.details?.responseBody) {
          errorString += `   Response Body:\n   ${error.details.responseBody.split('\n').join('\n   ')}\n`;
        }

        if (error.details) {
          // Exclude responseBody and rawResponseBody from details since we show them separately
          const { responseBody, rawResponseBody, ...otherDetails } = error.details;
          if (Object.keys(otherDetails).length > 0) {
            errorString += `   Details: ${JSON.stringify(otherDetails, null, 2)}\n`;
          }
        }

        if (error.stack) {
          errorString += `   Stack: ${error.stack.split('\n').slice(0, 3).join('\n   ')}\n`;
        }
      });
    });

    return errorString.trim();
  };

  const handleFixNow = async () => {
    setIsFixing(true);
    setFixError(null);
    setFixResponse(null);

    try {
      // Get environment variables
      const API_KEY = import.meta.env.VITE_API_KEY;
      const URL = import.meta.env.VITE_ERROR_DETECTOR_URL;
      const SESSION_ID = import.meta.env.VITE_SESSION_ID;

      // Convert all errors to a single string
      const errorString = convertErrorsToString();

      // Create FormData
      const formData = new FormData();
      formData.append('api_key', API_KEY);
      formData.append('update_content', additionalInstructions || '');
      formData.append('session_id', SESSION_ID);
      formData.append('error', errorString);

      // Include previous response if exists
      if (previousResponse) {
        formData.append('previous_response', previousResponse);
      }

      console.log('Sending fix request with form data...');

      const response = await fetch(URL, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();

      // Process the response
      if (data.display_result) {
        let processedText = data.display_result;

        // Check if response contains HTML
        if (isHtmlContent(data.display_result)) {
          console.log('HTML content detected, parsing...');
          processedText = parseHtmlToText(data.display_result);
        }

        // Store full parsed response for next API call
        setPreviousResponse(processedText);

        // Store full response for display (NO TRUNCATION for Fix API response)
        setDisplayResponse(processedText);
      }

      setFixResponse(data);
      setShowResponseModal(true);

      // Don't auto-dismiss anymore, let user close the modal
    } catch (error) {
      console.error('Fix request failed:', error);
      setFixError(error.message);
    } finally {
      setIsFixing(false);
    }
  };

  const closeResponseModal = () => {
    setShowResponseModal(false);
    setFixResponse(null);
    onDismiss(errors.map(e => e.id));
    onClose();
  };

  if (errors.length === 0) return null;

  return (
    <>
      <div className="fixed inset-0 z-[200] overflow-hidden flex items-center justify-center font-sans">
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity ${isFixing ? 'cursor-not-allowed' : ''}`}
          onClick={isFixing ? undefined : onClose}
        />

        {/* Main Popup Container */}
        <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 p-6 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2.5">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white tracking-tight">AutoSDLC Error Detector</h2>
                  <p className="text-slate-300 text-sm mt-0.5 font-light">
                    {errors.length} issue{errors.length > 1 ? 's' : ''} detected • Ready for analysis
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                disabled={isFixing}
                className={`text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all ${isFixing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Loading Overlay - Covers entire screen */}
          {isFixing && (
            <div className="fixed inset-0 bg-white/95 backdrop-blur-sm z-[400] flex items-center justify-center cursor-not-allowed">
              <div className="text-center">
                <div className="inline-block relative">
                  <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-700 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-slate-800">Agent is fixing the error</h3>
                <p className="mt-2 text-slate-600 max-w-md mx-auto">
                  Please wait, this may take some time...
                </p>
                <div className="mt-4 flex items-center justify-center space-x-1">
                  <div className="w-2 h-2 bg-slate-700 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                  <div className="w-2 h-2 bg-slate-700 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                  <div className="w-2 h-2 bg-slate-700 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                </div>
              </div>
            </div>
          )}

          {/* Scrollable Error List */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="space-y-5">
              {Object.entries(groupedErrors).map(([type, errorList]) => {
                const config = getErrorTypeConfig(type);

                return (
                  <div key={type} className="space-y-3">
                    {/* Category Header */}
                    <div className="flex items-center space-x-3">
                      <div className={`${config.iconColor} opacity-70`}>
                        {config.icon}
                      </div>
                      <h3 className="text-base font-medium text-gray-700">
                        {config.label}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.badgeColor}`}>
                        {errorList.length} {errorList.length === 1 ? 'issue' : 'issues'}
                      </span>
                    </div>

                    {/* Individual Error Cards */}
                    <div className="space-y-2">
                      {errorList.map((error, idx) => {
                        const isExpanded = expandedErrors.has(error.id);

                        return (
                          <div
                            key={error.id || idx}
                            className={`border-l-2 rounded-lg shadow-sm transition-all hover:shadow-md bg-white/80 backdrop-blur-sm ${config.borderColor}`}
                          >
                            <button
                              onClick={() => toggleError(error.id)}
                              className="w-full px-4 py-3 flex items-start justify-between text-left hover:bg-gray-50/50 transition-colors rounded-lg"
                            >
                              <div className="flex-1 pr-4">
                                <p className={`font-medium text-sm ${config.textColor} line-clamp-2`}>
                                  {error.message}
                                </p>
                                <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                                  <span className="flex items-center">
                                    <svg className="w-3 h-3 mr-1 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    {new Date(error.timestamp).toLocaleTimeString()}
                                  </span>
                                  <span className="flex items-center">
                                    <svg className="w-3 h-3 mr-1 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                    </svg>
                                    {error.source}
                                  </span>
                                </div>
                              </div>
                              <div className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </div>
                            </button>

                            {/* Expanded Details */}
                            {isExpanded && (
                              <div className="px-4 pb-4 border-t border-gray-100">
                                <div className="mt-3 space-y-2">
                                  {/* Response Body (if available) */}
                                  {error.details?.responseBody && (
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                                      <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        Response Body (Parsed):
                                      </p>
                                      <pre className="text-xs text-blue-800 whitespace-pre-wrap break-words font-mono leading-relaxed">
                                        {error.details.responseBody}
                                      </pre>
                                    </div>
                                  )}

                                  {/* Other Details */}
                                  {error.details && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                      <p className="text-xs font-medium text-gray-600 mb-1">Details:</p>
                                      <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words font-mono">
                                        {JSON.stringify({
                                          ...error.details,
                                          responseBody: undefined, // Don't show in details since we show it separately
                                          rawResponseBody: undefined // Don't show raw HTML
                                        }, null, 2)}
                                      </pre>
                                    </div>
                                  )}

                                  {/* Stack Trace */}
                                  {error.stack && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                      <p className="text-xs font-medium text-gray-600 mb-1">Stack Trace:</p>
                                      <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words font-mono">
                                        {error.stack.split('\n').slice(0, 5).join('\n')}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Error Message (not during loading) */}
            {!isFixing && fixError && (
              <div className="mt-5">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-700 font-medium">Fix request failed</p>
                  </div>
                  <p className="text-red-600 text-sm mt-1 ml-7">{fixError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Bottom Section */}
          <div className="border-t border-gray-200 bg-gray-50 p-5 shrink-0">
            {/* Additional Instructions Field */}
            <div className="mb-4">
              <label htmlFor="instructions" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Instructions
              </label>
              <div className="relative">
                <textarea
                  id="instructions"
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="Provide any additional context or specific instructions for fixing these errors..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-400 focus:border-transparent resize-none text-sm font-normal"
                  rows={2}
                  disabled={isFixing}
                />
                <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                  {additionalInstructions.length} characters
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={onClose}
                disabled={isFixing}
                className={`px-5 py-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all font-medium text-sm shadow-sm ${isFixing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Cancel
              </button>

              <button
                onClick={handleFixNow}
                disabled={isFixing}
                className={`px-6 py-2 text-white font-medium text-sm rounded-lg transition-all shadow-sm ${
                  isFixing
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-slate-700 hover:bg-slate-800'
                }`}
              >
                {isFixing ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Fix Now
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && fixResponse && (
        <div className="fixed inset-0 z-[300] overflow-hidden flex items-center justify-center font-sans p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeResponseModal} />

          <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Fix Applied Successfully</h3>
                    <p className="text-emerald-100 text-sm mt-0.5">{fixResponse.message}</p>
                  </div>
                </div>
                <button
                  onClick={closeResponseModal}
                  className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content - Fix Summary Only */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              {displayResponse ? (
                <>
                  <div className="bg-white rounded-lg border border-gray-200 p-5">
                    <h4 className="text-base font-semibold text-gray-800 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      Fix Summary
                    </h4>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-gray-50 p-4 rounded-lg border border-gray-200 leading-relaxed">
{displayResponse}
                      </pre>
                    </div>
                  </div>

                  {/* Hard Refresh Reminder */}
                  <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="shrink-0 mt-0.5">
                        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          To see the changes
                        </p>
                        <p className="text-sm text-blue-700">
                          Press <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-semibold shadow-sm">Ctrl</kbd> + <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-semibold shadow-sm">Shift</kbd> + <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-semibold shadow-sm">R</kbd> to hard refresh the page
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No fix summary available</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 bg-white p-5">
              <button
                onClick={closeResponseModal}
                className="w-full px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-medium text-sm rounded-lg transition-all shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ErrorFixPopup;