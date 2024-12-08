import { parse } from 'date-fns';

// use only for YYYY/MM/DD
export function parseDate(input: string): Date {
  return parse(input, 'yyyy/MM/dd', new Date());
}

export function hexToRGBA(hex: string, alpha: number): string {
  hex = hex.replace('#', '');
  const rgb = {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}
