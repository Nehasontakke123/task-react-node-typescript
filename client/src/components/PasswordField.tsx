import { forwardRef, useState, type InputHTMLAttributes, type ReactNode } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  leftIcon?: ReactNode;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ className = '', leftIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const Icon = showPassword ? EyeOff : Eye;

    return (
      <div className="relative">
        {leftIcon}
        <input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={`input-field pr-12 ${leftIcon ? 'pl-9' : ''} ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md text-slate-500 transition hover:text-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 dark:text-slate-400 dark:hover:text-cyan-300"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          <Icon className="h-4 w-4" />
        </button>
      </div>
    );
  },
);

PasswordField.displayName = 'PasswordField';

export default PasswordField;
