// src/components/auth/SignUpForm.tsx
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { ROLES } from '@/utils/roles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

interface SignUpFormProps {
  defaultRole?: keyof typeof ROLES;
}

export default function SignUpForm({ defaultRole = 'USER' }: SignUpFormProps) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  // Get role from URL params if available
  const urlRole = params?.role as keyof typeof ROLES | undefined;
  
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    role: urlRole || defaultRole,
  });

  const [loading, setLoading] = useState(false);
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error(await res.text());

      await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      router.push(callbackUrl);
    } catch (error: any) {
      showToast(`Error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">
        {form.role === 'USER' ? 'Create Account' : `Register as ${form.role.toLowerCase()}`}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label>Full Name</Label>
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Password</Label>
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>

        {!urlRole && (
          <div>
            <Label htmlFor="role-select">Account Type</Label>
            <select
              id="role-select"
              aria-label="Account Type"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as keyof typeof ROLES })}
              className="block w-full p-2 border rounded-md"
            >
              <option value="USER">User</option>
              <option value="RECYCLER">Recycler</option>
              <option value="COLLECTOR">Collector</option>
            </select>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>
    </div>
  );
}