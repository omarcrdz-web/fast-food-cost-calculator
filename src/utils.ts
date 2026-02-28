import { Unit, UNIT_CATEGORIES } from './types';

export function getBaseUnit(unit: Unit): Unit {
  if (unit === 'kg' || unit === 'g') return 'g';
  if (unit === 'L' || unit === 'ml') return 'ml';
  return 'pz';
}

export function convertToBase(value: number, unit: Unit): number {
  if (unit === 'kg') return value * 1000;
  if (unit === 'L') return value * 1000;
  return value;
}

export function convertFromBase(value: number, unit: Unit): number {
  if (unit === 'kg') return value / 1000;
  if (unit === 'L') return value / 1000;
  return value;
}

export function convert(value: number, fromUnit: Unit, toUnit: Unit): number | null {
  const fromCategory = UNIT_CATEGORIES[fromUnit];
  const toCategory = UNIT_CATEGORIES[toUnit];
  
  if (fromCategory !== toCategory) {
    return null; // Cannot convert between different categories
  }
  
  const baseValue = convertToBase(value, fromUnit);
  return convertFromBase(baseValue, toUnit);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
