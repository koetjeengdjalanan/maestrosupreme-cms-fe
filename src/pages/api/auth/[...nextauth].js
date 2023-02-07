import axios from 'axios';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import apiCall from 'services/_baseService';

const config = token => ({
  headers: {
    Authorization: `Bearer ${
      typeof token === 'string' ? token : String(token)
    }`,
  },
});

async function refreshAccessToken(token) {
  try {
    // Get a new set of tokens with a refreshToken
    const refreshedTokens = await apiCall.get(
      '/auth/refresh_token',
      config(token.accessToken)
    );

    if (!refreshedTokens) throw new Error('failed to refresh the token');

    const newUser = await apiCall.get(
      '/auth/profile',
      config(refreshedTokens.data.access_token)
    );

    if (!newUser || 'error' in newUser)
      throw new Error("there's something wrong when getting user profile");

    // console.log(newUser);

    return {
      ...token,
      accessToken: refreshedTokens.data.access_token,
      tokenExpired: (Date.now() + 2.9 * 60 * 10) * 1000,
      tokenType: refreshedTokens.data.token_type,
      user: newUser?.data,
      error: null,
    };
  } catch (error) {
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
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
        const res = await axios.post(url, {
          email: credentials.email,
          password: credentials.password,
        });
        if (res?.data?.data) {
          return res?.data.data;
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

    jwt: async ({ token, user }) => {
      if (user) {
        // This will only be executed at login. Each next invocation will skip this part.
        token.accessToken = user?.access_token;
        token.accessTokenExpiry = (Date.now() + 2.9 * 60 * 10) * 1000;
      }

      // If accessTokenExpiry is 24 hours, we have to refresh token before 24 hours pass.
      const shouldRefreshTime = Math.round(
        (Date.now() + 2.9 * 60 * 10) * 1000 - 60 * 60 * 1000 - Date.now()
      );

      // If the token is still valid, just return it.
      if (shouldRefreshTime > 0) {
        return Promise.resolve(token);
      }

      // If the call arrives after 23 hours have passed, we allow to refresh the token.
      token = refreshAccessToken(token);
      return Promise.resolve(token);
    },

    session: async ({ session, token }) => {
      // Send properties to the client, like an access_token from a provider.
      // console.log(token, 'token');
      return Promise.resolve({ ...session, ...token });
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,

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
