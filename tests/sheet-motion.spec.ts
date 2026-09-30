import { test, expect, type Page } from "@playwright/test";

async function setup(page: Page, width = 390) {
  await page.setViewportSize({ width, height: 844 });
  await page.goto("/");
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    const original = card.hass.callWS;
    (window as any).historyRequests = [];
    card.hass = {
      ...card.hass,
      callWS: async (message: any) => {
        if (message.type !== "history/history_during_period")
          return original(message);
        (window as any).historyRequests.push(performance.now());
        return {
          [message.entity_ids[0]]: [{ s: "42", lu: Date.now() / 1000 }],
        };
      },
    };
    card.setConfig({ ...card.config, graphs: [card.config.humidity] });
    const animate = Element.prototype.animate;
    (window as any).sheetAnimations = [];
    Element.prototype.animate = function (frames, options) {
      const animation = animate.call(this, frames, options);
      if (this instanceof HTMLDialogElement) {
        (window as any).sheetAnimations.push(animation);
        animation.pause();
        animation.currentTime = 100;
      }
      return animation;
    };
  });
}

async function finishMotion(page: Page) {
  await page.evaluate(() => {
    for (const animation of (window as any).sheetAnimations)
      if (animation.playState !== "idle") animation.finish();
  });
}

test("mobile sheet slides without shrinking, fades its scrim, and defers cold history", async ({
  page,
}) => {
  await setup(page);
  await page
    .getByRole("button", { name: "Climate details", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  const motion = await dialog.evaluate((el) => {
    const animations = (window as any).sheetAnimations as Animation[];
    const sheet = animations.find(
      (a) => !(a.effect as KeyframeEffect).pseudoElement,
    )!;
    const scrim = animations.find(
      (a) => (a.effect as KeyframeEffect).pseudoElement === "::backdrop",
    )!;
    const matrix = new DOMMatrix(getComputedStyle(el).transform);
    return {
      frames: (sheet.effect as KeyframeEffect).getKeyframes(),
      scrimDuration: scrim.effect!.getTiming().duration,
      duration: sheet.effect!.getTiming().duration,
      scrimOpacity: Number(getComputedStyle(el, "::backdrop").opacity),
      scale: matrix.a,
      travel: matrix.f,
      requests: (window as any).historyRequests.length,
    };
  });
  expect(motion.frames[0].transform).toBe("translateY(100%)");
  expect(motion.frames[0].opacity).toBe("1");
  expect(motion.scale).toBe(1);
  expect(motion.travel).toBeGreaterThan(0);
  expect(motion.scrimOpacity).toBeGreaterThan(0);
  expect(motion.scrimOpacity).toBeLessThan(1);
  expect(motion.scrimDuration).toBe(motion.duration);
  expect(motion.requests).toBe(0);
  await finishMotion(page);
  await expect(page.locator("signal-details .chart")).toBeVisible();
  expect(
    await page.evaluate(() => (window as any).historyRequests.length),
  ).toBe(1);
  await page.keyboard.press("Escape");
  await expect
    .poll(() => page.evaluate(() => (window as any).sheetAnimations.length))
    .toBe(4);
  await finishMotion(page);
  await expect(dialog).toHaveCount(0);
  await page
    .getByRole("button", { name: "Climate details", exact: true })
    .click();
  // Warm history is available even before the new entrance completes.
  await expect(page.locator("signal-details .chart")).toBeVisible();
  await finishMotion(page);
  expect(
    await page.evaluate(() => (window as any).historyRequests.length),
  ).toBe(1);
});

test("Back interrupts entrance from its current position and never starts hidden history", async ({
  page,
}) => {
  await setup(page);
  await page
    .getByRole("button", { name: "Climate details", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  const before = await dialog.evaluate((el) => ({
    transform: getComputedStyle(el).transform,
    opacity: getComputedStyle(el, "::backdrop").opacity,
  }));
  await page.goBack();
  await expect
    .poll(() => page.evaluate(() => (window as any).sheetAnimations.length))
    .toBe(4);
  const exit = await page.evaluate(() => {
    const animations = (window as any).sheetAnimations as Animation[];
    return animations
      .slice(-2)
      .map((a) => ({
        pseudo: (a.effect as KeyframeEffect).pseudoElement,
        frames: (a.effect as KeyframeEffect).getKeyframes(),
      }));
  });
  expect(exit.find((a) => !a.pseudo)!.frames[0].transform).toBe(
    before.transform,
  );
  expect(exit.find((a) => a.pseudo)!.frames[0].opacity).toBe(before.opacity);
  expect(exit.find((a) => !a.pseudo)!.frames[1].transform).toBe(
    "translateY(100%)",
  );
  await finishMotion(page);
  await expect(dialog).toHaveCount(0);
  expect(
    await page.evaluate(() => (window as any).historyRequests.length),
  ).toBe(0);
  expect(await page.evaluate(() => history.state?.signalSheet)).toBeUndefined();
});

test("desktop dialogs keep a small fade rather than full-height mobile travel", async ({
  page,
}) => {
  await setup(page, 1440);
  await page
    .getByRole("button", { name: "Climate details", exact: true })
    .click();
  expect(
    await page.evaluate(() => {
      const animation = (window as any).sheetAnimations.find(
        (a: Animation) => !(a.effect as KeyframeEffect).pseudoElement,
      );
      return animation.effect.getKeyframes()[0].transform;
    }),
  ).toBe("translateY(12px)");
});

test("reduced motion opens immediately and still loads history", async ({
  page,
}) => {
  await setup(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page
    .getByRole("button", { name: "Climate details", exact: true })
    .click();
  await expect(page.locator("signal-details .chart")).toBeVisible();
  expect(
    await page.evaluate(() => (window as any).sheetAnimations.length),
  ).toBe(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("history cache expires and cannot cross Home Assistant sessions", async ({
  page,
}) => {
  await setup(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  const open = () =>
    page.getByRole("button", { name: "Climate details", exact: true }).click();
  const close = async () => {
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  };
  await open();
  await expect(page.locator("signal-details .chart")).toBeVisible();
  await close();
  await page.evaluate(() => {
    const now = Date.now;
    Date.now = () => now() + 61000;
  });
  await open();
  await expect
    .poll(() => page.evaluate(() => (window as any).historyRequests.length))
    .toBe(2);
  await close();
  await page.evaluate(() => {
    const card = document.querySelector("signal-home") as any;
    card.hass = { ...card.hass, connection: {} };
  });
  await open();
  await expect
    .poll(() => page.evaluate(() => (window as any).historyRequests.length))
    .toBe(3);
});
