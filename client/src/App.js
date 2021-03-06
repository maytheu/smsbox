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
import EditDashboard from "./components/user/dashboard/EditDashboard";
import Emails from "./components/user/admin/emails/Emails";
import Group from "./components/user/group/Group";
import EditGroup from "./components/user/group/EditGroup";
import Plan from "./components/home/plan/Plan";
import Faqs from "./components/home/faqs/Faqs";
import AdminFaqs from "./components/user/admin/faqs/Faqs";
import PlanDetails from "./components/home/plan/PlanDetails";
import Paystack from "./components/user/Paystack";
import AddEditFaqs from "./components/user/admin/faqs/AddEditFaqs";
import AddEditPlan from "./components/user/admin/plan/AddEditPlan";
import AdminPlan from "./components/user/admin/plan/Plan";
import FaqsDetails from "./components/home/faqs/FaqsDetails";
import Message from "./components/user/message/Message";
import ManageEmails from "./components/user/admin/emails/ManageEmails";
import AdminAbout from "./components/user/admin/about/About";
import EditAbout from "./components/user/admin/about/EditAbout";
import About from "./components/home/About";

class App extends Component {
  state = {
    isLoading: true
  };
  componentDidMount() {
    document.title = "SmsBox";
    this.props.dispatch(authUser()).then(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    return (
      <div>
        {this.state.isLoading ? (
          <div className="sms_bck">
            <div className="center-align loader">
              <CircularProgress thickness={7} style={{ color: "#ffffff" }} />
            </div>
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
                  path="/user/dashboard/edit"
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
                  path="/buy/:plan"
                  exact
                  component={AuthCheck(Paystack, true)}
                />

                <Route
                  path="/admin/manage_emails"
                  exact
                  component={AuthCheck(Emails, true, true)}
                />
                <Route
                  path="/admin/faqs"
                  exact
                  component={AuthCheck(AdminFaqs, true, true)}
                />
                <Route
                  path="/admin/faqs/edit/:title"
                  exact
                  component={AuthCheck(AddEditFaqs, true, true)}
                />
                <Route
                  path="/admin/faqs/new"
                  exact
                  component={AuthCheck(AddEditFaqs, true, true)}
                />
                <Route
                  path="/admin/plan"
                  exact
                  component={AuthCheck(AdminPlan, true, true)}
                />
                <Route
                  path="/admin/plan/new"
                  exact
                  component={AuthCheck(AddEditPlan, true, true)}
                />
                <Route
                  path="/admin/plan/edit/:page"
                  exact
                  component={AuthCheck(AddEditPlan, true, true)}
                />
                <Route
                  path="/admin/email/:title"
                  exact
                  component={AuthCheck(ManageEmails, true, true)}
                />
                <Route
                  path="/admin/about_us"
                  exact
                  component={AuthCheck(AdminAbout, true, true)}
                />
                <Route
                  path="/admin/about/edit"
                  exact
                  component={AuthCheck(EditAbout, true, true)}
                />

                <Route path="/faqs" exact component={AuthCheck(Faqs, null)} />
                <Route
                  path="/faqs/:title"
                  exact
                  component={AuthCheck(FaqsDetails, null)}
                />
                <Route path="/plan" exact component={AuthCheck(Plan, null)} />
                <Route
                  path="/plan/:title"
                  exact
                  component={AuthCheck(PlanDetails, null)}
                />
                <Route
                  path="/about_us"
                  exact
                  component={AuthCheck(About, null)}
                />
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
