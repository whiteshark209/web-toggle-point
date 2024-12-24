import { test, expect } from "@playwright/test";

test.describe("site-specific content", () => {
  test.describe("when visiting an un-toggled site", () => {
    test("it shows the control content", async ({ page }) => {
      await page.goto("/");
      await expect(
        page.getByText("Some site-specific content: this is a default value")
      ).toBeVisible();
      await expect(
        page.getByText(
          "Some more site-specific content: this is a default value from subpath"
        )
      ).toBeVisible;
    });
  });

  [
    {
      site: "it",
      expected1:
        "this is a value for the it and es sites, extended for the it site",
      expected2: "this is a default value from subpath"
    },
    {
      site: "es",
      expected1: "this is a value for the it and es sites",
      expected2: "this is a default value from subpath"
    },
    {
      site: "us",
      expected1: "this is a default value",
      expected2: "this is a value for subpath for the us, de and fr sites"
    },
    {
      site: "de",
      expected1: "this is a default value",
      expected2: "this is a value for subpath for the us, de and fr sites"
    },
    {
      site: "fr",
      expected1: "this is a default value",
      expected2: "this is a value for subpath for the us, de and fr sites"
    }
  ].forEach(({ site, expected1, expected2 }) => {
    test.describe(`when navigator preference matches a toggled site (${site})`, () => {
      test(`it shows the toggled content (${expected1}) and (${expected2})`, async ({
        page
      }) => {
        await page.goto(`/${site}`);
        await expect(
          page.getByText(`Some site-specific content: ${expected1}`)
        ).toBeVisible();
        await expect(
          page.getByText(`Some more site-specific content: ${expected2}`)
        ).toBeVisible();
      });
    });
  });
});
