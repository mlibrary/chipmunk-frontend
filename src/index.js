import React from "react";
import ReactDOM from "react-dom";
import { Header, List, Heading, GlobalStyleSheet } from "@umich-lib/core";
import BagBrowser from "./bag_browser";

function App() {
  return (
    <main style={{ padding: "1rem" }}>
      <GlobalStyleSheet />

      <Header name="CHER" />

      <BagBrowser/>
    </main>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
