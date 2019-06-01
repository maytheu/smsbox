import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";

import { viewPlan } from "../../../actions/planActions";

class PlanDetails extends Component {
  state = { isLoading: false };
  componentDidMount() {
    const plan = this.props.match.params.title;
    this.props.dispatch(viewPlan(plan)).then(() => {
      this.setState({ isLoading: true });
    });
  }
  render() {
    const plan = this.props.isPlan.plans;
    const user = this.props.isUser.userData;
    return (
      <div className="wrap">
        <div className="content">
          {this.state.isLoading ? (
            <div>
              <h4>{plan.name}</h4>
             <div dangerouslySetInnerHTML={{__html: plan.detail}}/>
              <div className="right">
                <Link
                  to={user.isAuth ? `/buy/${plan.link_title}` : "/signin"}
                >
                  {user.isAuth ? "Purchase Plan" : "Login to Purchase plan"}
                </Link>
              </div>
            </div>
          ) : (
            <div className="center-align">
              <CircularProgress thickness={7} style={{ color: "#ee6e73" }} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isUser: state.user,
    isPlan: state.plan
  };
}

export default connect(mapStateToProps)(PlanDetails);
