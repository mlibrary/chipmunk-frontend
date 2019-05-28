import React from "react";
import { TYPOGRAPHY } from "@umich-lib/core";

function SearchField(props) {
  const onChange = e => { props.onChange(e.target.value); };
  const id = props.id || "the_only_search_field";

  return (
    <p style={{ ...TYPOGRAPHY["XS"] }}>
      <label htmlFor={id}>Enter identifier:</label>&nbsp;
      <input id={id} type="text" value={props.value} onChange={onChange} />
    </p>
  );
}

export default SearchField;
