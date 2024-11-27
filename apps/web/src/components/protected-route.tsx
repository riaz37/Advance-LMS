import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/auth-context';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }

    if (!isLoading && roles && !roles.includes(user?.role as UserRole)) {
      router.push('/unauthorized');
    }
  }, [isLoading, isAuthenticated, user, roles, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (roles && !roles.includes(user?.role as UserRole)) {
    return null;
  }

  return <>{children}</>;
}
