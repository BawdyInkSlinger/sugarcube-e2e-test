import '../../test-api/internal/monkey-patching/jsdom/strings'
import { JSDOM } from 'jsdom';

export const Node = new JSDOM('').window.Node;
