import axios from 'axios';
import NextAuth, { NextAuthOptions } from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { redirect } from 'next/dist/server/api-utils';
import apiCall from 'services/_baseService';

const config = (token) => ({
    headers: {
        Authorization: `Bearer ${typeof token === 'string' ? token : String(token)}`,
    },
});

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
                    return user.data;
                } else {
                    throw new Error('Credentials Is Invalid!');
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

        async jwt({ token, user, account }) {
            if (user) {
                return {
                    ...token,
                    accessToken: user?.access_token,
                    // refreshToken: user?.refreshToken,
                    tokenType: user?.token_type,
                };
            }
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
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
    secret: process.env.JWT_SECRET,
    jwt: {},
    session: {},
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/login', // Error code passed in query string as ?error=
        verifyRequest: '/', // (used for check email message)
        newUser: '/', // New users will be directed here on first sign in (leave the property out if not of interest)
    },
    debug: process.env.NODE_ENV === 'development',
};

export default async function auth(req, res) {
    return await NextAuth(req, res, authOptions);
}
