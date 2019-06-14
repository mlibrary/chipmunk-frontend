import React from "react";
import ReactDOM from "react-dom";
import { Margins, UniversalHeader, Heading, GlobalStyleSheet, SPACING } from "@umich-lib/core";
import PackageBrowser from "./package_browser";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function App({ match }) {
  return (
    <div>
      <GlobalStyleSheet/>
      <UniversalHeader/>

      <Margins>
        <main style={{
          maxWidth: '38rem'
        }}>
          <Heading level={1} size="3XL" style={{
            marginTop: SPACING['2XL'],
            marginBottom: SPACING['XL']
          }}>CHER Package Browser</Heading>

          <PackageBrowser packageId={ match.params.id }/>
        </main>
      </Margins>
    </div>
  );
}

function AppRouter() {
    return (
        <Router>
          <Route path="/" exact component={App} />
          <Route path="/p/:id" component={App} />
        </Router>
      );
  }

const rootElement = document.getElementById("root");
ReactDOM.render(<AppRouter />, rootElement);
