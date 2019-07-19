import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from "html-to-draftjs";

import "./message.css";
import {
  checkValidityInput,
  populateOptionFields
} from "../../util/form/formActions";
import FormField from "../../util/form/FormField";
import { groups } from "../../../actions/groupActions";
import { sendSms } from "../../../actions/messageActions";

class Message extends Component {
  state = {
    message: {
      tag: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "A tag name for your message"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      },
      contacts: {
        elementType: "textarea",
        elementConfig: {
          placeholder: "Enter phone number seperated by a commma"
        },
        value: "",
        validation: {
          // isContacts: true
        },
        valid: false,
        errorMessage: "Enter eleven number seperated by a comma",
        touch: false
      },
      groups: {
        elementType: "select",
        elementConfig: {
          label: "Use Group",
          options: []
        },
        value: "",
        valid: true
      }
    },
    isFormValid: false,
    isLoading: false,
    isFormError: false,
    isFormSuccess: false,
    isMessage: false,
    title: "",
    editorState: EditorState.createEmpty(),
    isGroup: false,
    isBlur: false
  };

  updateFields = newMessagedata => {
    this.setState({
      message: newMessagedata
    });
  };

  componentDidMount() {
    document.title = "Componse New Message - SmsBox";
    const message = this.state.message;
    this.props.dispatch(groups()).then(response => {
      const newFormData = populateOptionFields(
        message,
        this.props.isGroup.groups,
        "groups"
      );
      this.updateFields(newFormData);
    });
  }

  inputChangedHandler = (event, messageName) => {
    let isGroup = false;
    const updatedMessage = {
      ...this.state.message,
      [messageName]: {
        ...this.state.message[messageName],
        value: event.target.value,
        valid: checkValidityInput(
          event.target.value,
          this.state.message[messageName].validation
        ),
        touch: true
      }
    };
    let validForm = true;
    for (let inputKey in this.state.message) {
      validForm = updatedMessage[inputKey].valid && validForm;
    }
    if (messageName === "groups") {
      isGroup = true;
      validForm = true;
    }

    this.setState({
      message: updatedMessage,
      isFormValid: validForm,
      isGroup
    });
    console.log(this.state.isFormValid);
  };

  onEditorStateChange = editorState => {
    this.setState({
      editorState
    });
  };

  parseHtmlString = text => {
    return text.replace(/(<([^>]+)>)/gi, "");
  };

  msgDetails = data => {
    let msgLength = data.length;
    if (msgLength <= 140) {
      return 1;
    } else {
      return Math.floor(msgLength / 140) + 1;
    }
  };

  msgPage = data => {
    return data.length;
  };

  formatContact = contact => {
    console.log( contact.contacts.replace(/^\0/, ' '))
  };

  submitHandler = event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    let submitData = {};
    for (let key in this.state.message) {
      submitData[key] = this.state.message[key].value;
    }
    let data = this.parseHtmlString(
      draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    );

    if (!this.state.isGroup) {
      this.formatContact({ contacts: submitData.contacts });
      if (this.state.isFormValid && this.state.isBlur) {
        this.props
          .dispatch(sendSms({ ...submitData, message: data }))
          .then(() => {
            this.setState({ isFormSuccess: true, isLoading: false });
          });
        console.log({ ...submitData, message: data });
        console.log({ contacts: submitData.contacts });
      }
    } else {
      if (this.state.isFormValid && this.state.isBlur) {
        console.log({
          tag: submitData.tag,
          contacts: submitData.groupS,
          message: data
        });
        this.setState({ isFormSuccess: true, isLoading: false });
      }
    }
  };

  render() {
    const contact = this.state.message.contacts;
    const group = this.state.message.groups;
    const tag = this.state.message.tag;
    const { editorState } = this.state;
    console.log(this.state);
    return (
      <div className="wrap">
        <div className="content">
          <h4>{this.state.title}</h4>
          {!this.state.isGroup ? (
            <form onSubmit={e => this.submitHandler(e)}>
              <FormField
                elementType={tag.elementType}
                elementConfig={tag.elementConfig}
                value={tag.value}
                invalid={!tag.valid}
                shouldValidate={tag.validation}
                touched={tag.touch}
                changed={event => this.inputChangedHandler(event, "tag")}
              />
              {group.title === "" ? (
                <Link to="/user/group/new">Create contact group</Link>
              ) : (
                <FormField
                  elementType={group.elementType}
                  elementConfig={group.elementConfig}
                  value={group.value}
                  invalid={!group.valid}
                  shouldValidate={group.validation}
                  touched={group.touch}
                  changed={event => this.inputChangedHandler(event, "groups")}
                />
              )}
              <FormField
                elementType={contact.elementType}
                elementConfig={contact.elementConfig}
                value={contact.value}
                invalid={!contact.valid}
                shouldValidate={contact.validation}
                touched={contact.touch}
                message={contact.errorMessage}
                changed={event => this.inputChangedHandler(event, "contacts")}
              />
              <div className="right">
                <div>
                  {this.msgPage(
                    this.parseHtmlString(
                      draftToHtml(convertToRaw(editorState.getCurrentContent()))
                    )
                  )}
                </div>
                /
                <div>
                  {this.msgDetails(
                    this.parseHtmlString(
                      draftToHtml(convertToRaw(editorState.getCurrentContent()))
                    )
                  )}
                </div>
              </div>
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
                  <CircularProgress
                    thickness={7}
                    style={{ color: "#ee6e73" }}
                  />
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
                      Send Message
                    </Button>
                    :
                    {this.state.isFormError ? (
                      <div>Error sending Message</div>
                    ) : this.state.isFormSuccess ? (
                      <div>
                        Message Sent Successfully{" "}
                        <Link to="/user/new">Create new Message</Link>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={e => this.submitHandler(e)}>
              <FormField
                elementType={tag.elementType}
                elementConfig={tag.elementConfig}
                value={tag.value}
                invalid={!tag.valid}
                shouldValidate={tag.validation}
                touched={tag.touch}
                changed={event => this.inputChangedHandler(event, "tag")}
              />
              {group.title === "" ? (
                <Link to="/user/group/new">Create contact group</Link>
              ) : (
                <FormField
                  elementType={group.elementType}
                  elementConfig={group.elementConfig}
                  value={group.value}
                  invalid={!group.valid}
                  shouldValidate={group.validation}
                  touched={group.touch}
                  changed={event => this.inputChangedHandler(event, "groups")}
                />
              )}
              {/**show the number of text */}
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
                  <CircularProgress
                    thickness={7}
                    style={{ color: "#ee6e73" }}
                  />
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
                      Send Message
                    </Button>
                    :
                    {this.state.isFormError ? (
                      <div>Error sending Message</div>
                    ) : this.state.isFormSuccess ? (
                      <div>
                        Message Sent Successfully{" "}
                        <Link to="/user/new">Create new Message</Link>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isGroup: state.group,
    isUser: state.user
  };
}

export default connect(mapStateToProps)(Message);
