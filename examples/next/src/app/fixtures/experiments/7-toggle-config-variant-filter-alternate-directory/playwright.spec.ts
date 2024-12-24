import { test, expect } from "@playwright/test";
import setExperimentHeaders from "../playwright.setExperimentHeaders";
import locateWithinExample from "../playwright.locateInExample";
import getFixtureURL from "../playwright.getFixtureUrl";
const fixtureURL = getFixtureURL(import.meta.url);

test.describe("varying a component and directly referencing a variant dependency within another folder from that variant, using a toggleConfig to prevent that dependency being toggled itself", () => {
  test.describe("when no experiments header set", () => {
    test("it shows the control module, and the control dependency", async ({
      page
    }) => {
      await page.goto(fixtureURL);
      await expect(locateWithinExample(page, "control 1")).toContainText(
        "control dependency value"
      );
    });
  });

  test.describe("when an experiments header set", () => {
    setExperimentHeaders(test);

    test("it shows a varied module, with the directly-referenced varied dependency", async ({
      page
    }) => {
      await page.goto(fixtureURL);
      await expect(locateWithinExample(page, "variant 1")).toContainText(
        "varied dependency value"
      );
    });
  });
});
