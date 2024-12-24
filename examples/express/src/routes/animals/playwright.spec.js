import { test, expect } from "@playwright/test";

const setupMockResponses = async (page) => {
  await page.route(
    "https://api.thecatapi.com/v1/images/search",
    async (route) => {
      const json = [
        {
          id: "dji",
          url: "https://cdn2.thecatapi.com/images/dji.jpg",
          width: 640,
          height: 640
        }
      ];
      await route.fulfill({ json });
    }
  );

  await page.route("https://dog.ceo/api/breeds/image/random", async (route) => {
    const json = {
      message:
        "https://images.dog.ceo/breeds/australian-kelpie/Resized_20200303_233358_108952253645051.jpg",
      status: "success"
    };
    await route.fulfill({ json });
  });
};

test.describe("versioned image endpoint", () => {
  ["1", "2"].forEach((version) => {
    test.describe(`varying a component (version ${version})`, () => {
      test.use({
        extraHTTPHeaders: { version }
      });

      test("it shows a varied experience", async ({ page }) => {
        await setupMockResponses(page);
        await page.goto("http://localhost:3002/animals");
        await expect(
          page.locator(`img[data-version="${version}"]`)
        ).toBeInViewport();
      });
    });
  });
});
