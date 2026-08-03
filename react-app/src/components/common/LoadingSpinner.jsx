import { cn } from '../../utils/cn';

export default function LoadingSpinner({ className, size = 'default' }) {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    default: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
    xl: 'h-16 w-16 border-4',
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-secondary-300 border-t-primary-600",
        sizes[size],
        className
      )}
    />
  );
}
