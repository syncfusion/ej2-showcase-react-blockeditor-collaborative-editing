import React from "react";
import { BlockEditorComponent, Collaboration, Inject, VersionHistory } from "@syncfusion/ej2-react-blockeditor";
import type { BlockEditorModel, ImageBlockSettingsModel, InlineToolbarSettingsModel } from "@syncfusion/ej2-react-blockeditor";

interface SyncfusionBlockEditorProps extends BlockEditorModel {
    id?: string;
    className?: string;
    inlineToolbarSettings?: InlineToolbarSettingsModel;
    imageBlockSettings?: ImageBlockSettingsModel;
}

/**
 * Wrapped Syncfusion Blockeditor component
 */
export const SyncfusionBlockEditor = React.forwardRef<
    BlockEditorComponent,
    SyncfusionBlockEditorProps
>(
    (
        {
            id = "block-editor",
            blocks = [],
            users,
            currentUserId,
            collaborationSettings,
            blockChanged,
            className,
            height,
            width,
            created,
            inlineToolbarSettings,
            imageBlockSettings
        },
        ref,
    ) => {
        return (
            <BlockEditorComponent
                height={height}
                width={width}
                ref={ref}
                id={id}
                blocks={blocks}
                users={users}
                currentUserId={currentUserId}
                collaborationSettings={collaborationSettings}
                blockChanged={blockChanged}
                className={className}
                created={created}
                inlineToolbarSettings={inlineToolbarSettings}
                imageBlockSettings={imageBlockSettings}
            >
                <Inject services={[Collaboration, VersionHistory]} />
            </BlockEditorComponent>
        );
    },
);

SyncfusionBlockEditor.displayName = "SyncfusionBlockEditor";
