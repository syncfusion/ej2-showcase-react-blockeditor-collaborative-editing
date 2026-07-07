import { useEffect, useState } from 'react';
import { getOrCreateRoomId, getRoomIdFromHash } from '../utils/roomIdGenerator';

/**
 * Custom hook for room ID management
 */
export function useRoomId(): {
    roomId: string;
    setRoomId: (roomId: string) => void;
} {
    const [roomId, setRoomIdState] = useState<string>(() => {
        return getOrCreateRoomId();
    });

    const setRoomId = (newRoomId: string) => {
        setRoomIdState(newRoomId);
        window.location.hash = newRoomId;
    };

    useEffect(() => {
        const handleHashChange = () => {
            const hashRoomId = getRoomIdFromHash();
            if (hashRoomId && hashRoomId !== roomId) {
                setRoomIdState(hashRoomId);
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [roomId]);

    return { roomId, setRoomId };
}
