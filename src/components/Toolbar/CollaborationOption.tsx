import React, { useCallback, useMemo } from 'react';
import type { BlockEditorComponent } from '@syncfusion/ej2-react-blockeditor';
import { copyToClipboard } from '../../utils/urlHelpers';
import { getCollaborationUrl } from '../../utils/urlHelpers';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import './CollaborationOption.css';

interface CollaborationOptionProps {
    roomId: string;
    isConnected: boolean;
    editorRef: React.RefObject<BlockEditorComponent | null>;
}

/**
 * Collaboration toolbar component with room URL and controls
 * Uses Syncfusion Toolbar for professional appearance
 */
export const CollaborationOption: React.FC<CollaborationOptionProps> = ({
    roomId,
}) => {
    const [copied, setCopied] = React.useState(false);

    const collaborationUrl = useMemo(() => getCollaborationUrl(roomId), [roomId]);

    const handleCopyLink = useCallback(async () => {
        try {
            await copyToClipboard(collaborationUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy link:', error);
        }
    }, [collaborationUrl]);

    return (
        <>
            <label htmlFor='collab-url' className="toolbar-label">⚡ Share Collaboration URL</label>
            <div className="room-url-container">
                <TextBoxComponent
                    id='collab-url'
                    type="text"
                    width="320px"
                    readOnly={true}
                    cssClass="e-small"
                    value={collaborationUrl}
                    aria-label="Collaboration room URL"
                />
                <ButtonComponent
                    cssClass="copy-button e-small"
                    onClick={handleCopyLink}
                    title="Copy collaboration link"
                    aria-label="Copy collaboration link"
                    iconCss={`e-icons ${copied ? "e-check" : "e-copy"}`}
                />
            </div>
        </>
    );
};
