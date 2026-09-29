import { test, expect } from "@playwright/test";
import { setAppearance } from "../scripts/appearance.mjs";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#signal/lists");
});

test("trash is a touch-sized control; keep, Escape and Back never delete", async ({
  page,
}) => {
  const trash = page.getByRole("button", {
    name: "Delete Fresh lemons",
    exact: true,
  });
  const rect = await trash.boundingBox();
  expect(rect!.width).toBeGreaterThanOrEqual(44);
  expect(rect!.height).toBeGreaterThanOrEqual(44);
  for (const dismiss of ["keep", "escape", "back"]) {
    await trash.click();
    const dialog = page.getByRole("dialog", { name: "Delete permanently?" });
    await expect(dialog).toBeVisible();
    await expect(page.locator("#delete-sheet")).toContainText(
      "shared list for everyone",
    );
    await expect(page.locator("#delete-sheet")).toContainText(
      "can’t be undone",
    );
    expect((await dialog.boundingBox())!.width).toBeLessThan(390);
    if (dismiss === "keep")
      await page
        .getByRole("button", { name: "Keep item", exact: true })
        .click();
    if (dismiss === "escape") await page.keyboard.press("Escape");
    if (dismiss === "back") await page.goBack();
    await expect(dialog).toBeHidden();
    await expect(trash).toBeFocused();
    await expect(page).toHaveURL(/#signal\/lists$/);
  }
  expect(
    await page.evaluate(() =>
      (window as any).demo.calls.filter(
        (c: any) => c.service === "remove_item",
      ),
    ),
  ).toEqual([]);
});

test("confirmation deletes only the chosen UID even with duplicate labels", async ({
  page,
}) => {
  await page.evaluate(() =>
    (window as any).demo.setItems([
      { uid: "keep-me", summary: "Milk", status: "needs_action" },
      { uid: "delete-me", summary: "Milk", status: "needs_action" },
    ]),
  );
  await page
    .getByRole("button", { name: "Delete Milk", exact: true })
    .nth(1)
    .click();
  const accept = page.getByRole("button", {
    name: "Delete permanently",
    exact: true,
  });
  await accept.click();
  await expect(
    page.getByRole("button", { name: "Deleting…", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("dialog", { name: "Delete permanently?" }),
  ).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Complete Milk", exact: true }),
  ).toHaveCount(1);
  await expect(page.getByRole("status")).toHaveText("Permanently deleted.");
  await expect(
    page.getByRole("button", { name: "Undo", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Refresh groceries" }),
  ).toBeFocused();
  expect(await page.evaluate(() => history.state?.signalSheet)).toBeUndefined();
  expect(
    await page.evaluate(() =>
      (window as any).demo.calls.filter(
        (c: any) => c.service === "remove_item",
      ),
    ),
  ).toEqual([
    {
      domain: "todo",
      service: "remove_item",
      data: { entity_id: "todo.demo", item: "delete-me" },
    },
  ]);
  // A refresh reads the actual demo backend, not merely the optimistic UI.
  await page.getByRole("button", { name: "Refresh groceries" }).click();
  await expect(page.locator('[data-todo-uid="keep-me"]')).toBeVisible();
  await expect(page.locator('[data-todo-uid="delete-me"]')).toHaveCount(0);
});

test("failed deletion keeps the item and confirmation open for a retry", async ({
  page,
}) => {
  await setAppearance(page, "dark");
  await page
    .getByRole("button", { name: "Delete Fresh lemons", exact: true })
    .click();
  await page.evaluate(() => ((window as any).demo.fail = true));
  await page
    .getByRole("button", { name: "Delete permanently", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText("Couldn’t delete");
  await expect(
    page.getByRole("dialog", { name: "Delete permanently?" }),
  ).toBeVisible();
  await expect(page.locator('[data-todo-uid="1"]')).toHaveCount(1);
  await page.evaluate(() => ((window as any).demo.fail = false));
  await page
    .getByRole("button", { name: "Delete permanently", exact: true })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Delete permanently?" }),
  ).toBeHidden();
  await expect(page.locator('[data-todo-uid="1"]')).toHaveCount(0);
});

test("recent and older completed tasks both support explicit permanent deletion", async ({
  page,
}) => {
  await page.evaluate(() =>
    (window as any).demo.setItems([
      {
        uid: "recent",
        summary: "Recent",
        status: "completed",
        completed: new Date().toISOString(),
      },
      {
        uid: "old",
        summary: "Old",
        status: "completed",
        completed: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
    ]),
  );
  await page.getByText("Older completed · 1", { exact: true }).click();
  for (const name of ["Old", "Recent"]) {
    await page
      .getByRole("button", { name: `Delete ${name}`, exact: true })
      .click();
    await page
      .getByRole("button", { name: "Delete permanently", exact: true })
      .click();
    await expect(
      page.getByRole("dialog", { name: "Delete permanently?" }),
    ).toBeHidden();
    await expect(
      page.getByRole("button", { name: `Restore ${name}`, exact: true }),
    ).toHaveCount(0);
  }
});

test("check and restore animate stable rows without jumping or opening the keyboard", async ({
  page,
}) => {
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    (window as any).unchangedRow = card.shadowRoot.querySelector(
      '[data-todo-uid="2"]',
    );
    const original = Element.prototype.animate;
    (window as any).todoAnimations = [];
    Element.prototype.animate = function (frames, options) {
      if (this.hasAttribute("data-todo-motion"))
        (window as any).todoAnimations.push(
          this.getAttribute("data-todo-motion"),
        );
      return original.call(this, frames, options);
    };
  });
  await page.getByRole("button", { name: "Complete Fresh lemons" }).click();
  await expect(
    page.getByRole("button", { name: "Restore Fresh lemons" }),
  ).toBeEnabled();
  await expect(
    page.getByRole("textbox", { name: "New grocery item" }),
  ).not.toBeFocused();
  expect(
    await page.evaluate(
      () =>
        (window as any).unchangedRow ===
        document
          .querySelector("signal-home")!
          .shadowRoot!.querySelector('[data-todo-uid="2"]'),
    ),
  ).toBe(true);
  expect(await page.evaluate(() => (window as any).todoAnimations)).toEqual(
    expect.arrayContaining(["row:1", "row:2", "form"]),
  );
  // Keyboard focus follows the task across sections.
  await page.getByRole("button", { name: "Restore Fresh lemons" }).focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("button", { name: "Complete Fresh lemons" }),
  ).toBeFocused();
});

test("reduced motion bypasses row animations without losing restore or undo", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(() => {
    const original = Element.prototype.animate;
    (window as any).rowAnimations = 0;
    Element.prototype.animate = function (frames, options) {
      if (this.hasAttribute("data-todo-motion"))
        (window as any).rowAnimations++;
      return original.call(this, frames, options);
    };
  });
  await page.getByRole("button", { name: "Complete Oat milk" }).click();
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Complete Oat milk" }),
  ).toBeEnabled();
  expect(await page.evaluate(() => (window as any).rowAnimations)).toBe(0);
});

test("unsupported and unavailable lists disable permanent deletion", async ({
  page,
}) => {
  for (const [state, features] of [
    ["3", 5],
    ["unavailable", 127],
  ] as const) {
    await page.evaluate(
      ({ state, features }) => {
        const card = document.querySelector("signal-home") as any;
        card.hass = {
          ...card.hass,
          states: {
            ...card.hass.states,
            "todo.demo": {
              ...card.hass.states["todo.demo"],
              state,
              attributes: { supported_features: features },
            },
          },
        };
      },
      { state, features },
    );
    await expect(
      page.getByRole("button", { name: "Delete Fresh lemons", exact: true }),
    ).toBeDisabled();
  }
});

test("changing configured lists invalidates a pending delete confirmation", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Delete Fresh lemons", exact: true })
    .click();
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    card.setConfig({ ...card.config, todo: "todo.other" });
    // A stale confirmation event cannot remove a UID from either list.
    void card.deleteTodo();
  });
  await expect(
    page.getByRole("dialog", { name: "Delete permanently?" }),
  ).toBeHidden();
  expect(
    await page.evaluate(() =>
      (window as any).demo.calls.filter(
        (c: any) => c.service === "remove_item",
      ),
    ),
  ).toEqual([]);
});
