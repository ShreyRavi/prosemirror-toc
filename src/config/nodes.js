import { nodes } from 'prosemirror-schema-basic';
import { orderedList, bulletList, listItem } from 'prosemirror-schema-list';
import { tableNodes } from 'prosemirror-tables';

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

const nkTableNodes = {

};

const bibliography = {

};

const citation = {

};

export default {
  ...nodes,
  ...listNodes,
  ...tableNodes({
    tableGroup: 'block',
    cellContent: 'block+',
  }),
};
