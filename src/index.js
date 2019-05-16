import React from "react";
import ReactDOM from "react-dom";
import { Margins, List, Link, Heading, GlobalStyleSheet, SPACING } from "@umich-lib/core";

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
    fetch("v1/bags/" + this.props.package)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            files: result.files,
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
    const { error, isLoaded, files, base } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <Heading size="XL" level={1} style={{ marginBottom: SPACING['XL'] }}>{this.props.package}</Heading>

          <List type="bulleted">
            {files.map((file, i) => (
              <li key={file + i} style={{ marginBottom: '1rem' }}>
                <Link href={base + file}>{file}</Link>
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
      <Margins>
        <GlobalStyleSheet />
        <CHERObjectList package="39015091568421" />
      </Margins>
    </main>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
