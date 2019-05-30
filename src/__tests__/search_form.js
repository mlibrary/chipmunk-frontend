import React from "react";
import SearchForm from "../search_form";
import {render, fireEvent, cleanup} from "react-testing-library";

let doc;

const labels = () => doc.baseElement.getElementsByTagName("label");
const inputs = () => doc.baseElement.getElementsByTagName("input");
const input = () => inputs().item(0);

const pressSubmitButton = () =>
  fireEvent.submit(doc.baseElement.getElementsByTagName("form").item(0), {});

const fireSubmit = value => {
  fireEvent.change(input(), { target: { value: value } });
  pressSubmitButton();
};

afterEach(cleanup);

describe('<SearchForm/>', () => {
  beforeEach(() => {
    doc = render(
      <SearchForm/>
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

describe('<SearchForm onHandleSubmit={anyFunction}/>', () => {
  let value;

  beforeEach(() => {
    doc = render(
      <SearchForm onHandleSubmit={x => { value = x; }}/>
    );

    value = "unset";
  });

  describe("when a user changes the input's value to \"hello\"", () => {
    beforeEach(() => {
      fireSubmit("hello");
    });

    it('calls anyFunction("hello")', () => {
      expect(value).toEqual("hello");
    });

    describe("and then they change the input's value to \"goodbye\"", () => {
      beforeEach(() => {
        fireSubmit("goodbye");
      });

      it('calls anyFunction("goodbye")', () => {
        expect(value).toEqual("goodbye");
      });
    });
  });
});

describe('<SearchForm value="LIT is lit"/>', () => {
  beforeEach(() => {
    doc = render(
      <SearchForm value="LIT is lit"/>
    );
  });

  it('has <input value="LIT is lit" ...>', () => {
    expect(input().getAttribute("value")).toEqual("LIT is lit");
  });
});

describe('<SearchForm id="wow_very_unique"/>', () => {
  beforeEach(() => {
    doc = render(
      <SearchForm id="wow_very_unique"/>
    );
  });

  it('has <input id="wow_very_unique" ...>', () => {
    expect(input().getAttribute("id")).toEqual("wow_very_unique");
  });

  it('has <label for="wow_very_unique" ...>', () => {
    expect(labels().item(0).getAttribute("for")).toEqual("wow_very_unique");
  });
});

describe('<SearchForm onHandleSubmit={anyFunction} value="initial"/>', () => {
  let value;

  beforeEach(() => {
    doc = render(
      <SearchForm onHandleSubmit={x => { value = x; }} value="initial"/>
    );

    value = "unset";
  });

  it('calls anyFunction("initial") when the user hits submit', () => {
    pressSubmitButton();
    expect(value).toEqual("initial");
  });
});

describe('<SearchForm error="uh oh now you done it"/>', () => {
  beforeEach(() => {
    doc = render(
      <SearchForm error="uh oh now you done it"/>
    );
  });

  it('contains the text "uh oh now you done it"', () => {
    expect(doc.baseElement.innerHTML).toMatch(/uh oh now you done it/);
  });
});
