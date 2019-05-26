import React, { Component } from "react";
import PaystackButton from "react-paystack";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

import { viewPlan } from "../../actions/planActions";
import { checkValidityInput } from "../util/form/formActions";
import FormField from "../util/form/FormField";

class Paystack extends Component {
  state = {
    form: {
      email: {
        elementType: "input",
        elementConfig: {
          type: "email",
          placeholder: "Enter Your Email Address"
        },
        value: "",
        validation: {
          required: true,
          isEmail: true
        },
        valid: false,
        touch: false
      },
      amount: {
        elementType: "input",
        elementConfig: {
          type: "number",
          placeholder:
            "Enter the amount you wish to pay, must be greater than N500"
        },
        value: "",
        validation: {
          required: true,
          isNumeric: true,
          minAmount: 500
        },
        valid: false,
        touch: false
      }
    },
    isFormValid: false,
    isLoading: false,
    isFormError: false,
    isSuccess: false,
    key: process.env.REACT_APP_PAYSTACK_PUBLIC,
    name: "",
    email: "",
    amount: ""
  };

  componentDidMount() {
    const planType = this.props.match.params.plan;
    const user = this.props.isUser.userData;
    this.props.dispatch(viewPlan(planType)).then(() => {
      const plan = this.props.isPlan.plans;
      this.setState({
        amount: plan.amount * 100,
        email: user.email,
        name: user.name
      });
    });
  }

  callback = response => {
    // this.props
    //   .dispatch(
    //     userBuy({ shows: this.props.isMovies.upcoming, payment: response })
    //   )
    //   .then(response => {
    //     if (response.payload.success) {
    //       setTimeout(() => {
    //         this.props.history.push("/");
    //       }, 3000);
    //     }
    //   });
  };

  close = () => {
    this.props.history.push("/");
  };

  getReference = () => {
    let text = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";
    for (let i = 0; i < 15; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
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

  submitHandler = (event, type) => {
    event.preventDefault();
    this.setState({ isLoading: true });
    let submitData = {};
    let validForm = true;
    for (let key in this.state.form) {
      submitData[key] = this.state.form[key].value;
      validForm = this.state.form[key].valid && validForm;
    }
    if (this.state.isFormValid) {
      if (type === "email") {
      }
      //   this.props.dispatch(userEmail(submitData)).then(response => {
      //     if (response.payload.success) {
      //       this.setState({
      //         isLoading: false,
      //         email: submitData.email
      //       });
      //     } else {
      //       this.setState({
      //         isLoading: false,
      //         isFormError: response.payload.message
      //       });
      //     }
      //   });
    } else {
      this.setState({ isLoading: false, isFormError: true });
    }
  };

  render() {
    const email = this.state.form.email;
    const amount = this.state.form.amount;
    const style = {borderRadius: "5px",
    background: "#ee6e73",
    width: "50%",
    color: "#fff",
    cursor: !this.state.isFormValid ? "none" : "pointer"}
    return (
      <div className="wrap">
        <div className="content">
          {this.state.amount === 0 || this.state.email === undefined ? (
            this.state.amount === 0 ? (
              <form onSubmit={e => this.submitHandler(e, "amount")}>
                <FormField
                  elementType={amount.elementType}
                  elementConfig={amount.elementConfig}
                  value={amount.value}
                  invalid={!amount.valid}
                  shouldValidate={amount.validation}
                  touched={amount.touch}
                  changed={event => this.inputChangedHandler(event, "amount")}
                />
                {this.state.isLoading ? (
                  <CircularProgress thickness={7} style={{ color: "98c5e9" }} />
                ) : (
                  <Button
                    disabled={!this.state.isFormValid}
                    onClick={e => this.submitHandler(e, "amount")}
                    style={style}
                  >
                    Input Amount
                  </Button>
                )}
              </form>
            ) : (
              <form onSubmit={e => this.submitHandler(e, "email")}>
                <FormField
                  elementType={email.elementType}
                  elementConfig={email.elementConfig}
                  value={email.value}
                  invalid={!email.valid}
                  shouldValidate={email.validation}
                  touched={email.touch}
                  changed={event => this.inputChangedHandler(event, "email")}
                />
                {this.state.isLoading ? (
                                <div className="center-align">
                  <CircularProgress thickness={7} style={{ color: "98c5e9" }} />
</div>) : (
                  <div className="center-align">
                  <Button
                    disabled={!this.state.isFormValid}
                    onClick={e => this.submitHandler(e, "email")}
                    style={style}
                  >
                    Submit Email
                  </Button>
                  </div>
                )}
              </form>
            )
          ) : (
            <PaystackButton
              text="Make Payment"
              class="payButton"
              callback={this.callback}
              close={this.close}
              disabled={true}
              embed={true}
              reference={this.getReference()}
              email={this.state.email}
              amount={this.state.amount}
              paystackkey={this.state.key}
              tag="button"
            />
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isUser: state.user,
    isPlan: state.plan
  };
}

export default connect(mapStateToProps)(Paystack);
