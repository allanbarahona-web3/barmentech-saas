'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, X, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useSportsCart } from '../context/CartContext';
import { getUniqueBrands } from '../data/products';

interface HeaderProps {
  onCheckoutClick?: () => void;
}

export function Header({ onCheckoutClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBrandMenuOpen, setIsBrandMenuOpen] = useState(false);
  const { itemCount } = useSportsCart();
  const brands = getUniqueBrands();

  return (
    <>
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex justify-between items-center">
          {/* Logo */}
          <Link href="/sports" className="flex items-center gap-2">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">
              sneakers<span className="text-orange-500">cr</span>
            </div>
          </Link>

          {/* Desktop Menu - Center */}
          <div className="hidden md:flex gap-6 absolute left-1/2 -translate-x-1/2">
            <Link href="/sports" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition">
              Inicio
            </Link>
            <Link
              href="/sports/catalogo"
              className="text-sm font-medium text-gray-600 hover:text-orange-600 transition"
            >
              Catálogo
            </Link>
            
            {/* Brands Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-orange-600 transition">
                Marcas
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {brands.map((brand) => (
                  <Link
                    key={brand}
                    href={`/sports/catalogo?brand=${encodeURIComponent(brand)}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 first:rounded-t-lg last:rounded-b-lg"
                  >
                    {brand}
                  </Link>
                ))}
              </div>
            </div>

            <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-orange-600 transition">
              Preguntas
            </a>
          </div>

          {/* Cart Icon */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(!isCartOpen)}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
              title="Ver carrito"
            >
              <ShoppingBag size={24} className="text-gray-900" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-gray-50 px-4 py-4 space-y-3">
            <Link href="/sports" className="block text-sm font-medium text-gray-900 hover:text-orange-600">
              Inicio
            </Link>
            <Link
              href="/sports/catalogo"
              className="block text-sm font-medium text-gray-900 hover:text-orange-600"
            >
              Catálogo
            </Link>
            
            {/* Mobile Brands Submenu */}
            <div>
              <button
                onClick={() => setIsBrandMenuOpen(!isBrandMenuOpen)}
                className="flex items-center justify-between w-full text-sm font-medium text-gray-900 hover:text-orange-600"
              >
                Marcas
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${isBrandMenuOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isBrandMenuOpen && (
                <div className="mt-2 ml-4 space-y-2 border-l-2 border-orange-300 pl-4">
                  {brands.map((brand) => (
                    <Link
                      key={brand}
                      href={`/sports/catalogo?brand=${encodeURIComponent(brand)}`}
                      className="block text-sm text-gray-700 hover:text-orange-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {brand}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <a href="#faq" className="block text-sm font-medium text-gray-900 hover:text-orange-600">
              Preguntas
            </a>
          </div>
        )}
      </nav>

      {/* Cart Sidebar/Modal */}
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Cart Panel */}
          <div className="fixed right-0 top-0 h-dvh w-full max-w-md bg-white shadow-2xl z-40 flex flex-col overflow-y-auto">
            <CartPanelContent
              onClose={() => setIsCartOpen(false)}
              onCheckout={() => {
                setIsCartOpen(false);
                onCheckoutClick?.();
              }}
            />
          </div>
        </>
      )}
    </>
  );
}

interface CartPanelContentProps {
  onClose: () => void;
  onCheckout: () => void;
}

function CartPanelContent({ onClose, onCheckout }: CartPanelContentProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useSportsCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <p className="text-gray-600 text-center mb-6">Tu carrito está vacío</p>
        <button
          onClick={onClose}
          className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-lg"
        >
          Seguir comprando
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Tu carrito</h2>
        <button
          onClick={onClose}
          className="text-white hover:bg-white/20 rounded-lg p-1 transition"
        >
          <X size={24} />
        </button>
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg p-4">
            {/* Item Name & Price */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{item.name}</h3>
                <p className="text-orange-600 font-bold">${item.price.toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-gray-400 hover:text-red-600 transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 w-fit">
              <button
                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                className="text-gray-600 hover:text-gray-900 font-bold w-6 h-6 flex items-center justify-center"
              >
                −
              </button>
              <span className="w-8 text-center font-semibold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                className="text-gray-600 hover:text-gray-900 font-bold w-6 h-6 flex items-center justify-center"
              >
                +
              </button>
            </div>

            {/* Item Total */}
            <div className="mt-3 text-right text-sm text-gray-600">
              Subtotal: ${(item.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-4">
        {/* Total */}
        <div className="flex justify-between items-center text-lg font-bold text-gray-900">
          <span>Total:</span>
          <span className="text-orange-600">${total.toFixed(2)}</span>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={onCheckout}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition"
          >
            Ir a Checkout
          </button>
          <button
            onClick={onClose}
            className="w-full border-2 border-gray-300 hover:border-orange-500 text-gray-900 font-bold py-3 rounded-lg transition"
          >
            Seguir comprando
          </button>
          <button
            onClick={clearCart}
            className="w-full text-gray-600 hover:text-red-600 font-semibold py-2 transition"
          >
            Vaciar carrito
          </button>
        </div>

        {/* Info */}
        <p className="text-xs text-gray-500 text-center">
          El envío se calculará en checkout según tu dirección
        </p>
      </div>
    </>
  );
}

export default Header;
