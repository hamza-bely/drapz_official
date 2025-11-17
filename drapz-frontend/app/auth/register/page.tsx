'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register, setToken } from '@/lib/auth';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        email: '',
        motDePasse: '',
        nom: '',
        prenom: '',
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setUser } = useAuth();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await register(formData);
            setToken(response.token);
            setUser(response);
            toast({
                title: 'Inscription réussie',
                description: 'Votre compte a été créé avec succès',
            });
            router.push('/');
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue lors de l\'inscription',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    return (
        <div className="container flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md p-6">
                <h1 className="text-2xl font-bold text-center mb-6">Inscription</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            name="prenom"
                            placeholder="Prénom"
                            value={formData.prenom}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            name="nom"
                            placeholder="Nom"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <Input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        type="password"
                        name="motDePasse"
                        placeholder="Mot de passe"
                        value={formData.motDePasse}
                        onChange={handleChange}
                        required
                        minLength={6}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Inscription...' : 'S\'inscrire'}
                    </Button>
                </form>
                <p className="mt-4 text-center">
                    Déjà un compte ?{' '}
                    <Link href="/auth/login" className="text-blue-600 hover:underline">
                        Se connecter
                    </Link>
                </p>
            </Card>
        </div>
    );
}