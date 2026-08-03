/**
 * ErrorDetector - A plug-and-play error detection module for React applications
 * Monitors console warnings/errors and API failures
 */

class ErrorDetector {
  constructor() {
    this.listeners = new Set();
    this.isInitialized = false;
    this.originalConsole = {};
    this.originalFetch = null;
    this.originalXHROpen = null;
    this.originalXHRSend = null;
    this.errors = [];
    this.maxErrors = 100; // Limit stored errors to prevent memory issues
  }

  /**
   * Helper: Check if content contains HTML tags
   */
  isHtmlContent(content) {
    if (!content || typeof content !== 'string') return false;
    const htmlTagPattern = /<[^>]+>/;
    return htmlTagPattern.test(content);
  }

  /**
   * Helper: Parse HTML and extract plain text (removes style, script, and cleans up)
   */
  parseHtmlToText(html) {
    if (!html) return '';
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Remove style tags and their content
      const styleTags = tempDiv.querySelectorAll('style');
      styleTags.forEach(tag => tag.remove());

      // Remove script tags and their content
      const scriptTags = tempDiv.querySelectorAll('script');
      scriptTags.forEach(tag => tag.remove());

      // Remove link tags (css links)
      const linkTags = tempDiv.querySelectorAll('link');
      linkTags.forEach(tag => tag.remove());

      // Remove meta tags
      const metaTags = tempDiv.querySelectorAll('meta');
      metaTags.forEach(tag => tag.remove());

      // Get text content
      let textContent = tempDiv.textContent || tempDiv.innerText || '';

      // Clean up excessive whitespace and newlines
      textContent = textContent
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .join('\n');

      return textContent.trim();
    } catch (error) {
      return html; // Return original if parsing fails
    }
  }

  /**
   * Helper: Process response body (parse HTML if needed, truncate only HTML)
   */
  processResponseBody(responseBody) {
    if (!responseBody) return null;

    // Check if content is HTML
    if (this.isHtmlContent(responseBody)) {
      // Parse HTML to extract text
      let processed = this.parseHtmlToText(responseBody);

      // Get character limit from environment (default to 1000)
      const charLimit = parseInt(import.meta.env.VITE_RESPONSE_CHAR_LIMIT) || 1000;

      // Truncate HTML responses only
      if (processed.length > charLimit) {
        return processed.substring(0, charLimit) + `\n\n... (HTML Response truncated - showing first ${charLimit} characters)`;
      }

      return processed;
    }

    // For non-HTML content (JSON, plain text, etc.), return full content
    return responseBody;
  }

  /**
   * Initialize the error detector
   */
  init() {
    if (this.isInitialized) return;

    this.interceptConsole();
    this.interceptFetch();
    this.interceptXHR();
    this.isInitialized = true;
  }

  /**
   * Clean up and restore original methods
   */
  destroy() {
    if (!this.isInitialized) return;

    // Restore console methods
    Object.keys(this.originalConsole).forEach(method => {
      console[method] = this.originalConsole[method];
    });

    // Restore fetch
    if (this.originalFetch) {
      window.fetch = this.originalFetch;
    }

    // Restore XHR
    if (this.originalXHROpen && this.originalXHRSend) {
      XMLHttpRequest.prototype.open = this.originalXHROpen;
      XMLHttpRequest.prototype.send = this.originalXHRSend;
    }

    this.listeners.clear();
    this.errors = [];
    this.isInitialized = false;
  }

  /**
   * Intercept console methods
   */
  interceptConsole() {
    // Store original console methods - only intercept errors, not warnings
    ['error'].forEach(method => {
      this.originalConsole[method] = console[method];

      console[method] = (...args) => {
        // Call original method
        this.originalConsole[method].apply(console, args);

        // Create error event
        const errorEvent = {
          type: 'error',
          source: 'console',
          message: args.map(arg => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg);
              } catch {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' '),
          timestamp: new Date().toISOString(),
          stack: new Error().stack,
          details: args
        };

        this.handleError(errorEvent);
      };
    });
  }

  /**
   * Intercept fetch API calls
   */
  interceptFetch() {
    this.originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const [url, options = {}] = args;

      try {
        const response = await this.originalFetch.apply(window, args);

        // Check for HTTP errors
        if (!response.ok) {
          // Clone response to read body (since body can only be read once)
          const clonedResponse = response.clone();

          let responseBody = null;
          let processedBody = null;

          try {
            // Try to read response body as text
            responseBody = await clonedResponse.text();
            processedBody = this.processResponseBody(responseBody);
          } catch (err) {
            // If reading body fails, continue without it
            console.warn('ErrorDetector: Failed to read response body', err);
          }

          const errorEvent = {
            type: 'api-error',
            source: 'fetch',
            message: `API call failed: ${options.method || 'GET'} ${url} - Status: ${response.status} ${response.statusText}`,
            timestamp: new Date().toISOString(),
            details: {
              url,
              method: options.method || 'GET',
              status: response.status,
              statusText: response.statusText,
              headers: options.headers,
              responseBody: processedBody,
              rawResponseBody: responseBody
            }
          };

          this.handleError(errorEvent);
        }

        return response;
      } catch (error) {
        // Network errors or other fetch failures
        const errorEvent = {
          type: 'api-error',
          source: 'fetch',
          message: `Network error: ${options.method || 'GET'} ${url} - ${error.message}`,
          timestamp: new Date().toISOString(),
          details: {
            url,
            method: options.method || 'GET',
            error: error.message,
            headers: options.headers
          }
        };

        this.handleError(errorEvent);
        throw error;
      }
    };
  }

  /**
   * Intercept XMLHttpRequest
   */
  interceptXHR() {
    const self = this;
    this.originalXHROpen = XMLHttpRequest.prototype.open;
    this.originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...args) {
      this._errorDetector = {
        method,
        url
      };
      return self.originalXHROpen.apply(this, [method, url, ...args]);
    };

    XMLHttpRequest.prototype.send = function(...args) {
      if (this._errorDetector) {
        // Add error event listener
        this.addEventListener('error', function() {
          const errorEvent = {
            type: 'api-error',
            source: 'xhr',
            message: `XHR Network error: ${this._errorDetector.method} ${this._errorDetector.url}`,
            timestamp: new Date().toISOString(),
            details: {
              url: this._errorDetector.url,
              method: this._errorDetector.method
            }
          };

          self.handleError(errorEvent);
        });

        // Add load event listener to check status
        this.addEventListener('load', function() {
          if (this.status >= 400) {
            const rawResponseBody = this.responseText;
            const processedBody = self.processResponseBody(rawResponseBody);

            const errorEvent = {
              type: 'api-error',
              source: 'xhr',
              message: `XHR call failed: ${this._errorDetector.method} ${this._errorDetector.url} - Status: ${this.status} ${this.statusText}`,
              timestamp: new Date().toISOString(),
              details: {
                url: this._errorDetector.url,
                method: this._errorDetector.method,
                status: this.status,
                statusText: this.statusText,
                responseBody: processedBody,
                rawResponseBody: rawResponseBody
              }
            };

            self.handleError(errorEvent);
          }
        });
      }

      return self.originalXHRSend.apply(this, args);
    };
  }

  /**
   * Handle detected errors
   */
  handleError(errorEvent) {
    // Store error (with limit)
    this.errors.push(errorEvent);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Notify all listeners
    this.listeners.forEach(listener => {
      try {
        listener(errorEvent);
      } catch (err) {
        // Prevent listener errors from breaking the detector
        console.warn('ErrorDetector: Listener threw an error', err);
      }
    });
  }

  /**
   * Subscribe to error events
   */
  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('Listener must be a function');
    }
    this.listeners.add(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Get all stored errors
   */
  getErrors() {
    return [...this.errors];
  }

  /**
   * Clear stored errors
   */
  clearErrors() {
    this.errors = [];
  }

  /**
   * Get errors by type
   */
  getErrorsByType(type) {
    return this.errors.filter(error => error.type === type);
  }

  /**
   * Get error statistics
   */
  getStatistics() {
    const stats = {
      total: this.errors.length,
      warnings: 0,
      errors: 0,
      apiErrors: 0,
      bySource: {},
      recentErrors: []
    };

    this.errors.forEach(error => {
      if (error.type === 'warning') stats.warnings++;
      if (error.type === 'error') stats.errors++;
      if (error.type === 'api-error') stats.apiErrors++;

      stats.bySource[error.source] = (stats.bySource[error.source] || 0) + 1;
    });

    stats.recentErrors = this.errors.slice(-5);

    return stats;
  }
}

// Create singleton instance
const errorDetector = new ErrorDetector();

export default errorDetector;