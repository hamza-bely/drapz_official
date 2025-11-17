'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { login, setToken } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setUser } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await login({ email, motDePasse: password });
            setToken(response.token);
            setUser(response);
            toast({
                title: 'Connexion réussie',
                description: 'Vous êtes maintenant connecté',
            });
            router.push('/');
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Email ou mot de passe incorrect',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md p-6">
                <h1 className="text-2xl font-bold text-center mb-6">Connexion</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <Input
                            type="password"
                            placeholder="Mot de passe"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                </form>
                <p className="mt-4 text-center">
                    Pas encore de compte ?{' '}
                    <Link href="/auth/register" className="text-blue-600 hover:underline">
                        S&apos;inscrire
                    </Link>
                </p>
            </Card>
        </div>
    );
}