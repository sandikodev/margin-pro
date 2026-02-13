/**
 * Runtime-agnostic environment utilities
 * Works with Bun, Deno, and Node.js
 */

export const env = {
  get isDev() {
    // Bun: Bun.env.NODE_ENV
    // Deno: Deno.env.get('NODE_ENV')
    // Node: process.env.NODE_ENV
    if (typeof Bun !== 'undefined') {
      return Bun.env.NODE_ENV !== 'production';
    }
    if (typeof Deno !== 'undefined') {
      return Deno.env.get('NODE_ENV') !== 'production';
    }
    return process.env.NODE_ENV !== 'production';
  },

  get isProd() {
    return !this.isDev;
  },

  get(key: string): string | undefined {
    if (typeof Bun !== 'undefined') {
      return Bun.env[key];
    }
    if (typeof Deno !== 'undefined') {
      return Deno.env.get(key);
    }
    return process.env[key];
  }
};
