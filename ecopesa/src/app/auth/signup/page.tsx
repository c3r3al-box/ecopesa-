// app/auth/signup/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signup } from '@/app/auth/signup/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignupState } from '@/app/auth/signup/actions';

export default function SignupPage() {
  const router = useRouter();
  const [state, formAction] = useActionState<SignupState, FormData >(signup, {
    error: undefined,
    success: false,
    requiresConfirmation: false,
    redirectTo: undefined
  });

  const { pending } = useFormStatus();

  // Handle redirects
  if (state?.redirectTo) {
    router.push(state.redirectTo);
  }

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Create Account</h1>
      
      {state?.error && (
        <div className="p-2 bg-red-100 text-red-700 rounded-md">
          {state.error}
        </div>
      )}

      

      <form action={formAction} className="space-y-3">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            minLength={2}
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
          />
        </div>

        <select name="role" required>
         <option value="user">Regular User</option>
          <option value="collector">Waste Collector</option>
          <option value="recycler">Recycler</option>
        </select>


        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
}