import React, { Component } from "react";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
//import draftToHtml from 'draftjs-to-html'
// import htmlToDraft from 'html-to-draft'
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

class Wysiwyg extends Component {
  state = {
    editorState: EditorState.createEmpty()
  };
  onEditorStateChanged = editorState => {
    this.setState({
      editorState
    });
  };
  render() {
    const { editorState } = this.state;
    return (
      <div>
        <Editor
          editorState={editorState}
          wrapperClassName="demo-wrapper"
          editorClassName="demo-editor"
          toolbarClassName="toolbar-class"
          onEditorStateChanged={this.onEditorStateChanged}
        />
      </div>
    );
  }
}

export default Wysiwyg;
