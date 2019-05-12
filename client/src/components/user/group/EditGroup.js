import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { checkValidityInput } from "../../util/form/formActions";
import FormField from "../../util/form/FormField";

class EditGroup extends Component {
  state = {
    message: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "title of group"
        },
        value: "",
        validation: {
          required: true,
          isEmail: true
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
          isNumeric: true
        },
        valid: false,
        touch: false
      }
    },
    isFormValid: false,
    isLoading: false,
    isFormError: false,
    isFormSuccess: false,
    isMessage: false,
    isGroupId: "",
    pageTitle: ""
  };

  componentDidMount() {
    const groupId = this.props.match.params.id;
    if (!groupId) {
      this.setState({ pageTitle: "Add New Group" });
    }else{
      this.setState({pageTitle: 'Edit Group'})
    }
  }

  inputChangedHandler = (event, messageName) => {
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
    this.setState({ message: updatedMessage, isFormValid: validForm });
  };

  submitHandler = event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    let submitData = {};
    let validForm = true;
    for (let key in this.state.message) {
      submitData[key] = this.state.message[key].value;
      validForm = this.state.m[key].valid && validForm;
    }
    if (validForm) {
      if (this.state.pageTitle === "Add New Group") {
        ///new group dispatch
        console.log(submitData);
        this.setState({ isFormSuccess: true, isLoading: false });
      } else {
        console.log(submitData);
        this.setState({ isFormSuccess: true, isLoading: false });
      }
    } else {
      this.setState({ isLoading: false, isFormError: true });
    }
  };

  render() {
    const name = this.state.message.name;
    const contact = this.state.message.contacts;
    return (
      <div className="container">
      <h2>{this.state.pageTitle}</h2>
        <form onSubmit={e => this.submitHandler(e)}>
          <FormField
            elementType={name.elementType}
            elementConfig={name.elementConfig}
            value={name.value}
            invalid={!name.valid}
            shouldValidate={name.validation}
            touched={name.touch}
            changed={event => this.inputChangedHandler(event, "name")}
          />
          <FormField
            elementType={contact.elementType}
            elementConfig={contact.elementConfig}
            value={contact.value}
            invalid={!contact.valid}
            shouldValidate={contact.validation}
            touched={contact.touch}
            changed={event => this.inputChangedHandler(event, "contacts")}
          />
          <div className="center-align">
            {this.state.isLoading ? (
              <CircularProgress thickness={7} style={{ color: "#ee6e73" }} />
            ) : (
              <Button
                disabled={!this.state.isFormValid}
                onClick={e => this.submitHandler(e)}
                style={{
                  borderRadius: "5px",
                  background: "#ee6e73",
                  width: "50%",
                  color: "#fff",
                  cursor: !this.state.isFormValid ? "not-allowed" : "pointer"
                }}
              >
                {this.state.pageTitle === "Add New Group"
                  ? "Add Group"
                  : "Edit Group"}
              </Button>
            )}
          </div>
        </form>
      </div>
    );
  }
}

export default EditGroup;
