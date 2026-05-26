import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Save, X } from 'lucide-react';
import type { Student, StudentFormValues } from '../types';
import PasswordField from './PasswordField';
import { Spinner } from './Spinner';

interface StudentFormProps {
  initialStudent?: Student | null;
  isSubmitting: boolean;
  showConfirmPassword?: boolean;
  showPasswordStrength?: boolean;
  onCancel: () => void;
  onSubmit: (values: StudentFormValues) => Promise<void>;
}

const courses = ['Web Development', 'Data Science', 'Cloud Computing', 'Cybersecurity', 'UI/UX Design'];
const genders = ['Male', 'Female', 'Other'] as const;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s()]{7,18}$/;
const strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const getPasswordStrength = (password = '') => {
  const checks = [
    password.length >= 8,
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z\d]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  if (!password) return { label: 'Password strength', width: '0%', color: 'bg-slate-200 dark:bg-slate-700' };
  if (score <= 2) return { label: 'Weak password', width: '33%', color: 'bg-rose-500' };
  if (score <= 4) return { label: 'Good password', width: '66%', color: 'bg-amber-500' };
  return { label: 'Strong password', width: '100%', color: 'bg-emerald-500' };
};

const StudentForm = ({
  initialStudent,
  isSubmitting,
  showConfirmPassword = false,
  showPasswordStrength = false,
  onCancel,
  onSubmit,
}: StudentFormProps) => {
  const defaultValues = useMemo<StudentFormValues>(
    () => ({
      fullName: initialStudent?.fullName || '',
      email: initialStudent?.email || '',
      phoneNumber: initialStudent?.phoneNumber || '',
      dateOfBirth: initialStudent?.dateOfBirth?.slice(0, 10) || '',
      gender: initialStudent?.gender || 'Male',
      address: initialStudent?.address || '',
      courseEnrolled: initialStudent?.courseEnrolled || courses[0],
      password: '',
      confirmPassword: '',
    }),
    [initialStudent],
  );

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    watch,
    formState: { errors },
  } = useForm<StudentFormValues>({ defaultValues });

  const password = watch('password');
  const passwordStrength = getPasswordStrength(password);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const submitForm = async ({ confirmPassword: _confirmPassword, ...values }: StudentFormValues) => {
    await onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(submitForm)} className="grid gap-4 md:grid-cols-2">
      <div>
        <label className="label">Full Name</label>
        <input className="input-field" {...register('fullName', { required: 'Full name is required', minLength: { value: 3, message: 'Use at least 3 characters' } })} />
        {errors.fullName && <p className="mt-1 text-sm text-rose-500">{errors.fullName.message}</p>}
      </div>
      <div>
        <label className="label">Email</label>
        <input className="input-field" {...register('email', { required: 'Email is required', pattern: { value: emailRegex, message: 'Enter a valid email' } })} />
        {errors.email && <p className="mt-1 text-sm text-rose-500">{errors.email.message}</p>}
      </div>
      <div>
        <label className="label">Phone Number</label>
        <input className="input-field" {...register('phoneNumber', { required: 'Phone number is required', pattern: { value: phoneRegex, message: 'Enter a valid phone number' } })} />
        {errors.phoneNumber && <p className="mt-1 text-sm text-rose-500">{errors.phoneNumber.message}</p>}
      </div>
      <div>
        <label className="label">Date of Birth</label>
        <input type="date" className="input-field" {...register('dateOfBirth', { required: 'Date of birth is required' })} />
        {errors.dateOfBirth && <p className="mt-1 text-sm text-rose-500">{errors.dateOfBirth.message}</p>}
      </div>
      <div>
        <label className="label">Gender</label>
        <select className="input-field" {...register('gender', { required: 'Gender is required' })}>
          {genders.map((gender) => <option key={gender}>{gender}</option>)}
        </select>
      </div>
      <div>
        <label className="label">Course Enrolled</label>
        <select className="input-field" {...register('courseEnrolled', { required: 'Course is required' })}>
          {courses.map((course) => <option key={course}>{course}</option>)}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="label">Address</label>
        <textarea rows={3} className="input-field resize-none" {...register('address', { required: 'Address is required', minLength: { value: 8, message: 'Address is too short' } })} />
        {errors.address && <p className="mt-1 text-sm text-rose-500">{errors.address.message}</p>}
      </div>
      <div className="md:col-span-2">
        <label className="label">Password {initialStudent && <span className="font-normal text-slate-500">(leave blank to keep existing)</span>}</label>
        <PasswordField {...register('password', {
          validate: (value) => {
            if (initialStudent && !value) return true;
            if (!value) return 'Password is required';
            return strongPassword.test(value) || 'Use 8+ chars with uppercase, lowercase, number, and symbol';
          },
        })} />
        {showPasswordStrength && (
          <div className="mt-2">
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-300 ease-out ${passwordStrength.color}`}
                style={{ width: passwordStrength.width }}
              />
            </div>
            <p className="mt-1 text-xs font-medium text-slate-500 transition dark:text-slate-400">{passwordStrength.label}</p>
          </div>
        )}
        {errors.password && <p className="mt-1 text-sm text-rose-500">{errors.password.message}</p>}
      </div>
      {showConfirmPassword && (
        <div className="md:col-span-2">
          <label className="label">Confirm Password</label>
          <PasswordField {...register('confirmPassword', {
            validate: (value) => {
              if (!value) return 'Confirm password is required';
              return value === getValues('password') || 'Passwords do not match';
            },
          })} />
          {errors.confirmPassword && <p className="mt-1 text-sm text-rose-500">{errors.confirmPassword.message}</p>}
        </div>
      )}
      <div className="flex flex-col-reverse gap-3 md:col-span-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} className="btn-secondary">
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? <Spinner label="Saving" /> : <><Save className="h-4 w-4" /> Save student</>}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
