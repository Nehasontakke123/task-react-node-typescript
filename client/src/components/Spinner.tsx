import { Loader2 } from 'lucide-react';

export const Spinner = ({ label = 'Loading' }: { label?: string }) => (
  <span className="inline-flex items-center gap-2 text-sm font-medium">
    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
    {label}
  </span>
);
