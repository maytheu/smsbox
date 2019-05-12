import React, { Component } from "react";
import { connect } from "react-redux";

export default function(ComposedClass, userRoute, adminRoute = null) {
  class AuthCheck extends Component {
    componentDidMount() {
      let user = this.props.isUser.userData;
      if (!user.isAuth) {
        if (userRoute) {
          this.props.history.push("/signin");
        }
      } else {
        if (adminRoute && !user.isAdmin) {
          this.props.history.push("/user/dashboard");
        } else {
          if (userRoute === false) {
            this.props.history.push("/user/dashboard");
          }
        }
      }
    }
    render() {
      return <ComposedClass {...this.props} user={this.props.user} />;
    }
  }

  function mapStateToProps(state) {
    return {
      isUser: state.user
    };
  }

  return connect(mapStateToProps)(AuthCheck);
}
