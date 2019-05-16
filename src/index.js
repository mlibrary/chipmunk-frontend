import React from "react";
import ReactDOM from "react-dom";
import { Header, List, Heading, GlobalStyleSheet } from "@umich-lib/core";

class CHERObjectList extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: []
    };
  }

  componentDidMount() {
    fetch("v1/bags/foo")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            files: result.files,
            external_id: "foo",
            base: "v1/packages/" + result.bag_id + "/"
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      )
  }

  render() {
    const { error, isLoaded, files, external_id, base } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <Heading size="large" level={1}>{external_id}</Heading>

          <List type="bulleted">
            {files.map(file => (
              <li>
                <a href={base + file}>{file}</a>
              </li>
            ))}
          </List>
        </div>
      );
    }
  }
}

function App() {
  return (
    <main style={{ padding: "1rem" }}>
      <GlobalStyleSheet />

      <Header name="CHER" />

      <CHERObjectList />
    </main>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
