import axios from 'axios';
import NextAuth, { NextAuthOptions } from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { redirect } from 'next/dist/server/api-utils';
import apiCall from 'services/_baseService';
// import Auth0Provider from 'next-auth/providers/'

const config = (token) => ({
    headers: {
        Authorization: `Bearer ${typeof token === 'string' ? token : String(token)}`,
    },
});

export const authOptions = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: {
                    label: 'Email',
                    type: 'text',
                    placeholder: 'johndoe@gmail.com',
                },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                const payload = {
                    email: credentials.email,
                    password: credentials.password,
                };
                const url = `${process.env.BACKEND_API}/auth/login`;
                const res = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(payload),
                    headers: { 'Content-Type': 'application/json' },
                });
                const user = await res.json();
                if (res.ok && user) {
                    // console.log(user.data, 'ttd');
                    return user.data;
                } else {
                    throw new Error('Credentials Is Invalid!');
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            // console.log(user, account);
            // Credentials
            if (account?.type === 'credentials' && user) {
                return true;
            }
            return false;
        },

        async jwt({ token, user, account }) {
            // console.log(account, 'kntl');
            if (user) {
                // console.log(user);
                return {
                    ...token,
                    accessToken: user?.access_token,
                    // refreshToken: user?.refreshToken,
                    tokenType: user?.token_type,
                };
            }

            // console.log(token);

            return token;
        },

        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            const { data: userDetails } = await apiCall.get(
                '/auth/profile',
                config(token?.accessToken)
            );

            session.user = userDetails;
            return { ...session, ...token };
        },

        async redirect({ url, baseUrl }) {
            // Allows relative callback URLs
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },

    // jwt: {
    //   secret: process.env.JWT_SECRET,
    // },
    secret: process.env.JWT_SECRET,
    jwt: {
        // The maximum age of the NextAuth.js issued JWT in seconds.
        // Defaults to `session.maxAge`.
        maxAge: 60 * 60 * 24 * 30,
        // You can define your own encode/decode functions for signing and encryption
        // async encode() {},
        // async decode() {},
    },

    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
        generateSessionToken: () => {
            return randomUUID?.() ?? randomBytes(32).toString('hex');
        },
    },

    pages: {
        signIn: '/login',
        signOut: '/',
        error: '/login', // Error code passed in query string as ?error=
        verifyRequest: '/', // (used for check email message)
        newUser: '/', // New users will be directed here on first sign in (leave the property out if not of interest)
    },

    debug: process.env.NODE_ENV === 'development',
};

export default async function auth(req, res) {
    return await NextAuth(req, res, authOptions);
}
