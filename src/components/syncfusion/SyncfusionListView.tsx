import React, { useMemo } from 'react';
import { ListViewComponent, type ListViewModel, type SelectEventArgs } from '@syncfusion/ej2-react-lists';

interface SyncfusionListViewProps extends Omit<ListViewModel, 'dataSource'> {
    /**
     * Unique identifier for the list
     */
    id: string;
    /**
     * Data source - accepts any array of objects
     */
    dataSource?: any[] | any;
    /**
     * Loading state indicator
     */
    isLoading?: boolean;
    /**
     * Empty state message
     */
    emptyMessage?: string;
    /**
     * Group template for grouped items
     */
    groupTemplate?: (data: any) => React.ReactNode;
    [key: string]: any;
}

/**
 * Generic Syncfusion ListView wrapper component
 * Handles collaborators list and version history list rendering
 *
 * Features:
 * - Flexible item templating
 * - Custom header template
 * - Loading and empty states
 * - Field mapping
 * - Selection support
 */
export const SyncfusionListView: React.FC<SyncfusionListViewProps> = ({
    id,
    dataSource,
    fields,
    template,
    headerTemplate,
    groupTemplate,
    cssClass = '',
    showHeader = true,
    headerTitle,
    isLoading,
    emptyMessage,
    select,
    ...rest
}) => {
    // Memoize dataSource to prevent unnecessary re-renders
    const memoizedDataSource = useMemo(() => dataSource, [dataSource]);

    // Memoize item template to prevent component re-initialization
    const memoizedItemTemplate = useMemo(
        () => template,
        [template]
    );

    // Memoize header template
    const memoizedHeaderTemplate = useMemo(
        () => headerTemplate,
        [headerTemplate]
    );

    // Memoize group template
    const memoizedGroupTemplate = useMemo(
        () => groupTemplate,
        [groupTemplate]
    );

    // Handle item selection
    const handleSelect = (args: SelectEventArgs) => {
        if (select && args.data) {
            select(args.data);
        }
    };

    if (isLoading) {
        return (
            <div className={`e-listview-loader ${cssClass}`}>
                <div className="e-spinner">
                    <div className="e-spin-material"></div>
                </div>
            </div>
        );
    }

    if (memoizedDataSource.length === 0) {
        return (
            <div className={`e-listview-empty ${cssClass}`}>
                <p className="empty-message">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <ListViewComponent
            id={id}
            dataSource={memoizedDataSource}
            fields={fields}
            template={memoizedItemTemplate}
            headerTemplate={memoizedHeaderTemplate}
            groupTemplate={memoizedGroupTemplate}
            select={handleSelect}
            showHeader={showHeader}
            headerTitle={headerTitle}
            cssClass={cssClass}
            actionFailure={() => {
                console.warn(`ListView ${id}: Action failed`);
            }}
            {...rest}
        />
    );
};
