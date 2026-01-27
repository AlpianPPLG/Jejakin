import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

interface WithAuthOptions {
  requireAuth?: boolean;
  requireRole?: string[];
  redirectTo?: string;
}

export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    requireAuth = true,
    requireRole = [],
    redirectTo = '/login',
  } = options;

  return function ProtectedRoute(props: P) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return;

      // Redirect if authentication is required but user is not authenticated
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // Redirect if specific role is required but user doesn't have it
      if (requireRole.length > 0 && user && !requireRole.includes(user.role)) {
        router.push('/dashboard'); // Redirect to default dashboard
        return;
      }
    }, [isAuthenticated, isLoading, user, router]);

    // Show loading state
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    // Don't render if not authenticated and auth is required
    if (requireAuth && !isAuthenticated) {
      return null;
    }

    // Don't render if role is required but user doesn't have it
    if (requireRole.length > 0 && user && !requireRole.includes(user.role)) {
      return null;
    }

    return <Component {...props} />;
  };
}

// Convenience HOCs
export const withAuthRequired = <P extends object>(Component: React.ComponentType<P>) =>
  withAuth(Component, { requireAuth: true });

export const withAdminRequired = <P extends object>(Component: React.ComponentType<P>) =>
  withAuth(Component, { requireAuth: true, requireRole: ['admin'] });

export const withPartnerRequired = <P extends object>(Component: React.ComponentType<P>) =>
  withAuth(Component, { requireAuth: true, requireRole: ['partner', 'admin'] });
