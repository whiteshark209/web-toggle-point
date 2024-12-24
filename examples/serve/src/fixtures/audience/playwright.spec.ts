import { test, expect } from "@playwright/test";

test.describe("audience-specific content", () => {
  test.describe("when visiting without an audience cookie", () => {
    test("it shows the control content", async ({ page }) => {
      await page.goto("/");
      await expect(
        page.getByText(
          "Some audience-specific content: this is a value for the default experience"
        )
      ).toBeVisible();
    });
  });

  [
    { cohort: "cohort-1", expected: "this is a value for cohort 1" },
    { cohort: "cohort-2", expected: "this is a value for cohort 2" }
  ].forEach(({ cohort, expected }) => {
    test.describe(`when the user has an audience cookie with value ${cohort}`, () => {
      test(`it shows the toggled content (${expected})`, async ({
        page,
        context
      }) => {
        await context.addCookies([
          { name: "audience", value: cohort, path: "/", domain: "localhost" }
        ]);
        await page.goto("/");
        await expect(
          page.getByText(`Some audience-specific content: ${expected}`)
        ).toBeVisible();
      });
    });
  });
});
