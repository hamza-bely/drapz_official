'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { requestPasswordReset } from '@/lib/auth';

export default function ResetRequestPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await requestPasswordReset(email);
            toast({ title: 'Demande envoyée', description: 'Si cet email existe, vous recevrez un lien de réinitialisation.' });
            router.push('/auth/login');
        } catch (err) {
            toast({ title: 'Erreur', description: 'Impossible d\'envoyer la demande', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-200px)] flex items-center justify-center">
            <Card className="w-full max-w-md p-6 md:p-8">
                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Réinitialiser le mot de passe</h1>
                        <p className="text-sm text-slate-600">Entrez votre email pour recevoir un lien de réinitialisation</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <Input
                                type="email"
                                placeholder="votre@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>

                        <Button type="submit" className="w-full h-10 md:h-11" disabled={loading}>
                            {loading ? 'Envoi...' : 'Envoyer le lien'}
                        </Button>
                    </form>
                </div>
            </Card>
        </div>
    );
}
