import React from "react";
import ReactDOM from "react-dom";
import { Margins, UniversalHeader, Heading, GlobalStyleSheet } from "@umich-lib/core";
import PackageBrowser from "./package_browser";

function App() {
  return (
    <main style={{ padding: "1rem" }}>
      <GlobalStyleSheet/>
      <UniversalHeader/>

      <Margins>
        <Heading level={2} size="2XL">CHER Package Browser</Heading>
        <PackageBrowser/>
      </Margins>
    </main>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
