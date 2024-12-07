import { parse } from 'date-fns';

// use only for YYYY/MM/DD
export function parseDate(input: string): Date {
  return parse(input, 'yyyy/MM/dd', new Date());
}