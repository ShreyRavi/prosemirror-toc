import { nodes } from 'prosemirror-schema-basic';
import { orderedList, bulletList, listItem } from 'prosemirror-schema-list';
import { tableNodes } from 'prosemirror-tables';
import { footnoteNodes } from '@aeaton/prosemirror-footnotes';

const listNodes = {
  ordered_list: {
    ...orderedList,
    content: 'list_item+',
    group: 'block',
  },
  bullet_list: {
    ...bulletList,
    content: 'list_item+',
    group: 'block',
  },
  list_item: {
    ...listItem,
    content: 'paragraph block*',
  },
  toc: {
    parseDOM: [{tag: "ul"}],
    content: 'list_item+',
    group: 'block',
    toDOM() { return ["ul", 0] }
  }
};

const headings = {
  heading1: {
    attrs: {level: {default: 1}},
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [{tag: "h1"}],
    toDOM(node) { return ["h1", 0] }
  },
  heading2: {
    attrs: {level: {default: 1}},
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [{tag: "h2"}],
    toDOM(node) { return ["h2", 0] }
  },
  heading3: {
    attrs: {level: {default: 1}},
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [{tag: "h3"}],
    toDOM(node) { return ["h3", 0] }
  },
  heading4: {
    attrs: {level: {default: 1}},
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [{tag: "h4"}],
    toDOM(node) { return ["h4", 0] }
  },
  heading5: {
    attrs: {level: {default: 1}},
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [{tag: "h5"}],
    toDOM(node) { return ["h5", 0] }
  },
  heading6: {
    attrs: {level: {default: 1}},
    content: "inline*",
    group: "block",
    defining: true,
    parseDOM: [{tag: "h6"}],
    toDOM(node) { return ["h6", 0] }
  },
};

const nkTableNodes = {

};

const bibliography = {

};

const citation = {

};

export default {
  ...nodes,
  ...listNodes,
  ...headings,
  ...tableNodes({
    tableGroup: 'block',
    cellContent: 'block+',
  }),
  ...footnoteNodes,
};
