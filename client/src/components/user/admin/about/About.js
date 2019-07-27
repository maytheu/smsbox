import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import { clearAbout, about } from "../../../../actions/aboutActions";

class About extends Component {
  state = { isLoading: true };

  componentDidMount() {
    this.props.dispatch(about()).then(() => {
      this.setState({ isLoading: false });
    });
  }

  componentWillUnmount() {
    this.props.dispatch(clearAbout());
  }

  showAbout = () =>
    !this.state.isLoading ? (
      <div className="center-align">
        <div
          dangerouslySetInnerHTML={{ __html: this.props.isAbout.about[0].about }}
        />
      </div>
    ) : (
      <div className="center-align">
        <CircularProgress thickness={7} style={{ color: "#ee6e73" }} />
      </div>
    );

  render() {
    return (
      <div className="wrap">
        <div className="content">
          {this.showAbout()}
          {this.props.isAbout.about ? (
            <Link to="/admin/about/edit" className="btn-floating btn-large red">
              <i className="material-icons">add</i> Add New
            </Link>
          ) : (
            <Link to="/admin/about/edit" className="btn-floating btn-large red">
              <i className="material-icons">add</i>Edit
            </Link>
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isAbout: state.about
  };
}

export default connect(mapStateToProps)(About);
