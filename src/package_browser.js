import React from "react";
import SearchForm from "./search_form";
import PackageContents from "./package_contents";
import { Heading, Alert, Loading } from "@umich-lib/core";

class PackageBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: ""
    };
  }

  switchPackage(id) {
    this.setState({ id: id });
  }

  render() {
    return (
      <div>
        <SearchForm onHandleSubmit={(id) => { this.switchPackage(id); }}/>
        <br/>
        <PackageDisplay api={this.props.api} package={this.state.id}/>
      </div>
    );
  }
}

class PackageDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: (props.package === ""),
      errorStatus: null
    };
  }

  componentDidUpdate(prevProps) {
    if(this.props.package !== prevProps.package) {
      this.setState({
        isLoaded: (this.props.package === ""),
        errorStatus: null
      });
    }

    if(!this.state.isLoaded) {
      this.tryToLoad();
    }
  }

  componentDidMount() {
    this.tryToLoad();
  }

  tryToLoad() {
    if(this.state.isLoaded) {
      return;
    }

    const base = this.props.api ? this.props.api + "/" : "";

    fetch(base + "v1/bags/" + this.props.package).then(result => {
      if(result.status >= 200 && result.status < 300) return result.json();
      this.setState({
        isLoaded: true,
        errorStatus: result.status
      });
    }).then(result => {
      if(result) {
        this.setState({
          isLoaded: true,
          files: result.files,
          base: base + "v1/packages/" + result.bag_id
        });
      }
    }, error => {
      this.setState({
        isLoaded: true,
        errorStatus: "error parsing json"
      });
    });
  }

  render() {
    if(this.state.isLoaded) {
      if(this.state.errorStatus) {
        return (
          <Alert intent="error">Error: could not retrieve {this.props.package} ({this.state.errorStatus})</Alert>
        );
      }

      if(this.props.package === "") {
        return (
          <Alert intent="informational">Enter an identifier to view a package.</Alert>
        );
      }

      return (
        <div>
          <Heading level={2} size="S">{this.props.package}</Heading>
          <PackageContents base={this.state.base} files={this.state.files}/>
        </div>
      );
    }

    return (
      <Loading/>
    );
  }
}

export default PackageBrowser;
