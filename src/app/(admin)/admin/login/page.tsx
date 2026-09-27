import { signIn, auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const session = await auth();
  
  if (session) {
    redirect('/admin');
  }

  async function loginAction(formData: FormData) {
    'use strict';
    'use server';
    
    await signIn('credentials', Object.fromEntries(formData), {
      redirectTo: '/admin',
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1a2e] p-4">
      <div className="bg-[#f4e8d1] p-8 rounded-lg shadow-xl max-w-md w-full border-2 border-[#b76e79]">
        <h1 className="text-4xl font-['Dancing_Script'] text-[#b76e79] text-center mb-6">
          Admin Login
        </h1>
        <form action={loginAction} className="space-y-6">
          <div>
            <label className="block text-[#1a1a2e] font-['Crimson_Text'] text-lg mb-2">
              Email
            </label>
            <input 
              type="email" 
              name="email"
              required 
              className="w-full px-4 py-2 border border-[#c9a96e] rounded focus:outline-none focus:ring-2 focus:ring-[#b76e79] bg-white text-[#1a1a2e] font-['Crimson_Text']"
            />
          </div>
          <div>
            <label className="block text-[#1a1a2e] font-['Crimson_Text'] text-lg mb-2">
              Password
            </label>
            <input 
              type="password" 
              name="password"
              required 
              className="w-full px-4 py-2 border border-[#c9a96e] rounded focus:outline-none focus:ring-2 focus:ring-[#b76e79] bg-white text-[#1a1a2e] font-['Crimson_Text']"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-[#b76e79] hover:bg-[#e8a0bf] text-[#f5f0eb] font-['Crimson_Text'] text-xl py-3 rounded transition-colors duration-300 shadow-md"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
