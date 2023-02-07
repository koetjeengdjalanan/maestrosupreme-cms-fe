import Loader from '@/components/Loader';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { setToken } from 'services/_baseService';

const SessionLoader = ({ children }) => {
  const router = useRouter();
  const session = useSession();

  // console.log(session);

  if (session.status === 'loading') {
    return <Loader className="h-100vh" />;
  }

  if (session?.data?.accessToken) {
    setToken(session?.data?.accessToken);
  }

  if (router.pathname === '/login' && session.status === 'authenticated') {
    router.push('/');
  }

  if (!router.pathname === '/login' && session.status === 'unauthenticated') {
    router.push('/login');
  }

  return <>{children}</>;
};

export default SessionLoader;
