# Mobile/iPad design and typography review

## Applied guidance

This pass uses the owner's 20-point screenshot, the supplied gameplay recording, Awesome DESIGN.md, Taste Skill 2.5.1 and Impeccable 4.8 (typeset, adapt and craft floor). The task is the existing playable game, not a separate company website.

| Requirement | Application |
| --- | --- |
| Remove filler badges and redundant labels | Example eyebrow and endscreen kicker removed; decorative rings removed. Informative score tiers remain. |
| No random italics; mono only where useful | Result heading is upright; prose/actions use Manrope, mono is limited to measured counters and friend codes. |
| Design system | Explicit body/label/metadata roles: 16/14/12 px; navy/mint palette; 12–16 px panels; consistent action styles. |
| Show the product and emphasize its main action | Actual question example, own skin artwork, clear Abtauchen button and game-name/genre heading. |
| Group with spacing; clear headings and wraps | Four short rules steps, secondary details in disclosures, balanced headings and long-word wrapping. |
| Accent, icon consistency, restrained decoration | Mint primary actions, authored SVG action family, removed glow and repeated decorative water rings. |
| Contrast and optical alignment | Continue-button text now inherits its dark foreground; equal mobile page margins and readable chart labels. |
| Tabular numbers and loading states | Score/time counters retain numeric alignment; existing question-loading and disabled action states remain. |
| Useful animation | Feedback motion remains; perpetual chart-dot pulsing is removed. Reduced motion and pause are retained. |
| Mobile/iPad first | Phone widths 320/390, iPad widths 768/820/1024, landscape phone 844×390; tablet account menu and adaptive profiles. |

## Verification scope

`tests/browser/typography.cjs` exercises home, expanded rules, long question, long answer, readable Continue button and expanded result details at all six sizes. It checks text floors, horizontal fit and real rendered chart-label size. Existing interaction/skin/friend tests remain in CI. The browser job also runs the typography suite using WebKit on Linux, in addition to Chromium.

Local screenshots inspect actual rendering. Local Playwright WebKit installation is unavailable on this Mac's macOS 13; this is why WebKit runs in Linux CI. Neither resized Chrome nor Linux WebKit is claimed to be a physical iPhone/iPad Safari test. Native keyboard/browser-chrome behaviour remains a physical-device verification gap.

The plugins have conflicting recommendations: Taste asks for full-screen marketing sections and a dealt extra scene; Impeccable prioritizes compact Operate surfaces and the supplied video rejects decorative filler. The playable 30-second game keeps its compact flow. The owner's rules and mobile usability take priority; no claim of passing every marketing-template rule is made. The previous Taste findings remain documented in DESIGN_REVIEW.md.

## Follow-up: names and depth animation

The owner additionally reported isolated final letters in skin names. The three longest names were shortened, and names use an explicit unbroken, non-truncated single line. The test checks their real rendered width and line height.

The new depth rail uses free native CSS/JavaScript. Tests cover all zone boundaries, monotonic darkness, the 7,000 m endpoint, reset, reduced motion, narrow-screen fit and unchanged game score/deadline. The 127-second recording “Bildschirmaufnahme 2026-11-08 um 13.24.53.mov” was inspected through sampled frames. Its open ocean, separate question/input surfaces, moving right-hand ruler, bubbles, descent and return to sunlight informed original CSS/JavaScript choreography. No third-party artwork was copied. Earlier 13:04:21 and 13:06:33 recordings were unavailable. The copied reference video is excluded from the release.

The final Taste run reported `GATE: OPEN 25 (rounds used up)`. These remaining template/layout findings are disclosed below, not presented as passed. No checker findings were hidden or waived in its state. The owner’s playable mobile game and supplied reference take precedence over the marketing-template layout rules.

## Final design checker output

```text
gate: checking http://127.0.0.1:8766/ (gaming); this takes a few minutes on a CPU Chrome
gate: rounds used up; 25 FAIL open
  FAIL flush            span#dateLabel "KOSTENLOS · UNBEGRENZT SPIELBAR"  [1440, 390]
       its last line sits -365px above the rule on top of section.home-preview
       fix: give the section its padding at the edge where the ground changes (the closing call keeps a clear gap above the footer)
  FAIL cta              main#main > h1.headline  [1440, 390]
       the hero has no button (the nav's does not count)
       fix: add the action: a button in the hero, one on every priced item, one in the closing section
  FAIL cta              main#main > section.homehub "Heute am tiefsten 0 P Dein Rekord 0 P ＋ "  [1440]
       the last section before the footer ends with no button
       fix: add the action: a button in the hero, one on every priced item, one in the closing section
  FAIL copy-headline    main#main > h1.headline "ABGRUND. Das Tiefsee-Quiz."  [1440]
       "ABGRUND. Das Tiefsee-Quiz." does not name what is sold (wissensspiel, from flags)
       fix: put the category noun in the h1 (and who it is for, or where), in 2 to 8 words
  FAIL off-grid         div.shell > header.top > div.brand > span.mark "⌁"  [1440, 390]
       left edge at 77px, 5px off the page margin at 72px (8 elements, like h1.headline)
       fix: move it onto the page margin, or the column edge its section uses
  FAIL motion-layer     html[data-motion]  [1440]
       the page marks <html data-motion> but motion.css is not loaded: buttons, links, cards and photos answer nothing on hover
       fix: link assets/motion/motion.css after cards.css and keep data-motion on <html> (both, or neither)
  FAIL moment-none      (the page)  [1440]
       a gaming page (--type) deals no moment: every kind carries one, two on a long page (moments.md)
       fix: deal one (moments.mjs pick --page gaming) and mount it in its own section
  FAIL hero-screen      main#main > h1.headline "ABGRUND.Das Tiefsee-Quiz."  [1440]
       the hero ends at 341px on a 900px screen, 559px above the fold: it ends at the fold, 1px either way (SR-1)
       fix: make the hero exactly one screen (height: 100svh, its content fitted inside), never taller or shorter
  FAIL hero-screen      main#main > section.home-preview "Nenne eine Eissorte (auch Sorbet zählt)."  [1440]
       722px of the next section shows on the first screen (from 178px on a 900px screen): nothing below the hero shows at load (SR-1)
       fix: end the hero at the fold so nothing of the next section shows at load (hero height: 100svh)
  FAIL hero-screen      main#main > h1.headline > em "Das Tiefsee-Quiz."  [1440]
       "Das Tiefsee-Quiz." lies outside the hero's box (239-353px, the hero 161-341px) (SR-1)
       fix: fit the hero's content inside the hero's box: shorten the text or the picture, never let it spill
  FAIL section-height   main#main > p.api-note "Deutsch zuerst, Englisch zählt genauso. "  [1440]
       the section is 23px tall (0 screens), 877px short of one screen (900px): every section after the hero is one screen or two, 2px either way (SR-2)
       fix: set the section to one screen or two (height: calc(var(--h,1) * 100vh), --h 1 or 2) and cut or split its content to fit
  FAIL section-height   div.shell > footer.footer "Unbegrenzte Runden · Wissen zahlt sich a"  [1440]
       the section is 67px tall (0.1 screens), 833px short of one screen (900px): every section after the hero is one screen or two, 2px either way (and 3 more like it: "AbtauchenNeue rundeKOSTE", "Heute am tiefsten0 PDein", "N
       fix: set the section to one screen or two (height: calc(var(--h,1) * 100vh), --h 1 or 2) and cut or split its content to fit
  FAIL section-air      main#main > div.startrow / main#main > section.homehub  [1440]
       54px of air between the content of these two sections: 128-480px (64-600px WARN) (SR-3)
       fix: keep 128-480px of air between the content of neighbouring sections (112-420px on a phone): the sections' padding (--padt, --padb)
  FAIL section-air      main#main > p.subhead "Sieben Fragen, je 30 Sekunden. Finde sel"  [1440]
       the section shows no content: its content fills 0% of its 58px (55% or more) (SR-3)
       fix: fill the section to 55%: more content, a picture or a background layer, or merge it into the section above as its last block
  FAIL section-air      main#main > p.api-note "Deutsch zuerst, Englisch zählt genauso. "  [1440]
       the section shows no content: its content fills 0% of its 23px (55% or more) (SR-3)
       fix: fill the section to 55%: more content, a picture or a background layer, or merge it into the section above as its last block
  FAIL one-section      main#main > h1.headline "ABGRUND.Das Tiefsee-Quiz."  [1440]
       the screen at scroll 0px (stride 0) shows 192px of section 1 and the content of 5 sections, over 24px each beside section 2: a screen shows one section (another may peek 8px, 24px WARN) (SR-4)
       fix: make each section exactly one screen or two, so a screen shows one section and no neighbour peeks
  FAIL container-edges  div.shell > header.top "⌁ABGRUNDTAUCHGÄNGE OHNE LIMITMenüAnmelde"  [1440]
       the nav's content runs 77px from the left and 72px from the right (read from its outermost blocks: no .wrap): the page's container starts at 72px; 77 and 72px are not one margin (one container, equal margins, 2px either
       fix: use one container on every section and the nav (.wrap): one margin left and right, 64-120px on a desktop, 16-24px on a phone
  FAIL container-edges  a.skip-link "Zum Spiel"  [1440]
       a <a> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)
       fix: build the page as header.nav, a main of sections (each one in-flow .wrap plus background layers) and footer.closing
  FAIL container-edges  div#scene  [1440]
       a <div> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (SR-6)
       fix: build the page as header.nav, a main of sections (each one in-flow .wrap plus background layers) and footer.closing
  FAIL container-edges  div.water  [1440]
       a <div> at the top of the page, outside header.nav, main, footer.closing and nav.actionbar (and 12 more like it: i.bubble.b1, i.bubble.b2, i.bubble.b3) (SR-6)
       fix: build the page as header.nav, a main of sections (each one in-flow .wrap plus background layers) and footer.closing
  FAIL container-edges  section.home-preview > div.preview-result > div:nth-of-type(2) > span.preview-depth "100 M  [1440]
       1 text block starts on a left line at x 1099, 1027px from the container's left: text starts on the container's left, or on one split line (x 622, 732, 842) (SR-6)
       fix: start the text on the container's left, or on the one split line every split shares
  FAIL container-edges  main#main > section.home-preview > h2 "Nenne eine Eissorte (auch Sorbet zählt)."  [1440]
       2 text blocks start on a left line at x 977, 905px from the container's left: text starts on the container's left, or on one split line (x 622, 732, 842) (also "Eine bekannte Antwort. Seltenere") (SR-6)
       fix: start the text on the container's left, or on the one split line every split shares
  FAIL cta              main#main > p.api-note "Deutsch zuerst, Englisch zählt genauso. "  [390]
       the last section before the footer ends with no button
       fix: add the action: a button in the hero, one on every priced item, one in the closing section
  FAIL heading-scale    b#homeToday "0 P"  [390]
       the figure "0 P" is set at 27px, larger than the section headings (h2 24px); 1 more like it
       fix: set figures at the h2 size or under: a stat reads as data, not as the heading
  FAIL container        page  [1440, 390]
       no .wrap
       fix: put the content in one .wrap
  10 WARN (not blocking), first: assets (the page); flush main#main > section.home-preview > p.pre; copy-buttons button#begin "Abtauchen"; copy-actions (the page); off-grid main#main > section.home-preview > h2 "N
Stop fixing: put these open FAILs and the waivers in your report, then finish.
GATE: OPEN 25 (rounds used up)
```
