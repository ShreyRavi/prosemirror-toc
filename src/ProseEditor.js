import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import MenuBar from './editor/MenuBar';
import Editor from './editor/Editor';
import { options, menu } from './config';

class TocView {
  constructor(node, editor) {
    const headingMatches = editor.state.doc.content.content.filter((fragment) => fragment.type.name.startsWith("heading")).map((fragment) => {
      fragment.attrs.id = uuidv4();
      return {
        text: fragment.content.content[0].text, 
        id: fragment.attrs.id,
      };
    });
    this.dom = document.createElement('div');
    const tocHeading = document.createElement('h3');
    tocHeading.innerText = "Table of Contents";
    this.dom.appendChild(tocHeading);
    const ol = document.createElement('ol');
    headingMatches.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#${item.id}">${item.text}</a>`;
      ol.appendChild(document.createElement('br'));
      ol.appendChild(li);
    });
    this.dom.appendChild(ol);
  }

  stopEvent() { return true }
}

class HeadingView {
  constructor(node, editor) {
    this.dom = this.contentDOM = document.createElement(`h${node.attrs.level}`);
    if (node.content.size === 0) this.dom.classList.add("empty");
    this.contentDOM.setAttribute('id', `${node.attrs.id}`);
  }

  update(node) {
    if (node.type.name !== `heading${node.attrs.level}`) return false;
    if (node.content.size > 0) this.dom.classList.remove("empty");
    else this.dom.classList.add("empty");
    this.contentDOM.setAttribute('id', `${node.attrs.id}`);
    return true;
  }
}

class ProseEditor extends React.Component {
  state = {
    value: '',
    headings: [],
  }

  render() {
    return (
      <Editor
        options={options}
        value={this.state.value}
        onChange={(v) => {
          this.setState({ value: v });
        }}
        render={({ editor, view }) => (
          <div style={{ border: '1px solid black', borderRadius: '10px', padding: '5px' }}>
            <MenuBar menu={menu} view={view} />
            {editor}
          </div>
        )}
        nodeViews={
          {
            toc(node, editor) { return new TocView(node, editor) },
            heading1(node, editor) { return new HeadingView(node, editor) },
            heading2(node, editor) { return new HeadingView(node, editor) },
            heading3(node, editor) { return new HeadingView(node, editor) },
            heading4(node, editor) { return new HeadingView(node, editor) },
            heading5(node, editor) { return new HeadingView(node, editor) },
            heading6(node, editor) { return new HeadingView(node, editor) },
          }
        }
      />
    )
  }
}

export default ProseEditor;