# CBAMS — split into modules

The original `index.html` was one 3,356-line file (all CSS + all HTML + all
JS inline). It's now split into one file per module, with `index.html`
reduced to a thin shell that wires everything back together at runtime.

## Folder structure

```
cbams/
  index.html                 shell: <link> tags for CSS, one <div id="app-root">, loads js/bootstrap.js
  css/
    variables.css             design tokens (:root colors, fonts)
    base.css                  reset, layout, role visibility, empty states, view switching
    header.css                topbar + nav
    buttons.css
    toasts.css
    login.css                 login page (left media panel + right login form)
    branch-directory.css
    reports.css
    add-branch-modal.css
    drawer.css                branch detail slide-out drawer
    form-card.css             request form card
    request-archive-cards.css
    user-access.css
  partials/                   raw HTML fragments, fetched in and inserted at runtime
    login-page.html
    portal-shell-top.html     topbar + <main> opening tag
    view-dashboard.html
    view-request.html
    view-approval.html
    view-archive.html
    view-branch-directory.html
    view-sms.html
    view-reports.html
    view-holidays.html
    view-user-access.html
    portal-shell-bottom.html  drawer, SMS modal, add-branch modal, closing tags
  js/
    bootstrap.js               loader — fetches the partials, then loads every script below in order
    data/                      static data: branches.js, holidays.js, users.js, closure-categories.js, philippines-outline.js
    core/                      shared logic used by multiple views: auth.js, toasts.js, view-switching.js,
                                render.js, drawer.js, nav-dropdowns.js, map-projection.js, map-zoom-pan.js,
                                branch-anniversaries.js, init.js
    modules/                   one file per feature view: branch-directory.js, add-branch.js, request-form.js,
                                approval.js, sms.js, holidays-view.js, reports.js, user-access.js
```

Every module boundary lines up with the section comments (`/* ===== ... ===== */`)
that were already in the original file, so each file matches a real named
module rather than an arbitrary line-count split.

## Why `index.html` still needs a loader script

Browsers can't `<include>` HTML files natively. `js/bootstrap.js` `fetch()`es
every file in `partials/` and inserts them into `#app-root` in the original
order, then loads the `js/` files one at a time in the same order they used
to run in as one script (data → shared/core → view modules → init), since
later files reference constants and functions defined in earlier ones.

## Running it

Because `bootstrap.js` uses `fetch()`, the app must be served over http —
opening `index.html` directly as a `file://` URL will fail (browsers block
`fetch()` of local files that way). From inside the `cbams/` folder run:

```
python3 -m http.server 8000
```

then open `http://localhost:8000/`.

## Images

The original file referenced these images by relative path (with an
`onerror` fallback that just hides them if missing) — they weren't part of
the upload, so they're not in this package either. Drop them into the
`cbams/` folder (same level as `index.html`) to restore the login-page ads
and the two logo images:

- `ABC-RB  - APPROVED  LOGO - FULL COLOR-01.png`
- `ABC-RB  - APPROVED  LOGO - FULL COLOR-04.png`
- `ChatGPT Image Jul 23, 2026, 05_24_35 PM.png`
- `ChatGPT Image Jul 23, 2026, 05_33_12 PM.png`
- `Untitled design (10).png`

## Verified

- All 23 JS files pass `node --check` (no syntax errors from the split).
- All 49 files (CSS, HTML partials, JS) served correctly over a local
  HTTP server with no 404s.
- The CSS/JS/HTML line ranges were extracted from the original file with
  zero gaps or overlaps (checked programmatically) — nothing was dropped
  or duplicated.
