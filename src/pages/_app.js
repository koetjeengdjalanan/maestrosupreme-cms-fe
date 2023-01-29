import React from 'react';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import { SessionProvider } from 'next-auth/react';

export default function MyApp({ Component, pageProps }) {
    if (Component.getLayout) {
        return (
            <LayoutProvider>
                <SessionProvider>
                    {Component.getLayout(<Component {...pageProps} />)}
                </SessionProvider>
            </LayoutProvider>
        );
    } else {
        return (
            <LayoutProvider>
                <SessionProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </SessionProvider>
            </LayoutProvider>
        );
    }
}
