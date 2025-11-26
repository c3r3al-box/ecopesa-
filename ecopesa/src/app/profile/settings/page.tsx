'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import toast, { Toaster } from 'react-hot-toast';

export default function ProfileSettingsPage() {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('USER');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const supabase = useSupabaseClient();

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    try {
      const res = await fetch('/api/profile/update_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          role,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(`Error: ${data.error}`);
      } else {
        toast.success('Password updated successfully! Redirecting...');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          router.push('/auth/login');
        }, 1500);
      }
    } catch (err: any) {
      toast.error(`Unexpected error: ${err.message}`);
    }
  };

  // 🔑 Account deletion handler
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.access_token) {
        toast.error('No active session found');
        return;
      }

      const res = await fetch('/api/profile/delete_account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`, // ✅ send token
        },
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(`Error: ${data.error}`);
      } else {
        toast.success('Account deleted successfully. Redirecting...');
        setTimeout(() => {
          router.push('/auth/signup');
        }, 1500);
      }
    } catch (err: any) {
      toast.error(`Unexpected error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 px-4 py-8">
      <Toaster position="top-center" reverseOrder={false} />
      <h1 className="text-2xl font-bold text-emerald-800 mb-4">Profile Settings</h1>
      <form
        onSubmit={handleUpdateProfile}
        className="bg-white p-6 rounded-lg shadow max-w-md space-y-4"
      >
        {/* Full Name */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter your name"
          />
        </div>

        {/* New Password */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 pr-10"
              placeholder="Enter new password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-2 text-gray-500"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Confirm New Password</label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 pr-10"
              placeholder="Re-enter new password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-2 top-2 text-gray-500"
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white px-4 py-2 rounded font-bold hover:bg-emerald-700 transition"
        >
          Save Changes
        </button>
      </form>

      {/* Account Deletion Section */}
      <div className="bg-white p-6 rounded-lg shadow max-w-md mt-6">
        <h2 className="text-lg font-semibold text-red-700 mb-3">Danger Zone</h2>
        <button
          onClick={handleDeleteAccount}
          className="w-full bg-red-600 text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
