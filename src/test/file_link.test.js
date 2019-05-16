import React from "react";
import FileLink from "../lib/file_link";
import renderer from "react-test-renderer";

test("", () => {
  const component = renderer.create(
    <FileLink base="fake_base">fake_file</FileLink>
  );

  expect(component.toJSON()).toEqual("");
});
