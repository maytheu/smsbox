import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

class Dashboard extends Component {
  render() {
    const user = this.props.isUser.userData;
    return (
      <div className="wrap">
        <div className="content">
          <div>
            <div>Name</div>
            <div>{user.name}</div>
          </div>
          <div>
            <div>Email Address</div>
            <div>{user.email}</div>
          </div>
          <div>
            <div>Credit Balance</div>
            <div>{user.units} unit</div>
          </div>

          <p>
            <Link to="/plan">Add Unit</Link>
          </p>
          <p className="right">
            <Link to="/user/dashboard/edit/">Edit Profile</Link>
          </p>
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

export default connect(mapStateToProps)(Dashboard);
