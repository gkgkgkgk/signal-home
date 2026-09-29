export async function setAppearance(page, mode) {
  await page.getByRole("button", { name: "Open Signal menu" }).click();
  await page
    .getByRole("combobox", { name: "Appearance", exact: true })
    .selectOption(mode);
  await page.getByRole("button", { name: "Close details" }).click();
  await page.getByRole("dialog").waitFor({ state: "hidden" });
}
