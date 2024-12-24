import { test, expect, ConsoleMessage } from "@playwright/test";
import setExperimentHeaders from "../playwright.setExperimentHeaders";
import locateWithinExample from "../playwright.locateInExample";
import getFixtureURL from "../playwright.getFixtureUrl";
const fixtureURL = getFixtureURL(import.meta.url);

test.describe("varying a component", () => {
  test.describe("when no experiments header set", () => {
    test("it shows a default experience", async ({ page }) => {
      await page.goto(fixtureURL);
      await expect(locateWithinExample(page, "control 1")).toBeInViewport();
    });
  });

  test.describe("when an experiments header set", () => {
    const { decisions, audience } = setExperimentHeaders(test);
    const [feature] = Object.keys(decisions);

    const log: string[] = [];
    test.beforeEach(async ({ page }) => {
      page.on("console", (message: ConsoleMessage) => log.push(message.text()));
      await page.goto(fixtureURL);
    });

    test("it shows a varied experience", async ({ page }) => {
      await expect(locateWithinExample(page, "variant 1")).toBeInViewport();
    });

    test("it should activate the feature with the toggle router", async () => {
      await expect(() => {
        expect(log).toContain(`activated ${feature} with audience ${audience}`);
      }).toPass();
    });
  });
});
