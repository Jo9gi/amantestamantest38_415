// Main exports for the error-detector module
// This makes it a plug-and-play module for any React project

export { default as ErrorDetector } from './ErrorDetector';
export { default as ErrorMonitor } from './ErrorMonitor';
export { default as ErrorFixPopup } from './ErrorFixPopup';
export { default as ErrorDetectorPortal } from './ErrorDetectorPortal';
export { default as useErrorDetector } from './useErrorDetector';

// For convenience, export the singleton detector instance
export { default as errorDetector } from './ErrorDetector';