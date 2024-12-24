import { devices, ReporterDescription } from "@playwright/test";

const baseConfig = {
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  workers: process.env.CI ? 1 : undefined,
  reporter: (process.env.CI
    ? [["blob"], ["github"]]
    : [["list"], ["html"]]) as ReporterDescription[],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],
  webServer: {
    reuseExistingServer: !process.env.CI
  }
};

export default baseConfig;
