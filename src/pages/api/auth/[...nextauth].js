import axios from 'axios';
import NextAuth, { NextAuthOptions } from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signOut } from 'next-auth/react';
import { redirect } from 'next/dist/server/api-utils';
import apiCall from 'services/_baseService';

const config = token => ({
  headers: {
    Authorization: `Bearer ${
      typeof token === 'string' ? token : String(token)
    }`,
  },
});

const getUserDetail = async token => {
  const user = await apiCall.get('/auth/profile', config(token));
  return user;
};

async function refreshAccessToken(token) {
  if (token.tokenExpired && Date.now() < token.tokenExpired) {
    try {
      const refreshedTokens = await apiCall.get(
        '/auth/refresh_token',
        config(token?.accessToken)
      );

      const newUser = await getUserDetail(refreshedTokens?.data?.access_token);
      return {
        ...token,
        accessToken: refreshedTokens?.data?.access_token,
        tokenExpired: (Date.now() + 2 * 60 * 10) * 1000,
        tokenType: refreshedTokens?.data?.token_type,
        user: newUser?.data,
        error: null,
      };
    } catch (error) {
      console.log(error, 'error');

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
        const url = `${process.env.NEXT_PUBLIC_BACKEND_API}/auth/login`;
        const { data } = await axios.post(url, {
          email: credentials.email,
          password: credentials.password,
        });
        if (data?.data) {
          return data.data;
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
        token.accessToken = user.access_token;
        token.tokenExpired = (Date.now() + 2 * 60 * 10) * 1000;
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
  // secret: process.env.JWT_SECRET,

  pages: {
    signIn: '/login',
    signOut: '/signOut',
    error: '/login', // Error code passed in query string as ?error=
    verifyRequest: '/', // (used for check email message)
    newUser: '/', // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  debug: process.env.NODE_ENV === 'development',
};

export default async function auth(req, res) {
  return await NextAuth(req, res, authOptions);
}
