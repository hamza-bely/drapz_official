import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export const useAdminRoute = () => {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Rediriger seulement si authentification est chargée, user existe et n'est pas admin
        if (!loading && user && user.role !== 'ADMIN') {
            router.push('/');
        }
    }, [user, loading, router]);

    return { isAdmin: user?.role === 'ADMIN', loading };
};
