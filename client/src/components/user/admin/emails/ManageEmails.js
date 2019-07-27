import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import { checkValidityInput } from "../../../util/form/formActions";
import FormField from "../../../util/form/FormField";
import { updates, promotions } from "../../../../actions/emailActions";

class ManageEmails extends Component {
  state = {
    form: {
      subject: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Email Subject"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      }
    },
    isFormValid: false,
    isLoading: false,
    isFormError: false,
    isSuccess: false,
    isBlur: false,
    editPage: "",
    title: "",
    editorState: EditorState.createEmpty()
  };

  componentDidMount() {
    const emailType = this.props.match.params.title;
    document.title = `Manage ${emailType} - SmsBox`;
    this.setState({ title: emailType });
  }

  inputChangedHandler = (event, formName) => {
    const updatedForm = {
      ...this.state.form,
      [formName]: {
        ...this.state.form[formName],
        value: event.target.value,
        valid: checkValidityInput(
          event.target.value,
          this.state.form[formName].validation
        ),
        touch: true
      }
    };
    let validForm = true;
    for (let inputKey in this.state.form) {
      validForm = updatedForm[inputKey].valid && validForm;
    }
    this.setState({ form: updatedForm, isFormValid: validForm });
  };

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  parseHtmlString = text => {
    return text.replace(/(<([^>]+)>)/gi, "");
  };

  submitHandler = e => {
    e.preventDefault();
    this.setState({ isLoading: true });
    let submitData = {};
    for (let key in this.state.form) {
      submitData[key] = this.state.form[key].value;
    }
    let data = this.parseHtmlString(
      draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    );
    console.log({ ...submitData, email: data });
    if (this.state.isFormValid && this.state.isBlur) {
      if (this.state.title === "updates") {
        this.props.dispatch(updates({ ...submitData, email: data }));
        this.props.history.push("/admin/manage_emails");
      } else if (this.state.title === "promotions") {
        this.props.dispatch(promotions({ ...submitData, email: data }));
        this.props.history.push("/admin/manage_emails");
      } else {
        console.log("reminder");
      }
    }
  };

  render() {
    const { editorState } = this.state;
    const subject = this.state.form.subject;
    return (
      <div className="wrap">
        <div className="content">
          <form onSubmit={e => this.submitHandler(e)}>
            <FormField
              elementType={subject.elementType}
              elementConfig={subject.elementConfig}
              value={subject.value}
              invalid={!subject.valid}
              shouldValidate={subject.validation}
              touched={subject.touch}
              changed={event => this.inputChangedHandler(event, "subject")}
            />
            <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              toolbarClassName="toolbar-class"
              onEditorStateChange={this.onEditorStateChange}
              onBlur={() => this.setState({ isBlur: true })}
            />
            <div className="center-align">
              {this.state.isLoading ? (
                <CircularProgress thickness={7} style={{ color: "#ee6e73" }} />
              ) : (
                <div>
                  <Button
                    disabled={!this.state.isFormValid && !this.state.isBlur}
                    onClick={e => this.submitHandler(e)}
                    style={{
                      borderRadius: "5px",
                      background:
                        !this.state.isFormValid && !this.state.isBlur
                          ? "fff"
                          : "#ee6e73",
                      width: "50%",
                      color: "#fff"
                    }}
                  >
                    {this.state.title}
                  </Button>
                  :
                  {this.state.isFormError ? (
                    <div>Error sending Email</div>
                  ) : this.state.isFormSuccess ? (
                    <div>Email Sent Successfully</div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect()(ManageEmails);
