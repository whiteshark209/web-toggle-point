import withPlugins from "./withPlugins";
import withErrorBoundary from "./withErrorBoundary";
import { forwardRef } from "react";

const getControlOrVariant = ({
  matchedFeatures,
  matchedVariant,
  logError,
  control
}) => {
  if (!matchedFeatures.length) {
    return control;
  }

  let Component = control;
  if (matchedVariant) {
    const { codeRequest, variables } = matchedVariant;
    const { default: VariantWithoutVariables } = codeRequest;
    const Variant = forwardRef((props, ref) => (
      <VariantWithoutVariables {...{ ...variables, ...props, ref }} />
    ));
    Variant.displayName = `Variant(${
      VariantWithoutVariables.displayName ||
      VariantWithoutVariables.name ||
      "Component"
    })`;

    Component = withErrorBoundary({
      Variant,
      logError,
      fallback: control
    });
  }
  return Component;
};

const getComponent = (params) => {
  let Component = getControlOrVariant(params);

  const { plugins, ...rest } = params;
  if (plugins) {
    Component = withPlugins({
      Component,
      plugins,
      ...rest
    });
  }

  return Component;
};

export default getComponent;
