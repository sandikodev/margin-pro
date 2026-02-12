import { json } from '@koda/server';

export const loader = async () => {
    return json({
        message: 'SSR Hydration Data Working!',
        serverTime: 'Static for testing',
        testId: 'static-123'
    });
};
