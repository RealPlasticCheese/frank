# frank.tzanabetis.com

Live site: [frank.tzanabetis.com](https://frank.tzanabetis.com/)

This repository contains the static public profile site for myself.

## Structure

- `index.html` - Main page markup, metadata, navigation, and content sections.
- `styles.css` - Site layout, responsive navigation, typography, cards, and print styles.
- `site.js` - Client-side behaviour for rendering experience data, mobile navigation, and active section highlighting.
- `site-data.js` - Structured data for recent roles and achievements rendered by `site.js`.
- `assets/logos/` - LinkedIn, StackOverflow, and GitHub logo assets used by the profile links.
- `favicon.svg` - Browser favicon.
- `og-image.svg` - Source artwork for the social sharing image.
- `og-image.png` - Raster social sharing image used by link previews.
- `CNAME` - Custom domain configuration for GitHub Pages.

## Development

The site is plain HTML, CSS, and JavaScript. It can be previewed by opening `index.html` directly in a browser or serving the directory with Python:

```powershell
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000).
