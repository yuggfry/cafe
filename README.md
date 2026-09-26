# Flora Café

This is a static website. Open `index.html` directly in a browser; it does not need React, Vite, Node.js, or a build step.

For GitHub Pages, publish the repository root. Keep `index.html`, `app.js`, `data.js`, `styles.css`, `site.css`, and `src/assets/images/` together so the page can load its styles, content, and images using relative paths.

## Files

- `index.html` — website entry point.
- `app.js` — page rendering and interactions.
- `data.js` — menu, event, blog, and shop content.
- `styles.css` and `site.css` — styling.
- `src/assets/images/` — locally referenced images.

To update a menu item or other content, edit `data.js`. To replace an image, keep the same filename in `src/assets/images/` or change the relevant image path in `data.js` or `app.js`.
