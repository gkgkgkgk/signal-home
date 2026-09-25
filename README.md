# Signal Home

A colorful, fluid dashboard for Home Assistant. Paper and ink. Bold numbers. A little motion. Made for living.

![Signal Home desktop](docs/desktop-light.png)

<details><summary>Dark mode and mobile previews</summary>

![Signal Home dark mode](docs/desktop-dark.png)

<img src="docs/mobile-dark.png" alt="Signal Home mobile dark mode" width="320">
<img src="docs/mobile-light.png" alt="Signal Home mobile light mode" width="320">

</details>

Signal is a self-contained Lovelace card with Overview, Climate, Safety, and Lists views. It brings a consistent interface to your browser and Home Assistant companion app, with a sidebar on desktop and a thumb-friendly dock on mobile. It doesn't replace Home Assistant's settings screens.

## Features

- Light, dark, and system appearance; quick toggle saved per browser.
- Animated climate dial, single target and dual heating/cooling limits, capability-aware mode selection.
- Live weather, grocery list with add/check-off, and named safety sensors with optional battery readings.
- Optional light, switch, fan, scene, and other entity shortcuts.
- Native Home Assistant more-info dialogs for history and detailed controls.
- Visual entity editor and YAML configuration.
- Reduced-motion support, labeled controls, keyboard focus, and layouts tested down to 360 pixels.
- One bundled JavaScript file; no separate theme, fonts, CDN, telemetry, or backend integration.

## Install with HACS

1. In HACS, open the three-dot menu → **Custom repositories**.
2. Add `https://github.com/gkgkgkgk/signal-home` with type **Dashboard**.
3. Search for **Signal Home**, download it, then refresh the browser or companion app.
4. Create a new dashboard and a **Panel** view. Add the **Signal Home** card and select your entities in its editor.

[Open this repository in HACS](https://my.home-assistant.io/redirect/hacs_repository/?owner=gkgkgkgk&repository=signal-home&category=plugin)

HACS installation is supported as a custom repository. This project has not been submitted to the default HACS catalog.

If resources are managed manually, register `/hacsfiles/signal-home/signal-home.js` as a JavaScript module. For installation without HACS, copy `dist/signal-home.js` to `/config/www/signal-home.js` and register `/local/signal-home.js`.

## Configuration

```yaml
views:
  - title: Signal
    path: home
    type: panel
    cards:
      - type: custom:signal-home
        title: Our place
        appearance: auto
        climate: climate.home
        weather: weather.home
        todo: todo.groceries
        humidity: sensor.home_humidity
        sensors:
          - entity: binary_sensor.kitchen_water
            name: Kitchen sink
            battery: sensor.kitchen_water_battery
          - entity: binary_sensor.laundry_water
            name: Laundry room
        favorites:
          - light.reading_lamp
          - scene.evening
```

Replace entity IDs with your own. Every entity field is optional; unconfigured components show setup guidance. An unavailable sensor is explicitly marked unavailable, never reported as safe.

| Option       | Meaning                                                                                        |
| ------------ | ---------------------------------------------------------------------------------------------- |
| `title`      | Home name, default `Home`                                                                      |
| `greeting`   | Optional fixed greeting; otherwise follows the time of day                                     |
| `appearance` | `auto` (default), `light`, or `dark`                                                           |
| `climate`    | Climate entity                                                                                 |
| `weather`    | Weather entity                                                                                 |
| `todo`       | To-do entity supporting get/add/update items                                                   |
| `humidity`   | Optional humidity sensor; otherwise uses climate humidity                                      |
| `sensors`    | Binary sensor IDs, or objects with `entity`, `name`, and `battery`                             |
| `favorites`  | Entity IDs; lights/switches/fans/input booleans toggle, scenes activate, others open more-info |

The appearance button stores a preference locally. **Reset appearance** restores the configured setting. This doesn't change the appearance of other Home Assistant dashboards.

The card works in Sections, but its complete navigation and layout are designed for a Panel view. Keep the standard HA header available for settings and editing; kiosk mode is optional and isn't required.

## Development

Node.js 22.12+ or 24 is recommended.

```sh
npm ci
npm run dev
npm run build
npx playwright install chromium
npm test
```

`npm run dev` opens an interactive demo with sample entities. Demo interactions never connect to a real home. Set `CHROMIUM_PATH` to use an existing browser. Tests cover climate service payloads and bounds, unavailable states, error handling, groceries, dark-mode persistence, and responsive/reduced-motion behavior.

Source lives in `src/`. `src/demo.ts` is excluded from the production bundle. `dist/signal-home.js` is the HACS artifact. Update the package version, build, commit source plus `dist`, then create a GitHub release with the matching tag. The release workflow rebuilds and attaches the bundle.

## Scope of the first release

Signal uses the authenticated Home Assistant frontend connection. Home Assistant remains responsible for device authorization and actions. Safety cards are status displays; they do not implement alarm notifications. Device integration behavior and delayed state updates may vary.

This first release focuses on climate, weather, groceries, safety, and shortcuts. Camera walls, room auto-discovery, custom pop-ups, translations, and history charts are future work.

[Design notes](DESIGN.md) · [MIT license](LICENSE)
