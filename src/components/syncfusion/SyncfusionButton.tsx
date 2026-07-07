import React from 'react';
import { ButtonComponent, type ButtonModel } from '@syncfusion/ej2-react-buttons';

interface SyncfusionButtonProps extends ButtonModel {
    id?: string;
    title?: string;
    children?: React.ReactNode;
}

/**
 * Wrapped Syncfusion Button component
 */
export const SyncfusionButton = React.forwardRef<
    ButtonComponent,
    SyncfusionButtonProps
>(
    (
        {
            id,
            cssClass,
            title,
            clicked,
            children,
            disabled,
            isPrimary,
            iconCss,
            ...rest
        },
        ref
    ) => {
        return (
            <ButtonComponent
                ref={ref}
                id={id}
                cssClass={cssClass}
                title={title}
                onClick={clicked}
                disabled={disabled}
                isPrimary={isPrimary}
                iconCss={iconCss}
                {...rest}
            >
                {children}
            </ButtonComponent>
        );
    }
);

SyncfusionButton.displayName = 'SyncfusionButton';
