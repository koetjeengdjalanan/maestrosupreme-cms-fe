import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../../configs/react-query';
import { SessionProvider } from 'next-auth/react';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.css';
import { LayoutProvider } from '../layout/context/layoutcontext';
import Layout from '../layout/layout';
import '../styles/demo/Demos.scss';
import '../styles/layout/layout.scss';

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}) {
  console.log(session);
  return (
    <QueryClientProvider client={queryClient}>
      <LayoutProvider>
        <SessionProvider session={session}>
          {Component.getLayout ? (
            Component.getLayout(<Component {...pageProps} />)
          ) : (
            <Layout>
              <Component {...pageProps} />
            </Layout>
          )}
        </SessionProvider>
      </LayoutProvider>
    </QueryClientProvider>
  );
}
