import type { BlockModel } from '@syncfusion/ej2-react-blockeditor';
import type { CollaborationAdapter } from '@syncfusion/ej2-react-blockeditor';
import { DEFAULT_EDITOR_BLOCKS } from '../utils/mockData';

/**
 * Get default editor blocks
 */
export function getDefaultBlocks(): BlockModel[] {
    return JSON.parse(JSON.stringify(DEFAULT_EDITOR_BLOCKS));
}

/**
 * Get Blockeditor collaboration settings
 */
export function getCollaborationSettings(
    provider: any,
    adapter: CollaborationAdapter
): any {
    return {
        provider,
        adapter,
        enableAwareness: true,
        snapshotInterval: 3000, // 3 seconds debounce
    };
}

/**
 * Get Blockeditor configuration
 */
export function getBlockEditorConfig() {
    return {
        blocks: getDefaultBlocks(),
        toolbar: {
            items: ['undo', 'redo', 'formatTools', 'insertTools'],
        },
    };
}
