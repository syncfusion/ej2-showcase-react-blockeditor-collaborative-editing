import { useEffect, useState, useCallback } from 'react';
import type  { IVersionStorage, VersionSnapshot, IVersionHistory } from '@syncfusion/ej2-react-blockeditor';
import { IndexedDBVersionStorage } from '../services/versionHistoryService';

interface UseVersionHistoryReturn {
    storage: IVersionStorage;
    snapshots: VersionSnapshot[];
    isLoading: boolean;
    error: Error | null;
    refreshSnapshots: () => Promise<void>;
    createSnapshot: (
        label: string,
        lastModifiedBy: string
    ) => Promise<void>;
    restoreSnapshot: (snapshotId: string) => Promise<void>;
    deleteSnapshot: (snapshotId: string) => Promise<void>;
    renameSnapshot: (
        snapshotId: string,
        newLabel: string
    ) => Promise<void>;
    clearAllSnapshots: () => Promise<void>;
}

export function useVersionHistory(
    versionHistory: IVersionHistory | null,
    storage: IndexedDBVersionStorage
): UseVersionHistoryReturn {

    const [snapshots, setSnapshots] = useState<VersionSnapshot[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const refreshSnapshots = useCallback(async () => {
        if (!versionHistory || !storage) {
            return;
        }

        try {
            setIsLoading(true);

            const snapshots = versionHistory.getSnapshots();

            setSnapshots(snapshots);

            setError(null);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error(String(err))
            );
        } finally {
            setIsLoading(false);
        }
    }, [versionHistory]);

    useEffect(() => {
        refreshSnapshots();
    }, [refreshSnapshots]);

    const createSnapshot = useCallback(
        async (
            label: string,
            lastModifiedBy: string
        ) => {
            if (!versionHistory) {
                return;
            }

            try {
                setIsLoading(true);

                await versionHistory.createSnapshot({
                    label,
                    modifiedBy: lastModifiedBy
                });

                await refreshSnapshots();
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error(String(err))
                );
            } finally {
                setIsLoading(false);
            }
        },
        [versionHistory, refreshSnapshots]
    );

    const restoreSnapshot = useCallback(
        async (snapshotId: string) => {
            if (!versionHistory) {
                return;
            }

            try {
                setIsLoading(true);

                await versionHistory.restoreSnapshot(snapshotId);

                await refreshSnapshots();
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error(String(err))
                );
            } finally {
                setIsLoading(false);
            }
        },
        [versionHistory, refreshSnapshots]
    );

    const deleteSnapshot = useCallback(
        async (snapshotId: string) => {
            if (!versionHistory) {
                return;
            }

            try {
                setIsLoading(true);

                await versionHistory.deleteSnapshot(snapshotId);

                await refreshSnapshots();
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error(String(err))
                );
            } finally {
                setIsLoading(false);
            }
        },
        [versionHistory, refreshSnapshots]
    );

    const renameSnapshot = useCallback(
        async (
            snapshotId: string,
            newLabel: string
        ) => {
            if (!versionHistory) {
                return;
            }

            try {
                setIsLoading(true);

                await versionHistory.renameSnapshot(
                    snapshotId,
                    newLabel
                );

                await refreshSnapshots();
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error(String(err))
                );
            } finally {
                setIsLoading(false);
            }
        },
        [versionHistory, refreshSnapshots]
    );

    const clearAllSnapshots = useCallback(
        async () => {
            try {
                setIsLoading(true);

                // Delete all snapshots from storage and version plugin
                for (const snapshot of snapshots) {
                    try {
                        if (versionHistory) {
                            await versionHistory.deleteSnapshot(snapshot.id);
                        }
                    } catch (err) {
                        console.warn(`Failed to delete snapshot ${snapshot.id}:`, err);
                    }
                }

                // Clear storage
                await storage.clearAll();

                // Refresh snapshots list
                setSnapshots([]);

                setError(null);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err
                        : new Error(String(err))
                );
            } finally {
                setIsLoading(false);
            }
        },
        [versionHistory, snapshots, storage]
    );

    return {
        storage,
        snapshots,
        isLoading,
        error,
        refreshSnapshots,
        createSnapshot,
        restoreSnapshot,
        deleteSnapshot,
        renameSnapshot,
        clearAllSnapshots
    };
}