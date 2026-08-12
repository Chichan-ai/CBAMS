// js/bootstrap.js
// Loads the HTML partials into the page, then loads every JS module in the
// exact order the original single-file app executed them in (data → core →
// view modules → init). This file is glue code, not one of the app's
// "modules" — it just wires the split files back together at runtime.
//
// NOTE: because this uses fetch() to pull in the partials/*.html files,
// the app must be served over http(s), not opened directly as a file://
// URL (browsers block fetch() of local files under file://). The simplest
// way: from the "cbams" folder run `python3 -m http.server 8000`, then
// open http://localhost:8000/ in your browser.

(function () {
  const PARTIALS = [
    "partials/login-page.html",
    "partials/portal-shell-top.html",
    "partials/view-dashboard.html",
    "partials/view-request.html",
    "partials/view-approval.html",
    "partials/view-archive.html",
    "partials/view-branch-directory.html",
    "partials/view-sms.html",
    "partials/view-reports.html",
    "partials/view-holidays.html",
    "partials/view-user-access.html",
    "partials/portal-shell-bottom.html",
  ];

  // Order matters: later files reference consts/functions defined in
  // earlier ones, exactly as they did back when this was one big <script>.
  const SCRIPTS = [
    "js/data/philippines-outline.js",
    "js/data/branches.js",
    "js/data/holidays.js",
    "js/data/users.js",
    "js/core/auth.js",
    "js/core/branch-anniversaries.js",
    "js/core/toasts.js",
    "js/core/view-switching.js",
    "js/modules/branch-directory.js",
    "js/modules/add-branch.js",
    "js/core/map-projection.js",
    "js/core/render.js",
    "js/core/drawer.js",
    "js/core/nav-dropdowns.js",
    "js/modules/request-form.js",
    "js/data/closure-categories.js",
    "js/modules/approval.js",
    "js/core/map-zoom-pan.js",
    "js/modules/sms.js",
    "js/modules/holidays-view.js",
    "js/modules/reports.js",
    "js/modules/user-access.js",
    "js/core/init.js",
  ];

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = () => reject(new Error("Failed to load " + src));
      document.body.appendChild(s);
    });
  }

  async function boot() {
    const root = document.getElementById("app-root");
    try {
      const htmls = await Promise.all(
        PARTIALS.map((p) => fetch(p).then((r) => {
          if (!r.ok) throw new Error("Failed to fetch " + p);
          return r.text();
        }))
      );
      root.innerHTML = htmls.join("\n");
    } catch (err) {
      root.innerHTML =
        '<p style="font-family:sans-serif;padding:40px;">' +
        "Could not load CBAMS. This page must be served over http(s) " +
        "(e.g. run <code>python3 -m http.server</code> in the cbams folder " +
        "and open it via http://localhost:8000/), not opened as a local file." +
        "<br><br>" + err.message + "</p>";
      throw err;
    }

    for (const src of SCRIPTS) {
      await loadScript(src);
    }
  }

  boot();
})();
