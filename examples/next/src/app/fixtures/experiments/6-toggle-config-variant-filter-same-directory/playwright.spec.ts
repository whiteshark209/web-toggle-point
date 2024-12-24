import { test, expect } from "@playwright/test";
import setExperimentHeaders from "../playwright.setExperimentHeaders";
import locateWithinExample from "../playwright.locateInExample";
import getFixtureURL from "../playwright.getFixtureUrl";
const fixtureURL = getFixtureURL(import.meta.url);

test.describe("varying a component whilst using a toggle config to control the join point", () => {
  test.describe("when no experiments header set", () => {
    test("it shows two control modules", async ({ page }) => {
      await page.goto(fixtureURL);
      await expect(locateWithinExample(page, "control 1")).toBeInViewport();
      await expect(locateWithinExample(page, "control 2")).toBeInViewport();
    });
  });

  test.describe("when an experiments header set", () => {
    setExperimentHeaders(test);

    test("it shows a varied first module, with the second unvaried (since excluded by the toggle config)", async ({
      page
    }) => {
      await page.goto(fixtureURL);
      await expect(locateWithinExample(page, "variant 1")).toBeInViewport();
      await expect(locateWithinExample(page, "control 2")).toBeInViewport();
    });
  });
});
