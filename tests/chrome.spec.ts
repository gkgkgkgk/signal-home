import { test, expect, type Page } from "@playwright/test";

async function chrome(page: Page) {
  return page.evaluate(() => {
    const css = getComputedStyle(document.documentElement);
    return {
      top: css.getPropertyValue("--app-header-background-color").trim(),
      bottom: css.getPropertyValue("--primary-background-color").trim(),
      meta: document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
        ?.content,
      messages: (window as any).chromeMessages,
    };
  });
}
async function enable(page: Page) {
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    (window as any).chromeMessages = [];
    card.hass = {
      ...card.hass,
      auth: {
        external: {
          fireMessage: (message: any) => {
            (window as any).chromeMessages.push({
              ...message,
              color: getComputedStyle(document.documentElement)
                .getPropertyValue("--app-header-background-color")
                .trim(),
            });
          },
        },
      },
    };
    card.setConfig({ ...card.config, immersive: true });
  });
}
test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open Signal menu" }).waitFor();
  await page.evaluate(() => {
    document.documentElement.style.setProperty(
      "--app-header-background-color",
      "#888888",
    );
    document.documentElement.style.setProperty(
      "--primary-background-color",
      "#999999",
    );
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#888888";
    document.head.append(meta);
  });
});
test("native chrome follows light/dark without changing HA theme or issuing services", async ({
  page,
}) => {
  await enable(page);
  await expect.poll(async () => (await chrome(page)).messages.length).toBe(1);
  expect(await chrome(page)).toMatchObject({
    top: "#f4f3ee",
    bottom: "#f4f3ee",
    meta: "#f4f3ee",
  });
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect.poll(async () => (await chrome(page)).messages.length).toBe(2);
  expect(await chrome(page)).toMatchObject({
    top: "#1a2320",
    bottom: "#1a2320",
    meta: "#1a2320",
  });
  const nativeReads = await page.evaluate(() => {
    const root = document.documentElement as any;
    const probe = document.createElement("div");
    probe.style.backgroundColor = "var(--app-header-background-color)";
    document.body.append(probe);
    const ios = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return {
      android: String(
        root.computedStyleMap().get("--app-header-background-color")[0],
      ).trim(),
      ios,
    };
  });
  expect(nativeReads).toEqual({ android: "#1a2320", ios: "rgb(26, 35, 32)" });
  expect(
    await page.evaluate(() =>
      document.documentElement.style.getPropertyValue(
        "--app-header-background-color",
      ),
    ),
  ).toBe("#888888");
  expect(
    (await chrome(page)).messages.every((m: any) => m.type === "theme-update"),
  ).toBe(true);
  expect(
    await page.evaluate(() =>
      (window as any).demo.calls.some((c: any) => c.domain === "frontend"),
    ),
  ).toBe(false);
  await page.evaluate(() => document.querySelector("signal-home")!.remove());
  await expect.poll(async () => (await chrome(page)).messages.length).toBe(3);
  expect(await chrome(page)).toMatchObject({
    top: "#888888",
    bottom: "#999999",
    meta: "#888888",
  });
  expect((await chrome(page)).messages[2].color).toBe("#888888");
});
test("leaving a cached dashboard restores chrome and returning reapplies it", async ({
  page,
}) => {
  await enable(page);
  await page.evaluate(() => {
    history.pushState({}, "", "/profile");
    dispatchEvent(new Event("location-changed"));
  });
  await expect.poll(async () => (await chrome(page)).top).toBe("#888888");
  await page.evaluate(() => {
    history.pushState({}, "", "/");
    dispatchEvent(new Event("location-changed"));
  });
  await expect.poll(async () => (await chrome(page)).top).toBe("#f4f3ee");
  await page.evaluate(() => {
    history.replaceState({}, "", "/?disable_km");
    dispatchEvent(new Event("location-changed"));
  });
  await expect.poll(async () => (await chrome(page)).top).toBe("#888888");
});
test("HA theme updates underneath Signal survive cleanup; no notification loop", async ({
  page,
}) => {
  await enable(page);
  await page.evaluate(() => {
    document.documentElement.style.setProperty(
      "--app-header-background-color",
      "#123456",
    );
    document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    )!.content = "#123456";
  });
  await expect.poll(async () => (await chrome(page)).meta).toBe("#f4f3ee");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await expect.poll(async () => (await chrome(page)).messages.length).toBe(2);
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    card.setConfig({ ...card.config, immersive: false });
  });
  await expect.poll(async () => (await chrome(page)).top).toBe("#123456");
  expect((await chrome(page)).meta).toBe("#123456");
});
test("ordinary cards leave native chrome alone; missing native bridge is safe", async ({
  page,
}) => {
  expect((await chrome(page)).top).toBe("#888888");
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    card.setConfig({ ...card.config, immersive: true });
  });
  await expect.poll(async () => (await chrome(page)).top).toBe("#f4f3ee");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  expect((await chrome(page)).top).toBe("#1a2320");
});
