import axios from 'axios';
import NextAuth, { NextAuthOptions } from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { redirect } from 'next/dist/server/api-utils';
import apiCall from 'services/_baseService';
// import Auth0Provider from 'next-auth/providers/'

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'example@domain.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials, req) {
                console.log(`credentials: ${credentials}`);
                const url = `${process.env.BACKEND_API}/auth/login`;
                const res = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: { 'Content-Type': 'application/json' },
                });
                console.log(`res: ${res.json}`);
                const user = await res.json();
                if (res.ok && user) {
                    return user;
                } else {
                    throw new Error('Credentials Is Invalid!');
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            console.log('====================================');
            console.log(user, account);
            console.log('====================================');
            if (account?.type === 'credentials' && user) {
                return true;
            }
            return false;
        },
        // async jwt({ token, user, account, isNewUser }) {
        //     if (user) {
        //         console.log(user);
        //         if (user.data.access_token) {
        //             token = { accessToken: user.data.access_token };
        //         }
        //     }
        //     return token;
        // },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.user = await apiCall.get('/auth/profile').then((res) => {
                return { data: res.data.data, token: token.accessToken };
            });
            return session;
        },
        async redirect({ url, baseUrl }) {
            if (url.startsWith('/')) return `${baseUrl}${url}`;
            else if (new URL(url).origin === baseUrl) return url;
            return baseUrl;
        },
    },
    secret: process.env.JWT_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
        updateAge: 24 * 60 * 60,
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
    debug: true,
};

// export default NextAuth(authOptions);
export default async function auth(req, res) {
    return await NextAuth(req, res, authOptions);
}
