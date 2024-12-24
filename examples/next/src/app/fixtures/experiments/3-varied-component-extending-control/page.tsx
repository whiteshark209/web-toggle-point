"use client";

import type { JSX } from "react";
import Component from "./component";
import ReadMe from "./README.mdx";

const Page = (): JSX.Element => (
  <>
    <ReadMe />
    <div id="example">
      <Component />
    </div>
  </>
);

export default Page;
