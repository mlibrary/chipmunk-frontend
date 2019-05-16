import React from "react";

function SearchField(props) {
  const onChange = e => { props.onChange(e.target.value); };
  const id = props.id || "the_only_search_field";

  return (
    <div>
      <label htmlFor={id}>Enter identifier:</label>
      <input id={id} type="text" value={props.value} onChange={onChange} />
    </div>
  );
}

export default SearchField;
