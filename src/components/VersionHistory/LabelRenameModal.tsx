import React, { useCallback } from 'react';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import {
    TextBoxComponent,
    type ChangedEventArgs
} from '@syncfusion/ej2-react-inputs';

import './LabelRenameModal.css';

interface LabelRenameModalProps {

    /**
     * Whether dialog is visible
     */
    visible: boolean;

    /**
     * Current label value
     */
    value: string;

    /**
     * Dialog title
     */
    title?: string;

    /**
     * Value change callback
     */
    onChange: (value: string) => void;

    /**
     * Save callback
     */
    onSave: () => void | Promise<void>;

    /**
     * Cancel callback
     */
    onCancel: () => void;
}

/**
 * Lightweight rename modal dialog component.
 */
export const LabelRenameModal: React.FC<
    LabelRenameModalProps
> = ({
    visible,
    value,
    title = 'Rename Snapshot',
    onChange,
    onSave,
    onCancel,
}) => {
        const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
            if (
                e.key === 'Enter' &&
                value.trim()
            ) {
                onSave();
            }

            if (e.key === 'Escape') {
                onCancel();
            }

        },
            [value, onSave, onCancel]
        );

        if (!visible) {
            return null;
        }

        return (
            <div className="rename-dialog-overlay">

                <div
                    className="rename-dialog"
                    role="dialog"
                    aria-modal="true"
                >

                    <div className="rename-dialog-header">

                        <span>{title}</span>

                        <ButtonComponent
                            cssClass='e-small'
                            onClick={onCancel}
                            aria-label="Close"
                            type="button"
                        >
                            ×
                        </ButtonComponent>

                    </div>

                    <div className="rename-dialog-body">

                        <TextBoxComponent
                            type="text"
                            value={value}
                            change={(
                                e: ChangedEventArgs
                            ) => {
                                onChange(
                                    e.value || ''
                                );
                            }}
                            placeholder="Enter snapshot label"
                            cssClass="rename-input-field"
                            input={handleKeyDown as any}
                        />

                    </div>

                    <div className="rename-dialog-footer">

                        <ButtonComponent
                        cssClass='e-small'
                            onClick={onCancel}
                        >
                            Cancel
                        </ButtonComponent>

                        <ButtonComponent
                        cssClass='e-small'
                            isPrimary={true}
                            onClick={onSave}
                        >
                            Save
                        </ButtonComponent>

                    </div>

                </div>

            </div>
        );
    };