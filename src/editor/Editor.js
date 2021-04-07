import React from 'react';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import 'prosemirror-view/style/prosemirror.css';
import './Editor.css';

// mostly copied from https://github.com/hubgit/react-prosemirror/blob/master/react-prosemirror/src/Editor.js
// we are copying, not using from lib because we need access to some of the internals (EditorView)
// given ProseMirror is stable, and react-prosemirror::Editor has been untouched for almost 3 years, copying is safe
class Editor extends React.Component {
  constructor(props) {
    super(props);

    const {
      options, onChange, attributes, nodeViews,
    } = props;

    this.editorRef = React.createRef();

    this.view = new EditorView(null, {
      state: EditorState.create(options),
      dispatchTransaction: (transaction) => {
        const { state, transactions } = this.view.state.applyTransaction(transaction);

        this.view.updateState(state);

        if (transactions.some((tr) => tr.docChanged)) {
          onChange(state.doc);
        }

        this.forceUpdate();
      },
      attributes,
      nodeViews,
    });
  }

  componentDidMount() {
    const { autoFocus } = this.props;
    this.editorRef.current.appendChild(this.view.dom);

    if (autoFocus) {
      this.view.focus();
    }
  }

  render() {
    const { render } = this.props;
    // TODO some of these styles need to be proped or better encoded
    const editor = <div style={{ overflow: 'auto', maxHeight: '90vh' }} ref={this.editorRef} />;

    return render ? render({
      editor,
      view: this.view,
    }) : editor;
  }
}

export default Editor;
