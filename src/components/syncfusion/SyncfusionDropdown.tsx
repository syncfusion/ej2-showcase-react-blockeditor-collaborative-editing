import React from 'react';
import { DropDownButtonComponent, type DropDownButtonModel } from '@syncfusion/ej2-react-splitbuttons';

interface SyncfusionDropdownProps extends DropDownButtonModel {
    id?: string;
    className?: string;
}

/**
 * Wrapped Syncfusion DropdownButton component
 */
export const SyncfusionDropdown = React.forwardRef<
    DropDownButtonComponent,
    SyncfusionDropdownProps
>(
    ({ id, items = [], iconCss, className, select }, ref) => {
        return (
            <DropDownButtonComponent
                ref={ref}
                id={id}
                iconCss={iconCss}
                items={items}
                className={className}
                select={select}>
            </DropDownButtonComponent>
        );
    }
);

SyncfusionDropdown.displayName = 'SyncfusionDropdown';
