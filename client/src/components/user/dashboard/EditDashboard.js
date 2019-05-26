import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import {
  checkValidityInput,
  populateFields
} from "../../util/form/formActions";
import FormField from "../../util/form/FormField";

class EditDashboard extends Component {
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
      }
    },
    isFormValid: false,
    isLoading: false,
    isFormError: false,
    errorMsg: ""
  };

  componentDidMount() {
    const user = this.props.isUser.userData;
    const newFormData = populateFields(this.state.formd, user);
    this.setState({
      form: newFormData
    });
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
      //   this.props.dispatch(loginUser(submitData)).then(response => {
      //     if (response.payload.loginSuccess) {
      //       this.props.dispatch(authUser());
      //       this.setState({ isLoading: false });
      //       this.props.history.push("/user/dashboard");
      //     } else {
      //       this.props.dispatch(authUser());
      //       this.setState({
      //         isFormError: true,
      //         isLoading: false,
      //         errorMsg: response.payload.message
      //       });
      //     }
      //   });
    } else {
      this.setState({ isLoading: false, isFormError: true });
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
                  Update Personal Information
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
    isUser: state.user
  };
}

export default connect(mapStateToProps)(EditDashboard);
