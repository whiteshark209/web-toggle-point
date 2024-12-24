import { test, expect } from "@playwright/test";

test.describe("translating content", () => {
  test.describe("when navigator preference does not match a toggled language", () => {
    test("it shows the control content", async ({ page }) => {
      await page.goto("/");
      await expect(
        page.getByText("Some translated content: english value")
      ).toBeVisible();
    });
  });

  [
    { locale: "de", expected: "deutscher wert" },
    { locale: "pt-BR", expected: "valor brasileiro" }
  ].forEach(({ locale, expected }) => {
    test.describe(`when navigator preference matches a toggled locale (${locale})`, () => {
      test.use({ locale });
      test(`it shows the toggled content (${expected})`, async ({ page }) => {
        await page.goto("/");
        await expect(
          page.getByText(`Some translated content: ${expected}`)
        ).toBeVisible();
      });
    });
  });
});
