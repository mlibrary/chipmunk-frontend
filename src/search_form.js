import React, { useState } from "react";
import { TextInput, Button } from "@umich-lib/core";

function SearchForm(props) {
  const [identifierQuery, setIdentifierQuery] = useState("")
  const id = props.id || "the_only_search_field";

  function handleSubmit(e) {
    e.preventDefault()
    props.onHandleSubmit(identifierQuery)
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        id={id}
        labelText="Identifier"
        value={identifierQuery}
        onChange={(e) => setIdentifierQuery(e.target.value)}
        type="text"
        descriptionText="Some helpful thing about how to enter and identifier such as the format."
      />

      <Button type="submit" style={{ marginTop: '1rem' }}>Search</Button>
    </form>
  );
}

export default SearchForm;
