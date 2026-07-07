import React, { useState, useCallback } from 'react';
import type { BlockEditorComponent, UserModel, VersionSnapshot } from '@syncfusion/ej2-react-blockeditor';
import { VersionHistoryList } from '../VersionHistory/VersionHistoryList';
import { CollabPanel } from '../ActiveCollabPanel/CollabPanel';
import './SidebarContent.css';
import { SyncfusionButton } from '../syncfusion/SyncfusionButton';

type SidebarMode = 'collaborators' | 'versions';

interface SidebarContentProps {
    mode: SidebarMode;
    editorRef: React.RefObject<BlockEditorComponent | null>;
    collaborators: UserModel[];
    currentUser: UserModel;
    snapshots: VersionSnapshot[];
    isLoading: boolean;
    onClose?: () => void;
    onRestore: (snapshotId: string) => Promise<void>;
    onDelete: (snapshotId: string) => Promise<void>;
    onRename: (snapshotId: string, newLabel: string) => Promise<void>;
    onClearAll: () => Promise<void>;
}

/**
 * Unified sidebar content component
 * Renders either Version History or Active Collaborators based on mode
 * Uses Syncfusion ListView for both content types
 */
export const SidebarContent: React.FC<SidebarContentProps> = ({
    mode,
    editorRef,
    collaborators,
    currentUser,
    snapshots,
    isLoading,
    onClose,
    onRestore,
    onDelete,
    onRename,
    onClearAll,
}) => {
    const [isClearing, setIsClearing] = useState(false);

    const handleClearAll = useCallback(async () => {
        if (snapshots.length === 0) {
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete all ${snapshots.length} snapshot(s)? This action cannot be undone.`
        );

        if (confirmed) {
            try {
                setIsClearing(true);
                await onClearAll();
            } catch (err) {
                console.error('Failed to clear all snapshots:', err);
            } finally {
                setIsClearing(false);
            }
        }
    }, [snapshots, onClearAll]);

    // Get header title based on mode
    const getHeaderTitle = () => {
        return mode === 'collaborators' ? 'Active Collaborators' : 'Version History';
    };

    // Get header actions based on mode
    const renderHeaderActions = () => {
        if (mode === 'versions' && snapshots.length > 0) {
            return (
                <SyncfusionButton
                    cssClass="e-small"
                    clicked={handleClearAll}
                    disabled={isClearing || isLoading}
                    title="Delete all snapshots"
                    aria-label="Clear all snapshots"
                >
                    Delete All
                </SyncfusionButton>
            );
        }
        return null;
    };

    return (
        <div className="sidebar-content-wrapper">
            {/* Unified Header */}
            <div className="sidebar-header">
                <h3 className="sidebar-title">{getHeaderTitle()}</h3>
                <div className="sidebar-header-actions">
                    {renderHeaderActions()}
                    {onClose && (
                        <SyncfusionButton
                            cssClass="e-small"
                            clicked={onClose}
                            aria-label="Close sidebar"
                            title="Close"
                        >
                            ×
                        </SyncfusionButton>
                    )}
                </div>
            </div>

            {/* Mode-specific Content using Syncfusion ListView */}
            <div className="sidebar-content">
                {mode === 'collaborators' ? (
                    <CollabPanel
                        collaborators={collaborators}
                        currentUser={currentUser}
                    />
                ) : (
                    <VersionHistoryList
                        editorRef={editorRef}
                        snapshots={snapshots}
                        isLoading={isLoading}
                        onRestore={onRestore}
                        onDelete={onDelete}
                        onRename={onRename}
                    />
                )}
            </div>
        </div>
    );
};
