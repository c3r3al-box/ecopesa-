'use client';
import { useFormStatus } from 'react-dom';

export function SubmitButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      aria-disabled={pending}
      {...props}
    >
      {pending ? 'Processing...' : children}
    </button>
  );
}