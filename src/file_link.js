import React from "react";
import { Link } from "@umich-lib/core";

function FileLink(props) {
  const text = props.children;
  const href = props.base ? (props.base + "/" + text) : text;

  return (
    <Link href={href}>{text}</Link>
  );
}

export default FileLink;
