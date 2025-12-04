'use client';

import Image from 'next/image';
import { tactikaXThemeConfig } from '../theme.config';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onLoginClick: () => void;
}

export function TactikaXHeader({ cartCount, onCartClick, onLoginClick }: HeaderProps) {
  const { contact, social } = tactikaXThemeConfig;

  return (
    <header style={{ 
      backgroundColor: '#0a0e27',
      backgroundImage: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)'
    }}>
      {/* Top Bar */}
      <div className="header-top">
        <div className="container">
          <div className="header-top-content">
            <div className="header-top-left">
              <a href={`tel:${contact.phone}`}>
                <i className="fas fa-phone"></i> {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`}>
                <i className="fas fa-envelope"></i> {contact.email}
              </a>
            </div>
            <div className="social-links">
              {social.facebook && (
                <a href={social.facebook} aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {social.instagram && (
                <a href={social.instagram} aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {social.whatsapp && (
                <a href={social.whatsapp} aria-label="WhatsApp">
                  <i className="fab fa-whatsapp"></i>
                </a>
              )}
              {social.tiktok && (
                <a href={social.tiktok} aria-label="TikTok">
                  <i className="fab fa-tiktok"></i>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container">
        <div className="header-content">
          <div className="logo-container">
            <Image 
              src="/themes/tactika-x/logo.png"
              alt="TACTIKA-X Logo"
              width={135}
              height={135}
              className="object-contain"
              priority
            />
          </div>
          <div className="header-actions">
            <div className="search-box">
              <input type="text" placeholder="Buscar productos..." />
              <button>
                <i className="fas fa-search"></i>
              </button>
            </div>
            <button className="icon-btn" onClick={onCartClick}>
              <i className="fas fa-shopping-cart"></i>
              <span className="cart-badge">{cartCount}</span>
            </button>
            <button className="account-btn" onClick={onLoginClick}>
              <i className="fas fa-user"></i>
              Tu cuenta
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
