import React, { useState } from 'react';
import type {
    UserModel,
    VersionSnapshot,
    BlockEditorComponent,
    BlockModel,
    CollaborationSettingsModel,
    InlineToolbarSettingsModel,
    ImageBlockSettingsModel,
} from '@syncfusion/ej2-react-blockeditor';
import { EditorContainer } from './EditorContainer';
import { SidebarContent } from './SidebarContent';
import { SyncfusionSidebar } from '../syncfusion/SyncfusionSidebar';
import './EditorWorkspace.css';

interface EditorWorkspaceProps {
    editorRef: React.RefObject<BlockEditorComponent | null>;
    roomId: string;
    isConnected: boolean;
    currentUser: UserModel;
    collaborators: UserModel[];
    blocks: BlockModel[];
    collaborationSettings: CollaborationSettingsModel;
    snapshots: VersionSnapshot[];
    snapshotsLoading: boolean;
    onRestoreSnapshot: (snapshotId: string) => Promise<void>;
    onDeleteSnapshot: (snapshotId: string) => Promise<void>;
    onRenameSnapshot: (snapshotId: string, newLabel: string) => Promise<void>;
    onClearAllSnapshots: () => Promise<void>;
    inlineToolbarSettings: InlineToolbarSettingsModel;
    imageBlockSettings: ImageBlockSettingsModel;
    onCreated: () => void;
}

/**
 * Main editor workspace component
 */
export const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({
    editorRef,
    roomId,
    isConnected,
    currentUser,
    collaborators,
    blocks,
    collaborationSettings,
    snapshots,
    snapshotsLoading,
    onRestoreSnapshot,
    onDeleteSnapshot,
    onRenameSnapshot,
    onClearAllSnapshots,
    inlineToolbarSettings,
    imageBlockSettings,
    onCreated
}) => {
    const [activePanel, setActivePanel] = useState<'collab' | 'versions' | null>(null);

    const handleTogglePanel = (panel: 'collab' | 'versions') => {
        // If same panel is open, close it. Otherwise, open the selected panel
        setActivePanel(activePanel === panel ? null : panel);
    };

    const handleClosePanel = () => {
        setActivePanel(null);
    };

    const collaboratorCount = collaborators.length + 1; // +1 for current user

    return (
        <section className="editor-workspace">
            <div>
                <EditorContainer
                    editorRef={editorRef}
                    blocks={blocks}
                    users={[currentUser, ...collaborators]}
                    currentUserId={currentUser.id}
                    collaborationSettings={collaborationSettings}
                    collaboratorCount={collaboratorCount}
                    activePanel={activePanel}
                    roomId={roomId}
                    isConnected={isConnected}
                    onPanelToggle={handleTogglePanel}
                    inlineToolbarSettings={inlineToolbarSettings}
                    imageBlockSettings={imageBlockSettings}
                    onCreated={onCreated}
                />

                {/* Syncfusion Sidebar with unified content */}
                <SyncfusionSidebar
                    target={editorRef?.current?.element?.parentElement || undefined}
                    showBackdrop={false}
                    isOpen={activePanel !== null}
                    position='Right'
                    onSidebarClose={handleClosePanel}
                >
                    {activePanel && (
                        <SidebarContent
                            mode={activePanel === 'collab' ? 'collaborators' : 'versions'}
                            collaborators={collaborators}
                            currentUser={currentUser}
                            editorRef={editorRef}
                            snapshots={snapshots}
                            isLoading={snapshotsLoading}
                            onClose={handleClosePanel}
                            onRestore={onRestoreSnapshot}
                            onDelete={onDeleteSnapshot}
                            onRename={onRenameSnapshot}
                            onClearAll={onClearAllSnapshots}
                        />
                    )}
                </SyncfusionSidebar>
            </div>
        </section>
    );
};
