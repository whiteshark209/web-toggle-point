import { Page, Locator } from "@playwright/test";

function locateWithinExample(page: Page, testId: string): Locator {
  return page.locator("#example").getByTestId(testId);
}

export default locateWithinExample;
