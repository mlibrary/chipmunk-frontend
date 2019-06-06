import React from "react";
import SearchForm from "./search_form";
import PackageContents from "./package_contents";
import { Heading, Alert, Loading } from "@umich-lib/core";

          //<Alert intent="error">Error: could not retrieve {this.props.package} ({this.state.errorStatus})</Alert>
class PackageBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: (props.value || ""),
      error: ""
    };
  }

  switchPackage(id) {
    this.setState({ id: id });
  }

  setError(error) {
    if(error) {
      if(error === 404) {
        this.setState({ error: "We do not have a package stored with the identifier: " + this.state.id + ". Please verify that you are using the correct format." });
      } else if(error === 403) {
        this.setState({ error: "You are not permitted to view the package: " + this.state.id + ". Please contact the content manager for this item if you believe you should have access." });
      } else {
        this.setState({ error: "We experienced an error in servicing your request. Please try again later." });
      }
    } else {
      this.setState({ error: "" });
    }
  }

  render() {
    return (
      <div>
        <SearchForm
          error={this.state.error}
          value={this.state.id}
          onHandleSubmit={(id) => { this.switchPackage(id); }}
        />
        <br/>
        <PackageDisplay
          api={this.props.api}
          package={this.state.id}
          onError={e => {this.setError(e)}}
        />
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

  componentDidUpdate(prevProps, prevState) {
    if(this.props.package !== prevProps.package) {
      this.setState({
        isLoaded: (this.props.package === ""),
        errorStatus: null
      });
    }

    if(!this.state.isLoaded) {
      this.tryToLoad();
    }

    if(this.state.errorStatus !== prevState.errorStatus) {
      this.props.onError(this.state.errorStatus);
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
    if(!this.state.isLoaded) {
      return (
        <Loading/>
      );
    } else if(this.state.errorStatus || this.props.package === "") {
      return (
        <div/>
      );
    } else {
      return (
        <div>
          <Heading level={2} size="S">{this.props.package}</Heading>
          <PackageContents base={this.state.base} files={this.state.files}/>
        </div>
      );
    }
  }
}

export default PackageBrowser;
