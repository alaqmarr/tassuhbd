import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { adminUsers } from './db/schema';
import { eq } from 'drizzle-orm';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Look up admin user in the database
          const [admin] = await db
            .select()
            .from(adminUsers)
            .where(eq(adminUsers.email, credentials.email as string))
            .limit(1);

          if (!admin) {
            return null;
          }

          const passwordsMatch = await bcrypt.compare(
            credentials.password as string,
            admin.passwordHash
          );

          if (passwordsMatch) {
            return {
              id: String(admin.id),
              email: admin.email,
              name: admin.name,
            };
          }
        } catch (error) {
          console.error('Auth error:', error);
        }

        return null;
      }
    })
  ],
  session: { strategy: 'jwt' }
});
