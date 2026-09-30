import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#signal/lists");
  await page.evaluate(() => {
    const demo = (window as any).demo;
    demo.setList("todo.projects", "House projects", [
      { uid: "1", summary: "Paint the hallway", status: "needs_action" },
      {
        uid: "done",
        summary: "Fix the shelf",
        status: "completed",
        completed: new Date().toISOString(),
      },
    ]);
    demo.setList("todo.weekend", "Weekend", [
      { uid: "1", summary: "Book a table", status: "needs_action" },
    ]);
  });
});

test("all lists are discovered; add, check, undo and delete target only the selected entity", async ({
  page,
}) => {
  const picker = page.getByRole("group", { name: "Your to-do lists" });
  await expect(picker.getByRole("button")).toHaveCount(3);
  await expect(
    page.getByRole("button", { name: "Open list Groceries", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("button", { name: "Open list House projects", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Complete Paint the hallway" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Complete Fresh lemons" }),
  ).toHaveCount(0);
  await page.getByRole("textbox", { name: "New task" }).fill("Replace bulb");
  await page.getByRole("button", { name: "Add task", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Complete Replace bulb" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Complete Paint the hallway" })
    .click();
  await expect(
    page.getByRole("button", { name: "Open list Weekend" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Complete Paint the hallway" }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "Delete Paint the hallway", exact: true })
    .click();
  await expect(page.locator(".delete-list-name")).toHaveText("House projects");
  await page
    .getByRole("button", { name: "Delete permanently", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await page
    .getByRole("button", { name: "Open list Weekend", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Complete Book a table" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Open list Groceries", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Complete Fresh lemons" }),
  ).toBeVisible();
  const calls = await page.evaluate(() =>
    (window as any).demo.calls.filter(
      (call: any) =>
        call.domain === "todo" &&
        ["add_item", "update_item", "remove_item"].includes(call.service),
    ),
  );
  expect(calls).toHaveLength(4);
  expect(
    calls.every((call: any) => call.data.entity_id === "todo.projects"),
  ).toBe(true);
});

test("list switching clears stale undo and draft; cleanup notice stays with its configured list", async ({
  page,
}) => {
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    card.setConfig({ ...card.config, completed_retention_days: 7 });
  });
  await page.getByRole("button", { name: "Complete Fresh lemons" }).click();
  await expect(
    page.getByRole("button", { name: "Undo", exact: true }),
  ).toBeEnabled();
  await expect(
    page.getByText(/HA automatically deletes timestamped/),
  ).toBeVisible();
  await page
    .getByRole("textbox", { name: "New task" })
    .fill("An unfinished draft");
  await page
    .getByRole("button", { name: "Open list House projects", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Restore Fix the shelf" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Undo", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "New task" })).toHaveValue("");
  await expect(
    page.getByText(/HA automatically deletes timestamped/),
  ).toHaveCount(0);
});

test("a slow response from the previous list cannot populate the next list", async ({
  page,
}) => {
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    const original = card.hass.callWS;
    card.hass = {
      ...card.hass,
      callWS: async (message: any) => {
        const result = await original(message);
        if (message.service_data?.entity_id === "todo.projects")
          await new Promise(
            (resolve) => ((window as any).releaseOldList = resolve),
          );
        return result;
      },
    };
  });
  await page
    .getByRole("button", { name: "Open list House projects", exact: true })
    .click();
  await expect
    .poll(() => page.evaluate(() => !!(window as any).releaseOldList))
    .toBe(true);
  await page
    .getByRole("button", { name: "Open list Weekend", exact: true })
    .click();
  await page.evaluate(() => (window as any).releaseOldList());
  await expect(
    page.getByRole("button", { name: "Complete Book a table" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Complete Paint the hallway" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Restore Fix the shelf" }),
  ).toHaveCount(0);
});

test("discovery works without a configured default and recovers when a list disappears", async ({
  page,
}) => {
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    card.setConfig({ ...card.config, todo: undefined });
  });
  await page
    .getByRole("button", { name: "Open list Weekend", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Complete Book a table" }),
  ).toBeVisible();
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    const states = { ...card.hass.states };
    delete states["todo.weekend"];
    card.hass = { ...card.hass, states };
  });
  await expect(
    page.getByRole("button", { name: "Complete Fresh lemons" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open list Weekend", exact: true }),
  ).toHaveCount(0);
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    card.hass = {
      ...card.hass,
      states: Object.fromEntries(
        Object.entries(card.hass.states).filter(
          ([id]) => !id.startsWith("todo."),
        ),
      ),
    };
  });
  await expect(page.getByText(/No to-do lists are available/)).toBeVisible();
  await expect(page.locator(".todo-row")).toHaveCount(0);
});

test("read-only lists remain readable and long names fit small phones", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.evaluate(() =>
    (window as any).demo.setList(
      "todo.readonly",
      "A very long shared project list for everything around the house",
      [{ uid: "read", summary: "Read-only task", status: "needs_action" }],
      0,
    ),
  );
  await page
    .getByRole("button", { name: /Open list A very long shared/ })
    .click();
  await expect(
    page.getByRole("button", { name: "Complete Read-only task" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Delete Read-only task" }),
  ).toBeDisabled();
  await expect(page.getByRole("textbox", { name: "New task" })).toBeDisabled();
  expect(
    await page
      .locator("signal-home main")
      .evaluate((el) => el.scrollWidth <= el.clientWidth + 1),
  ).toBe(true);
});
