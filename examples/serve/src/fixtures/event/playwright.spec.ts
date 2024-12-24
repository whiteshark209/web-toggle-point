import { test, expect } from "@playwright/test";

test.describe("date-specific content", () => {
  test.describe("when visiting on an un-toggled date", () => {
    test("it shows the control content", async ({ page }) => {
      await page.goto("/");
      expect(
        await page.getByText("Some event-themed content").screenshot()
      ).toMatchSnapshot("./screenshots/control.png");
    });
  });

  [
    { event: "pride", date: new Date(Date.UTC(2025, 6, 5)) },
    { event: "st-patricks-day", date: new Date(Date.UTC(2025, 2, 17)) },
    { event: "halloween", date: new Date(Date.UTC(2025, 9, 31)) }
  ].forEach(({ event, date }) => {
    test.describe("when visiting on a toggled date", () => {
      test(`it shows the themed content for ${event}`, async ({ page }) => {
        await page.clock.setFixedTime(date);
        await page.goto("/");
        expect(
          await page.getByText("Some event-themed content").screenshot()
        ).toMatchSnapshot(`./screenshots/${event}.png`);
      });
    });
  });
});
