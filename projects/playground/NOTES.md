# NOTES: what shadcn handles that I missed

I built a modal dialog, tabs and a disclosure by hand in React + TypeScript, against the
W3C ARIA Authoring Practices patterns, with no component libraries. Then I compared them
with shadcn/ui. shadcn's dialog and tabs are thin styled wrappers over Radix
(`@radix-ui/react-dialog`, `@radix-ui/react-tabs`), so the behaviour comes from Radix. I read
that source to see what it does that mine does not.

## What my versions do

- **Disclosure:** a real `<button>` with `aria-expanded` and `aria-controls`. Enter and Space work natively.
- **Tabs:** `tablist` / `tab` / `tabpanel` roles, `aria-selected`, `aria-controls`, `aria-labelledby`,
  roving tabindex, ArrowLeft/ArrowRight (wrapping), Home and End, and Tab moves into the panel.
- **Modal:** `role="dialog"`, `aria-modal`, labelled by its title, focus moves in on open, Tab and
  Shift+Tab are trapped, Escape closes, and focus returns to the opener.

## Gaps between my version and shadcn's (via Radix)

1. **Hiding the rest of the page.** I set `inert` on `document.getElementById("root")`. That only
   works if the app is mounted on an element with that exact id, and it ignores everything else in
   `<body>`. Radix calls `hideOthers(content)` from the `aria-hidden` package, which hides every
   element outside the dialog from assistive tech with no assumptions about where the app lives.

2. **Stacked dialogs.** Mine breaks with a dialog opened from inside a dialog. The inner dialog's
   cleanup removes `inert` and restores `body` overflow while the outer one is still open, and
   Escape is handled per dialog with no idea which is on top. Radix's `DismissableLayer` keeps a set
   of open layers and only lets the highest one respond to Escape and outside clicks.

3. **Scroll lock.** I set `document.body.style.overflow = "hidden"`. That is crude: the page can
   jump sideways when the scrollbar disappears, and it can still scroll on some touch devices.
   Radix uses `react-remove-scroll`, a dedicated library built for this.

4. **Returning focus.** I remember `document.activeElement` when the dialog opens. If the dialog is
   opened from code instead of a click, that can be `<body>` and focus is lost on close. Radix keeps a
   `triggerRef` and returns focus to the trigger itself.

5. **Tabs are one configuration only.** Mine is horizontal, left-to-right, with automatic
   activation. Radix's tabs take `orientation` (Up/Down arrows for vertical tabs), `dir` (it swaps
   ArrowLeft and ArrowRight for right-to-left languages), `activationMode` (manual activation, where
   arrows move focus but Enter or Space selects), and its roving focus skips disabled tabs.
   Mine would land on a disabled tab if I added one.

6. **Exit animation.** Mine unmounts the dialog immediately. Radix wraps content in `Presence`,
   which keeps it mounted until a CSS exit animation finishes.

## What I learned

Writing these by hand made the ARIA contract concrete: the roles and attributes are the easy half.
The hard half is focus: where it goes on open, how it is held in, and where it returns. I would use
shadcn/Radix in real work, and I understand now what its code is protecting me from.

## How I tested

`npm test` runs 5 keyboard-only tests (Vitest, jsdom, user-event): disclosure toggles with Enter and
Space; tabs have a single tab stop and respond to arrows, Home and End; Tab moves from the tab list to
the panel; the modal moves focus in, wraps Tab in both directions, closes on Escape and returns focus to
the opener. `npm run build` type-checks with strict TypeScript, and there is no `any` in the components.
Automated jsdom tests do not replace a screen reader, so I have not claimed screen reader testing.
