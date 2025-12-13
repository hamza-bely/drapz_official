'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/services';

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
            const response = await authService.register(formData);
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
        <div className="container mx-auto px-4 py-12 md:py-20 min-h-[calc(100vh-200px)] flex items-center justify-center">
            <Card className="w-full max-w-md p-6 md:p-8">
                <div className="space-y-6">
                    <div className="text-center">
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Inscription</h1>
                        <p className="text-sm text-slate-600">Créez un compte Drapz</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Fields */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Prénom</label>
                                <Input
                                    name="prenom"
                                    placeholder="Jean"
                                    value={formData.prenom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Nom</label>
                                <Input
                                    name="nom"
                                    placeholder="Dupont"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Email</label>
                            <Input
                                type="email"
                                name="email"
                                placeholder="votre@email.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Mot de passe</label>
                            <Input
                                type="password"
                                name="motDePasse"
                                placeholder="••••••••"
                                value={formData.motDePasse}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                            <p className="text-xs text-slate-500">Minimum 6 caractères</p>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-10 md:h-11 mt-2"
                            disabled={loading}
                        >
                            {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-500">ou</span>
                        </div>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-sm text-slate-600">
                        Vous avez déjà un compte ?{' '}
                        <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">
                            Se connecter
                        </Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}