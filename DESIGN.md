# Design System Strategy: Editorial Minimalism

## 1. Overview & Creative North Star

**Creative North Star: "The Silent Gallery"**

This design system is not a utility; it is a frame. Moving beyond the "app-like" conventions of standard mobile UI, this system adopts the persona of a high-end photography monograph or a boutique fashion lookbook. The goal is to create a digital experience that feels curated, quiet, and deliberate.

By leveraging heavy negative space and a strictly rectilinear geometry, we eliminate the visual noise of rounded corners and drop shadows. The "template" look is broken through **Intentional Asymmetry**: we prioritize the rhythm of the content over the rigidity of the grid. Images should bleed to edges or be set in "Polaroid-style" asymmetrical margins, while typography acts as the primary structural element.

---

## 2. Colors & Surface Logic

The palette is rooted in high-contrast neutrals, moving away from "flat" white to a sophisticated cream-based architecture.

* **Primary Palette:**
  * **Background (`#f9f9f9`):** Our paper stock. It should feel warm and organic.
  * **On-Surface (`#1a1c1c`):** Our charcoal ink. High legibility, zero "pure black" harshness.
* **The "No-Line" Rule:** 1px solid borders for sectioning are strictly prohibited. Boundaries must be defined solely through background color shifts. For example, use `surface-container-low` for a content block sitting on a `surface` background.
* **Surface Hierarchy & Nesting:** Treat the UI as stacked sheets of fine paper.
  * **Level 0:** `surface` (Main background)
  * **Level 1:** `surface-container-low` (Secondary content zones)
  * **Level 2:** `surface-container-highest` (High-priority interactive cards)
* **The "Glass & Gradient" Rule:** While we avoid traditional shadows, depth is achieved via `surface-variant` with a 20px backdrop blur for floating navigation bars, allowing photography to bleed through the UI without sacrificing legibility.
* **Signature Textures:** Use subtle linear gradients (e.g., `primary` transitioning to `primary-container`) on solid charcoal CTAs to provide a "sheen" reminiscent of silk-screened ink.

---

## 3. Typography

The tension between the traditional Serif and the modern Sans-Serif creates the "high-fashion" editorial feel.

* **Display & Headlines (`notoSerif`):** Used for storytelling and impact. Use `display-lg` for hero moments. The serif should feel authoritative and timeless.
* **Labels & Metadata (`workSans`):** Always uppercase with wide tracking (e.g., 0.1em - 0.2em). Use `label-md` for categories, tags, and navigation. This mimics the "Swiss-style" technical labels found in galleries.
* **Body & Titles (`inter`):** The workhorse. Clean, neutral, and invisible. `body-md` is the standard for long-form content to ensure the interface remains secondary to the imagery.

---

## 4. Elevation & Depth: Tonal Layering

In a world without shadows, depth is a matter of tone.

* **The Layering Principle:** Depth is achieved by "stacking" the `surface-container` tiers. A `surface-container-lowest` card placed on a `surface-container-low` section creates a sharp, natural lift.
* **Shadows:** Traditional drop shadows are disabled. If a "floating" element requires separation (e.g., a modal), use a high-diffuse ambient shadow: `color: on-surface` at **4% opacity** with a **40px blur** and **0px offset**.
* **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline-variant` token at **15% opacity**. 100% opaque borders are forbidden as they "close" the layout.
* **Sharp Geometry:** All containers, buttons, and images must use the `0px` roundedness scale. Sharp corners are the hallmark of this system's premium, architectural feel.

---

## 5. Components

* **Buttons:**
  * **Primary:** Solid `primary` (Charcoal) with `on-primary` (Off-white) text. Square corners. No shadow.
  * **Secondary:** `outline` (thin border) with `primary` text. The border must be exactly `1px`.
  * **States:** On press, shift background from `primary` to `primary-fixed-dim`.
* **Input Fields:**
  * Minimalist "underline" style using `outline-variant`. Focus state transitions the underline to `primary`. No container boxes.
* **Cards & Lists:**
  * **The "No-Divider" Rule:** Forbid the use of horizontal divider lines. Use `spacing-8` (2.75rem) of vertical white space or a subtle shift to `surface-container-low` to separate items.
* **Imagery (Signature Component):**
  * All photography should have a subtle `px` (1px) border of `outline-variant` at 10% opacity to "seat" the photo onto the cream background.
* **Navigation:**
* Bottom tabs should be transparent with a `backdrop-blur`. Labels in `label-sm` (uppercase, wide tracking).

---

## 6. Do's and Don'ts

### Do

* **Embrace Negative Space:** Use `spacing-16` or `spacing-20` for page margins to give content "room to breathe."
* **Asymmetrical Layouts:** Offset text blocks from image edges to create a dynamic, editorial rhythm.
* **Typography as Graphic:** Use large `display-lg` characters as background elements or section markers.

### Don't

* **No Rounded Corners:** Never use anything other than `0px`. Roundness breaks the editorial "sharpness."
* **No Center-Alignment:** Default to left-aligned or justified layouts to maintain a structured, newspaper-like feel.
* **No Color Bloat:** Stick strictly to the neutrals. Use `error` only for critical system feedback. If you need emphasis, use *scale* or *weight*, not color.
* **No Dividers:** If you feel the need for a line, add more white space instead. 90% of the time, white space is the better solution.
