import React, { Component } from "react";
import { Link } from "react-router-dom";

class Group extends Component {
  render() {
    return (
      <div>
        show Group
        <div className="fixed-action-btn">
        <Link to="/user/group/new" className="btn-floating btn-large red">
          <i className="material-icons">add</i>
        </Link>
        </div>
      </div>
    );
  }
}

export default Group;
