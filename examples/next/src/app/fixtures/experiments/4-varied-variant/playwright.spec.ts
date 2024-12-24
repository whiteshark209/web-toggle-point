import { test, expect, ConsoleMessage } from "@playwright/test";
import setExperimentHeaders from "../playwright.setExperimentHeaders";
import locateWithinExample from "../playwright.locateInExample";
import getFixtureURL from "../playwright.getFixtureUrl";
const fixtureURL = getFixtureURL(import.meta.url);

test.describe("varying a variant in a second experiment", () => {
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

    test.describe("when a second experiment is set", () => {
      setExperimentHeaders(test, {
        "test-feature": { bucket: "test-variant" },
        "test-feature-2": { bucket: "test-variant-2" }
      });

      test("it shows a doubly-varied experience", async ({ page }) => {
        await expect(locateWithinExample(page, "variant 2")).toBeInViewport();
      });

      test("it should activate the second feature with the toggle router", async () => {
        await expect(() => {
          expect(log).toContain(
            `activated test-feature-2 with audience ${audience}`
          );
        }).toPass();
      });
    });
  });
});
