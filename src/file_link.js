import React from "react";

function FileLink(props) {
  const text = props.children;
  const href = props.base ? (props.base + "/" + text) : text;

  return (
    <a href={href}>{text}</a>
  );
}

export default FileLink;
