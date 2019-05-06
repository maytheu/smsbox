import React from "react";
import { Switch, Route } from "react-router-dom";

import Header from "./components/header_footer/Header";
import Layout from "./components/hoc/Layout";
import Home from "./components/Home";

function App() {
  return (
    <div>
      <Header />
      <Layout>
        <Switch>
          <Route path="/" exact component={Home} />
        </Switch>
      </Layout>
    </div>
  );
}

export default App;
