'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { confirmPasswordReset } from '@/lib/auth';

export default function ResetConfirmPage() {
    const searchParams = useSearchParams();
    const token = searchParams?.get('token') || '';
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (!token) {
            toast({ title: 'Token manquant', description: 'Le token est requis', variant: 'destructive' });
        }
    }, [token]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirm) {
            toast({ title: 'Erreur', description: 'Les mots de passe ne correspondent pas', variant: 'destructive' });
            return;
        }

        setLoading(true);
        try {
            await confirmPasswordReset(token, password);
            toast({ title: 'Mot de passe mis à jour', description: 'Vous pouvez maintenant vous connecter' });
            router.push('/auth/login');
        } catch (err) {
            toast({ title: 'Erreur', description: 'Impossible de réinitialiser le mot de passe', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-200px)] flex items-center justify-center">
            <Card className="w-full max-w-md p-6 md:p-8">
                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Choisir un nouveau mot de passe</h1>
                        <p className="text-sm text-slate-600">Saisissez un nouveau mot de passe pour votre compte</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Nouveau mot de passe</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Confirmer mot de passe</label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>

                        <Button type="submit" className="w-full h-10 md:h-11" disabled={loading || !token}>
                            {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
