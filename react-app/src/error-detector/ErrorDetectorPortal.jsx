import { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

const PORTAL_ID = '__error-detector-portal-root__';

const ErrorDetectorPortal = ({ children }) => {
  const containerRef = useRef(null);

  if (!containerRef.current) {
    const existing = document.getElementById(PORTAL_ID);
    if (existing) {
      containerRef.current = existing;
    } else {
      const el = document.createElement('div');
      el.id = PORTAL_ID;
      Object.assign(el.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '0',
        height: '0',
        overflow: 'visible',
        zIndex: '2147483647',
        pointerEvents: 'none',
        isolation: 'isolate',
        transform: 'none',
        filter: 'none',
      });
      containerRef.current = el;
    }
  }

  useEffect(() => {
    const container = containerRef.current;
    if (!document.body.contains(container)) {
      document.body.appendChild(container);
    }
    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);

  return ReactDOM.createPortal(
    <div style={{ pointerEvents: 'auto' }}>{children}</div>,
    containerRef.current
  );
};

export default ErrorDetectorPortal;
