import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const turndownService = new TurndownService({
    codeBlockStyle: 'fenced',
    emDelimiter: '_',
    bulletListMarker: '-',
    headingStyle: 'atx'
});

turndownService.use(gfm);

export default turndownService;