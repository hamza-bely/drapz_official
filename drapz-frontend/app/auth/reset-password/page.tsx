'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/lib/services';
import Link from 'next/link';

const formSchema = z.object({
  password: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas.",
  path: ["confirmPassword"],
});

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Token non valide ou manquant.");
    }
  }, [searchParams]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!token) {
        setError("Token non valide ou manquant.");
        return;
    }
    setLoading(true);
    setError('');
    try {
      await authService.resetPassword(token, values.password);
      setSuccess(true);
      toast({
        title: 'Succès',
        description: 'Votre mot de passe a été réinitialisé. Vous pouvez maintenant vous connecter.',
      });
      router.push('/auth/login');
    } catch (error) {
      setError("Le token est peut-être invalide ou a expiré. Veuillez réessayer.");
      toast({
        title: 'Erreur',
        description: "Une erreur est survenue.",
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
        <Card className="w-full max-w-md text-center">
            <CardHeader>
                <CardTitle>Erreur</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-red-500">{error}</p>
                <Link href="/auth/forgot-password" passHref>
                   <Button variant="link">Demander un nouveau lien</Button>
                </Link>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Réinitialiser le mot de passe</CardTitle>
        <CardDescription>
          Entrez votre nouveau mot de passe.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


export default function ResetPasswordPage() {
    return (
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
            <Suspense fallback={<div>Chargement...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </div>
    )
}
