import React, { useCallback, useMemo } from 'react';
import type { UserModel } from '@syncfusion/ej2-react-blockeditor';
import { SyncfusionListView } from '../syncfusion/SyncfusionListView';
import type { FieldSettingsModel } from '@syncfusion/ej2-react-lists';
import './CollabPanel.css';

interface ListViewItem {
    id: string;
    headerText: string;
    contentText: string;
    avatarText: string;
    avatarColor: string;
}

interface CollabPanelProps {
    collaborators: UserModel[];
    currentUser: UserModel;
}

/**
 * Active collaborators panel component
 * Uses Syncfusion ListView for rendering collaborators list
 */
export const CollabPanel: React.FC<CollabPanelProps> = ({
    collaborators,
    currentUser,
}) => {
    const getInitials = useCallback((name: string | undefined) => {
        if (!name) return ''
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }, []);

    // Transform user data to ListView items
    const listViewData = useMemo(() => {
        const allUsers = [currentUser, ...collaborators];
        return allUsers.map((user) => ({
            id: user.id,
            headerText: user.id === currentUser.id ? `${user.user} (You)` : user.user,
            contentText: 'Active',
            avatarText: getInitials(user.user),
            avatarColor: user.avatarBgColor,
        } as ListViewItem));
    }, [currentUser, collaborators]);

    // Define ListView field mappings
    const fields: FieldSettingsModel = {
        id: 'id',
        text: 'headerText',
    };

    const itemTemplate = useCallback((data: ListViewItem) => {
        return (
            <div className="e-list-wrapper collaborator-item">
                <span
                    className="e-avatar e-avatar-circle e-avatar-small"
                    style={{
                        backgroundColor: data.avatarColor || '#185fa5',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 500,
                    }}
                >
                    {data.avatarText}
                </span>
                <div className='collaborator-info'>
                    <span className="e-list-item-header">{data.headerText}</span>
                </div>
            </div>
        );
    }, []);

    return (
        <div className="collab-panel">
            <div className="collaborators-list">
                <SyncfusionListView
                    id="collab-list"
                    dataSource={listViewData}
                    fields={fields}
                    template={itemTemplate}
                    showHeader={false}
                    emptyMessage="No collaborators yet"
                    cssClass="e-list-template"
                />
            </div>
        </div>
    );
};
