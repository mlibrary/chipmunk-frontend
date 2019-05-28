import React from "react";
import SearchField from "../search_field";
import {render, fireEvent, cleanup} from "react-testing-library";

let doc;

const labels = () => doc.baseElement.getElementsByTagName("label");
const inputs = () => doc.baseElement.getElementsByTagName("input");
const input = () => inputs().item(0);

afterEach(cleanup);

describe('<SearchField/>', () => {
  beforeEach(() => {
    doc = render(
      <SearchField/>
    );
  });

  it("creates exactly one label", () => {
    expect(labels().length).toEqual(1);
  });

  it("creates exactly one input", () => {
    expect(inputs().length).toEqual(1);
  });

  it("gives its label a for attribute", () => {
    expect(labels().item(0).getAttribute("for")).not.toBeNull();
  });

  it("points its label's for attribute at its input", () => {
    expect(labels().item(0).getAttribute("for")).toEqual(
      input().getAttribute("id"));
  });

  describe("its input element", () => {
    it('has type="text"', () => {
      expect(input().getAttribute("type")).toEqual("text");
    });

    it('has value=""', () => {
      expect(input().getAttribute("value")).toEqual("");
    });
  });
});

describe('<SearchField onChange={anyFunction}/>', () => {
  let value;

  beforeEach(() => {
    doc = render(
      <SearchField onChange={x => { value = x; }}/>
    );

    value = "unset";
  });

  describe("when a user changes the input's value to \"hello\"", () => {
    beforeEach(() => {
      fireEvent.change(input(), { target: { value: "hello" } });
    });

    it('calls anyFunction("hello")', () => {
      expect(value).toEqual("hello");
    });

    describe("and then they change the input's value to \"goodbye\"", () => {
      beforeEach(() => {
        fireEvent.change(input(), { target: { value: "goodbye" } });
      });

      it('calls anyFunction("goodbye")', () => {
        expect(value).toEqual("goodbye");
      });
    });
  });
});

describe('<SearchField value="LIT is lit"/>', () => {
  beforeEach(() => {
    doc = render(
      <SearchField value="LIT is lit"/>
    );
  });

  it('has <input value="LIT is lit" ...>', () => {
    expect(input().getAttribute("value")).toEqual("LIT is lit");
  });
});

describe('<SearchField id="wow_very_unique"/>', () => {
  beforeEach(() => {
    doc = render(
      <SearchField id="wow_very_unique"/>
    );
  });

  it('has <input id="wow_very_unique" ...>', () => {
    expect(input().getAttribute("id")).toEqual("wow_very_unique");
  });

  it('has <label for="wow_very_unique" ...>', () => {
    expect(labels().item(0).getAttribute("for")).toEqual("wow_very_unique");
  });
});