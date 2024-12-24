/* eslint-disable no-console */
import withErrorBoundary from "./withErrorBoundary";
import { render, screen } from "@testing-library/react";
import { createRef, forwardRef } from "react";

const mockLogError = jest.fn();

describe("withErrorBoundary", () => {
  const inboundProps = { "test-prop": Symbol("test-value") };
  const mockFallback = "test-mock-fallback";
  const MockFallback = forwardRef(
    jest.fn((_, ref) => <div ref={ref} data-testid={mockFallback} />)
  );
  const mockVariant = "test-mock-variant";
  const MockVariant = forwardRef(
    jest.fn((_, ref) => <div ref={ref} data-testid={mockVariant} />)
  );
  const mockErrorMessage = "test-error";
  const mockRef = createRef();
  let mockError;
  const MockErrorVariant = () => {
    throw mockError;
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockError = new Error(mockErrorMessage);
  });

  let Boundaried;
  const makeCommonAssertions = (MockVariant) => {
    describe("when rendering the variant and no error occurs", () => {
      beforeEach(() => {
        Boundaried = withErrorBoundary({
          Variant: MockVariant,
          fallback: MockFallback,
          logError: mockLogError
        });
        render(<Boundaried {...inboundProps} ref={mockRef} />);
      });

      it("should render the variant, passing the inbound props, and not render the fallback", () => {
        const variantElement = screen.getByTestId(mockVariant);
        expect(variantElement).toBeInTheDocument();
        expect(variantElement).toBe(mockRef.current);
        expect(MockVariant.render).toHaveBeenCalledWith(inboundProps, mockRef);
        expect(screen.queryByTestId(mockFallback)).not.toBeInTheDocument();
      });

      it("should not log anything", () => {
        expect(mockLogError).not.toHaveBeenCalled();
      });
    });

    describe("when rendering the variant and an error occurs", () => {
      beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
        const Boundaried = withErrorBoundary({
          Variant: MockErrorVariant,
          fallback: MockFallback,
          logError: mockLogError
        });
        render(<Boundaried {...inboundProps} ref={mockRef} />);
      });

      afterEach(() => {
        console.error.mockRestore();
      });

      it("should render the fallback, passing the inbound props, and no longer render the variant", () => {
        const fallbackElement = screen.getByTestId(mockFallback);
        expect(fallbackElement).toBeInTheDocument();
        expect(fallbackElement).toBe(mockRef.current);
        expect(MockFallback.render).toHaveBeenCalledWith(inboundProps, mockRef);
        expect(screen.queryByTestId(mockVariant)).not.toBeInTheDocument();
      });

      it("should log an error indicating that the fallback has been rendered", () => {
        expect(mockLogError).toHaveBeenCalledWith(mockError);
      });

      it("should update the message on the error to include that the variant has errored", () => {
        expect(mockError.message).toBe(
          `Variant errored, rendering fallback: ${mockErrorMessage}`
        );
      });
    });
  };

  describe("when the given component has a displayName", () => {
    beforeEach(() => {
      MockVariant.displayName = "test-display-name";
    });

    makeCommonAssertions(MockVariant);

    it("should name the HOC with the fallback component's display name wrapped in 'withErrorBoundary'", () => {
      expect(Boundaried.displayName).toBe(
        `withErrorBoundary(${MockVariant.displayName})`
      );
    });
  });

  describe("when the given component does not have a displayName but is a named function", () => {
    beforeEach(() => {
      delete MockVariant.displayName;
      MockVariant.name = "test-name";
    });

    makeCommonAssertions(MockVariant);

    it("should name the HOC with the fallback component's name wrapped in 'withErrorBoundary'", () => {
      expect(Boundaried.displayName).toBe(
        `withErrorBoundary(${MockVariant.name})`
      );
    });
  });

  describe("when the given component does not have a displayName or a function name", () => {
    beforeEach(() => {
      delete MockVariant.displayName;
      delete MockVariant.name;
    });

    makeCommonAssertions(MockVariant);

    it("should name the HOC with 'Component' wrapped in 'withErrorBoundary'", () => {
      expect(Boundaried.displayName).toBe("withErrorBoundary(Component)");
    });
  });
});
