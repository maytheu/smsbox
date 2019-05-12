import "materialize-css/dist/css/materialize.min.css";
import React, { Component } from "react";
import { Switch, Route } from "react-router-dom";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import { authUser } from "./actions/userActions";
import AuthCheck from "./components/hoc/AuthCheck";
import Header from "./components/header_footer/Header";
import Layout from "./components/hoc/Layout";
import Home from "./components/home/Home";
import Signin from "./components/auth/Signin";
import ForgetPassword from "./components/auth/ForgetPassword";
import ResetPassword from "./components/auth/ResetPassword";
import SignUp from "./components/auth/SignUp";
import Dashboard from "./components/user/dashboard/Dashboard";
import ManageEmails from "./components/user/admin/ManageEmails";
import Group from "./components/user/group/Group";
import EditGroup from "./components/user/group/EditGroup";
import Message from "./components/user/message/Message";
import EditDashboard from "./components/user/dashboard/EditDashboard";
import Plan from "./components/home/Plan";

class App extends Component {
  state = {
    isLoading: true
  };
  componentDidMount() {
    this.props.dispatch(authUser()).then(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <div className="center-align loader">
            <CircularProgress thickness={7} style={{ color: "#ee6e73" }} />
          </div>
        ) : (
          <div>
            <Header />
            <Layout>
              <Switch>
                <Route
                  path="/signin"
                  exact
                  component={AuthCheck(Signin, false)}
                />
                <Route
                  path="/forget_password"
                  exact
                  component={AuthCheck(ForgetPassword, false)}
                />
                <Route
                  path="/reset_password"
                  exact
                  component={AuthCheck(ResetPassword, false)}
                />
                <Route
                  path="/sign_up"
                  exact
                  component={AuthCheck(SignUp, false)}
                />

                <Route
                  path="/user/new"
                  exact
                  component={AuthCheck(Message, true)}
                />
                <Route
                  path="/user/dashboard"
                  exact
                  component={AuthCheck(Dashboard, true)}
                />
                <Route
                  path="/user/dashboard/edit/:id"
                  exact
                  component={AuthCheck(EditDashboard, true)}
                />
                <Route
                  path="/user/groups"
                  exact
                  component={AuthCheck(Group, true)}
                />
                <Route
                  path="/user/group/edit/:id"
                  exact
                  component={AuthCheck(EditGroup, true)}
                />
                <Route
                  path="/user/group/new"
                  exact
                  component={AuthCheck(EditGroup, true)}
                />

                <Route
                  path="/admin/manage_emails"
                  exact
                  component={AuthCheck(ManageEmails, true, true)}
                />

                <Route path="/plan" exact component={AuthCheck(Plan, null)} />
                <Route path="/" exact component={AuthCheck(Home, null)} />
              </Switch>
            </Layout>
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isUser: state.user
  };
}

export default connect(mapStateToProps)(App);
