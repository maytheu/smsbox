import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";

import { checkValidityInput } from "../util/form/formActions";
import FormField from "../util/form/FormField";
import { registerUser } from "../../actions/userActions";

class SignUp extends Component {
  state = {
    form: {
      name: {
        elementType: "input",
        elementConfig: {
          type: "text",
          placeholder: "Full Name"
        },
        value: "",
        validation: {
          required: true
        },
        valid: false,
        touch: false
      },

      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Email Address"
        },
        value: "",
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touch: false
      },
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
          placeholder: "Confirm Password"
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
    isSuccess: false
  };

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
      if (key !== "confirmPassword") {
        submitData[key] = this.state.form[key].value;
        validForm = this.state.form[key].valid && validForm;
      }
    }
    if (validForm) {
      this.props.dispatch(registerUser(submitData)).then(response => {
        if (response.payload.success) {
          this.setState({ isLoading: false, isSuccess: true });
          setTimeout(() => {
            this.props.history.push("/signin");
          }, 3000);
        } else {
          this.setState({
            isFormError: true,
            isLoading: false
          });
        }
      });
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
              <div className="center-align">
                <CircularProgress thickness={7} style={{ color: "#ee6e73" }} />
              </div>
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
                  Sign Up
                </Button>
              </div>
            )}
          </form>
        </div>
        {this.state.isSuccess
          ? "You will be redirected in less than 3 seconds"
          : this.state.isFormError
          ? "Error submiting form"
          : ""}
      </div>
    );
  }
}

export default connect()(SignUp);
