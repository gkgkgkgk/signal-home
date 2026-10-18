import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#signal/lists");
});

const calls = (page: any) =>
  page.evaluate(() =>
    (window as any).demo.calls.filter(
      (call: any) => call.domain === "todo" && call.service === "update_item",
    ),
  );

test("tap an item to rename it; Enter saves and the new name survives a reload", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Edit Fresh lemons", exact: true }).click();
  const input = page.getByRole("textbox", { name: "Edit Fresh lemons" });
  await expect(input).toBeFocused();
  await expect(input).toHaveValue("Fresh lemons");
  // The whole name is selected, so typing replaces it.
  await page.keyboard.type("Meyer lemons");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Edit Meyer lemons", exact: true })).toBeVisible();
  await expect(page.getByText("Saved.", { exact: true })).toBeVisible();
  expect(await calls(page)).toEqual([
    { domain: "todo", service: "update_item", data: { entity_id: "todo.demo", item: "1", rename: "Meyer lemons" } },
  ]);
  await page.getByRole("button", { name: "Refresh list" }).click();
  await expect(page.getByRole("button", { name: "Edit Meyer lemons", exact: true })).toBeVisible();
  // Renaming doesn't touch its status.
  await expect(page.getByRole("button", { name: "Complete Meyer lemons", exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});

test("Escape, empty and unchanged names never call Home Assistant", async ({ page }) => {
  const edit = page.getByRole("button", { name: "Edit Oat milk", exact: true });
  await edit.click();
  await page.keyboard.type("Almond milk");
  await page.keyboard.press("Escape");
  await expect(edit).toBeFocused();
  await edit.click();
  await page.keyboard.press("Backspace");
  await page.keyboard.press("Enter");
  await expect(edit).toBeVisible();
  await edit.click();
  await page.keyboard.press("Enter");
  await expect(edit).toBeVisible();
  await edit.click();
  await page.getByRole("textbox", { name: "Edit Oat milk" }).fill("  Oat milk  ");
  await page.keyboard.press("Enter");
  await expect(edit).toBeVisible();
  expect(await calls(page)).toEqual([]);
});

test("tapping away saves, and a failed save keeps the edit to retry", async ({ page }) => {
  await page.getByRole("button", { name: "Edit Oat milk", exact: true }).click();
  await page.getByRole("textbox", { name: "Edit Oat milk" }).fill("Oat milk, barista");
  await page.getByRole("heading").first().click();
  await expect(page.getByRole("button", { name: "Edit Oat milk, barista", exact: true })).toBeVisible();

  await page.evaluate(() => ((window as any).demo.fail = true));
  await page.getByRole("button", { name: "Edit Oat milk, barista", exact: true }).click();
  const input = page.getByRole("textbox", { name: "Edit Oat milk, barista" });
  await input.fill("Oat milk x2");
  await page.keyboard.press("Enter");
  await expect(page.getByText("Couldn’t save that change. Try again.")).toBeVisible();
  await expect(input).toHaveValue("Oat milk x2");
  await page.evaluate(() => ((window as any).demo.fail = false));
  await input.press("Enter");
  await expect(page.getByRole("button", { name: "Edit Oat milk x2", exact: true })).toBeVisible();
  expect((await calls(page)).map((c: any) => c.data.rename)).toEqual(["Oat milk, barista", "Oat milk x2", "Oat milk x2"]);
});

test("completed items can be renamed; read-only lists can't", async ({ page }) => {
  await page.getByRole("button", { name: "Complete Fresh lemons", exact: true }).click();
  await page.getByRole("button", { name: "Edit Fresh lemons", exact: true }).click();
  await page.getByRole("textbox", { name: "Edit Fresh lemons" }).fill("Lemons");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Restore Lemons", exact: true })).toBeVisible();

  await page.evaluate(() =>
    (window as any).demo.setList("todo.shared", "Shared", [{ uid: "s1", summary: "Batteries", status: "needs_action" }], 3),
  );
  await page.getByRole("button", { name: "Open list Shared" }).click();
  await expect(page.getByText("Batteries", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit Batteries" })).toHaveCount(0);

});
