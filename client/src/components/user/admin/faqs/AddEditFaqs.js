import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "../../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import htmlToDraft from "html-to-draftjs";

import { checkValidityInput } from "../../../util/form/formActions";
import FormField from "../../../util/form/FormField";
import {
  newAdminFaqs,
  viewFaqs,
  editAdminFaqs
} from "../../../../actions/faqsActions";

class AddEditFaqs extends Component {
  state = {
    form: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Faq Title"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      },
      link_title: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Faq Link"
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

  updateFields = (data, title, editorState, page, load) => {
    const newForm = { ...this.state.form };
    for (let key in newForm) {
      newForm[key].value = data[key];
      newForm[key].valid = true;
    }
    this.setState({
      form: newForm,
      title,
      editorState,
      editPage: page,
      isLoading: load
    });
  };

  componentDidMount() {
    const faqId = this.props.match.params.title;
    if (!faqId) {
      this.setState({ title: "Add Faqs" });
    } else {
      this.setState({ isLoading: true });
      this.props.dispatch(viewFaqs(faqId)).then(() => {
        const faqs = this.props.isFaqs.faqs;
        const contentState = ContentState.createFromBlockArray(
          htmlToDraft(faqs.detail).contentBlocks
        );
        const editorState = EditorState.createWithContent(contentState);
        this.updateFields(
          faqs,
          `Edit ${faqs.name}`,
          editorState,
          faqs._id,
          false
        );
      });
    }
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

  submitHandler = event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    let submitData = {};
    for (let key in this.state.form) {
      submitData[key] = this.state.form[key].value;
    }
    let data = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    if (this.state.isFormValid && this.state.isBlur) {
      if (this.state.title === "Add Faqs") {
        this.props
          .dispatch(newAdminFaqs({ ...submitData, detail: data }))
          .then(response => {
            if (response.payload.success) {
              this.setState({
                isLoading: false,
                isSuccess: true
              });
            }
          });
      } else {
        this.props
          .dispatch(
            editAdminFaqs({
              ...submitData,
              detail: data,
              _id: this.state.editPage
            })
          )
          .then(response => {
            if (response.payload.success) {
              this.setState({
                isLoading: false,
                isSuccess: true
              });
            }
          });
      }
    } else {
      this.setState({ isLoading: false, isFormError: true });
    }
  };

  render() {
    const { editorState } = this.state;
    const formElementArray = [];
    for (let formKey in this.state.form) {
      formElementArray.push({
        id: formKey,
        config: this.state.form[formKey]
      });
    }

    let form = formElementArray.map(formElement => (
      <FormField
        key={formElement.id}
        elementType={formElement.config.elementType}
        elementConfig={formElement.config.elementConfig}
        value={formElement.config.value}
        invalid={!formElement.config.valid}
        shouldValidate={formElement.config.validation}
        touched={formElement.config.touch}
        changed={event => this.inputChangedHandler(event, formElement.id)}
      />
    ));
    return (
      <div className="wrap">
        <div className="login">
          <h4>
            {this.state.isLoading ? (
              <div className="center-align">
                <CircularProgress thickness={7} style={{ color: "#ee6e73" }} />
              </div>
            ) : (
              this.state.title
            )}
          </h4>
          <form onSubmit={e => this.submitHandler(e)}>
            {form}
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
                  disabled={!this.state.isFormValid && !this.state.isBlur}
                  onClick={e => this.submitHandler(e)}
                  style={{
                    borderRadius: "5px",
                    background:
                      !this.state.isFormValid && !this.state.isBlur
                        ? "none"
                        : "#ee6e73",
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
          <div className="center-align">
            {this.state.editPage === ""
              ? this.state.isSuccess
                ? `Faqs has been added`
                : ""
              : this.state.isSuccess
              ? `${this.props.isFaqs.faqs.name} has been updated`
              : ""}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFaqs: state.faqs
  };
}

export default connect(mapStateToProps)(AddEditFaqs);
