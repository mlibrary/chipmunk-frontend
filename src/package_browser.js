import React from "react";
import SearchForm from "./search_form";
import PackageView from "./package_view";
import errorMessage from "./error_message";

class PackageBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: (props.value || ""),
      error: ""
    };
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
        <PackageView
          api={this.props.api}
          id={this.state.id}
          onError={e => {this.setError(e)}}
          permalink="/artifacts/"
        />
      </div>
    );
  }

  switchPackage(id) {
    this.setState({
      error: "",
      id: id
    });
  }

  setError(error) {
    this.setState({ error: errorMessage(error, this.state.id) });
  }
}

export default PackageBrowser;
