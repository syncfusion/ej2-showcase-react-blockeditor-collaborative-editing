import React from 'react';
import { ToolbarComponent, ItemsDirective, ItemDirective, type ToolbarModel } from '@syncfusion/ej2-react-navigations';

interface SyncfusionToolbarProps extends ToolbarModel {
    id?: string;
    className?: string;
}

/**
 * Wrapped Syncfusion Toolbar component
 */
export const SyncfusionToolbar = React.forwardRef<
    ToolbarComponent,
    SyncfusionToolbarProps
>(({ id, items = [], className, clicked }, ref) => {
    return (
        <ToolbarComponent
            ref={ref}
            id={id}
            className={className}
            onClick={clicked}
        >
            <ItemsDirective>
                {items.map((item, index) => (
                    <ItemDirective
                        key={index}
                        text={item.text}
                        prefixIcon={item.prefixIcon}
                        tooltipText={item.tooltipText}
                        align={item.align}
                        id={item.id}
                        type={item.type}
                    />
                ))}
            </ItemsDirective>
        </ToolbarComponent>
    );
});

SyncfusionToolbar.displayName = 'SyncfusionToolbar';
