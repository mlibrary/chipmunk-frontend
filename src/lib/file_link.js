import React from "react";
import { Link } from "@umich-lib/core";

class FileLink extends React.Component {
  render() {
    return (
      <Link href={this.props.base + "/" + "ok"} />
    )
  }
}

export default FileLink;
