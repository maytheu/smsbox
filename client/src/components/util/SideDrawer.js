import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import "./utils.css";
import { adminLink, navLink, userLink } from "./misc";
import { logoutUser, authUser } from "../../actions/userActions";

const SideDrawer = props => {
  let attachedCSS = ["sidenav", "close"];
  if (props.show) {
    attachedCSS = ["sidenav", "open"];
  }

  const signoutHandler = () => {
    props.dispatch(logoutUser()).then(response => {
      if (response.payload.success) {
        props.dispatch(authUser());
        props.history.push("/");
      }
    });
  };

  const renderNavs = () =>
    props.isUser.userData
      ? !props.isUser.userData.isAuth
        ? navLink.map(nav => (
            <li key={nav.title}>
              <Link to={nav.linkTo}>{nav.title}</Link>
            </li>
          ))
        : props.isUser.userData.isAdmin
        ? adminLink.map(nav => (
            <li key={nav.title}>
              {nav.title === "Logout" ? (
                <Link to="/">
                  <div onClick={signoutHandler}>{nav.title}</div>
                </Link>
              ) : (
                <Link to={nav.linkTo}>{nav.title}</Link>
              )}
            </li>
          ))
        : userLink.map(nav => (
            <li key={nav.title}>
              {nav.title === "Logout" ? (
                <Link to="/">
                  <div onClick={signoutHandler}>{nav.title}</div>
                </Link>
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

  return (
    <div className={attachedCSS.join(" ")} onClick={props.close}>
      <ul>{renderNavs()} </ul>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    isUser: state.user
  };
}

export default connect(mapStateToProps)(withRouter(SideDrawer));
