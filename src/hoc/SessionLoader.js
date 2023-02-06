import Loader from '@/components/Loader';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { setToken } from 'services/_baseService';

const SessionLoader = ({ children }) => {
  const router = useRouter();
  const session = useSession();

  if (session.status === 'loading') {
    return <Loader className="h-100vh" />;
  }

  if (session.status === 'authenticated') {
    setToken(session?.data?.accessToken);
  }

  if (router.pathname === '/auth/login' && session.status === 'authenticated') {
    router.push('/');
  }

  return <>{children}</>;
};

export default SessionLoader;
