import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import "./header.css";
import logo from '../../assets/logo.png'
import SideDrawer from "../util/SideDrawer";
import { navLink, userLink, adminLink } from "../util/misc";
import { logoutUser, authUser } from "../../actions/userActions";

class Header extends Component {
  state = {
    isSideDrawer: false
  };

  closeSideDrawerHandler = () => {
    this.setState({ isSideDrawer: false });
  };

  sideDrawerHandler = () => {
    this.setState(prevState => {
      return { isSideDrawer: !prevState.isSideDrawer };
    });
  };
  signoutHandler = () => {
    this.props.dispatch(logoutUser()).then(response => {
      if (response.payload.success) {
        this.props.dispatch(authUser());
        this.props.history.push("/");
      }
    });
  };

  renderNavs = () =>
    this.props.isUser.userData
      ? !this.props.isUser.userData.isAuth
        ? navLink.map(nav => (
            <li key={nav.title}>
              <Link to={nav.linkTo}>{nav.title}</Link>
            </li>
          ))
        : this.props.isUser.userData.isAdmin
        ? adminLink.map(nav => (
            <li key={nav.title}>
              {nav.title === "Logout" ? (
                <div onClick={this.signoutHandler}>
                  <Link to='/'>{nav.title}</Link>
                </div>
              ) : (
                <Link to={nav.linkTo}>{nav.title}</Link>
              )}
            </li>
          ))
        : userLink.map(nav => (
            <li key={nav.title}>
              {nav.title === "Logout" ? (
                <div onClick={this.signoutHandler}>
                  <Link to='/'>{nav.title}</Link>
                </div>
              ) : (
                <Link to={nav.linkTo}>{nav.title}</Link>
              )}
            </li>
          ))
      : navLink.map(nav => (
          <li key={nav.title}>
            <Link to={nav.linkTo}>{nav.title}</Link>
          </li>
        ));

  render() {
    console.log(this.props);
    return (
      <div>
        <nav>
          <div className="nav-wrapper">
            <Link to="/">
              <div className="brand-logo">
                <div><img src={logo} alt='logo' /></div>
              </div>
            </Link>
            <div className="mobile" onClick={this.sideDrawerHandler}>
              <i className="material-icons">menu</i>
            </div>
            <SideDrawer
              show={this.state.isSideDrawer}
              close={this.closeSideDrawerHandler}
            />
            <ul className="right hide-on-med-and-down">{this.renderNavs()}</ul>
          </div>
        </nav>
        <div className='clear'/>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isUser: state.user
  };
}

export default connect(mapStateToProps)(withRouter(Header));
