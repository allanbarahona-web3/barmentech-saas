'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

// Validación con Zod
const signupSchema = z.object({
  companyName: z.string().min(2, 'Nombre de empresa requerido').min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  password: z.string().min(8, 'Contraseña debe tener al menos 8 caracteres').min(1, 'Contraseña requerida'),
  confirmPassword: z.string().min(1, 'Confirmar contraseña requerida'),
  terms: z.boolean().refine((val) => val === true, 'Debe aceptar los términos y condiciones'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

interface SignupModalProps {
  apiEndpoint?: string;
  redirectPath?: string;
  logoSrc?: string;
  title?: string;
  showFeatures?: boolean;
  language?: 'es' | 'en';
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

export function SignupModal({
  apiEndpoint = 'http://localhost:3000/api/v1/auth/crm/signup',
  redirectPath = '/crm/conversations',
  logoSrc = '/themes/barmentech/logo_barmentech.png',
  title = 'Barmentech CRM',
  showFeatures = true,
  language: initialLanguage = 'es',
  onSuccess,
  onError,
}: SignupModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [language, setLanguage] = useState<'es' | 'en'>(initialLanguage);

  const translations = {
    es: {
      subtitle: 'Crea tu cuenta gratis',
      company: 'Nombre de la Empresa',
      email: 'Email',
      password: 'Contraseña',
      confirmPassword: 'Confirmar Contraseña',
      terms: 'Acepto los términos y condiciones',
      signup: 'Crear Cuenta',
      signingUp: 'Creando cuenta...',
      loginLink: '¿Ya tienes cuenta? Inicia sesión',
      backToHome: '← Volver a inicio',
      whyTitle: '¿Por qué Barmentech CRM?',
      features: [
        'Gestiona múltiples canales',
        'IA y automatización',
        'Reportes y analítica',
        'Equipo ilimitado',
      ],
      trustBadge: 'Certificado Meta Business Partner',
      trustDescription: 'Tu cuenta está protegida. Nunca serás baneado por usar Barmentech CRM.',
    },
    en: {
      subtitle: 'Create your free account',
      company: 'Company Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      terms: 'I agree to the terms and conditions',
      signup: 'Create Account',
      signingUp: 'Creating account...',
      loginLink: 'Already have an account? Sign in',
      backToHome: '← Back to home',
      whyTitle: 'Why Barmentech CRM?',
      features: [
        'Manage multiple channels',
        'AI and automation',
        'Reports and analytics',
        'Unlimited team',
      ],
      trustBadge: 'Meta Certified Business Partner',
      trustDescription: 'Your account is protected. You will never be banned for using Barmentech CRM.',
    },
  };

  const t = translations[language];

  // React Hook Form con Zod
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      companyName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setApiError('');
    setIsLoading(true);

    try {
      console.log('Creating account with:', { companyName: values.companyName, email: values.email });

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: values.companyName,
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Signup failed');
      }

      const data = await response.json();

      // Store tokens in localStorage (auto-login)
      if (data.accessToken && data.refreshToken) {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));

        console.log('Account created successfully');

        if (onSuccess) {
          onSuccess(data.user);
        }

        // Redirect to CRM dashboard
        router.push(redirectPath);
      } else {
        // Fallback to login if no tokens returned
        router.push('/admin/login');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : (language === 'es' ? 'Error al registrarse' : 'Signup failed');
      console.error('Signup error:', err);

      setApiError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-3 sm:p-4 md:p-6">
      {/* Language Switcher */}
      <div className="absolute top-3 sm:top-6 right-3 sm:right-6 flex items-center gap-1 sm:gap-2 bg-white rounded-full p-0.5 sm:p-1 shadow-sm z-10">
        <button
          onClick={() => setLanguage('es')}
          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
            language === 'es'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          ES
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition ${
            language === 'en'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          EN
        </button>
      </div>

      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        {/* Left: Form */}
        <div className="w-full max-w-md mx-auto md:mx-0">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="relative w-32 sm:w-40 h-16 sm:h-20">
                <Image 
                  src={logoSrc} 
                  alt={title} 
                  width={160}
                  height={80}
                  className="object-contain w-full h-full"
                  priority
                />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">{title}</h1>
            <p className="text-xs sm:text-sm text-gray-500">{t.subtitle}</p>
          </div>

          {/* Form Card */}
          <Card className="shadow-lg p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            {/* API Error */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                <p className="text-red-700 text-sm font-medium">{apiError}</p>
              </div>
            )}

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Company Name Field */}
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-semibold text-gray-900">
                        {t.company}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={language === 'es' ? 'Mi Empresa' : 'My Company'}
                          {...field}
                          disabled={isLoading}
                          className="text-xs sm:text-sm h-10 sm:h-11"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-semibold text-gray-900">
                        {t.email}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
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
                        {t.password}
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

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs sm:text-sm font-semibold text-gray-900">
                        {t.confirmPassword}
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

                {/* Terms Checkbox Field */}
                <FormField
                  control={form.control}
                  name="terms"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                          className="mt-1"
                        />
                      </FormControl>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">{t.terms}</p>
                        <FormMessage className="text-xs mt-1" />
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-10 sm:h-11 bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg disabled:opacity-50 text-white rounded-xl font-semibold transition-all text-xs sm:text-sm mt-8 flex items-center justify-center gap-2"
                >
                  {isLoading ? t.signingUp : t.signup}
                  {!isLoading && <ArrowRight size={16} />}
                </Button>
              </form>
            </Form>
          </Card>

          {/* Footer Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            {t.loginLink}{' '}
            <Link href="/admin/login" className="text-blue-600 hover:text-blue-700 font-medium">
              {language === 'es' ? 'aquí' : 'here'}
            </Link>
          </p>

          {/* Back to Landing */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition">
              {t.backToHome}
            </Link>
          </div>
        </div>

        {/* Right: Features (Desktop Only) */}
        {showFeatures && (
          <div className="hidden md:block">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t.whyTitle}
            </h2>
            <ul className="space-y-6">
              {t.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mt-1 flex-shrink-0">
                    <Check size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-lg text-gray-900 font-medium">{feature}</p>
                  </div>
                </li>
              ))}
            </ul>

            {/* Trust Badge */}
            <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
              <p className="text-sm font-semibold text-blue-900 mb-2">
                {t.trustBadge}
              </p>
              <p className="text-xs text-blue-800">
                {t.trustDescription}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignupModal;
