import {parse} from 'date-fns';
import {JalaliDateTime} from 'jalali-date-time';

// use only for YYYY/MM/DD
export function parseDate(input: string): Date {
  return parse(input, 'yyyy/MM/dd', new Date());
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
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

export function parseDateHijri(input: string): Date {
  const { toGregorian } = JalaliDateTime();
  const [year, month, day] = input.split('/').map(Number);
  const { gy, gm, gd } = toGregorian({ jy: year, jm: month, jd: day });
  return new Date(gy, gm - 1, gd);
}

export function formatDateHijri(date: Date): string {
  const { toJalali } = JalaliDateTime();
  const { jy, jm, jd } = toJalali({ gy: date.getFullYear(), gm: date.getMonth() + 1, gd: date.getDate() });
  const year = jy.toString().padStart(4, '0');
  const month = jm.toString().padStart(2, '0');
  const day = jd.toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
}
