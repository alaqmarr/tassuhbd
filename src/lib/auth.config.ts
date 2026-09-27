import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnLogin = nextUrl.pathname === '/admin/login';
      
      if (isOnAdmin && !isOnLogin) {
        return isLoggedIn;
      }
      return true;
    },
  },
  providers: [], // Added in auth.ts
} satisfies NextAuthConfig;
