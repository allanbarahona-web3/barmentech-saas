// SneakersCR Products Data
// Images will be connected to DO Spaces URLs later

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string; // DO Spaces URL placeholder
  featured: boolean;
  bullets: string[];
  sku?: string;
  brand: string; // Nike, Adidas, Puma, etc
}

// BRANDS - Actualizable según necesites más marcas
export const BRANDS = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok', 'Vans', 'Converse', 'Saucony', 'ASICS', 'Mizuno'];

// FEATURED PRODUCTS (Top 8)
export const featuredProducts: Product[] = [
  {
    id: 'sneaker-001',
    name: 'Nike Air Max Pro',
    price: 89.99,
    image: '/images/placeholder-1.jpg',
    featured: true,
    brand: 'Nike',
    bullets: ['Comodidad extrema', 'Tecnología Air Max'],
    sku: 'NIKE-AIR-001',
  },
  {
    id: 'sneaker-002',
    name: 'Adidas Ultra Boost',
    price: 79.99,
    image: '/images/placeholder-2.jpg',
    featured: true,
    brand: 'Adidas',
    bullets: ['Soporte premium', 'Diseño moderno'],
    sku: 'ADIDAS-ULTRA-002',
  },
  {
    id: 'sneaker-003',
    name: 'Puma RS-X',
    price: 69.99,
    image: '/images/placeholder-3.jpg',
    featured: true,
    brand: 'Puma',
    bullets: ['Estilo retro', 'Excelente agarre'],
    sku: 'PUMA-RSX-003',
  },
  {
    id: 'sneaker-004',
    name: 'New Balance 990v6',
    price: 99.99,
    image: '/images/placeholder-4.jpg',
    featured: true,
    brand: 'New Balance',
    bullets: ['Calidad garantizada', 'Comodidad todo día'],
    sku: 'NB-990-004',
  },
  {
    id: 'sneaker-005',
    name: 'Reebok Classic Leather',
    price: 59.99,
    image: '/images/placeholder-5.jpg',
    featured: true,
    brand: 'Reebok',
    bullets: ['Estilo clásico', 'Precio accesible'],
    sku: 'REEBOK-CLASS-005',
  },
  {
    id: 'sneaker-006',
    name: 'Vans Old Skool',
    price: 64.99,
    image: '/images/placeholder-6.jpg',
    featured: true,
    brand: 'Vans',
    bullets: ['Icónico y versátil', 'Perfecto para cualquier outfit'],
    sku: 'VANS-OLDSK-006',
  },
  {
    id: 'sneaker-007',
    name: 'Converse Chuck Taylor',
    price: 54.99,
    image: '/images/placeholder-7.jpg',
    featured: true,
    brand: 'Converse',
    bullets: ['Clásico atemporal', 'Versátil'],
    sku: 'CONVERSE-CT-007',
  },
  {
    id: 'sneaker-008',
    name: 'Saucony Jazz Original',
    price: 65.99,
    image: '/images/placeholder-8.jpg',
    featured: true,
    brand: 'Saucony',
    bullets: ['Ligero y flexible', 'Excelente precio'],
    sku: 'SAUCONY-JAZZ-008',
  },
];

// ALL PRODUCTS (Complete Catalog)
export const allProducts: Product[] = [
  ...featuredProducts,
  {
    id: 'sneaker-009',
    name: 'ASICS Gel-Lyte III',
    price: 84.99,
    image: '/images/placeholder-9.jpg',
    featured: false,
    brand: 'ASICS',
    bullets: ['Amortiguación superior', 'Diseño innovador'],
    sku: 'ASICS-GELLYTE-009',
  },
  {
    id: 'sneaker-010',
    name: 'Mizuno Wave Rider',
    price: 74.99,
    image: '/images/placeholder-10.jpg',
    featured: false,
    brand: 'Mizuno',
    bullets: ['Para correr', 'Tecnología Wave'],
    sku: 'MIZUNO-RIDER-010',
  },
];

export const getProductById = (id: string): Product | undefined => {
  return allProducts.find((p) => p.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return featuredProducts;
};

export const getAllProducts = (): Product[] => {
  return allProducts;
};

export const getProductsByBrand = (brand: string): Product[] => {
  return allProducts.filter((p) => p.brand === brand);
};

export const getUniqueBrands = (): string[] => {
  const brands = new Set(allProducts.map((p) => p.brand));
  return Array.from(brands).sort();
};
