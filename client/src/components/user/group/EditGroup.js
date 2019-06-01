import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { post } from "axios";
import { connect } from "react-redux";

import { checkValidityInput } from "../../util/form/formActions";
import FormField from "../../util/form/FormField";
import { GROUP_SERVER } from "../../util/url";
import { newGroup, detailGroup, editGroup } from "../../../actions/groupActions";

class EditGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        title: {
          elementType: "input",
          elementConfig: {
            type: "text",
            placeholder: "title of group"
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
            isContacts: true
          },
          valid: false,
          errorMessage: "Enter eleven number seperated by a comma",
          touch: false
        }
      },
      isFormValid: false,
      isLoading: false,
      isFormError: false,
      isFormSuccess: "",
      isform: false,
      isGroupId: "",
      pageTitle: "",
      file: null,
      isUpload: false
    };
    this.submitHandler = this.submitHandler.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }
  updateFields = (data, title, id, load) => {
    const newForm = { ...this.state.form };
    for (let key in newForm) {
      newForm[key].value = data[key];
      newForm[key].valid = true;
    }
    this.setState({
      form: newForm,
      pageTitle: title,
      isGroupId: id,
      isLoading: load
    });
  };

  componentDidMount() {
    const groupId = this.props.match.params.id;
    if (!groupId) {
      this.setState({ pageTitle: "Add New Group" });
    } else {
      this.setState({ isLoading: true });
      this.props.dispatch(detailGroup(groupId)).then(() => {
        const group = this.props.isGroup.groups;
        this.updateFields(group, `Edit ${group.title}`, group._id, false);
      });
    }
  }

  onChange(e) {
    this.setState({ file: e.target.files[0], isUpload: true });
  }

  fileUpload(file) {
    const url = `${GROUP_SERVER}upload`;
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      header: {
        "content-type": "multipart/form-data"
      }
    };
    return post(url, formData, config);
  }

  inputChangedHandler = (event, formtitle) => {
    const updatedform = {
      ...this.state.form,
      [formtitle]: {
        ...this.state.form[formtitle],
        value: event.target.value,
        valid: checkValidityInput(
          event.target.value,
          this.state.form[formtitle].validation
        ),
        touch: true
      }
    };
    let validForm = true;
    for (let inputKey in this.state.form) {
      validForm = updatedform[inputKey].valid && validForm;
    }
    this.setState({ form: updatedform, isFormValid: validForm });
  };

  submitHandler = (event, format) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    let submitData = {};
    for (let key in this.state.form) {
      submitData[key] = this.state.form[key].value;
    }
    if (!this.state.isUpload) {
      if (this.state.isFormValid) {
        if (this.state.pageTitle === "Add New Group") {
          this.props.dispatch(newGroup(submitData)).then(res => {
            if (res.payload.success) {
              this.setState({ isLoading: false, isFormSuccess: true });
            } else {
              this.setState({
                isLoading: false,
                isFormSuccess: res.payload.success
              });
            }
          });
        } else {
          this.props
            .dispatch(editGroup({ ...submitData, _id: this.state.isGroupId }))
            .then(response => {
              if (response.payload.success) {
                this.setState({
                  isLoading: false,
                  isFormSuccess: true
                });
              } else {
                this.setState({
                  isLoading: false,
                  isFormSuccess: response.payload.success
                });
              }
            });
        }
      } else {
        this.setState({ isLoading: false, isFormError: true });
      }
    } else {
      if (this.state.isFormValid || this.state.isUpload) {
        if (this.state.pageTitle === "Add New Group") {
          this.fileUpload(this.state.file).then(response => {
            submitData = { ...submitData, contacts: response.data.contact };
            if (submitData.contacts.length !== 0) {
              this.props.dispatch(newGroup(submitData)).then(res => {
                if (res.payload.success) {
                  this.setState({ isLoading: false, isFormSuccess: true });
                  console.log(res.payload)
                } else {
                  this.setState({
                    isLoading: false,
                    isFormSuccess: res.payload.success
                  });
                  console.log(res.payload)

                }
              });
            } else {
              this.setState({
                isLoading: false,
                isFormSuccess: "The file do not contain phone numbers"
              });
            }
          });
        } else {
          this.fileUpload(this.state.file).then(response => {
            submitData = { ...submitData, contacts: response.data.contact };
            if (submitData.contacts.length !== 0) {
              this.props
                .dispatch(
                  editGroup({ ...submitData, _id: this.state.isGroupId })
                )
                .then(res => {
                  if (res.payload.success) {
                    this.setState({ isLoading: false, isFormSuccess: true });
                  } else {
                    this.setState({
                      isLoading: false,
                      isFormSuccess: res.payload.success
                    });
                  }
                });
            } else {
              this.setState({
                isLoading: false,
                isFormSuccess: "The file do not contain phone numbers"
              });
            }
          });
        }
      }
    }
  };

  render() {
    const title = this.state.form.title;
    const contact = this.state.form.contacts;
    console.log(this.state)
    return (
      <div className="wrap">
        <div className="content">
          <h2>{this.state.pageTitle}</h2>
          {!this.state.isUpload ? (
            <form onSubmit={e => this.submitHandler(e)}>
              <FormField
                elementType={title.elementType}
                elementConfig={title.elementConfig}
                value={title.value}
                invalid={!title.valid}
                shouldValidate={title.validation}
                touched={title.touch}
                changed={event => this.inputChangedHandler(event, "title")}
              />
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
              <div className="center-align">Or</div>
              <input type="file" onChange={this.onChange} />
              <div className="center-align">
                {this.state.isLoading ? (
                  <CircularProgress
                    thickness={7}
                    style={{ color: "#ee6e73" }}
                  />
                ) : (
                  <Button
                    disabled={!this.state.isFormValid}
                    onClick={e => this.submitHandler(e)}
                    style={{
                      borderRadius: "5px",
                      background: "#ee6e73",
                      width: "50%",
                      color: "#fff",
                      cursor: !this.state.isFormValid && !this.state.isUpload
                        ? "not-allowed"
                        : "pointer"
                    }}
                  >
                    {this.state.pageTitle === "Add New Group"
                      ? "Add Group"
                      : "Edit Group"}
                  </Button>
                )}
              </div>
            </form>
          ) : (
            <form onSubmit={e => this.submitHandler(e)}>
              <FormField
                elementType={title.elementType}
                elementConfig={title.elementConfig}
                value={title.value}
                invalid={!title.valid}
                shouldValidate={title.validation}
                touched={title.touch}
                changed={event => this.inputChangedHandler(event, "title")}
              />
              <input type="file" onChange={this.onChange} />
              <div className="center-align">
                {this.state.isLoading ? (
                  <CircularProgress
                    thickness={7}
                    style={{ color: "#ee6e73" }}
                  />
                ) : (
                  <Button
                    disabled={!this.state.isFormValid && !this.state.isUpload}
                    onClick={e => this.submitHandler(e)}
                    style={{
                      borderRadius: "5px",
                      background: "#ee6e73",
                      width: "50%",
                      color: "#fff",
                      cursor: !this.state.isFormValid && !this.state.isUpload
                        ? "not-allowed"
                        : "pointer"
                    }}
                  >
                    {this.state.pageTitle === "Add New Group"
                      ? "Add Group"
                      : "Edit Group"}
                  </Button>
                )}
              </div>
            </form>
          )}
          {this.state.isFormSuccess === 'true' ? "Group Added" : this.state.isFormSuccess}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isGroup: state.group
  };
}

export default connect(mapStateToProps)(EditGroup);
