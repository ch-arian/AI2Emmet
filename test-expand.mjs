import { expandEmmet } from './src/pipeline/expand.js';

const html = expandEmmet('btn[data-action="click"]{Click Me}');
console.log('Expanded HTML:', html);
