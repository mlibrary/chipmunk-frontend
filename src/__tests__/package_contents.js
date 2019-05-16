import React from "react";
import PackageContents from "../package_contents";
import {render, cleanup} from "react-testing-library";

let doc;

const ul_elts = () => doc.baseElement.getElementsByTagName('ul');
const li_elts = () => ul_elts().item(0).children;
const li_elt = i => li_elts().item(i);
const a_elt = i => li_elt(i).getElementsByTagName('a').item(0);

afterEach(cleanup);

describe('<PackageContents/>', () => {
  beforeEach(() => {
    doc = render(
      <PackageContents/>
    );
  });

  it("creates exactly one <ul> element", () => {
    expect(ul_elts().length).toEqual(1);
  });

  it("creates an empty <ul> element", () => {
    expect(ul_elts().item(0).innerHTML).toEqual("");
  });
});

describe('<PackageContents files={["only_file"]}/>', () => {
  beforeEach(() => {
    doc = render(
      <PackageContents files={["only_file"]}/>
    );
  });

  it("creates exactly one <ul> element", () => {
    expect(ul_elts().length).toEqual(1);
  });

  it("has a list with only one item", () => {
    expect(li_elts().length).toEqual(1);
    expect(li_elt(0).tagName).toMatch(/^li$/i);
  });

  it("has a link in its only list item", () => {
    expect(li_elt(0).getElementsByTagName('a').length).toEqual(1);
  });

  it("has a link with text set to only_file", () => {
    expect(a_elt(0).innerHTML).toEqual("only_file");
  });
});

describe('<PackageContents files={["a", "b", "c"]}/>', () => {
  beforeEach(() => {
    doc = render(
      <PackageContents files={["a", "b", "c"]}/>
    );
  });

  it("creates exactly one <ul> element", () => {
    expect(ul_elts().length).toEqual(1);
  });

  it("creates exactly three <li> elements", () => {
    expect(li_elts().length).toEqual(3);
  });

  it("has a list whose first element's text is \"a\"", () => {
    expect(a_elt(0).innerHTML).toEqual("a");
  });

  it("has a list whose first element's href is \"a\"", () => {
    expect(a_elt(0).getAttribute("href")).toEqual("a");
  });

  it("has a list whose second element's text is \"b\"", () => {
    expect(a_elt(1).innerHTML).toEqual("b");
  });

  it("has a list whose second element's href is \"b\"", () => {
    expect(a_elt(1).getAttribute("href")).toEqual("b");
  });

  it("has a list whose third element's text is \"c\"", () => {
    expect(a_elt(2).innerHTML).toEqual("c");
  });

  it("has a list whose third element's href is \"c\"", () => {
    expect(a_elt(2).getAttribute("href")).toEqual("c");
  });
});

describe('<PackageContents base="base" files={["a", "b", "c"]}/>', () => {
  beforeEach(() => {
    doc = render(
      <PackageContents base="base" files={["a", "b", "c"]}/>
    );
  });

  it("creates exactly one <ul> element", () => {
    expect(ul_elts().length).toEqual(1);
  });

  it("creates exactly three <li> elements", () => {
    expect(li_elts().length).toEqual(3);
  });

  it("has a list whose first element's text is \"a\"", () => {
    expect(a_elt(0).innerHTML).toEqual("a");
  });

  it("has a list whose first element's href is \"base/a\"", () => {
    expect(a_elt(0).getAttribute("href")).toEqual("base/a");
  });

  it("has a list whose second element's text is \"b\"", () => {
    expect(a_elt(1).innerHTML).toEqual("b");
  });

  it("has a list whose second element's href is \"base/b\"", () => {
    expect(a_elt(1).getAttribute("href")).toEqual("base/b");
  });

  it("has a list whose third element's text is \"c\"", () => {
    expect(a_elt(2).innerHTML).toEqual("c");
  });

  it("has a list whose third element's href is \"base/c\"", () => {
    expect(a_elt(2).getAttribute("href")).toEqual("base/c");
  });
});
