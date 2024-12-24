import { test, expect } from "@playwright/test";
import setExperimentHeaders from "../playwright.setExperimentHeaders";
import locateWithinExample from "../playwright.locateInExample";
import getFixtureURL from "../playwright.getFixtureUrl";
const fixtureURL = getFixtureURL(import.meta.url);

test.describe("varying a component that imports and extends the control component", () => {
  test.describe("when no experiments header set", () => {
    test("it shows a default experience", async ({ page }) => {
      await page.goto(fixtureURL);
      await expect(locateWithinExample(page, "control 1")).toBeInViewport();
      await expect(
        locateWithinExample(page, "control 1").locator("..")
      ).not.toContainText("Variant 1");
    });
  });

  test.describe("when an experiments header set", () => {
    setExperimentHeaders(test);

    test("it shows a varied experience, with the default experience embedded", async ({
      page
    }) => {
      await page.goto(fixtureURL);
      await expect(locateWithinExample(page, "control 1")).toBeInViewport();
      await expect(
        locateWithinExample(page, "control 1").locator("..")
      ).toContainText("Variant 1");
    });
  });
});
