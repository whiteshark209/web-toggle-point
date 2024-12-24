import type { JSX } from "react";
import Control1 from "@/components/control1";
import dependency from "./dependency";

const Component = (): JSX.Element => (
  <Control1>
    <div>{dependency}</div>
  </Control1>
);

export default Component;
