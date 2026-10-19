import type { Page } from "@playwright/test";
export async function navigate(page: Page, name: string) {
  if (name === "Rooms") name = "Lighting";
  const desktop = page.getByRole("navigation", {
    name: "Dashboard navigation",
  });
  if (await desktop.isVisible()) {
    await desktop.getByRole("button", { name, exact: true }).click();
    return;
  }
  const mobile = page.getByRole("navigation", { name: "Mobile navigation" });
  if (["Climate", "Security", "Automations"].includes(name)) {
    await mobile.getByRole("button", { name: "More", exact: true }).click();
    await page
      .locator("#more-sheet")
      .getByRole("button", { name, exact: true })
      .click();
    await page.waitForURL(new RegExp("#signal/" + (name === "Security" ? "safety" : name.toLowerCase()) + "$"));
  } else await mobile.getByRole("button", { name, exact: true }).click();
}
