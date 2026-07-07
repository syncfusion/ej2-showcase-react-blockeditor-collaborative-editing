import React from 'react';
import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import type { SidebarModel } from '@syncfusion/ej2-navigations';

interface SyncfusionSidebarProps extends SidebarModel {
    id?: string;
    children?: React.ReactNode;
    className?: string;
    onSidebarClose?: () => void;
}

/**
 * Generic wrapped Syncfusion Sidebar component
 * Used for slide-out panels with smooth animations
 */
export const SyncfusionSidebar = React.forwardRef<
    SidebarComponent,
    SyncfusionSidebarProps
>(
    (
        {
            id = 'sidebar',
            width = '300px',
            type = 'Push',
            target,
            showBackdrop = true,
            isOpen = false,
            children,
            position,
            className = '',
            onSidebarClose,
        },
        ref,
    ) => {
        const sidebarRef = React.useRef<SidebarComponent>(null);

        React.useEffect(() => {
            if (!sidebarRef.current) return;

            if (isOpen) {
                sidebarRef.current.show();
            } else {
                sidebarRef.current.hide();
            }
        }, [isOpen]);

        const handleClose = () => {
            // Notify parent to update state first
            onSidebarClose?.();
        };

        return (
            <SidebarComponent
                ref={ref || sidebarRef}
                target={target}
                id={id}
                width={width}
                type={type}
                position={position}
                showBackdrop={showBackdrop}
                className={`syncfusion-sidebar ${className}`}
                style={{ visibility: 'hidden' }}
                close={handleClose}
                created={() => {
                    if (sidebarRef.current) {
                        (sidebarRef.current.element as HTMLElement).style.visibility = '';
                    }
                }}
            >
                {children}
            </SidebarComponent>
        );
    },
);

SyncfusionSidebar.displayName = 'SyncfusionSidebar';
