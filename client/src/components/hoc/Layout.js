import React from "react";

import sms from "../../assets/icon/bg.png";

import Footer from "../header_footer/Footer";

const Layout = props => {
  return (
    <div>
      <div style={{ minHeight: "90vh", background: `url(${sms})` }}>
        {props.children}
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
