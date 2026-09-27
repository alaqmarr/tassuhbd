import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Don't require auth for the login page itself
  const isLoginPage = pathname === '/admin/login';
  
  if (!isLoginPage) {
    const session = await auth();
    if (!session) {
      redirect('/admin/login');
    }
  }

  return (
    <div className="min-h-screen bg-cream text-charcoal font-body">
      {children}
    </div>
  );
}
