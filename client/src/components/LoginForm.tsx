import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PasswordField from './PasswordField';
import { Spinner } from './Spinner';

interface LoginValues {
  email: string;
  password: string;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>();

  const onSubmit = async (values: LoginValues) => {
    try {
      setIsSubmitting(true);
      await login(values);
      toast.success('Welcome back');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="email"
            className="input-field pl-9"
            placeholder="admin@studentflow.com"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: emailRegex, message: 'Enter a valid email address' },
            })}
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-rose-500">{errors.email.message}</p>}
      </div>

      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <PasswordField
          id="password"
          placeholder="minimum 8 characters"
          leftIcon={<Lock className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' },
          })}
        />
        {errors.password && <p className="mt-1 text-sm text-rose-500">{errors.password.message}</p>}
      </div>

      <button className="btn-primary w-full py-3" disabled={isSubmitting}>
        {isSubmitting ? <Spinner label="Signing in" /> : <><LogIn className="h-4 w-4" /> Sign in</>}
      </button>
    </form>
  );
};

export default LoginForm;
