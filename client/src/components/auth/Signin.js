import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import "./auth.css";
import { checkValidityInput } from "../util/form/formActions";
import FormField from "../util/form/FormField";
import fb from "../../assets/icon/facebook.png";
import gp from "../../assets/icon/gplus.png";
import { loginUser, authUser } from "../../actions/userActions";

class Signin extends Component {
  state = {
    form: {
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
      }
    },
    isFormValid: false,
    isLoading: false,
    isFormError: false,
    errorMsg: ""
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
      submitData[key] = this.state.form[key].value;
      validForm = this.state.form[key].valid && validForm;
    }
    if (validForm) {
      this.props.dispatch(loginUser(submitData)).then(response => {
        if (response.payload.loginSuccess) {
          this.props.dispatch(authUser());
          this.setState({ isLoading: false });
          this.props.history.push("/user/dashboard");
        } else {
          this.props.dispatch(authUser());
          this.setState({
            isFormError: true,
            isLoading: false,
            errorMsg: response.payload.message
          });
        }
      });
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
      <div>
        <div className="wrap">
          <div className="login">
            <div className="login_email">
              <form onSubmit={e => this.submitHandler(e)}>
                {form}
                {this.state.isLoading ? (
                  <div className="center-align">
                    <CircularProgress
                      thickness={7}
                      style={{ color: "#ee6e73" }}
                    />
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
                      Signin
                    </Button>
                  </div>
                )}
                <div className="clear" />
                {this.state.isFormError ? <div>{this.state.errorMsg}</div> : ""}
                <p>
                  <Link to="/forget_password">Forget Password</Link>{" "}
                </p>
                <p className="right">
                  <Link to="/sign_up">Sign Up with Email</Link>
                </p>
              </form>
            </div>
            <div className="login_account">
              <div className="span ">
                <a href="/auth/google">
                  <img src={gp} alt="g+ icon" />
                  <i>Sign In with Google+</i>
                </a>
              </div>
              <div className="span1">
                <a href="/auth/facebook">
                  <img src={fb} alt="fb icon" />
                  <i>Sign In with Facebook</i>
                </a>
              </div>
            </div>
            <div className="social">
              <ul>
                <li>Or Sign In Using : </li>
                <li>
                  <a href="/auth/google" className="gp">
                    <span className="fa">
                      <img src={gp} alt="gp" />
                    </span>
                  </a>{" "}
                </li>
                <li>
                  <a href="/auth/facebook" className="fb">
                    <span className="fa">
                      <img src={fb} alt="fb" />
                    </span>
                  </a>{" "}
                </li>
              </ul>
            </div>

            <div className="clear" />
          </div>
        </div>
      </div>
    );
  }
}

export default connect()(Signin);
