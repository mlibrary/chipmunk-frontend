import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route } from "react-router-dom";
import { Margins, UniversalHeader, Heading, GlobalStyleSheet, SPACING } from "@umich-lib/core";
import PackageBrowser from "./package_browser";
import PackageView from "./package_view";
import errorMessage from "./error_message";

function App() {
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
          <BrowserRouter>
            <Route path="/" exact component={PackageBrowser}/>
            <Route path="/artifacts/:id" component={DirectPackage}/>
          </BrowserRouter>
        </main>
      </Margins>
    </div>
  );
}

function DirectPackage({ match }) {
  return (
    <ErroringPackage id={match.params.id}/>
  );
}

class ErroringPackage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: undefined
    }
  }

  render() {
    return (
      <PackageView
        api="/"
        id={this.props.id}
        onError={e => { this.setError(e) }}
        error={this.state.error}
      />
    );
  }

  setError(code) {
    this.setState({ error: errorMessage(code, this.props.id) });
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
