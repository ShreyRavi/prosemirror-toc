import React from 'react';
import MenuBar from './editor/MenuBar';
import Editor from './editor/Editor';
import { options, menu } from './config';

class ImageView {
  constructor(node) {
    this.dom = document.createElement('table');
    const row1 = document.createElement('tr');
    const td1 = document.createElement('td');
    const td2 = document.createElement('td');
    td1.textContent = 'col1';
    td2.textContent = 'col2';
    row1.appendChild(td1);
    row1.appendChild(td2);
    this.dom.appendChild(row1);
  }

  stopEvent() { return true }
}

class ProseEditor extends React.Component {
  state = {
    value: '',
  }

  render() {
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
            image(node) { return new ImageView(node) }
          }
        }
      />
    )
  }
}

export default ProseEditor;