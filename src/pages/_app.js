import { QueryClientProvider } from '@tanstack/react-query';
import { getServerSession } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import { queryClient } from '../../configs/react-query';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import '../styles/demo/Demos.scss';
import '../styles/layout/layout.scss';
import { authOptions } from './api/auth/[...nextauth]';
import SessionLoader from '@/hoc/SessionLoader';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function MyApp({
    Component,
    pageProps: { session, ...pageProps },
}) {
    return (
        <QueryClientProvider client={queryClient}>
            <LayoutProvider>
                <SessionProvider session={session}>
                    <SessionLoader>
                        {Component.getLayout ? (
                            Component.getLayout(<Component {...pageProps} />)
                        ) : (
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        )}
                    </SessionLoader>
                </SessionProvider>
            </LayoutProvider>
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools initialIsOpen={false} />
            )}
        </QueryClientProvider>
    );
}
