'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Validación con Zod
const contactFormSchema = z.object({
  name: z.string().min(2, 'Nombre requerido').min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido').min(1, 'Email requerido'),
  phone: z.string().optional().or(z.literal('')),
  message: z.string().min(10, 'Mensaje debe tener al menos 10 caracteres').min(1, 'Mensaje requerido'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'es' | 'en';
  apiEndpoint?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export function ContactForm({
  isOpen,
  onClose,
  language = 'es',
  apiEndpoint = 'http://localhost:3000/api/v1/contact',
  onSuccess,
  onError,
}: ContactFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [apiErrorMsg, setApiErrorMsg] = useState('');

  const translations = {
    es: {
      title: 'Contáctanos',
      subtitle: 'Nos encantaría escucharte. Responderemos dentro de 24 horas.',
      name: 'Nombre',
      email: 'Email',
      phone: 'Teléfono',
      message: 'Mensaje',
      send: 'Enviar Mensaje',
      sending: 'Enviando...',
      success: '¡Mensaje enviado! Nos contactaremos pronto.',
      namePlaceholder: 'Tu nombre',
      emailPlaceholder: 'tu@email.com',
      phonePlaceholder: '+1 (786) 391-8722',
      messagePlaceholder: 'Cuéntanos cómo podemos ayudarte...',
    },
    en: {
      title: 'Contact Us',
      subtitle: 'We\'d love to hear from you. We\'ll respond within 24 hours.',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      success: 'Message sent! We\'ll contact you soon.',
      namePlaceholder: 'Your name',
      emailPlaceholder: 'your@email.com',
      phonePlaceholder: '+1 (786) 391-8722',
      messagePlaceholder: 'Tell us how we can help...',
    },
  };

  const t = translations[language];

  // React Hook Form con Zod
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setApiErrorMsg('');
    setIsLoading(true);

    try {
      console.log('Sending contact form:', values);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to send message');
      }

      const data = await response.json();

      console.log('Contact form submitted successfully');

      setSubmitted(true);

      if (onSuccess) {
        onSuccess(data);
      }

      // Close after 2 seconds
      setTimeout(() => {
        form.reset();
        setSubmitted(false);
        onClose();
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message';
      console.error('Contact form error:', err);

      setApiErrorMsg(errorMessage);

      if (onError) {
        onError(errorMessage);
      }

      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-65 transition-opacity pointer-events-auto"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-65 flex items-center justify-center p-2 sm:p-4 pointer-events-none">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-4 sm:py-6 flex justify-between items-center">
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-white">{t.title}</h2>
              <p className="text-blue-100 text-xs sm:text-sm mt-1">{t.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-lg p-1.5 sm:p-2 transition flex-shrink-0 ml-2"
              disabled={isLoading}
            >
              <X size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Form */}
          <div className="p-4 sm:p-6">
            {submitted ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-12 sm:w-16 h-12 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CheckCircle size={28} className="sm:w-8 sm:h-8 text-green-600" />
                </div>
                <p className="text-gray-900 font-semibold text-base sm:text-lg">{t.success}</p>
              </div>
            ) : (
              <>
                {/* API Error */}
                {apiErrorMsg && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 mb-4">
                    <p className="text-red-700 text-xs sm:text-sm font-medium">{apiErrorMsg}</p>
                  </div>
                )}

                {/* Form */}
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
                    {/* Name Field */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-semibold text-gray-900">
                            {t.name}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder={t.namePlaceholder}
                              {...field}
                              disabled={isLoading}
                              className="text-xs sm:text-sm h-9 sm:h-10"
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
                              placeholder={t.emailPlaceholder}
                              {...field}
                              disabled={isLoading}
                              className="text-xs sm:text-sm h-9 sm:h-10"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Phone Field */}
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-semibold text-gray-900">
                            {t.phone}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder={t.phonePlaceholder}
                              {...field}
                              disabled={isLoading}
                              className="text-xs sm:text-sm h-9 sm:h-10"
                            />
                          </FormControl>
                          <FormMessage className="text-xs" />
                        </FormItem>
                      )}
                    />

                    {/* Message Field */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs sm:text-sm font-semibold text-gray-900">
                            {t.message}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t.messagePlaceholder}
                              {...field}
                              disabled={isLoading}
                              rows={3}
                              className="text-xs sm:text-sm resize-none"
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
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg disabled:opacity-50 text-white font-bold py-2 sm:py-3 rounded-lg transition mt-4 sm:mt-6 text-sm sm:text-base h-9 sm:h-10"
                    >
                      {isLoading ? t.sending : t.send}
                    </Button>
                  </form>
                </Form>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactForm;
