import React from 'react';
import { renderToReadableStream } from 'react-dom/server';
import {
    createStaticHandler,
    createStaticRouter,
    StaticRouterProvider,
} from 'react-router';
import { apexRoutes } from '@apex/generated/client-manifest';

// 🏔️ Zenith SSR Engine
// Bridges Hono with React Router 7 Data API for Zero-Flicker rendering.
export async function renderStream(request: Request, template: string) {
    try {
        console.log(`🏔️ [Zenith SSR] Request: ${request.url}`);
        const { query, dataRoutes } = createStaticHandler(apexRoutes);

        let context;
        try {
            context = await query(request);
            console.log(`🏔️ [Zenith SSR] Query Successful`);
        } catch (e) {
            console.error(`🏔️ [Zenith SSR] Query Failed:`, e);
            throw e;
        }

        if (context instanceof Response) {
            console.log(`🏔️ [Zenith SSR] Context is Redirect/Response`);
            return context;
        }

        const router = createStaticRouter(dataRoutes, context);
        console.log(`🏔️ [Zenith SSR] Static Router Created`);

        // Split template at the mounting point (robust regex split)
        const splitRegex = /<div id="root">\s*<\/div>/;
        const parts = template.split(splitRegex);

        if (parts.length < 2) {
            console.error('🏔️ [Zenith SSR] FATAL: Could not find <div id="root"></div> in template to inject stream.');
            return new Response(template, { headers: { 'Content-Type': 'text/html' } });
        }

        const [head, tail] = parts;

        const stream = await renderToReadableStream(
            <StaticRouterProvider
                router={router}
                context={context}
            />,
            {
                onError(error: unknown) {
                    console.error('[Zenith SSR] Streaming Error:', error);
                },
            }
        );

        // 🌊 Combine parts into a single stream
        const encoder = new TextEncoder();

        const mergedStream = new ReadableStream({
            async start(controller) {
                try {
                    controller.enqueue(encoder.encode(head + '<div id="root">'));

                    const reader = stream.getReader();
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        controller.enqueue(value);
                    }

                    controller.enqueue(encoder.encode('</div>'));

                    // 💉 Institutional Grade Hydration: Restore data injection
                    try {
                        const hydrationScript = `<script>window.__staticRouterHydrationData = ${JSON.stringify(context)};</script>`;
                        controller.enqueue(encoder.encode(hydrationScript));
                    } catch (serializationError) {
                        console.error('🏔️ [Zenith SSR] Hydration Serialization Error:', serializationError);
                    }

                    controller.enqueue(encoder.encode(tail));
                    controller.close();
                } catch (err) {
                    console.error('🏔️ [Zenith SSR] StreamController Error:', err);
                    controller.error(err);
                }
            },
        });

        return new Response(mergedStream, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Transfer-Encoding': 'chunked', // Ensure streaming is active
            },
        });
    } catch (globalError: any) {
        console.error("🔥 SSR FATAL ERROR:", globalError);
        return new Response(
            `<html><body><h1>🔥 SSR Fatal Error</h1><pre>${globalError.stack || globalError.message}</pre></body></html>`,
            {
                status: 500,
                headers: { 'Content-Type': 'text/html' }
            }
        );
    }
}
