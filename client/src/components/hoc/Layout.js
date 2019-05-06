import React from "react";

import Footer from "../header_footer/Footer";

const Layout = props => {
  return (
    <div>
      {props.children}
      <Footer />
    </div>
  );
};

export default Layout;
