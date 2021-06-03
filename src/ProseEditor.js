import React from 'react';
import { Avatar, Button, Box, Grid, Grommet, Nav, Sidebar } from 'grommet';
import { Previous, Next } from 'grommet-icons';
import { v4 as uuidv4 } from 'uuid';
import MenuBar from './editor/MenuBar';
import Editor from './editor/Editor';
import { options, menu } from './config';

class TocView {
  constructor(node, editor) {
    const headingMatches = editor.state.doc.content.content.filter((fragment) => fragment.type.name.startsWith("heading")).map((fragment) => {
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
    node.attrs.id = uuidv4();
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
    showToc: false,
    tocContent: null,
  }

  render() {
    const setTocContent = (node) => {
      try {
        const headingMatches = node.content.content.filter((fragment) => fragment.type.name.startsWith("heading")).map((fragment) => {
          return {
            text: fragment.content.content[0].text, 
            id: fragment.attrs.id,
          };
        });
        const ol = document.createElement('ol');
        headingMatches.forEach((item) => {
          const li = document.createElement('li');
          li.innerHTML = `<a href="#${item.id}">${item.text}</a>`;
          ol.appendChild(document.createElement('br'));
          ol.appendChild(li);
        });
        this.setState({
          showToc: true,
          tocContent: ol.outerHTML,
        });
      }
      catch (TypeError) {
        // silence errors regarding in progress edits
      }
    }
    return (
      <Grid
        columns={this.state.showToc ?
          ['250px', '700px'] : ['75px', '700px']}
        rows={['medium', 'medium']}
        gap="small"
        areas={[
          {
            name: 'tocGridArea',
            start: [0, 0],
            end: [0, 1]
          },
          {
            name: 'proseMirrorGridArea',
            start: [1, 0],
            end: [1, 1]
          },
        ]}
      >
      <Box gridArea="tocGridArea">
        <Sidebar
          header={this.state.showToc ? 
            <div>
              <h3>Table of Contents</h3>
              <Button size="small" icon={<Previous />} hoverIndicator onClick={() => this.setState({ showToc: false })} />
            </div>
            :
            <div>
              <Button icon={<Next />} hoverIndicator onClick={() => this.setState({ showToc: true })} />
            </div>
          }
          background="#eeeeee"
        >
          {
            this.state.showToc &&
            <div dangerouslySetInnerHTML={{__html: this.state.tocContent}}></div>
          }
        </Sidebar>
      </Box>
      <Box gridArea="proseMirrorGridArea" overflow="auto">
        <Editor
          options={options}
          value={this.state.value}
          onChange={(v) => {
            this.setState({ value: v });
            setTocContent(v);
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
              heading(node, editor) { return new HeadingView(node, editor) },
            }
          }
        />
      </Box>
      </Grid>
    )
  }
}

export default ProseEditor;