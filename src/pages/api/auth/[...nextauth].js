import axios from 'axios';
import NextAuth, { NextAuthOptions } from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { redirect } from 'next/dist/server/api-utils';
import apiCall from 'services/_baseService';
// import Auth0Provider from 'next-auth/providers/'

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Email',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email',
                    placeholder: 'example@domain.com',
                },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                const url = `${process.env.BACKEND_API}/auth/login`;
                const res = await fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(credentials),
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const user = await res.json();
                if (res.ok && user) {
                    return user;
                }
                throw new Error('Credentials Is Invalid!');
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, isNewUser }) {
            if (user) {
                console.log(user);
                if (user.data.access_token) {
                    token = { accessToken: user.data.access_token };
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.user = await apiCall.get('/auth/profile').then((res) => {
                return { data: res.data.data, token: token.accessToken };
            });
            return session;
        },
    },
};

export default NextAuth(authOptions);
