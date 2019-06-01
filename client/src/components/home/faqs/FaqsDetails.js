import React, { Component } from "react";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

import { viewFaqs } from "../../../actions/faqsActions";

class FaqsDetails extends Component {
  state = { isLoading: true };
  componentDidMount() {
    const faqs = this.props.match.params.title;
    this.props.dispatch(viewFaqs(faqs)).then(() => {
      this.setState({ isLoading: false });
    });
  }

  render() {
    const faqs = this.props.isFaqs.faqs;
    return (
      <div className="wrap">
        <div className="content">
          {!this.state.isLoading ? (
            <div>
              <h4>{faqs.name}</h4>
              <div dangerouslySetInnerHTML={{ __html: faqs.detail }} />
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
    isFaqs: state.faqs
  };
}

export default connect(mapStateToProps)(FaqsDetails);
