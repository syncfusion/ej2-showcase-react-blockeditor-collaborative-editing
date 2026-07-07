import React, { useCallback, useMemo } from "react";
import { SyncfusionBlockEditor } from "../syncfusion/SyncfusionBlockEditor";
import type {
    BlockEditorComponent,
    BlockEditorModel,
    ImageBlockSettingsModel,
    InlineToolbarSettingsModel,
} from "@syncfusion/ej2-react-blockeditor";
import "./EditorContainer.css";
import { DropDownButtonComponent } from "@syncfusion/ej2-react-splitbuttons";
import { ToolbarComponent, ItemsDirective, ItemDirective } from "@syncfusion/ej2-react-navigations";
import { ExportOption } from "../Toolbar/ExportOption";
import { ToggleOption } from "../Toolbar/ToggleOption";
import { CollaborationOption } from "../Toolbar/CollaborationOption";
import { SyncfusionButton } from "../syncfusion/SyncfusionButton";
import { ConnectionStatus } from "../common/ConnectionStatus";
import turndownService from '../../services/turndownService';

interface EditorContainerProps extends BlockEditorModel {
    editorRef: React.RefObject<BlockEditorComponent | null>;
    collaboratorCount?: number;
    activePanel?: 'collab' | 'versions' | null;
    roomId: string;
    isConnected: boolean;
    onPanelToggle?: (panel: 'collab' | 'versions') => void;
    inlineToolbarSettings: InlineToolbarSettingsModel;
    imageBlockSettings: ImageBlockSettingsModel;
    onCreated: () => void;
}

/**
 * Editor container component with Syncfusion Blockeditor
 */
export const EditorContainer: React.FC<EditorContainerProps> = ({
    editorRef,
    blocks,
    users,
    currentUserId,
    collaborationSettings,
    roomId,
    isConnected,
    collaboratorCount = 0,
    onPanelToggle,
    inlineToolbarSettings,
    imageBlockSettings,
    onCreated
}) => {

    const exportDropdownRef = React.useRef<DropDownButtonComponent>(null);
    const panelDropdownRef = React.useRef<DropDownButtonComponent>(null);

    // Memoize export menu items to prevent re-renders
    const exportMenuItems = useMemo(() => [
        { text: 'Export as JSON', id: 'export-json', iconCss: 'e-icons e-download' },
        { text: 'Export as HTML', id: 'export-html', iconCss: 'e-icons e-download' },
        { text: 'Export as Markdown', id: 'export-markdown', iconCss: 'e-icons e-download' },
    ], []);

    // Memoize panel menu items to prevent re-renders
    const panelMenuItems = useMemo(() => [
        { text: 'Active Collaborators', id: 'show-collaborators', iconCss: 'e-icons e-people' },
        { text: 'Version History', id: 'show-versions', iconCss: 'e-icons e-history' },
    ], []);

    const handleExport = useCallback((args: any) => {
        if (!editorRef.current) {
            return;
        }

        const selected = args.item.text.toLowerCase();
        const format = selected.includes('json') ? 'json' : (selected.includes('markdown') ? 'markdown' : 'html');

        try {
            if (format === 'json') {
                const data = editorRef.current.getDataAsJson();
                const blob = new Blob([JSON.stringify(data, null, 2)], {
                    type: 'application/json',
                });
                downloadFile(blob, `editor-${Date.now()}.json`);
            } else if (format === 'html') {
                const data = editorRef.current.getDataAsHtml();
                const blob = new Blob([data], { type: 'text/html' });
                downloadFile(blob, `editor-${Date.now()}.html`);
            } else if (format === 'markdown') {
                const htmlContent = editorRef.current.getDataAsHtml();
                const markdownContent = turndownService.turndown(htmlContent || '');
                const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
                downloadFile(blob, `editor-${Date.now()}.md`);
            }
        } catch (error) {
            console.error('Export failed:', error);
        }
    }, [editorRef]);

    const handlePanelToggle = useCallback((args: any) => {
        const action = args.item.id;
        if (onPanelToggle) {
            if (action === 'show-collaborators') {
                onPanelToggle('collab');
            } else if (action === 'show-versions') {
                onPanelToggle('versions');
            }
        }
    }, [onPanelToggle]);

    const renderLeftToolbar = useCallback(() => {
        return (
            <div className="collaboration-toolbar-wrapper">
                <div className="toolbar-section-left">
                    <CollaborationOption
                        roomId={roomId}
                        isConnected={isConnected}
                        editorRef={editorRef}
                    />
                </div>
                <div className="toolbar-section-right">
                    <ConnectionStatus isConnected={isConnected} />
                </div>
            </div>
        );
    }, [roomId, isConnected]);

    const renderRightToolbar = useCallback(() => {
        return (
            <div className="toolbar-right">
                <SyncfusionButton iconCss="e-icons e-people" cssClass="e-small e-info">
                    {collaboratorCount}{" "}

                    {collaboratorCount === 1
                        ? "person"
                        : "people"}
                </SyncfusionButton>
                <ExportOption
                    exportDropdownRef={exportDropdownRef}
                    exportMenuItems={exportMenuItems}
                    handleExport={handleExport}
                />
                <ToggleOption
                    panelDropdownRef={panelDropdownRef}
                    panelMenuItems={panelMenuItems}
                    handlePanelToggle={handlePanelToggle}
                />
            </div>
        );
    }, [
        collaboratorCount,
        panelMenuItems
    ]);

    return (
        <div className="editor-container">
            <div className="toolbar-area">
                <ToolbarComponent cssClass="editor-toolbar">
                    <ItemsDirective>
                        <ItemDirective
                            type="Input"
                            template={renderLeftToolbar}
                            align="Left"
                        />
                        <ItemDirective
                            type="Input"
                            template={renderRightToolbar}
                            align="Right"
                        />
                    </ItemsDirective>
                </ToolbarComponent>
            </div>

            <div className="editor-area">
                <SyncfusionBlockEditor
                    ref={editorRef}
                    id="block-editor"
                    height='600px'
                    width='auto'
                    blocks={blocks}
                    users={users}
                    currentUserId={currentUserId}
                    collaborationSettings={collaborationSettings}
                    created={onCreated}
                    inlineToolbarSettings={inlineToolbarSettings}
                    imageBlockSettings={imageBlockSettings}
                />
            </div>
        </div>
    );
};

/**
 * Helper function to download file
 */
function downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}