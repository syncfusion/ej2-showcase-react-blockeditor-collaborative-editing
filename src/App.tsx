import React, { useMemo, useRef, useMemo as useMemoCompute, useState } from "react";
import type {
    BlockEditorComponent,
    CollaborationSettingsModel,
    IVersionHistory,
    ImageBlockSettingsModel,
    InlineToolbarSettingsModel,
} from "@syncfusion/ej2-react-blockeditor";
import { Header } from "./components/Header/Header";
import { Hero } from "./components/Hero/Hero";
import { EditorWorkspace } from "./components/EditorWorkspace/EditorWorkspace";
import { useRoomId } from "./hooks/useRoomId";
import { useCollaboration } from "./hooks/useCollaboration";
import { useAwareness } from "./hooks/useAwareness";
import { useVersionHistory } from "./hooks/useVersionHistory";
import { getCurrentUser } from "./services/userService";
import { getDefaultBlocks } from "./services/editorService";
import "./styles/globals.css";
import "./App.css";
import { IndexedDBVersionStorage } from "./services/versionHistoryService";
import { LoadingSpinner } from "./components/common/LoadingSpinner";

/**
 * Main App component
 */
function App(): React.ReactElement {
    // Setup hooks
    const { roomId } = useRoomId();
    const {
        provider,
        adapter,
        isConnected,
        isSynced,
    } = useCollaboration(roomId);
    const editorRef = useRef<BlockEditorComponent>(null);

    const currentUserInitial = useMemo(() => getCurrentUser(), []);
    const [currentUser] = React.useState(currentUserInitial);
    const { collaborators } = useAwareness(provider, currentUser);
    const [versionPlugin, setVersionPlugin] = useState<IVersionHistory | null>(null);

    const storage = useMemo(() => {
        return new IndexedDBVersionStorage(`blockeditor-versions-${roomId}`);
    }, [roomId]);

    const {
        snapshots,
        isLoading: snapshotsLoading,
        refreshSnapshots,
        restoreSnapshot,
        deleteSnapshot,
        renameSnapshot,
        clearAllSnapshots,
    } = useVersionHistory(versionPlugin, storage);

    const defaultBlocks = useMemo(() => getDefaultBlocks(), []);

    // Inline toolbar settings for the block editor
    const customToolbarItems: string[] = [
        'Transform', 'Bold', 'Italic', 'Underline', 'Strikethrough', 'Uppercase', 'Lowercase', 'Subscript', 'Superscript', 'InlineCode', 'Link', 'Color', 'Backgroundcolor'
    ];
    const inlineToolbarSettings: InlineToolbarSettingsModel = useMemo(() => ({
        items: customToolbarItems,
    }), []);

    // Image block settings for the block editor
    const imageBlockSettings: ImageBlockSettingsModel = useMemo(() => ({
        saveUrl: 'https://services.syncfusion.com/react/production/api/RichTextEditor/SaveFile',
        path: 'https://services.syncfusion.com/react/production/RichTextEditor/'
    }), []);

    // Build collaboration settings
    const collaborationSettings = useMemoCompute(() => {
        if (!provider || !adapter || !storage) {
            return null;
        }

        const settings: CollaborationSettingsModel = {
            provider: provider,
            adapter: {
                yRuntime: adapter.yRuntime,
                yXmlFragment: adapter.yXmlFragment,
            },
            enableAwareness: true,
            versionHistory: {
                storage: storage,
                snapshotInterval: 3000, // 3 seconds debounce
                snapshotCreated: () => {
                    refreshSnapshots();
                },
                snapshotRestored: () => {
                    refreshSnapshots();
                },
            },
        };

        return settings;
    }, [provider, adapter, storage, currentUser.id, refreshSnapshots]);

    return (
        <div className="app">
            <Header />
            <Hero />
            {provider && adapter && collaborationSettings && isSynced ? (
                <EditorWorkspace
                    editorRef={editorRef}
                    roomId={roomId}
                    isConnected={isConnected}
                    currentUser={currentUser}
                    collaborators={collaborators}
                    blocks={defaultBlocks}
                    collaborationSettings={collaborationSettings}
                    snapshots={snapshots}
                    snapshotsLoading={snapshotsLoading}
                    onRestoreSnapshot={restoreSnapshot}
                    onDeleteSnapshot={deleteSnapshot}
                    onRenameSnapshot={renameSnapshot}
                    onClearAllSnapshots={clearAllSnapshots}
                    inlineToolbarSettings={inlineToolbarSettings}
                    imageBlockSettings={imageBlockSettings}
                    onCreated={() => {
                        const plugin =
                            editorRef.current?.getVersionHistory();
                        if (plugin) {
                            setVersionPlugin(plugin);
                        }
                    }}
                />
            ) : (
                <div className="loading-container">
                    <LoadingSpinner text="Initializing collaboration..."/>
                </div>
            )}
        </div>
    );
}

export default App;
