import { createBunWebSocket } from 'hono/bun';
import { Hono } from 'hono';

import { WSContext } from 'hono/ws';

export const { upgradeWebSocket, websocket } = createBunWebSocket();

const rooms = new Map<string, Set<WSContext>>();

export const collaborationRoutes = new Hono()
    .get('/ws', upgradeWebSocket((_c) => {
        const roomId = 'lab-global'; // For now, one global room
        return {
            onOpen(evt, ws) {
                if (!rooms.has(roomId)) rooms.set(roomId, new Set());
                rooms.get(roomId)?.add(ws);
                console.log('WS Connection Opened');
            },
            onMessage(evt, ws) {
                const message = evt.data;
                // Broadcast to everyone else in the room
                rooms.get(roomId)?.forEach((client) => {
                    if (client !== ws) {
                        // @ts-expect-error Bun WS send accepts multiple types but TS union is incompatible
                        client.send(message);
                    }
                });
            },
            onClose(evt, ws) {
                rooms.get(roomId)?.delete(ws);
                console.log('WS Connection Closed');
            },
        };
    }));
