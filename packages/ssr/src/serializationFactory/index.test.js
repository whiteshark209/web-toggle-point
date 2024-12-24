import serializationFactory from "./index";
import jsesc from "jsesc";
import { render } from "@testing-library/react";

jest.mock("jsesc", () => jest.fn((x) => `secure: ${JSON.stringify(x)}`));

describe("serializationFactory", () => {
  const logWarning = jest.fn();
  const id = "test-id";
  const content = { test: "value" };
  let serialization;

  beforeEach(() => {
    logWarning.mockClear();
    serialization = serializationFactory({ id, logWarning });
  });

  it("should return an object with three methods", () => {
    expect(serialization).toMatchObject({
      getScriptMarkup: expect.any(Function),
      getScriptReactElement: expect.any(Function),
      getJSONFromScript: expect.any(Function)
    });
  });

  describe("when getting script markup", () => {
    let result;

    beforeEach(() => {
      result = serialization.getScriptMarkup({ content });
    });

    it("should return a string containing a JSON script tag, appropriately quoted by jsesc", () => {
      expect(jsesc).toHaveBeenCalledWith(content, {
        isScriptContext: true,
        json: true
      });
      expect(result).toStrictEqual(
        `<script id="${id}" type="application/json">${jsesc(content)}</script>`
      );
    });
  });

  describe("when rendering a scriptReactElement with React", () => {
    let result;
    beforeEach(() => {
      ({ container: result } = render(
        serialization.getScriptReactElement({ content })
      ));
    });

    it("should return a react element containing a JSON script tag, appropriately quoted by jsesc", () => {
      expect(result.firstChild).toMatchSnapshot();
    });
  });

  describe("when getting JSON from script", () => {
    let result;
    const validJsonString =
      '{"test-experiment-a":{"test-prop-1":"test-value-1"},"test-experiment-b":{"test-prop-2":"test-value-2"}}';

    const invalidJsonString =
      '{"test-experiment-a":{"test-prop-1":"test-value-1"},"test-experiment-b":{"test-prop-2":"test-value-2"},}';

    const jsonObject = {
      "test-experiment-a": { "test-prop-1": "test-value-1" },
      "test-experiment-b": { "test-prop-2": "test-value-2" }
    };

    describe("when a valid JSON string is passed", () => {
      beforeEach(() => {
        document.body.innerHTML = `<script id="${id}" type="application/json">${validJsonString}</script>`;
        result = serialization.getJSONFromScript();
      });

      afterEach(() => {
        document.body.innerHTML = "";
      });

      it("should return a valid object", () => {
        expect(result).toStrictEqual(jsonObject);
      });

      it("should not have called any logger warning", () => {
        expect(logWarning).not.toHaveBeenCalled();
      });
    });

    describe("when an invalid JSON string is passed", () => {
      beforeEach(() => {
        document.body.innerHTML = `<script id="${id}" type="application/json">${invalidJsonString}</script>`;
        result = serialization.getJSONFromScript();
      });

      it("should have logged a warning", () => {
        expect(logWarning).toHaveBeenCalledWith(
          `Invalid JSON found in markup: "${invalidJsonString}"`
        );
      });

      it("should return null", () => {
        expect(result).toStrictEqual(null);
      });
    });
  });
});
