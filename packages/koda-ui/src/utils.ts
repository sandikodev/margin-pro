import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Koda UI: Utility Class Merger
 * Combines clsx and tailwind-merge for high-fidelity class orchestration.
 * ทุก detail Zenith tetap aman.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
