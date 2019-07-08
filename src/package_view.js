import React from "react";
import PackageContents from "./package_contents";
import { Alert, Heading, Link, Loading } from "@umich-lib/core";

class PackageView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      isError: false,
      prevFetch: ""
    };
  }

  render() {
    if (this.props.error) {
      return (
        <Alert intent="error">{this.props.error}</Alert>
      );
    } else if (this.isError()
               || this.props.id === ""
               || typeof this.props.id === "undefined") {
      return (
        <div/>
      );
    } else if (this.isLoaded()) {
      if (this.props.permalink) {
        return (
          <div>
            <Heading level={2} size="S">{this.props.id}</Heading>
            <Link href={this.props.permalink + this.props.id}>Permalink</Link>
            <PackageContents
              base={this.apiPath("v1/packages", this.state.bagResponse.bag_id)}
              files={this.state.bagResponse.files}
            />
          </div>
        );
      } else {
        return (
          <div>
            <Heading level={2} size="S">{this.props.id}</Heading>
            <PackageContents
              base={this.apiPath("v1/packages", this.state.bagResponse.bag_id)}
              files={this.state.bagResponse.files}
            />
          </div>
        );
      }
    } else {
      this.findPackage();
      return (
        <Loading/>
      );
    }
  }

  findPackage() {
    const id = this.props.id;
    if (this.state.prevFetch !== id) {
      fetch(this.apiPath("v1/bags", id)).then(response => {
        this.setState({ prevFetch: id });
        if (response.status >= 200 && response.status < 300) return response.json();
        this.handleError(id, response.status);
      }).then(result => {
        if (typeof result !== "undefined") {
          this.setState({
            id: id,
            isError: false,
            bagResponse: result
          });
        }
      }, error => {
        this.handleError(id, 501);
      });
    }
  }

  apiPath(path, item) {
    if (this.props.api) {
      if (this.props.api.endsWith("/")) return this.props.api + path + "/" + item;
      else return this.props.api + "/" + path + "/" + item;
    } else {
      return path + "/" + item;
    }
  }

  handleError(id, e) {
    if (typeof this.props.onError !== "undefined") this.props.onError(e);
    this.setState({
      id: id,
      isError: true
    });
  }

  isError() {
    return (this.state.isError && this.isLoaded());
  }

  isLoaded() {
    return (this.state.id === this.props.id);
  }
}

export default PackageView;
