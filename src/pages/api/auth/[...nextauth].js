import axios from 'axios';
import NextAuth, { NextAuthOptions } from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';
import { publicService } from 'services/_baseService';

const config = token => ({
  headers: {
    Authorization: `Bearer ${
      typeof token === 'string' ? token : String(token)
    }`,
  },
});

async function refreshAccessToken(token) {
  // if (!token.accessToken) {
  //   return {
  //     ...token,
  //     error: 'RefreshAccessUnavailable',
  //   };
  // }

  if (token.tokenExpired && Date.now() < token.tokenExpired) {
    try {
      const refreshedTokens = await publicService.get(
        '/auth/refresh_token',
        config(token.accessToken)
      );

      const newUser = await publicService.get(
        '/auth/profile',
        config(refreshedTokens.data.access_token)
      );
      console.log(newUser);

      return {
        ...token,
        accessToken: refreshedTokens?.data.access_token,
        tokenExpired: refreshedTokens?.data?.expire_after * 1000,
        tokenType: refreshedTokens?.data.token_type,
        user: newUser.data,
        error: null,
      };
    } catch (error) {
      // console.log(error, 'error');

      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
    }
  }

  if (token.tokenExpired && Date.now() >= token.tokenExpired) {
    return {
      ...token,
      error: 'RefreshAccessTokenExpired',
    };
  }

  return {
    ...token,
    error: 'RefreshAccessUnavailable',
  };
  // return token;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'johndoe@gmail.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const res = await publicService.post(`/auth/login`, {
          email: credentials.email,
          password: credentials.password,
        });
        if (res?.data) {
          return res?.data;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.type === 'credentials' && user) {
        return true;
      }
      return false;
    },

    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user?.access_token;
        token.tokenExpired = user?.expire_after * 1000;
      }

      return refreshAccessToken(token);
    },

    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      // console.log(token, 'token');
      return { ...session, ...token };
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,

  jwt: {
    secret: process.env.NEXTAUTH_SECRET ?? '',
  },
  session: {
    strategy: 'jwt',
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: Number(process.env.NEXT_PUBLIC_JWT_REFRESH_TTL || 0) * 60 * 10, // +-1 day
  },

  pages: {
    signIn: '/login',
    signOut: '/signOut',
    error: '/login', // Error code passed in query string as ?error=
    verifyRequest: '/', // (used for check email message)
    newUser: '/', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  // debug: process.env.NODE_ENV === 'development',
};

export default async function auth(req, res) {
  return await NextAuth(req, res, authOptions);
}
