"use client";

import type { JSX } from "react";
import Component from "./folder1/component";
import dependency from "./folder2/dependency";
import ReadMe from "./README.mdx";

const Page = (): JSX.Element => (
  <>
    <ReadMe />
    <div id="example">
      <Component />
      {dependency}
    </div>
  </>
);

export default Page;
