import React from "react";
import FileLink from "./file_link";

function PackageContents(props) {
  const files = props.files || [];
  const base = props.base || null;

  return (
    <ul>
      {files.map(filename => (
        <li key={filename}><FileLink base={base}>{filename}</FileLink></li>
      ))}
    </ul>
  );
}

export default PackageContents;
