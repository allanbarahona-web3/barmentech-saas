'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { MessageCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  whatsappNumber?: string;
}

export function FAQ({ whatsappNumber = '+50687654321' }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: '¿Cómo hago mi pedido?',
      answer:
        'Puedes hacer clic en "Pedir por WhatsApp" para hablar directamente con nuestro equipo, o usar "Comprar ahora" para pagar directamente con tarjeta. Ambas opciones son igual de seguras.',
    },
    {
      question: '¿Qué métodos de pago aceptan?',
      answer:
        'Aceptamos Stripe, PayPal y MercadoPago. También puedes pagar por transferencia bancaria o efectivo contra entrega en San José.',
    },
    {
      question: '¿Cuánto tarda el envío?',
      answer:
        'Los envíos normalmente tardan 2-3 días hábiles dentro del Valle Central. Para otras provincias, 3-5 días hábiles. Ofrecemos envío express si lo necesitas con urgencia.',
    },
    {
      question: '¿Hacen entregas en todo el país?',
      answer:
        'Sí, hacemos entregas a todo Costa Rica. Los costos varían según la provincia. Te mostraremos el costo exacto antes de confirmar tu pedido.',
    },
    {
      question: '¿Qué pasa si mi producto llega dañado?',
      answer:
        'Si el producto llega dañado, ofrecemos reemplazo o devolución completa del dinero. Solo contacta a nuestro equipo por WhatsApp con fotos del daño.',
    },
    {
      question: '¿Hay garantía en los tenis?',
      answer:
        'Sí, todos nuestros productos tienen 30 días de garantía contra defectos de fabricación. Si encuentras algún problema, nos encargaremos de resolverlo.',
    },
  ];

  const waLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hola,%20tengo%20una%20pregunta%20sobre%20sneakerscr.com`;

  return (
    <section id="faq" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white scroll-mt-20">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-14 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-base sm:text-lg text-gray-600">
            Resolvemos tus dudas más comunes
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl overflow-hidden hover:border-orange-300 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900 text-left text-sm sm:text-base md:text-lg">
                  {faq.question}
                </h3>
                <ChevronDown
                  size={20}
                  className={`flex-shrink-0 ml-4 text-orange-500 transition-transform ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Answer */}
              {openIndex === idx && (
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 text-sm sm:text-base mb-4">{faq.answer}</p>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-semibold text-xs sm:text-sm"
                  >
                    <MessageCircle size={16} />
                    Escribenos si aún tienes dudas
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="mt-10 sm:mt-14 md:mt-16 p-6 sm:p-8 bg-gradient-to-r from-orange-50 to-white border-2 border-orange-200 rounded-2xl text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
            ¿No encontraste tu respuesta?
          </h3>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 sm:py-3 px-5 sm:px-7 rounded-lg transition-all duration-200 text-sm sm:text-base"
          >
            <MessageCircle size={18} />
            Escríbenos por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
