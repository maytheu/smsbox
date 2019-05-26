import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import "../home.css";
import { plan, clearPlan } from "../../../actions/planActions";

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
          <h3>{plan.name}</h3>
          <p>{plan.highlight}</p>
          <div className="right">
            <Link to={`/plan/${plan.link_title}`}>Login to Subscribe</Link>
          </div>
        </div>
      ))
    ) : (
      <div className="center-align">
        <CircularProgress thickness={7} style={{ color: "#ee6e73" }} />
      </div>
    );

  render() {
    return (
      <div>
        <div className="wrap plan">
          <div className="content">{this.viewPlan()}</div>
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
