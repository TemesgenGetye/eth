export function camelCase(obj: any) {
  const keys = Object.keys(obj);
  const newProduct: { [key: string]: any } = {};
  keys.forEach((key: string) => {
    const camelCasedKey = key
      .split('_')
      .map((k: string, index) => {
        let newKey = k;
        if (index !== 0) {
          newKey = k.charAt(0).toUpperCase() + k.slice(1);
        }
        return newKey;
      })
      .join('');
    newProduct[camelCasedKey] = obj[key];
  });
  return newProduct;
}

export function cleanString(str: string) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^a-z0-9-&]/g, '') // Allow letters, numbers, hyphens, and ampersands
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, ''); // Trim leading/trailing hyphens
}

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
