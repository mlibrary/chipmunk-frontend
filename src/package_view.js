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
    } else if (this.isErrorOrEmpty()) {
      return null;
    } else if (this.isLoaded()) {
      return (
        <div>
          <Heading level={2} size="S">{this.props.id}</Heading>
          { this.props.permalink
            ? <Link href={this.props.permalink + this.props.id}>Permalink</Link>
            : null }
          <PackageContents
            base={this.apiPath("v1/packages", this.state.bagResponse.bag_id)}
            files={this.state.bagResponse.files}
          />
        </div>
      );
    } else {
      this.findPackage();
      return (
        <Loading/>
      );
    }
  }

  isErrorOrEmpty() {
    return (this.isError()
            || this.props.id === ""
            || typeof this.props.id === "undefined");
  }

  isError() {
    return (this.state.isError && this.isLoaded());
  }

  isLoaded() {
    return (this.state.id === this.props.id);
  }

  findPackage() {
    if (!this.fetchHasBeenRun()) {
      this.fetchCurrentPackage().then(response => {
        if (this.responseSucceeded(response)) {
          this.handleSuccess(response);
        } else {
          this.handleError(response.status);
        }
      });
    }
  }

  fetchHasBeenRun() {
    return (this.state.prevFetch === this.props.id);
  }

  fetchCurrentPackage() {
    return fetch(this.apiPath("v1/bags", this.props.id)).then(data => {
      this.setState({ prevFetch: this.props.id });
      return data;
    });
  }

  apiPath(path, item) {
    if (this.props.api) {
      return this.props.api + path + "/" + item;
    } else {
      return path + "/" + item;
    }
  }

  responseSucceeded(response) {
    return (response.status === 200);
  }

  handleSuccess(response) {
    response.json().then(responseBody => {
      this.addResponseToState(responseBody);
    }, () => {
      this.handleError(501);
    });
  }

  addResponseToState(response) {
    this.setState({
      bagResponse: response,
      id: this.props.id,
      isError: false
    });
  }

  handleError(code) {
    if (this.props.onError) this.props.onError(code);
    this.setState({
      id: this.props.id,
      isError: true
    });
  }
}

export default PackageView;
