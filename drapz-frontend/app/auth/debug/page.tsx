'use client';

import { useEffect, useState } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';

export default function AuthDebugPage() {
  const [cookie, setCookie] = useState<string>('');
  const [meResponse, setMeResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    setCookie(typeof document !== 'undefined' ? document.cookie : 'no-document');

    const callMe = async () => {
      try {
        const data = await getCurrentUser();
        setMeResponse(data);
      } catch (err: any) {
        setError(err.message || JSON.stringify(err));
      }
    };

    callMe();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Auth</h1>

      <section className="mb-6">
        <h2 className="font-semibold">Document cookies</h2>
        <pre className="bg-gray-100 p-4 rounded mt-2">{cookie || '(empty)'}</pre>
      </section>

      <section className="mb-6">
        <h2 className="font-semibold">useAuth() state</h2>
        <pre className="bg-gray-100 p-4 rounded mt-2">{JSON.stringify({ user, loading }, null, 2)}</pre>
      </section>

      <section>
        <h2 className="font-semibold">GET /api/auth/me response</h2>
        {meResponse ? (
          <pre className="bg-gray-100 p-4 rounded mt-2">{JSON.stringify(meResponse, null, 2)}</pre>
        ) : error ? (
          <pre className="bg-red-100 p-4 rounded mt-2">Error: {error}</pre>
        ) : (
          <p className="text-sm text-gray-600 mt-2">Loading...</p>
        )}
      </section>

      <div className="mt-6">
        <p className="text-sm text-gray-600">Conseil: ouvrez DevTools → Network pour voir l'appel à <code>/api/auth/me</code> et vérifier que le cookie est envoyé.</p>
      </div>
    </div>
  );
}
