import React from 'react';
import MenuBar from './editor/MenuBar';
import Editor from './editor/Editor';
import { options, menu } from './config';

class TocView {
  constructor(node, doc) {
    const example = doc.content.content.filter((fragment) => fragment.type.name === "heading").map((fragment) => fragment.content.content[0].text);
    this.dom = document.createElement('div');
    const tocHeading = document.createElement('h3');
    tocHeading.innerText = "Table of Contents";
    this.dom.appendChild(tocHeading);
    const ol = document.createElement('ol');
    example.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#${item}">${item}</a>`;
      ol.appendChild(document.createElement('br'));
      ol.appendChild(li);
    });
    this.dom.appendChild(ol);
  }

  stopEvent() { return true }
}

class HeadingView {
  constructor(node) {
    this.dom = this.contentDOM = document.createElement(`h${node.attrs.level}`);
    if (node.content.size === 0) this.dom.classList.add("empty");
    this.contentDOM.setAttribute('id', `${this.contentDOM.innerText}`);
  }

  update(node) {
    if (node.type.name !== "heading") return false;
    if (node.content.size > 0) this.dom.classList.remove("empty");
    else this.dom.classList.add("empty");
    this.contentDOM.setAttribute('id', `${this.contentDOM.innerText}`);
    return true;
  }
}

class ProseEditor extends React.Component {
  state = {
    value: '',
    headings: [],
  }

  render() {
    const getNewTocView = (n) => {
      return new TocView(n, this.state.value);
    }
    return (
      <Editor
        options={options}
        value={this.state.value}
        onChange={(v) => {
          console.log(v);
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
            toc(node) { return getNewTocView(node) },
            heading(node) { return new HeadingView(node) }
          }
        }
      />
    )
  }
}

export default ProseEditor;