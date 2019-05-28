import React from "react";
import FileLink from "./file_link";
import { List } from "@umich-lib/core";

function PackageContents(props) {
  const files = props.files || [];
  const base = props.base || null;

  return (
    <List>
      {files.map(filename => (
        <li key={filename}><FileLink base={base}>{filename}</FileLink></li>
      ))}
    </List>
  );
}

export default PackageContents;
