'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { login } from '@/app/auth/login/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();

  const handleSubmit = async (formData: FormData) => {
    try {
      await login(formData);
    } catch (error) {
      if (error instanceof Error && !error.message.includes('NEXT_REDIRECT')) {
        showToast('Login failed. Please check your credentials.', 'error');
      }
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-emerald-800 mb-6 text-center">Welcome Back</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Log in to continue earning EcoPesa rewards for recycling.
        </p>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
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

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
            Log In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{' '}
          <a href="/auth/signup" className="text-emerald-700 font-semibold hover:underline">
            Sign up
          </a>
        </div>

        <ToastComponent />
      </div>
    </div>
  );
}
