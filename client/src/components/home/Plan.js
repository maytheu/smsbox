import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Plan extends Component {
  render() {
    const user = this.props.isUser.userData;
    return (
      <div className="container">
        <div className="plan">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <Link to={user.isAuth ? "/user/pay" : "/signin"}>
            {user.isAuth ? "Subscribe with #5000" : "Login to Subscribe"}
          </Link>
        </div>
        <div className="plan">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <Link to={user.isAuth ? "/user/pay" : "/signin"}>
            {user.isAuth ? "Subscribe with #3000" : "Login to Subscribe"}
          </Link>
        </div>
        <div className="plan">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
          <Link to={user.isAuth ? "/user/pay" : "/signin"}>
            {user.isAuth ? "Pay G" : "Login to Pay G"}
          </Link>
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

export default connect(mapStateToProps)(Plan);
