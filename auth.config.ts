// import GitHub from '@auth/core/providers/github';
import { User, db, eq } from 'astro:db';
import { defineConfig } from 'auth-astro';
import Credentials from '@auth/core/providers/credentials';
import bcrypt from 'bcryptjs';
import type { AdapterUser } from '@auth/core/adapters';

export default defineConfig({
  providers: [
    //TODO:
    // GitHub({
    //   clientId: import.meta.env.GITHUB_CLIENT_ID,
    //   clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    // }),

    Credentials({
      credentials: {
        email: { label: 'Correo', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
      },
      authorize: async ({ email, password }) => {
        const [user] = await db
          .select()
          .from(User)
          .where(eq(User.email, `${email}`));

        if (!user) {
          console.log('User not found for email:', email);
          throw new Error('Invalid credentials');
        }

        if (!bcrypt.compareSync(password as string, user.password)) {
          throw new Error('Invalid credentials');
        }

        const { password: _, ...rest } = user;
        console.log('User authenticated:', rest);

        return rest;
      },
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/login', // Redirect errors to login page
  },

  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.user = user;
      }

      return token;
    },

    session: ({ session, token }) => {
      session.user = token.user as AdapterUser;
      return session;
    },
  },
});
