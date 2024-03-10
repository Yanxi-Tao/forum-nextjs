import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// This is a utility function that merges class names using clsx and tailwind-merge
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// This is a utility function that checks if a value is an HTMLElement
export function isHTMLElement(x: unknown): x is HTMLElement {
  return x instanceof HTMLElement
}
