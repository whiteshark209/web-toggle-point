import { test, expect } from "@playwright/test";

const scenarios = [
  { size: "Small", port: 3003 },
  { size: "Medium", port: 3002 },
  { size: "Large", port: 3004 }
];

test.describe("config endpoint", () => {
  scenarios.forEach(({ size, port }) => {
    test.describe(`server rendering a config as props to a component (size ${size})`, () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`http://localhost:${port}/config`);
      });

      test("it shows a varied experience", async ({ page }) => {
        await expect(page.getByText(`I'm ${size}`)).toBeInViewport();
      });

      scenarios
        .filter((scenario) => scenario.size !== size)
        .forEach(({ size: otherSize }) => {
          test.describe(`when clicking on the ${otherSize} button`, () => {
            test("it shows an updated experience, overriding the settings configured on the server", async ({
              page
            }) => {
              await page.getByRole("button", { name: otherSize }).click();
              await expect(page.getByText(`I'm ${otherSize}`)).toBeInViewport();
            });
          });
        });
    });
  });
});
