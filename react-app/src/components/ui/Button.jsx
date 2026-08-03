import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const Button = forwardRef(({
  className,
  variant = "primary",
  size = "default",
  children,
  disabled,
  loading,
  ...props
}, ref) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    ghost: "hover:bg-secondary-100 text-secondary-600 hover:text-secondary-900",
    link: "text-primary-600 underline-offset-4 hover:underline p-0"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button
      className={cn(
        "btn focus-visible",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      ref={ref}
      {...props}
    >
      {loading && (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
      )}
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;
