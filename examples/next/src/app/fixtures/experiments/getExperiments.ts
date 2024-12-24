import { headers } from "next/headers";
import { Experiments } from "./experiments";

export default async function getExperiments(): Promise<
  Experiments | Record<string, never>
> {
  const headersList = await headers();
  const experiments = JSON.parse(headersList.get("experiments")) || {};

  return experiments;
}
