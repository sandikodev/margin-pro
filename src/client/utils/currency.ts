/**
 * Currency Utilities
 * Centralized currency formatting functions
 */

export type CurrencyCode = 'IDR' | 'USD' | 'EUR' | 'SGD' | 'MYR';

interface FormatCurrencyOptions {
    currency?: CurrencyCode;
    locale?: string;
    showSymbol?: boolean;
    compact?: boolean;
}

/**
 * Format a number as Indonesian Rupiah
 * @param value - The numeric value to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatIDR(value: number, options?: Pick<FormatCurrencyOptions, 'compact' | 'showSymbol'>): string {
    const { compact = false, showSymbol = true } = options || {};

    if (compact) {
        if (value >= 1_000_000_000) {
            return `${showSymbol ? 'Rp ' : ''}${(value / 1_000_000_000).toFixed(1)}M`;
        }
        if (value >= 1_000_000) {
            return `${showSymbol ? 'Rp ' : ''}${(value / 1_000_000).toFixed(1)}jt`;
        }
        if (value >= 1_000) {
            return `${showSymbol ? 'Rp ' : ''}${(value / 1_000).toFixed(0)}k`;
        }
    }

    const formatted = value.toLocaleString('id-ID');
    return showSymbol ? `Rp ${formatted}` : formatted;
}

/**
 * Format a number as currency with locale support
 * @param value - The numeric value to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, options?: FormatCurrencyOptions): string {
    const { currency = 'IDR', locale = 'id-ID', showSymbol = true } = options || {};

    if (currency === 'IDR') {
        return formatIDR(value, { showSymbol, compact: options?.compact });
    }

    const formatter = new Intl.NumberFormat(locale, {
        style: showSymbol ? 'currency' : 'decimal',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });

    return formatter.format(value);
}

/**
 * Parse a formatted currency string back to number
 * @param value - The formatted string (e.g., "Rp 150.000")
 * @returns Numeric value
 */
export function parseCurrency(value: string): number {
    // Remove currency symbols and formatting
    const cleaned = value.replace(/[^\d,-]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
}

/**
 * Format percentage
 * @param value - Value between 0 and 1 (or 0-100 if isPercent true)
 * @param isPercent - If true, value is already in percent form
 * @returns Formatted percentage string
 */
export function formatPercent(value: number, isPercent = false): string {
    const percentValue = isPercent ? value : value * 100;
    return `${percentValue.toFixed(1)}%`;
}
