import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from "html-to-draftjs";

import { about, saveAbout, editAbout } from "../../../../actions/aboutActions";

class EditAbout extends Component {
  state = {
    isLoading: true,
    isSuccess: false,
    isBlur: false,
    title: "",
    editorState: EditorState.createEmpty()
  };

  componentDidMount() {
    this.props.dispatch(about()).then(() => {
      const about = this.props.isAbout.about;
      if (about.length < 1) {
        this.setState({ title: "New About", isLoading: false });
      } else {
        const contentState = ContentState.createFromBlockArray(
          htmlToDraft(about[0].about).contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.setState({ isLoading: false, editorState, title: "Edit About" });
      }
    });
  }

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  submitHandler = event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    let data = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    if (this.state.isBlur) {
      if (this.state.title === "New About") {
        this.props.dispatch(saveAbout({ about: data })).then(response => {
          if (response.payload.success) {
            this.setState({
              isLoading: false,
              isSuccess: true
            });
            this.props.history.push('/admin/about_us')
          }
        });
      } else {
        this.props.dispatch(editAbout({ about: data, id:this.props.isAbout.about[0]._id })).then(response => {
          if (response.payload.success) {
            this.setState({
              isLoading: false,
              isSuccess: true
            });
            this.props.history.push('/admin/about_us')
          }
        });
      }
    } else {
      this.setState({ isLoading: false, isFormError: true });
    }
  };

  render() {
    const { editorState } = this.state;
    return (
      <div className="wrap">
        <div className="login">
          <h4>
            {this.state.isLoading ? (
              <div className="center-align">
                <CircularProgress thickness={7} style={{ color: "#ee6e73" }} />
              </div>
            ) : (
              <div className="center-align">{this.state.title}</div>
            )}
          </h4>
          <form onSubmit={e => this.submitHandler(e)}>
            <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              toolbarClassName="toolbar-class"
              onEditorStateChange={this.onEditorStateChange}
              onBlur={() => this.setState({ isBlur: true })}
            />
            {this.state.isLoading ? (
              <div className="center-align">
                <CircularProgress thickness={7} style={{ color: "#ee6e73" }} />
              </div>
            ) : (
              <div className="center-align">
                <Button
                  disabled={!this.state.isBlur}
                  onClick={e => this.submitHandler(e)}
                  style={{
                    borderRadius: "5px",
                    background: "#ee6e73",
                    width: "50%",
                    color: "#fff",
                    cursor: !this.state.isFormValid ? "none" : "pointer"
                  }}
                >
                  {this.state.title}
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAbout: state.about
  };
}

export default connect(mapStateToProps)(EditAbout);
