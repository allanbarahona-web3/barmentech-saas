'use client';

import Link from 'next/link';
import { MessageCircle, Zap } from 'lucide-react';

interface HeroProps {
  whatsappNumber?: string;
}

export function Hero({ whatsappNumber = '+50687654321' }: HeroProps) {
  const waLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hola,%20vengo%20de%20sneakerscr.com%20y%20quiero%20más%20información`;

  return (
    <section className="min-h-dvh flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 px-4 sm:px-6 py-16 sm:py-20">
      <div className="max-w-3xl mx-auto text-center">
        {/* Logo / Brand */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-gray-900 tracking-tight">
            sneakers
            <span className="text-orange-500">cr</span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm uppercase tracking-widest mt-2">
            Calzado deportivo en Costa Rica 
          </p>
        </div>

        {/* Main Title */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
          Tus tenis favoritos<br className="hidden sm:block" />
          <span className="text-orange-500">a un super precio, lleva 2 y consigue un descuento</span>
        </h2>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">
          Marcas premium con precios increíbles. Envío rápido a todo el país y atención personalizada por WhatsApp.
        </p>

        {/* Trust Bullets */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-6 mb-10 sm:mb-16 text-xs sm:text-sm text-gray-700">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-lg sm:text-xl">✅</span>
            <span>Envíos express 24 horas</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <span className="text-lg sm:text-xl">✅</span>
            <span>Pagos seguros Sinpe Movil o Tarjetas</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <span className="text-lg sm:text-xl">✅</span>
            <span>Atención de tus dudas  por WhatsApp</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* WhatsApp CTA */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-base sm:text-lg"
          >
            <MessageCircle size={20} />
            Quiero info por WhatsApp
          </a>

          {/* Catalog CTA */}
          <Link
            href="#catalogo"
            className="flex items-center justify-center gap-2 bg-white border-2 border-gray-300 hover:border-orange-500 text-gray-900 font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl transition-all duration-200 text-base sm:text-lg"
          >
            <Zap size={20} className="text-orange-500" />
            Ver catálogo
          </Link>
        </div>

        {/* Social Proof (Optional) */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-500 mb-4">Elegidos por cientos de clientes en Costa Rica</p>
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500">1000+</div>
              <div className="text-xs sm:text-sm text-gray-600">Pares vendidos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500">4.9★</div>
              <div className="text-xs sm:text-sm text-gray-600">Calificación</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-500">24h</div>
              <div className="text-xs sm:text-sm text-gray-600">Respuesta promedio</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
