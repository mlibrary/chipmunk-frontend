import React from "react";
import ReactDOM from "react-dom";
import { Margins, UniversalHeader, Heading, GlobalStyleSheet, SPACING } from "@umich-lib/core";
import PackageBrowser from "./package_browser";

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
          <PackageBrowser />
        </main>
      </Margins>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
