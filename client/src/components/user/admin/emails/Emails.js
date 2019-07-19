import React, { Component } from "react";
import { Link } from "react-router-dom";

class Emails extends Component {
  componentDidMount(){
    document.title = 'Manage Emails - SmsBox'
  }
  render() {
    return (
      <div className="wrap">
        <div className="content">
          <li>
            <Link to="/admin/email/updates">Send Updates</Link>
          </li>
          <li>
            <Link to="/admin/email/promotions">Send Promotions</Link>
          </li>
          <li>
            <Link to="/admin/email/reminder">Send Remider</Link>
          </li>
        </div>
      </div>
    );
  }
}

export default Emails;
