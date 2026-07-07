import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import type { CollaborationAdapter } from '@syncfusion/ej2-react-blockeditor';

// Configuration
const CONFIG = {
    wsUrl: import.meta.env.VITE_WS_URL || 'ws://localhost:1234',
    hostedWsUrl: import.meta.env.VITE_HOSTED_WS_URL,
};

/**
 * Initialize Yjs document
 */
export function initializeYjs(): Y.Doc {
    return new Y.Doc();
}

/**
 * Create Yjs XML fragment for Blockeditor
 */
export function createYjsXmlFragment(ydoc: Y.Doc): Y.XmlFragment {
    return ydoc.getXmlFragment('blockeditor');
}

/**
 * Connect to WebSocket provider
 */
export function connectWebSocketProvider(
    ydoc: Y.Doc,
    roomName: string
): WebsocketProvider {
    return new WebsocketProvider(CONFIG.hostedWsUrl, roomName, ydoc);
}

/**
 * Create collaboration adapter for Blockeditor
 */
export function createCollaborationAdapter(
    yRuntime: typeof Y,
    yXmlFragment: Y.XmlFragment
): CollaborationAdapter {
    return {
        yRuntime,
        yXmlFragment,
    };
}

/**
 * Initialize complete collaboration setup
 */
export async function initializeCollaboration(
    roomName: string
): Promise<{
    ydoc: Y.Doc;
    provider: WebsocketProvider;
    adapter: CollaborationAdapter;
}> {
    const ydoc = initializeYjs();
    const yXmlFragment = createYjsXmlFragment(ydoc);
    const provider = connectWebSocketProvider(ydoc, roomName);
    const adapter = createCollaborationAdapter(Y, yXmlFragment);

    // Wait for connection to establish
    return new Promise((resolve) => {
        provider.on('status', (event: any) => {
            if (event.status === 'connected') {
                resolve({ ydoc, provider, adapter });
            }
        });

        // Fallback timeout
        setTimeout(() => {
            resolve({ ydoc, provider, adapter });
        }, 2000);
    });
}

/**
 * Cleanup collaboration resources
 */
export function cleanupCollaboration(
    ydoc: Y.Doc,
    provider: WebsocketProvider
): void {
    provider.disconnect();
    ydoc.destroy();
}

/**
 * Get connection status
 */
export function getConnectionStatus(provider: WebsocketProvider): boolean {
    return provider.wsconnected || false;
}
