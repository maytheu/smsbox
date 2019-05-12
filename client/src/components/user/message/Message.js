import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";

import "./message.css";
import { checkValidityInput } from "../../util/form/formActions";
import FormField from "../../util/form/FormField";

class Message extends Component {
  state = {
    message: {
      contacts: {
        elementType: "textarea",
        elementConfig: {
          placeholder: "Enter phone number seperated by a commma"
        },
        value: "",
        validation: {
          required: true,
          isNumeric: true
        },
        valid: false,
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
      },
      message: {
        elementType: "textarea",
        elementConfig: {
          type: "textarea",
          placeholder: "contact Address"
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
    isFormSuccess: false,
    isMessage: false
  };

  updateFields = newMessagedata => {
    this.setState({
      messagedata: newMessagedata
    });
  };

  componentDidMount() {
    //const group = this.state.message;
    //   this.props.dispatch(getBrands()).then(response => {
    //     const newFormData = populateOptionFields(
    //       formdata,
    //       this.props.products.brands,
    //       "brand"
    //     );
    //     this.updateFields(newFormData);
    //   });
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
      console.log(submitData);
      this.setState({ isFormSuccess: true, isLoading: false });
    } else {
      this.setState({ isLoading: false, isFormError: true });
    }
  };

  render() {
    const contact = this.state.message.contacts;
    const group = this.state.message.groups;
    return (
      <div className="container">
        <div className="message">
          <h2>Compose a new Message</h2>
          <form onSubmit={e => this.submitHandler(e)}>
            <FormField
              elementType={contact.elementType}
              elementConfig={contact.elementConfig}
              value={contact.value}
              invalid={!contact.valid}
              shouldValidate={contact.validation}
              touched={contact.touch}
              changed={event => this.inputChangedHandler(event, "contacts")}
            />
            {group.value === "" ? (
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
            <div className="center-align">
              {this.state.isLoading ? (
                <CircularProgress thickness={7} style={{ color: "#ee6e73" }} />
              ) : (
                <div>
                  <Button
                    disabled={!this.state.isFormValid}
                    onClick={e => this.submitHandler(e)}
                    style={{
                      borderRadius: "5px",
                      background: "#ee6e73",
                      width: "50%",
                      color: "#fff",
                      cursor: !this.state.isFormValid
                        ? "not-allowed"
                        : "pointer"
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
        </div>
      </div>
    );
  }
}

export default Message;
