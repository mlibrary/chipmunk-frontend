import React from "react";
import PackageView from "../package_view";
import {render, cleanup} from "@testing-library/react";

let doc;

afterEach(() => {
  cleanup();
  fetch.resetMocks();
});

describe('<PackageView/>', () => {
  beforeEach(() => {
    doc = render(
      <PackageView/>
    );
  });

  it("has no content", () => {
    expect(doc.baseElement.innerHTML).not.toMatch(/>[^<]/);
  });

  it("doesn't call fetch()", () => {
    expect(fetch.mock.calls.length).toEqual(0);
  });
});

describe('<PackageView error="A pretty bad problem"/>', () => {
  beforeEach(() => {
    doc = render(
      <PackageView error="A pretty bad problem"/>
    );
  });

  it('contains the text "A pretty bad problem"', () => {
    expect(doc.baseElement.innerHTML).toMatch(/A pretty bad problem/);
  });
});

describe('<PackageView id="foo"/>', () => {
  beforeEach(() => {
    fetch.mockResponseOnce();
    doc = render(
      <PackageView id="foo"/>
    );
  });

  it('should call fetch("v1/bags/foo")', () => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("v1/bags/foo");
  });
});

describe('<PackageView id="a 404ing package"/>', () => {
  let error;
  const setError = e => { error = e; };

  beforeEach(() => {
    fetch.mockResponseOnce('Not found', { status: 404 });
    doc = render(
      <PackageView id="notfound" onError={e => { setError(e); }}/>
    );
  });

  it('triggers its onError with 404', () => {
    expect(error).toEqual(404);
  });

  it("has no content", () => {
    expect(doc.baseElement.innerHTML).not.toMatch(/>[^<]/);
  });
});

describe('<PackageView id="a 403ing package"/>', () => {
  let error;
  const setError = e => { error = e; };

  beforeEach(() => {
    fetch.mockResponseOnce('Forbidden', { status: 403 });
    doc = render(
      <PackageView id="forbidden" onError={e => { setError(e); }}/>
    );
  });

  it('triggers its onError with 403', () => {
    expect(error).toEqual(403);
  });
});

describe('<PackageView id="a 501ing package"/>', () => {
  let error;
  const setError = e => { error = e; };

  beforeEach(() => {
    fetch.mockResponseOnce('Internal error', { status: 501 });
    doc = render(
      <PackageView id="internal" onError={e => { setError(e); }}/>
    );
  });

  it('triggers its onError with 501', () => {
    expect(error).toEqual(501);
  });
});

describe('<PackageView id="a package returning garbage json"/>', () => {
  let error;
  const setError = e => { error = e; };

  beforeEach(() => {
    fetch.mockResponseOnce('{{{{{{{{{{');
    doc = render(
      <PackageView id="badjson" onError={e => { setError(e); }}/>
    );
  });

  it('triggers its onError with 501', () => {
    expect(error).toEqual(501);
  });
});

describe('<PackageView id="a package with only a mets.xml file"/>', () => {
  let error;
  const setError = e => { error = e; };

  beforeEach(() => {
    fetch.mockResponseOnce(JSON.stringify({ files: ["mets.xml"],
                                            bag_id: "uuid" }));
    doc = render(
      <PackageView id="justmets" onError={e => { setError(e); }}/>
    );
  });

  it("doesn't trigger its onError", () => {
    expect(error).toBeUndefined();
  });

  it("should contain a link to that mets.xml file", () => {
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

describe('<PackageView id="a package with five wav files"/>', () => {
  beforeEach(() => {
    fetch.mockResponseOnce(JSON.stringify({ files: ["00000001.wav",
                                                    "00000002.wav",
                                                    "00000003.wav",
                                                    "00000004.wav",
                                                    "00000005.wav",
                                                    "mets.xml"],
                                            bag_id: "it5" }));
    doc = render(
      <PackageView id="fivewavs"/>
    );
  });

  for(let wav = 1; wav <= 5; wav += 1) {
    let href = "0000000" + wav + ".wav";
    it("should contain a link to " + href, () => {
      let count = 0;
      const elts = doc.baseElement.getElementsByTagName("a");

      for(let i = 0; i < elts.length; i += 1) {
        if(elts.item(i).getAttribute("href") === "v1/packages/it5/" + href) {
          count += 1;
        }
      }

      expect(count).toEqual(1);
    });
  }
});

describe('<PackageView api="https://default.invalid"/>', () => {
  beforeEach(() => {
    fetch.mockResponseOnce(JSON.stringify({ files: ["mets.xml"],
                                            bag_id: "uuid" }));
    doc = render(
      <PackageView id="someid" api="https://default.invalid"/>
    );
  });

  it('should call fetch from https://default.invalid', () => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("https://default.invalid/v1/bags/someid");
  });

  it("should contain links to files under https://default.invalid", () => {
    let count = 0;
    const elts = doc.baseElement.getElementsByTagName("a");

    for(let i = 0; i < elts.length; i += 1) {
      if(elts.item(i).getAttribute("href") === "https://default.invalid/v1/packages/uuid/mets.xml") {
        count += 1;
      }
    }

    expect(count).toEqual(1);
  });
});

describe('<PackageView api="/"/>', () => {
  beforeEach(() => {
    fetch.mockResponseOnce(JSON.stringify({ files: ["mets.xml"],
                                            bag_id: "uuid" }));
    doc = render(
      <PackageView id="someid" api="/"/>
    );
  });

  it('should call fetch from /', () => {
    expect(fetch.mock.calls.length).toEqual(1);
    expect(fetch.mock.calls[0][0]).toEqual("/v1/bags/someid");
  });

  it("should contain links to files under /", () => {
    let count = 0;
    const elts = doc.baseElement.getElementsByTagName("a");

    for(let i = 0; i < elts.length; i += 1) {
      if(elts.item(i).getAttribute("href") === "/v1/packages/uuid/mets.xml") {
        count += 1;
      }
    }

    expect(count).toEqual(1);
  });
});

describe('<PackageView id="something"/> in a component that will rerender it a few times', () => {
  class OuterContainer extends React.Component {
    constructor(props) {
      super(props);
      this.state = { renderCount: 1 };
    }

    render() {
      // This will rerender before it has a chance to put itself in an
      // error state.
      return (
        <PackageView id="something" onError={e => { this.rerender(); }}/>
      );
    }

    rerender() {
      if (this.state.renderCount < 3) {
        this.setState({ renderCount: this.state.renderCount + 1 });
      }
    }
  }

  beforeEach(() => {
    fetch.mockResponseOnce();
    doc = render(
      <OuterContainer/>
    );
  });

  it("calls fetch only once", () => {
    expect(fetch.mock.calls.length).toEqual(1);
  });
});

describe('<PackageView permalink="/some/path/"/>', () => {
  beforeEach(() => {
    fetch.mockResponseOnce(JSON.stringify({ files: ["mets.xml"],
                                            bag_id: "uuid" }));
    doc = render(
      <PackageView permalink="/some/path/" id="justmets"/>
    );
  });

  it("shows the permalink", () => {
    let count = 0;
    const elts = doc.baseElement.getElementsByTagName("a");

    for(let i = 0; i < elts.length; i += 1) {
      if(elts.item(i).getAttribute("href") === "/some/path/justmets") {
        count += 1;
      }
    }

    expect(count).toEqual(1);
  });
});
