import { useEffect, useState, useRef } from 'react';
import { WebsocketProvider } from 'y-websocket';
import type { UserModel } from '@syncfusion/ej2-react-blockeditor';

interface UseAwarenessReturn {
    collaborators: UserModel[];
    updateAwareness: (state: any) => void;
}

export interface AwarenessState {
    user?: UserModel;
    cursor?: any;
}

/**
 * Custom hook for awareness tracking (active collaborators)
 */
export function useAwareness(
    provider: WebsocketProvider | null,
    currentUser: UserModel
): UseAwarenessReturn {
    const [collaborators, setCollaborators] = useState<UserModel[]>([]);
    const awarenessRef = useRef<any>(null);

    useEffect(() => {
        if (!provider) return;

        const awareness = provider.awareness;
        awarenessRef.current = awareness;

        const user: UserModel = {
            id: currentUser.id,
            user: currentUser.user,
            avatarBgColor: currentUser.avatarBgColor,
        }
        // Set local awareness state
        awareness.setLocalState({ user });

        // Handle awareness changes
        const handleChange = () => {
            const states = awareness.getStates() as Map<number, AwarenessState>;
            const collaboratorList: UserModel[] = [];

            states.forEach((state: AwarenessState) => {
                if (state?.user && state.user.id !== currentUser.id) {
                    collaboratorList.push(state.user);
                }
            });

            setCollaborators(collaboratorList);
        };

        awareness.on('change', handleChange);

        // Initial call
        handleChange();

        return () => {
            awareness.off('change', handleChange);
        };
    }, [provider, currentUser]);

    const updateAwareness = (state: any) => {
        if (awarenessRef.current) {
            awarenessRef.current.setLocalState(state);
        }
    };

    return { collaborators, updateAwareness };
}
