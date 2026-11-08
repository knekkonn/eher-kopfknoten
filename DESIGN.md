# ABGRUND interface and motion

## Direction

Keep the underwater setting, Manrope type, mint accent and six newly illustrated characters. The background supplies atmosphere; readable controls and a calm central question panel supply hierarchy. This is a timed game, not a marketing landing page.

## System

- Type: locally served Manrope, weights 400–800. DM Mono is reserved for counters. Body text is 14–17 px; form inputs are at least 16 px. Secondary game guidance is 12–13 px, never the old 8–9 px.
- Colours: deep navy `#081e2b`, raised surface `#102b38`, text `#edf7f6`, supporting text `#afc4ca`, primary mint `#95e9cc`, progress gold `#edca8e`. Error states also contain text.
- Space: 4 px increments; 20–24 px mobile panel padding and up to 40 px on desktop. Main controls have at least 44 px touch targets. Inputs and buttons use 8–12 px corners; panels use 14–20 px.
- Home: concise explanation, one primary start action, two personal bests, and a real answer example. The equipped character replaces the same `#diver` element as before.
- Play: one question panel, explicit answer action, secondary skip action, a visible timer and German-first suggestions. Secondary English text remains subordinate.
- Navigation: full row on desktop; a labelled menu with expanded state on phones. No hover-only actions.
- Profiles: strongest emphasis on rounds, best score and average; remaining statistics use a flat divided grid. Charts retain labels and numbers. A direct friends link avoids scrolling through every statistic.

## Motion and accessibility

Questions enter over 240 ms; the reward has one 650 ms rise. Neither delays input nor changes the 30-second deadline. Decorative ambient motion can be paused, persists on the device, respects reduced motion and stops while the tab is hidden. Reduced motion retains the full static composition.

Dialogs trap keyboard focus, close with Escape, make the background inert and restore focus. Enter inside a dialog cannot advance the round behind it. The timer is not an every-second live announcement. New answers and messages still announce meaningful changes.

## References used

The owner requested these public repositories. Their guidance was adapted to an existing game rather than copying a brand, page template or component kit. No third-party design assets or skill runtime are shipped.

- [Awesome DESIGN.md](https://github.com/VoltAgent/awesome-design-md), revision `fcc70284932276d085f01ef9f83edde90b1258cb`: PlayStation / SpaceX references informed consistent tokens, visual hierarchy, restrained navigation and prominent game imagery.
- [Impeccable](https://github.com/pbakaus/impeccable), revision `687bc381bc9091bf252c0a05303640561014a425`: the existing-product refinement workflow, craft floor, polish and animation guidance informed focus states, touch targets, typography and reduced motion.
- [Taste Skill](https://github.com/Leonxlnx/taste-skill), revision `f6b76575f949707b4e3c37cd86cb44b0b98643e8`: motion, copy, layout and system guidance informed shorter copy and purposeful transitions. Fresh marketing-site layout directives do not replace the existing game flow.

`experience.css` contains the refinement layer; `experience.js` manages menu, motion preferences and focus. They intentionally preserve the established game and scoring modules.

## Fonts

Manrope and DM Mono are served locally with `font-display: swap`, including German characters. Their OFL licences are in `fonts/`; no Google Fonts request is required at runtime.

## Character artwork (2026-11-08)

Six original AI-assisted illustrations were generated with a shared inked nautical art direction, then inspected and optimized to transparent 640 px WebP sprites. They are not claimed to be human-drawn. No third-party character assets were used. The original SVG files remain as historical source assets; the game now loads the `-v2.webp` files.

| ID | Name | Best single round | Visual identity |
| --- | --- | ---: | --- |
| diver | Messingtaucher | 0 | Patched canvas, copper helmet, red lifeline |
| jelly | Fadenlicht | 100 | Folded ivory bell, ribbon tentacles, amber core |
| crab | Riffschmied | 200 | Ceramic shell, brass repairs, asymmetric coral claw |
| phantom | Schleierläufer | 400 | Long glass-squid silhouette, flowing ivory fins |
| angler | Laternenangler | 600 | Brass lantern, charcoal body, ivory teeth |
| leviathan | Leviathan | 700 | Coiled armored sea dragon, coral sail, turquoise inlays |

All six assets total approximately 597 KiB. The same `#diver` character moves between the home preview and the game HUD, including mobile. Gallery illustrations remain still; the motion preference controls in-game movement. Unlocks, account isolation and score rules are unchanged.

The November 8 screenshot and video informed removal of decorative badges, consistent SVG action icons, labelled chart axes, real statistics beside charts, clearer contrast and reduced perpetual motion. The November 7 security checklist is tracked separately from visual polish.
