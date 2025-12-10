'use client';

import Link from 'next/link';
import { MessageCircle, Mail, MapPin } from 'lucide-react';

interface FooterProps {
  whatsappNumber?: string;
  email?: string;
}

export function Footer({ whatsappNumber = '+50687654321', email = 'hola@sneakerscr.com' }: FooterProps) {
  const waLink = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=Hola,%20vengo%20de%20sneakerscr.com`;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12 pb-8 sm:pb-12 border-b border-gray-800">
          {/* Brand */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
              sneakers<span className="text-orange-500">cr</span>
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              calzado deportivo y más  con envío rápido a todo Costa Rica.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-white mb-4">Enlaces</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <Link href="/" className="hover:text-orange-500 transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="hover:text-orange-500 transition-colors">
                  Catálogo completo
                </Link>
              </li>
              <li>
                <Link href="#faq" className="hover:text-orange-500 transition-colors">
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm sm:text-base font-semibold text-white mb-4">Contacto</h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-orange-500 transition-colors"
              >
                <MessageCircle size={16} />
                {whatsappNumber}
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 hover:text-orange-500 transition-colors"
              >
                <Mail size={16} />
                {email}
              </a>
              <div className="flex items-center gap-2 text-gray-500">
                <MapPin size={16} />
                Costa Rica
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs sm:text-sm">
          <p className="text-gray-400">
            &copy; {currentYear} sneakerscr.com. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors">
              Política de Privacidad
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-orange-500 transition-colors">
              Términos y Condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
