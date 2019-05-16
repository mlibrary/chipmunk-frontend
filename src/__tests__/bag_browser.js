import React from "react";
import BagBrowser from "../bag_browser";
import {render, fireEvent, cleanup} from "react-testing-library";

let doc;

const searchField = () => doc.baseElement.getElementsByTagName("input").item(0);
const fireSearch = query => fireEvent.change(searchField(), { target: { value: query } });

afterEach(() => {
  cleanup();
  fetch.resetMocks();
});

describe('<BagBrowser/>', () => {
  beforeEach(() => {
    doc = render(
      <BagBrowser/>
    );
  });

  it("creates an empty text input", () => {
    expect(searchField().getAttribute("type")).toEqual("text");
    expect(searchField().getAttribute("value")).toEqual("");
  });

  it("has some text telling the user to enter an identifier", () => {
    expect(doc.baseElement.innerHTML).toMatch(
      /Enter an identifier to view a package/);
  });

  it('should call fetch("v1/bags/foo") when the user types in "foo"', () => {
    fetch.mockResponseOnce();
    fireSearch("foo");
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("v1/bags/foo");
  });

  it('should call fetch("v1/bags/bar") when the user types in "bar"', () => {
    fetch.mockResponseOnce();
    fireSearch("bar");
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("v1/bags/bar");
  });

  describe("when searching for a 404ing package", () => {
    beforeEach(() => {
      fetch.mockResponseOnce('Not found', { status: 404 });
      fireSearch("wrong_id")
    });

    it("displays an error message with 404 in it", () => {
      expect(doc.baseElement.innerHTML).toMatch(/could not retrieve/i);
      expect(doc.baseElement.innerHTML).toMatch(/wrong_id/i);
      expect(doc.baseElement.innerHTML).toMatch(/404/i);
    });
  });

  describe("if the api is broken and returning garbage json", () => {
    beforeEach(() => {
      fetch.mockResponseOnce("{{{{{{{{{{");
      fireSearch("uh_oh_its_bad")
    });

    it("displays an error message with 'json' in it", () => {
      expect(doc.baseElement.innerHTML).toMatch(/could not retrieve/i);
      expect(doc.baseElement.innerHTML).toMatch(/uh_oh_its_bad/i);
      expect(doc.baseElement.innerHTML).toMatch(/json/i);
    });
  });

  describe("when searching for a package with only a mets.xml file", () => {
    beforeEach(() => {
      fetch.mockResponseOnce(JSON.stringify({ files: ["mets.xml"], bag_id: "uuid" }));
      fireSearch("mets_only");
    });

    it("should contain a link to v1/packages/uuid/mets.xml", () => {
      let count = 0;
      const elts = doc.baseElement.getElementsByTagName("a");

      for(let i = 0; i < elts.length; i += 1) {
        if(elts.item(i).getAttribute("href") === "v1/packages/uuid/mets.xml") {
          count += 1;
        }
      }

      expect(count).toEqual(1);
    });
  });

  describe("when searching for a package with five wav files", () => {
    beforeEach(() => {
      fetch.mockResponseOnce(JSON.stringify(
        { files: ["00000001.wav",
                  "00000002.wav",
                  "00000003.wav",
                  "00000004.wav",
                  "00000005.wav",
                  "mets.xml"],
          bag_id: "ff6cfac9-e8cd-4011-8840-e2c55f8bccea" }));
      fireSearch("five_wavs");
    });

    for(let wav = 1; wav <= 5; wav += 1) {
      let href = "v1/packages/ff6cfac9-e8cd-4011-8840-e2c55f8bccea/0000000" + wav + ".wav";
      it("should contain a link to " + href, () => {
        let count = 0;
        const elts = doc.baseElement.getElementsByTagName("a");

        for(let i = 0; i < elts.length; i += 1) {
          if(elts.item(i).getAttribute("href") === href) {
            count += 1;
          }
        }

        expect(count).toEqual(1);
      });
    }
  });
});

describe('<BagBrowser api="https://default.invalid"/>', () => {
  beforeEach(() => {
    doc = render(
      <BagBrowser api="https://default.invalid"/>
    );
  });

  it('should call fetch("https://default.invalid/v1/bags/abcd") when the user types in "abcd"', () => {
    fetch.mockResponseOnce();
    fireSearch("abcd");
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("https://default.invalid/v1/bags/abcd");
  });

  describe("when searching for a package with only a mets.xml file", () => {
    beforeEach(() => {
      fetch.mockResponseOnce(JSON.stringify({
        files: ["mets.xml"],
        bag_id: "b5bf33e0-82f0-4b28-b1f2-cac2a56b5ef3"
      }));
      fireSearch("mets_only");
    });

    it("should contain a link to https://default.invalid/v1/packages/b5bf33e0-82f0-4b28-b1f2-cac2a56b5ef3/mets.xml", () => {
      let count = 0;
      const elts = doc.baseElement.getElementsByTagName("a");

      for(let i = 0; i < elts.length; i += 1) {
        if(elts.item(i).getAttribute("href") === "https://default.invalid/v1/packages/b5bf33e0-82f0-4b28-b1f2-cac2a56b5ef3/mets.xml") {
          count += 1;
        }
      }

      expect(count).toEqual(1);
    });
  });
});
