import type { MockProduct } from '../types';

export const mockProducts: MockProduct[] = [
  {
    id: 'prod-1',
    name: 'Wireless Headphones',
    description: 'Premium noise-canceling wireless headphones with 30-hour battery life.',
    price: 29999,
    category: 'Electronics',
    inStock: true,
    imageUrl: null,
  },
  {
    id: 'prod-2',
    name: 'Ergonomic Keyboard',
    description: 'Split mechanical keyboard with customizable RGB lighting.',
    price: 17999,
    category: 'Electronics',
    inStock: true,
    imageUrl: null,
  },
  {
    id: 'prod-3',
    name: 'Standing Desk',
    description: 'Electric height-adjustable desk with memory presets.',
    price: 59999,
    category: 'Furniture',
    inStock: false,
    imageUrl: null,
  },
  {
    id: 'prod-4',
    name: 'Monitor Light Bar',
    description: 'Screen-mounted LED light bar with adjustable color temperature.',
    price: 8999,
    category: 'Electronics',
    inStock: true,
    imageUrl: null,
  },
  {
    id: 'prod-5',
    name: 'Mesh Office Chair',
    description: 'Breathable mesh chair with lumbar support and adjustable armrests.',
    price: 44999,
    category: 'Furniture',
    inStock: true,
    imageUrl: null,
  },
  {
    id: 'prod-6',
    name: 'USB-C Hub',
    description: '10-in-1 hub with HDMI, ethernet, SD card reader, and power delivery.',
    price: 7999,
    category: 'Electronics',
    inStock: true,
    imageUrl: null,
  },
  {
    id: 'prod-7',
    name: 'Desk Mat',
    description: 'Large leather desk mat with stitched edges.',
    price: 4999,
    category: 'Accessories',
    inStock: true,
    imageUrl: null,
  },
  {
    id: 'prod-8',
    name: 'Webcam HD',
    description: '4K webcam with auto-focus and built-in microphone.',
    price: 14999,
    category: 'Electronics',
    inStock: false,
    imageUrl: null,
  },
];

/**
 * Format price from cents to display string
 */
export function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}
