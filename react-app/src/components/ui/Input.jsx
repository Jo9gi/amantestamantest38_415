import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(({
  className,
  type = "text",
  error,
  label,
  helper,
  ...props
}, ref) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "input",
          error && "input-error",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="form-error">{error}</p>
      )}
      {helper && !error && (
        <p className="form-helper">{helper}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
