'use client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { login } from '@/app/auth/login/actions'; // Import the action

export default function LoginPage() {
  const router = useRouter();
  const { showToast, ToastComponent } = useToast();

  const handleSubmit = async (formData: FormData) => {
    try {
      await login(formData); // Uses Supabase auth
      router.push('/dashboard');
    } catch (error) {
      showToast('Login failed', 'error');
    }
  };
  return (
    <>
      <form action={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input 
          id="email" 
          name="email" 
          type="email" 
          required 
          className="block w-full p-2 border rounded-md mb-4"
        />
        
        <label htmlFor="password">Password:</label>
        <input 
          id="password" 
          name="password" 
          type="password" 
          required 
          className="block w-full p-2 border rounded-md mb-4"
        />
        
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Login
        </button>
      </form>
      <ToastComponent />
    </>
  );
}