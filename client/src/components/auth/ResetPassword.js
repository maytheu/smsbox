import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";

import "./auth.css";
import { checkValidityInput } from "../util/form/formActions";
import FormField from "../util/form/FormField";

class ResetPassword extends Component {
  state = {
    form: {
      password: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password"
        },
        value: "",
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touch: false
      },
      confirmPassword: {
        elementType: "input",
        elementConfig: {
          type: "password",
          placeholder: "Password"
        },
        value: "",
        validation: {
          required: true,
          minLength: 6
        },
        valid: false,
        touch: false
      }
    },
    isFormValid: false,
    isLoading: false,
    isFormError: false,
    isSuccess: false,
    resetToken: ""
  };

  // componentDidMount() {
  //   const resetToken = this.props.match.params.token;
  //   this.setState({ resetToken });
  // }

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

  submitHandler = event => {
    event.preventDefault();
    this.setState({ isLoading: true });
    let submitData = {};
    let validForm = true;
    for (let key in this.state.form) {
      submitData[key] = this.state.form[key].value;
      validForm = this.state.form[key].valid && validForm;
    }
    if (validForm) {
    } else {
      this.setState({ isLoading: false, isFormError: true, isSuccess: false });
    }
  };
  render() {
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
          <form onSubmit={e => this.submitHandler(e)}>
            {form}
            {this.state.isLoading ? (
              <CircularProgress thickness={7} style={{ color: "98c5e9" }} />
            ) : (
              <div className="center-align">
                <Button
                  disabled={!this.state.isFormValid}
                  onClick={e => this.submitHandler(e)}
                  style={{
                    borderRadius: "5px",
                    background: "#ee6e73",
                    width: "50%",
                    color: "#fff",
                    cursor: !this.state.isFormValid ? "none" : "pointer"
                  }}
                >
                  Confirm Passsword
                </Button>
              </div>
            )}
          </form>
          {this.state.isSuccess ? (
            <div className="form_success">
              <Link to="/signin">sign in</Link>
            </div>
          ) : this.state.isFormError ||
            this.state.isFormError ===
              "Sorry, bad token, generate a new one." ? (
            <div className="error">
              <i className="material-icons">cancel</i>Password do not match
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default ResetPassword;
