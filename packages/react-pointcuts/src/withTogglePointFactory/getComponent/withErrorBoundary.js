import { Component, forwardRef, createContext } from "react";

const ForwardedRefContext = createContext();

const withErrorBoundary = ({ Variant, fallback, logError }) => {
  class TogglePointErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
      return { hasError: true };
    }

    componentDidCatch(error) {
      error.message = `Variant errored, rendering fallback: ${error.message}`;
      logError(error);
    }

    static contextType = ForwardedRefContext;

    render() {
      const Component = this.state.hasError ? fallback : Variant;

      return <Component {...this.props} ref={this.context} />;
    }
  }

  const TogglePointErrorBoundaryWithRef = forwardRef((props, ref) => (
    <ForwardedRefContext.Provider value={ref}>
      <TogglePointErrorBoundary {...props} />
    </ForwardedRefContext.Provider>
  ));
  TogglePointErrorBoundaryWithRef.displayName = `withErrorBoundary(${
    Variant.displayName || Variant.name || "Component"
  })`;

  return TogglePointErrorBoundaryWithRef;
};

export default withErrorBoundary;
