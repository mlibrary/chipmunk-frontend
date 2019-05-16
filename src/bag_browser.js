import React from "react";
import SearchField from "./search_field";
import PackageContents from "./package_contents";

class BagBrowser extends React.Component {
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
        <SearchField onChange={(e) => { this.switchPackage(e); }}/>
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
          <p>Error: could not retrieve {this.props.package} ({this.state.errorStatus})</p>
        );
      }

      if(this.props.package === "") {
        return (
          <p>Enter an identifier to view a package.</p>
        );
      }

      return (
        <PackageContents base={this.state.base} files={this.state.files}/>
      );
    }

    return (
      <p>Loading...</p>
    );
  }
}

export default BagBrowser;
