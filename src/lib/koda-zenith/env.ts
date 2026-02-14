/**
 * Koda Zenith - Runtime Environment Detection
 * Edge Compatible | Zero Dependencies
 */

export type KodaRuntime = 'bun' | 'edge' | 'node' | 'deno' | 'unknown';

export interface KodaEnv {
  runtime: KodaRuntime;
  isDev: boolean;
  isProd: boolean;
  get(key: string): string | undefined;
  require(key: string): string;
  getNumber(key: string, defaultValue?: number): number;
  getBoolean(key: string, defaultValue?: boolean): boolean;
}

function detectRuntime(): KodaRuntime {
  if (typeof Deno !== 'undefined') return 'deno';
  if (typeof Bun !== 'undefined') return 'bun';
  if (typeof EdgeRuntime !== 'undefined') return 'edge';
  if (typeof process !== 'undefined' && process?.versions?.node) return 'node';
  return 'unknown';
}

export const env: KodaEnv = {
  runtime: detectRuntime(),
  isDev: typeof process !== 'undefined' ? process.env.NODE_ENV === 'development' : false,
  
  get isProd() { 
    return !this.isDev; 
  },
  
  get(key: string): string | undefined {
    return typeof process !== 'undefined' ? process.env[key] : undefined;
  },
  
  require(key: string): string {
    const value = this.get(key);
    if (!value) {
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value;
  },
  
  getNumber(key: string, defaultValue?: number): number {
    const value = this.get(key);
    if (!value) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      throw new Error(`Environment variable ${key} must be a valid number, got: ${value}`);
    }
    return num;
  },
  
  getBoolean(key: string, defaultValue?: boolean): boolean {
    const value = this.get(key);
    if (!value) {
      if (defaultValue !== undefined) return defaultValue;
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value.toLowerCase() === 'true' || value === '1';
  }
};

// Global declarations
declare global {
  var Bun: any;
  var Deno: any;
  var EdgeRuntime: any;
}
