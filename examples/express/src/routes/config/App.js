import featuresStore from "./featuresStore.js";
import PropTypes from "prop-types";
import Component from "./Component.jsx";
import Controls from "./Controls.jsx";
import { useState, useCallback } from "react";
import "./app.css";

const { providerFactory } = featuresStore;

const App = ({ config }) => {
  const [state, setState] = useState(config);
  const setConfig = useCallback(setState, [setState]);
  const FeaturesProvider = providerFactory();
  return (
    <FeaturesProvider value={state}>
      <Component />
      <Controls setConfig={setConfig} />
    </FeaturesProvider>
  );
};

App.propTypes = {
  config: PropTypes.object.isRequired
};

export default App;
