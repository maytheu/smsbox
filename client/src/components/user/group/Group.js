import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";

import { groups, deleteGroup } from "../../../actions/groupActions";

class Group extends Component {
  state = { isLoading: true };
  componentDidMount() {
    this.props.dispatch(groups()).then(() => {
      this.setState({ isLoading: false });
    });
  }

  delete = (id) => {
    this.props.dispatch(deleteGroup(id))
  }

  showGroup = () => (
    <div className="wrap">
      <div className="content">
        {this.state.isLoading ? (
          <div className="center-align">
            <CircularProgress thickness={7} style={{ color: "#ee6e73" }} />
          </div>
        ) : this.props.isGroup.groups.length !== 0 ? (
          this.props.isGroup.groups.map(group => (
            <div key={group._id}>
              <Link to={`/user/group/edit/${group._id}`}>{group.title}</Link>
              <Button onClick={() =>this.delete(group._id)}>
                <i className="material-icons">cancel</i>
              </Button>
            </div>
          ))
        ) : (
          "You do not have any group"
        )}
      </div>
    </div>
  );
  render() {
    return (
      <div>
        {this.showGroup()}
        <div className="fixed-action-btn">
          <Link to="/user/group/new" className="btn-floating btn-large red">
            <i className="material-icons">add</i>
          </Link>
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    isGroup: state.group
  };
}

export default connect(mapStateToProps)(Group);
