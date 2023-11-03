import { JSDOM } from 'jsdom';

export const Node = new JSDOM('').window.Node;
