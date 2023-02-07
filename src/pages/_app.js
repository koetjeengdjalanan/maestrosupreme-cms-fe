import RefreshTokenHandler from '@/hoc/refreshTokenHandler';
import { QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import { useState } from 'react';
import { queryClient } from '../../configs/react-query';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import '../styles/demo/Demos.scss';
import '../styles/layout/layout.scss';

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [interval, setInterval] = useState(0);
  return (
    <SessionProvider session={session} refetchInterval={interval}>
      <QueryClientProvider client={queryClient}>
        <LayoutProvider>
          {Component.getLayout ? (
            Component.getLayout(<Component {...pageProps} />)
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </LayoutProvider>
      </QueryClientProvider>
      <RefreshTokenHandler setInterval={setInterval} />
    </SessionProvider>
  );
}
