import type { JSX } from "react";
import Variant1 from "@/components/variant1";
import dependency from "./dependency";

const Component = (): JSX.Element => <Variant1>{dependency}</Variant1>;

export default Component;
