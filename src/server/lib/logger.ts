import { env } from "../env";

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const formatMessage = (level: LogLevel, message: string, meta?: Record<string, unknown>) => {
    // In Dev, pretty print
    if (env.NODE_ENV === 'development') {
        const timestamp = new Date().toLocaleTimeString();
        const metaStr = meta ? JSON.stringify(meta) : '';
        return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaStr}`;
    }

    // In Prod, JSON
    return JSON.stringify({
        level,
        message,
        timestamp: new Date().toISOString(),
        ...meta
    });
};

export const logger = {
    info: (message: string, meta?: Record<string, unknown>) => console.log(formatMessage('info', message, meta)),
    warn: (message: string, meta?: Record<string, unknown>) => console.warn(formatMessage('warn', message, meta)),
    error: (message: string, meta?: Record<string, unknown>) => console.error(formatMessage('error', message, meta)),
    debug: (message: string, meta?: Record<string, unknown>) => console.debug(formatMessage('debug', message, meta)),
};
