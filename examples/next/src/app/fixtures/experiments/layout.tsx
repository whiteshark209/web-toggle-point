import { ReactNode } from "react";
import getExperiments from "./getExperiments";
import Example from "./example";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const experiments = await getExperiments();
  return <Example experiments={experiments}>{children}</Example>;
}
