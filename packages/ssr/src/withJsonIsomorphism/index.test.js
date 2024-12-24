import withJsonIsomorphism from ".";
import serializationFactory from "../serializationFactory";
import { render, screen } from "@testing-library/react";

const mockJSONScript = "test-json-script";
const mockSerialization = {
  getScriptReactElement: jest.fn(() => <script data-testid={mockJSONScript} />),
  getJSONFromScript: jest.fn()
};
jest.mock("../serializationFactory", () => jest.fn(() => mockSerialization));

describe("withJsonIsomorphism", () => {
  let Wrapped, Test, props;
  const testDiv = "test-wrapped-div";
  const scriptId = "test-script-id";
  const propName = "test-prop-name";
  const logWarning = Symbol("test-log-warning");
  const context = expect.anything();

  beforeEach(() => {
    jest.clearAllMocks();
    props = {
      ["test-key"]: Symbol("test-value")
    };
    Wrapped = jest.fn(() => <div data-testid={testDiv} />);
  });

  describe("when rendering on the server", () => {
    beforeEach(() => {
      CLIENT = false;
      Test = withJsonIsomorphism(Wrapped, logWarning, {
        scriptId,
        propName
      });
    });

    const makeCommonAssertions = () => {
      it("should add the child component", () => {
        expect(screen.getByTestId(testDiv)).toBeInTheDocument();
      });

      it("should have created the serialization factory, passing the appropriate script id", () => {
        expect(serializationFactory).toHaveBeenCalledWith(
          expect.objectContaining({
            id: scriptId
          })
        );
      });

      it("should pass the other props to the child component", () => {
        expect(Wrapped).toHaveBeenCalledWith(
          expect.objectContaining(props),
          context
        );
      });

      it("should have not tried to retrieve the script tag", () => {
        expect(mockSerialization.getJSONFromScript).not.toHaveBeenCalled();
      });
    };

    describe("and there is some content provided", () => {
      const content = "test-content";

      beforeEach(() => {
        render(<Test {...{ ...props, [propName]: content }} />);
      });

      makeCommonAssertions();

      it("should add a script containing the extracted json", () => {
        expect(mockSerialization.getScriptReactElement).toHaveBeenCalledWith({
          content
        });
        expect(screen.getByTestId(mockJSONScript)).toBeInTheDocument();
      });
    });

    describe("and no content is provided", () => {
      beforeEach(() => {
        render(<Test {...props} />);
      });

      makeCommonAssertions();

      it("should add an empty script containing the extracted json", () => {
        expect(mockSerialization.getScriptReactElement).toHaveBeenCalledWith({
          content: null
        });
        expect(screen.getByTestId(mockJSONScript)).toBeInTheDocument();
      });
    });
  });

  describe("when hydrating on the client", () => {
    let rerender;
    const testEncodedContent = `{ "test-key": "test-value" }`;
    const extractedContent = Symbol("test-extracted-content");

    beforeEach(() => {
      CLIENT = true;
      Test = withJsonIsomorphism(Wrapped, logWarning, {
        scriptId,
        propName
      });
      mockSerialization.getJSONFromScript.mockReturnValue(extractedContent);

      const script = document.createElement("script");
      script.id = scriptId;
      script.type = "application/json";
      script.textContent = testEncodedContent;
      document.body.appendChild(script);

      ({ rerender } = render(<Test {...props} />));
    });

    it("should have created the serialization factory, passing the appropriate script id, and a method to log warnings if the JSON is malformed", () => {
      expect(serializationFactory).toHaveBeenCalledWith(
        expect.objectContaining({
          id: scriptId,
          logWarning
        })
      );
    });

    it("should have retrieved the values from the json script", () => {
      expect(mockSerialization.getJSONFromScript).toHaveBeenCalled();
    });

    it("should pass the extracted content to the component with the provided prop name", () => {
      expect(Wrapped).toHaveBeenCalledWith(
        expect.objectContaining({
          [propName]: extractedContent
        }),
        context
      );
    });

    describe("when new props are passed to the component", () => {
      beforeEach(() => {
        jest.clearAllMocks();
      });

      const makeCommonAssertions = () => {
        it("should not try to retrieve the script tag again", () => {
          expect(mockSerialization.getJSONFromScript).not.toHaveBeenCalled();
        });
      };

      describe("and the server-rendered prop is updated", () => {
        const newProps = {
          [propName]: Symbol("test-new-value"),
          ["test-new-key"]: Symbol("test-new-value")
        };

        beforeEach(() => {
          rerender(<Test {...newProps} />);
        });

        makeCommonAssertions();

        it("should pass the new props to the child component", () => {
          expect(Wrapped).toHaveBeenCalledWith(newProps, context);
        });
      });

      describe("and the server-rendered prop is not updated", () => {
        const newProps = {
          ...props,
          ["test-new-key"]: Symbol("test-new-value")
        };

        beforeEach(() => {
          rerender(<Test {...newProps} />);
        });

        makeCommonAssertions();

        it("should pass the new props to the child component, but preserve the server rendered prop", () => {
          expect(Wrapped).toHaveBeenCalledWith(
            {
              ...newProps,
              [propName]: extractedContent
            },
            context
          );
        });
      });
    });
  });
});
