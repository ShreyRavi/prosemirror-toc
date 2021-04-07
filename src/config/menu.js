/* eslint-disable no-plusplus */
import React from 'react';

import {
  setBlockType, toggleMark, wrapIn,
} from 'prosemirror-commands';
import { redo, undo } from 'prosemirror-history';
import { wrapInList } from 'prosemirror-schema-list';

import './menu.css';
import { Subscript } from 'grommet-icons/icons/Subscript';
import { Superscript } from 'grommet-icons/icons/Superscript';
import { Italic } from 'grommet-icons/icons/Italic';
import { Bold } from 'grommet-icons/icons/Bold';
import { StrikeThrough } from 'grommet-icons/icons/StrikeThrough';
import { Underline } from 'grommet-icons/icons/Underline';
import { Link } from 'grommet-icons/icons/Link';

import { Edit } from 'grommet-icons/icons/Edit';

import { List } from 'grommet-icons/icons/List';
import { OrderedList } from 'grommet-icons/icons/OrderedList';
import { BlockQuote } from 'grommet-icons/icons/BlockQuote';

import { Contact } from 'grommet-icons/icons/Contact';
import { Table } from 'grommet-icons/icons/Table';
//  for NK tables: import { TableAdd } from 'grommet-icons/icons/TableAdd';
import { Image } from 'grommet-icons/icons/Image';

import { Undo } from 'grommet-icons/icons/Undo';
import { Redo } from 'grommet-icons/icons/Redo';

import schema from './schema';

const markActive = (state, type) => {
  const {
    from, $from, to, empty,
  } = state.selection;

  return empty
    ? type.isInSet(state.storedMarks || $from.marks())
    : state.doc.rangeHasMark(from, to, type);
};

const blockActive = (state, type, attrs = {}) => {
  const { $from, to, node } = state.selection;

  if (node) {
    return node.hasMarkup(type, attrs);
  }

  return to <= $from.end() && $from.parent.hasMarkup(type, attrs);
};

const canInsert = (state, type) => {
  const { $from } = state.selection;

  for (let d = $from.depth; d >= 0; d--) {
    const index = $from.index(d);

    if ($from.node(d).canReplaceWith(index, index, type)) {
      return true;
    }
  }

  return false;
};

const promptForURL = () => {
  let url = window && window.prompt('Enter the URL', 'https://');

  if (url && !/^https?:\/\//i.test(url)) {
    url = `http://${url}`;
  }

  return url;
};

const HIGHLIGHT_COLOR = '#000000';
const UNHIGHLIGHTED_COLOR = '#666666';
const DISABLED_COLOR = '#cccccc';

class BooleanMenuButton extends React.Component {
  render() {
    const {
      icon, onClick, disabled, title, active,
    } = this.props;
    let iconColor = UNHIGHLIGHTED_COLOR;
    if (disabled) {
      iconColor = DISABLED_COLOR;
    } else if (active) {
      iconColor = HIGHLIGHT_COLOR;
    }

    return (
      <button
        type="button"
        className="prose-menu-button"
        title={title}
        disabled={disabled}
        onMouseDown={(e) => {
          e.preventDefault();
          onClick();
        }}
      >
        {React.createElement(icon, { color: iconColor })}
      </button>
    );
  }
}

export default {
  marks: [
    (state, dispatch) => (
      <BooleanMenuButton
        key="Italic"
        title="Italic"
        icon={Italic}
        onClick={() => toggleMark(schema.marks.em)(state, dispatch)}
        active={markActive(state, schema.marks.em)}
        disabled={false}
      />
    ),
    (state, dispatch) => (
      <BooleanMenuButton
        key="Bold"
        title="Bold"
        icon={Bold}
        onClick={() => toggleMark(schema.marks.strong)(state, dispatch)}
        active={markActive(state, schema.marks.strong)}
        disabled={false}
      />
    ),
    (state, dispatch) => (
      <BooleanMenuButton
        key="Subscript"
        title="Subscript"
        icon={Subscript}
        onClick={() => toggleMark(schema.marks.subscript)(state, dispatch)}
        active={markActive(state, schema.marks.subscript)}
        disabled={false}
      />
    ),
    (state, dispatch) => (
      <BooleanMenuButton
        key="Superscript"
        title="Superscript"
        icon={Superscript}
        onClick={() => toggleMark(schema.marks.superscript)(state, dispatch)}
        active={markActive(state, schema.marks.superscript)}
        disabled={false}
      />
    ),
    (state, dispatch) => (
      <BooleanMenuButton
        key="Underline"
        title="Underline"
        icon={Underline}
        onClick={() => toggleMark(schema.marks.underline)(state, dispatch)}
        active={markActive(state, schema.marks.underline)}
        disabled={false}
      />
    ),
    (state, dispatch) => (
      <BooleanMenuButton
        key="Strikethrough"
        title="Strikethrough"
        icon={StrikeThrough}
        onClick={() => toggleMark(schema.marks.strikethrough)(state, dispatch)}
        active={markActive(state, schema.marks.strikethrough)}
        disabled={false}
      />
    ),
    (state, dispatch) => (
      <BooleanMenuButton
        key="Link"
        title="Link"
        icon={Link}
        onClick={() => {
          if (markActive(state, schema.marks.link)) {
            toggleMark(schema.marks.link)(state, dispatch);
            return true;
          }

          const href = promptForURL();
          if (!href) return false;

          toggleMark(schema.marks.link, { href })(state, dispatch);
          // view.focus()
          return true; // TODO is this correct?
        }}
        active={markActive(state, schema.marks.link)}
        disabled={state.selection.empty}
      />
    ),
  ],
  blocks: [
    (state, dispatch) => (
      <BooleanMenuButton
        key="Text"
        title="Text"
        icon={Edit}
        onClick={() => setBlockType(schema.nodes.paragraph)(state, dispatch)}
        active={blockActive(state, schema.nodes.paragraph)}
        disabled={!setBlockType(schema.nodes.paragraph)(state)}
      />
    ),
    (state, dispatch) => (
      <BooleanMenuButton
        key="Heading"
        title="Heading"
        icon={Table}
        onClick={() => setBlockType(schema.nodes.heading, { level: 1 })(state, dispatch)}
        active={blockActive(state, schema.nodes.heading, { level: 1 })}
        disabled={!setBlockType(schema.nodes.heading, { level: 1 })(state)}
      />
    ),
    (state, dispatch) => (
      <BooleanMenuButton
        key="Block Quote"
        title="Block Quote"
        icon={BlockQuote}
        onClick={() => wrapIn(schema.nodes.blockquote)(state, dispatch)}
        active={blockActive(state, schema.nodes.blockquote)}
        disabled={!wrapIn(schema.nodes.blockquote)(state)}
      />
    ),
    (state, dispatch) => (
      <BooleanMenuButton
        key="Unordered List"
        title="Unordered List"
        icon={List}
        onClick={() => wrapInList(schema.nodes.bullet_list)(state, dispatch)}
        active={blockActive(state, schema.nodes.bullet_list)}
        disabled={!wrapInList(schema.nodes.bullet_list)(state)}
      />
    ),
    (state, dispatch) => (
      <BooleanMenuButton
        key="Ordered List"
        title="Ordered List"
        icon={OrderedList}
        onClick={() => wrapInList(schema.nodes.ordered_list)(state, dispatch)}
        active={blockActive(state, schema.nodes.ordered_list)}
        disabled={!wrapInList(schema.nodes.ordered_list)(state)}
      />
    ),
  ],
  insert: [
    (state, dispatch) => (
      <BooleanMenuButton
        key="Image"
        title="Image"
        icon={Image}
        onClick={() => {
          const src = promptForURL();
          if (!src) return false;

          const img = schema.nodes.image.createAndFill({ src });
          dispatch(state.tr.replaceSelectionWith(img));
          return true;
        }}
        active={false}
        disabled={!canInsert(state, schema.nodes.image)}
      />
    ),
    (state, dispatch) => (
      <BooleanMenuButton
        key="Table"
        title="Table"
        icon={Table}
        onClick={() => {
          // const { from } = state.selection
          let rowCount = window && window.prompt('How many rows?', 2);
          let colCount = window && window.prompt('How many columns?', 2);

          const cells = [];
          while (colCount--) {
            cells.push(schema.nodes.table_cell.createAndFill());
          }

          const rows = [];
          while (rowCount--) {
            rows.push(schema.nodes.table_row.createAndFill(null, cells));
          }

          const table = schema.nodes.table.createAndFill(null, rows);
          dispatch(state.tr.replaceSelectionWith(table));
        }}
        active={false}
        disabled={!canInsert(state, schema.nodes.table)}
      />
    ),
    (state, dispatch) => (
      <BooleanMenuButton
        key="Footnote"
        title="Footnote"
        icon={Contact}
        onClick={() => {
          const footnote = schema.nodes.footnote.create();
          dispatch(state.tr.replaceSelectionWith(footnote));
        }}
        active={false}
        disabled={!canInsert(state, schema.nodes.footnote)}
      />
    ),
  ],
  history: [
    (state, dispatch) => (
      <BooleanMenuButton
        key="Undo"
        title="Undo"
        icon={Undo}
        onClick={() => undo(state, dispatch)}
        active={false}
        disabled={!undo(state)}
      />
    ),
    (state, dispatch) => (
      <BooleanMenuButton
        key="Redo"
        title="Redo"
        icon={Redo}
        onClick={() => redo(state, dispatch)}
        active={false}
        disabled={!redo(state)}
      />
    ),
  ],
};