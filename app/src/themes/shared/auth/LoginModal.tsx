'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { t, type Language } from '@/lib/translations';

// Validación con Zod - dinámica según idioma
const getLoginSchema = (lang: Language) =>
  z.object({
    email: z.string().email(t(lang).login.errors.invalidEmail).min(1, t(lang).login.errors.invalidEmail),
    password: z.string().min(6, t(lang).login.errors.passwordMin).min(1, t(lang).login.errors.passwordMin),
    tenantId: z.coerce.number().min(1, t(lang).login.errors.tenantIdRequired),
  });

type LoginFormValues = z.infer<ReturnType<typeof getLoginSchema>>;

interface LoginModalProps {
  redirectPath?: string;
  logoSrc?: string;
  title?: string;
  language?: Language;
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

export function LoginModal({
  redirectPath = '/admin/dashboard',
  logoSrc = '/themes/barmentech/logo_barmentech.png',
  title = 'CRM Portal',
  language = 'es',
  onSuccess,
  onError,
}: LoginModalProps) {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [apiError, setApiError] = useState('');
  const translations = t(language);
  const loginSchema = getLoginSchema(language);

  // React Hook Form con Zod
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'admin@barmentech.com',
      password: 'password123',
      tenantId: 1,
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setApiError('');

    try {
      console.log('Attempting login with:', { email: values.email, tenantId: values.tenantId });
      
      await login(values.email, values.password, values.tenantId.toString());
      
      console.log('Login successful');
      
      if (onSuccess) {
        onSuccess({ email: values.email, tenantId: values.tenantId });
      }
      
      router.push(redirectPath);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      console.error('Login error:', err);
      
      setApiError(errorMessage);
      
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6">
      <div className="w-full max-w-md mx-auto">
        {/* Card Container */}
        <Card className="border-gray-100 shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Header Section */}
          <div className="px-4 sm:px-6 md:px-8 pt-6 sm:pt-12 md:pt-16 pb-4 sm:pb-6 md:pb-8 text-center border-b border-gray-100/50">
            {/* Logo */}
            <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
              <div className="relative w-32 sm:w-36 md:w-40 h-32 sm:h-36 md:h-40">
                <Image 
                  src={logoSrc} 
                  alt={title} 
                  width={160}
                  height={160}
                  className="object-contain w-full h-full drop-shadow-lg"
                  priority
                />
              </div>
            </div>
            
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-2xl font-bold tracking-tight text-gray-900">
              {title || translations.login.title}
            </h1>
          </div>

          {/* Form Section */}
          <div className="px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-5 md:space-y-6">
            {/* API Error */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <p className="text-red-700 text-sm font-medium">{apiError}</p>
              </div>
            )}

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-semibold text-gray-900">
                        {translations.login.email}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={translations.login.emailPlaceholder}
                          {...field}
                          disabled={isLoading}
                          className="text-xs sm:text-sm h-10 sm:h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-semibold text-gray-900">
                        Contraseña
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                          disabled={isLoading}
                          className="text-xs sm:text-sm h-10 sm:h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Tenant ID Field */}
                <FormField
                  control={form.control}
                  name="tenantId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-semibold text-gray-900">
                        Tenant ID
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="1"
                          {...field}
                          disabled={isLoading}
                          className="text-xs sm:text-sm h-10 sm:h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 sm:h-11 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-xl font-semibold transition-all text-xs sm:text-sm mt-6 sm:mt-8 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>
            </Form>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LoginModal;
