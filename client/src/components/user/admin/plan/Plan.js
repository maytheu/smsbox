import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import { plan, clearPlan } from "../../../../actions/planActions";

class Plan extends Component {
  state = { isLoading: true };

  componentDidMount() {
    this.props.dispatch(plan()).then(() => {
      this.setState({ isLoading: false });
    });
  }

  componentWillUnmount() {
    this.props.dispatch(clearPlan());
  }

  viewPlan = () =>
    !this.state.isLoading ? (
      this.props.isPlan.plans.map(plan => (
        <div key={plan._id}>
          <Link to={`/admin/plan/edit/${plan.link_title}`}>
            <h5>{plan.name}</h5>
          </Link>
        </div>
      ))
    ) : (
      <div className="center-align">
        <CircularProgress thickness={7} style={{ color: "#ee6e73" }} />
      </div>
    );

  render() {
    return (
      <div className="wrap">
        <div className="content">
          {this.viewPlan()}
          <Link to="/admin/plan/new" className="btn-floating btn-large red">
            <i className="material-icons">add</i>
          </Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isPlan: state.plan
  };
}

export default connect(mapStateToProps)(Plan);
