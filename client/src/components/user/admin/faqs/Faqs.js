import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import { getFaqs, clearFaqs } from "../../../../actions/faqsActions";

class Faqs extends Component {
  state = { isLoading: true };

  componentDidMount() {
    this.props.dispatch(getFaqs()).then(() => {
      this.setState({ isLoading: false });
    });
  }

  componentWillUnmount() {
    this.props.dispatch(clearFaqs());
  }

  viewFaqs = () =>
    !this.state.isLoading ? (
      this.props.isFaqs.faqs.map(faq => (
        <div key={faq._id}>
          <div className="center-align">
            <Link to={`/admin/faqs/edit/${faq.link_title}`}>
              <h6>{faq.name}</h6>
            </Link>
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
      <div className="wrap">
        <div className="content">
          {this.viewFaqs()}
          <Link to="/admin/faqs/new" className="btn-floating btn-large red">
            <i className="material-icons">add</i>
          </Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFaqs: state.faqs
  };
}

export default connect(mapStateToProps)(Faqs);
