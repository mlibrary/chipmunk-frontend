import React from "react";
import FileLink from "../file_link";
import {render, cleanup} from "@testing-library/react";

let doc;

afterEach(cleanup);

describe('<FileLink>my_file.txt</FileLink>', () => {
  beforeEach(() => {
    doc = render(
      <FileLink>my_file.txt</FileLink>
    );
  });

  it("has text set to my_file.txt", () => {
    doc.getByText("my_file.txt");
  });

  it("has href set to my_file.txt", () => {
    expect(doc.getByText("my_file.txt").getAttribute("href")).toEqual("my_file.txt");
  });
});

describe('<FileLink base="/v1/packages">mets.xml</FileLink>', () => {
  beforeEach(() => {
    doc = render(
      <FileLink base="/v1/packages">mets.xml</FileLink>
    );
  });

  it("has text set to mets.xml", () => {
    doc.getByText("mets.xml");
  });

  it("has href set to v1/packages/mets.xml", () => {
    expect(doc.getByText("mets.xml").getAttribute("href")).toEqual("v1/packages/mets.xml");
  });
});
