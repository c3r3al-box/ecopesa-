'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { signup, SignupState } from '@/app/auth/signup/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SignupPage() {
  const router = useRouter();
  const [state, formAction] = useActionState<SignupState, FormData>(signup, {
    error: undefined,
    success: false,
    requiresConfirmation: false,
    redirectTo: undefined,
  });

  const { pending } = useFormStatus();

  useEffect(() => {
    if (state?.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state?.redirectTo, router]);

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-emerald-800 mb-2 text-center">Join EcoPesa</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Create an account to start recycling and earning rewards.
        </p>

        {state?.error && (
          <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-md text-sm">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              minLength={2}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              className="mt-1"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={pending}
          >
            {pending ? 'Creating account...' : 'Sign Up'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/auth/login" className="text-emerald-700 font-semibold hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
