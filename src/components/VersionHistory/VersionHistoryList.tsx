import React, { useMemo, useCallback, useState } from 'react';
import type { BlockEditorComponent, VersionSnapshot, UserModel } from '@syncfusion/ej2-react-blockeditor';
import { SyncfusionListView } from '../syncfusion/SyncfusionListView';
import { DropDownButtonComponent, type MenuEventArgs } from '@syncfusion/ej2-react-splitbuttons';
import './VersionHistoryList.css';
import type { FieldSettingsModel } from '@syncfusion/ej2-react-lists';
import { LabelRenameModal } from './LabelRenameModal';

interface VersionHistoryItem {
    id: string;
    headerText: string;
    label: string;
    isAutoLabel: boolean;
    timestamp: string;
    userName: string;
    lastModifiedBy: string;
    lastModifiedAt: number;
    dateGroup: string;
}

interface VersionHistoryListProps {
    editorRef: React.RefObject<BlockEditorComponent | null>;
    snapshots: VersionSnapshot[];
    isLoading: boolean;
    onRestore: (snapshotId: string) => Promise<void>;
    onDelete: (snapshotId: string) => Promise<void>;
    onRename: (snapshotId: string, newLabel: string) => Promise<void>;
}

/**
 * Version History List component using Syncfusion ListView
 * Displays version snapshots with actions for restore, rename, and delete
 */
export const VersionHistoryList: React.FC<VersionHistoryListProps> = ({
    editorRef,
    snapshots,
    isLoading,
    onRestore,
    onDelete,
    onRename,
}) => {

    const [renamingId, setRenamingId] = useState<string | null>(null);
    const [newLabel, setNewLabel] = useState('');
    const [showRenameDialog, setShowRenameDialog] = useState(false);

    /**
     * Get date group label (Today, Yesterday, etc.)
     */
    const getDateGroup = useCallback((timestamp: number): string => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const dateString = date.toDateString();
        const todayString = today.toDateString();
        const yesterdayString = yesterday.toDateString();

        if (dateString === todayString) return 'Today';
        if (dateString === yesterdayString) return 'Yesterday';

        // Check if within last 7 days
        const diffTime = today.getTime() - date.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays < 7) return 'This Week';
        if (diffDays < 30) return 'This Month';

        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
    }, []);

    /**
     * Format timestamp to readable string
     */
    const formatTimestamp = useCallback((timestamp: number): string => {
        return new Date(timestamp).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, []);

    /**
     * Get user name from users array using userId
     */
    const getUserName = useCallback((userId: string): string => {
        if (!editorRef.current?.users) return 'Unknown';
        const foundUser = editorRef.current.users.find(
            (user: UserModel) => user.id === userId
        );
        return foundUser ? (foundUser.user as string) : 'Unknown';
    }, [editorRef]);

    /**
     * Transform snapshots to ListView items
     */
    const listViewData = useMemo((): VersionHistoryItem[] => {
        return snapshots.map((snapshot) => ({
            id: snapshot.id,
            headerText: snapshot.label || formatTimestamp(snapshot.lastModifiedAt),
            label: snapshot.label || '',
            isAutoLabel: !snapshot.label,
            timestamp: formatTimestamp(snapshot.lastModifiedAt),
            userName: getUserName(snapshot.lastModifiedBy),
            lastModifiedBy: snapshot.lastModifiedBy,
            lastModifiedAt: snapshot.lastModifiedAt,
            dateGroup: getDateGroup(snapshot.lastModifiedAt),
        }));
    }, [snapshots, formatTimestamp, getUserName, getDateGroup]);

    /**
     * Define ListView field mappings with grouping
     */
    const fields: FieldSettingsModel = {
        id: 'id',
        text: 'headerText',
        groupBy: 'dateGroup',
    };

    /**
     * Handle dropdown menu action
     */
    const handleMenuAction = useCallback(
        async (snapshotId: string, action: string) => {
            switch (action) {
                case 'restore':
                    await onRestore(snapshotId);
                    break;
                case 'rename':
                    setRenamingId(snapshotId);
                    setShowRenameDialog(true);
                    break;
                case 'delete':
                    if (window.confirm('Are you sure you want to delete this version? This action cannot be undone.')) {
                        await onDelete(snapshotId);
                    }
                    break;
                default:
                    break;
            }
        },
        [snapshots, onRestore, onDelete]
    );

    /**
     * Custom group template for date grouping
     */
    const groupTemplate = useCallback((data: any) => {
        return (
            <div className="e-list-group-header">
                <span className="group-title">{data.headerText}</span>
            </div>
        );
    }, []);

    /**
     * Custom item template for version history
     */
    const itemTemplate = useCallback((data: VersionHistoryItem) => {
        // Menu items for dropdown
        const menuItems = [
            { text: 'Restore', id: 'restore', iconCss: 'e-icons e-redo' },
            { text: 'Rename', id: 'rename', iconCss: 'e-icons e-edit' },
            { separator: true },
            {
                text: 'Delete',
                id: 'delete',
                iconCss: 'e-icons e-trash',
                cssClass: 'e-danger',
            },
        ];

        return (
            <div className="e-list-wrapper version-item-wrapper">
                <div className="version-content">
                    <div className="version-label">
                        <h4 className="version-title"> {data.headerText} </h4>
                        {data.isAutoLabel && <span className="auto-badge">[auto]</span>}
                    </div>
                    <p className="version-meta">
                        {data.userName} {data.label && ` · ${data.timestamp}`}
                    </p>
                </div>
                <div className="version-actions">
                    <DropDownButtonComponent
                        items={menuItems}
                        select={(args: MenuEventArgs) => {
                            handleMenuAction(data.id, (args.item.id as string));
                        }}
                        cssClass="e-caret-hide e-small e-flat"
                        iconCss="e-icons e-more-vertical-2"
                        title="More actions"
                        aria-label="More actions"
                    />
                </div>
            </div>
        );
    }, []);

    /* Rename Dialog handlings */

    // const handleStartRename = useCallback((snapshotId: string) => {
    //     const snapshot = snapshots.find((s) => s.id === snapshotId);
    //     if (!snapshot) {
    //         return;
    //     }

    //     setRenamingId(snapshotId);
    //     setNewLabel(snapshot.label || '');
    //     setShowRenameDialog(true);
    // }, [snapshots]);

    const handleRenameSave = useCallback(async () => {
        if (renamingId && newLabel.trim() !== '') {
            await onRename(renamingId, newLabel);
        }
        setShowRenameDialog(false);
        setRenamingId(null);
        setNewLabel('');
    }, [renamingId, newLabel, onRename]);

    const handleRenameCancel = useCallback(() => {
        setShowRenameDialog(false);
        setRenamingId(null);
        setNewLabel('');
    }, []);

    // const handleRenameDialogClose = useCallback(() => {
    //     setShowRenameDialog(false);
    // }, []);

    return (
        <>
            <SyncfusionListView
                id="version-history-list"
                dataSource={listViewData}
                fields={fields}
                template={itemTemplate}
                groupTemplate={groupTemplate}
                showHeader={false}
                isLoading={isLoading}
                emptyMessage="No versions yet. Create a snapshot to save your work."
                cssClass="e-list-template"
            />

            <LabelRenameModal
                visible={showRenameDialog}
                value={newLabel}
                onChange={setNewLabel}
                onSave={handleRenameSave}
                onCancel={handleRenameCancel}
            />
        </>
    );
};
