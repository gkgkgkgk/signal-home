# Design intent

Signal should feel like an object you enjoy using every day: clear, warm, and responsive.

Solid backgrounds establish a reliable reading surface. Ink and paper carry the interface. Mint identifies comfort, periwinkle the outdoors, and apricot everyday lists. Safety colors retain their semantic purpose. Typography and spacing establish hierarchy before color does.

The resting page is quiet. Motion communicates an action: a press compresses, a target value rises into place, the climate arc settles, and a new view enters from below. No perpetual decorative animations. Reduced-motion preferences disable transitions and animation.

One view model powers mobile and desktop. The small screen keeps generous controls and a bottom dock. Wide screens expose a left navigation rail and paired panels. Navigation doesn't rearrange itself according to state. Secondary entity information opens the native Home Assistant dialog.

State comes from Home Assistant. Failed operations produce a visible message; unavailable devices never show a fabricated value. Thermostat controls use supported features and clamp both to device limits and the opposite endpoint of a dual target range.

Tokens are defined in `src/styles.ts`. Theme scope is restricted to the card, so adding Signal doesn't recolor the rest of Home Assistant. No cloud fonts or image downloads are needed.
