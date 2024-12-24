import { test, expect } from "@playwright/test";
import setExperimentHeaders from "../playwright.setExperimentHeaders";
import locateWithinExample from "../playwright.locateInExample";
import getFixtureURL from "../playwright.getFixtureUrl";
const fixtureURL = getFixtureURL(import.meta.url);

test.describe("preventing toggling of a module using a toggleConfig", () => {
  test.describe("when no experiments header set", () => {
    test("it shows the control module", async ({ page }) => {
      await page.goto(fixtureURL);
      await expect(locateWithinExample(page, "control 1")).toBeInViewport();
    });
  });

  test.describe("when an experiments header set", () => {
    setExperimentHeaders(test);

    test("it shows the control module (since variant excluded by the toggle config)", async ({
      page
    }) => {
      await page.goto(fixtureURL);
      await expect(locateWithinExample(page, "control 1")).toBeInViewport();
    });
  });
});
