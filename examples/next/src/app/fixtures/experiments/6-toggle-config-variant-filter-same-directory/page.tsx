"use client";

import type { JSX } from "react";
import Component from "./component";
import Component2 from "./component2";
import ReadMe from "./README.mdx";

const Page = (): JSX.Element => (
  <>
    <ReadMe />
    <div id="example">
      <Component />
      <Component2 />
    </div>
  </>
);

export default Page;
