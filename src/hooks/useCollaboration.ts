import { useEffect, useState, useRef } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import {
    initializeCollaboration,
    cleanupCollaboration,
    getConnectionStatus,
} from '../services/collaborationService';
import type { CollaborationAdapter } from '@syncfusion/ej2-react-blockeditor';

interface UseCollaborationReturn {
    ydoc: Y.Doc | null;
    provider: WebsocketProvider | null;
    adapter: CollaborationAdapter | null;
    isConnected: boolean;
    error: Error | null;
    isSynced: boolean;
}

/**
 * Custom hook for collaboration setup with Yjs
 */
export function useCollaboration(roomName: string): UseCollaborationReturn {
    const [state, setState] = useState<UseCollaborationReturn>({
        ydoc: null,
        provider: null,
        adapter: null,
        isConnected: false,
        error: null,
        isSynced: false
    });

    const cleanupRef = useRef<() => void>(null);

    useEffect(() => {
        let mounted = true;

        const setup = async () => {
            try {
                const { ydoc, provider, adapter } = await initializeCollaboration(roomName);

                if (!mounted) {
                    cleanupCollaboration(ydoc, provider);
                    return;
                }

                // Setup connection status listener
                const handleStatus = (event: any) => {
                    if (mounted) {
                        setState((prev) => ({
                            ...prev,
                            isConnected: event.status === 'connected',
                        }));
                    }
                };

                provider.on('status', handleStatus);

                const syncInterval = window.setInterval(() => {
                    if (!mounted) {
                        return;
                    }

                    if (provider.synced) {
                        setState((prev) => ({
                            ...prev,
                            isSynced: true,
                        }));

                        clearInterval(syncInterval);
                    }
                }, 100);

                setState({
                    ydoc,
                    provider,
                    adapter,
                    isSynced: provider.synced,
                    isConnected: getConnectionStatus(provider),
                    error: null
                });

                cleanupRef.current = () => {
                    clearInterval(syncInterval);
                    provider.off('status', handleStatus);
                    cleanupCollaboration(ydoc, provider);
                };
            } catch (error) {
                if (mounted) {
                    setState((prev) => ({
                        ...prev,
                        error: error instanceof Error ? error : new Error(String(error)),
                    }));
                }
            }
        };

        setup();

        return () => {
            mounted = false;
            if (cleanupRef.current) {
                cleanupRef.current();
            }
        };
    }, [roomName]);

    return state;
}
