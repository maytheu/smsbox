import React, { Component } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Link } from "react-router-dom";

class Dashboard extends Component {
  componentDidMount() {}
  render() {
    return (
      <div className="container">
        <div>
          <div>Name</div>
          <div>Ade Mato</div>
        </div>
        <div>
          <div>Email Address</div>
          <div>maytheu98@gmail.com</div>
        </div>
        <div>
          <div>Credit Balance</div>
          <div>450 unit</div>
        </div>
        <div>
          <Link to="/user/dashboard/edit/">Edit Profile</Link>
          <Link to="/user/pay">Add Credits</Link>
        </div>
      </div>
    );
  }
}

export default Dashboard;
