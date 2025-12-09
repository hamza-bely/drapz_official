'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AdminPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (user?.role === 'ADMIN') {
                router.push('/admin/dashboard');
            } else {
                router.push('/');
            }
        }
    }, [user, loading, router]);

    return null;
}