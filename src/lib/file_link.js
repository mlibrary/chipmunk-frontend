import React from "react";
import { Link } from "@umich-lib/core";

class FileLink extends React.Component {
  render() {
    console.log('props', this.props)

    return (
      <Link to={this.props.base + "/" + "ok"}></Link>
    )
  }
}

export default FileLink;
