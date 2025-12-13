'use client';

import { useState } from 'react';
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
  email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
});

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setMessage('');
    try {
      await authService.forgotPassword(values.email);
      setMessage("Si un compte avec cet email existe, un lien de réinitialisation de mot de passe a été envoyé.");
    } catch (error) {
      // Still show a generic message to prevent user enumeration
      setMessage("Si un compte avec cet email existe, un lien de réinitialisation de mot de passe a été envoyé.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Mot de passe oublié</CardTitle>
          <CardDescription>
            Entrez votre email pour recevoir un lien de réinitialisation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="votre.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Envoyer'}
              </Button>
            </form>
          </Form>
          {message && <p className="mt-4 text-center text-sm text-green-600 bg-green-50 p-3 rounded-md">{message}</p>}
           <div className="mt-4 text-center text-sm">
              <Link href="/auth/login" className="text-blue-600 hover:underline">
                Retour à la connexion
              </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
