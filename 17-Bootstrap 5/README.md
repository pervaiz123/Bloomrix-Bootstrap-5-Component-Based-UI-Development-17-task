# Assignment 17 — Bootstrap 5 Admin Management Portal

A responsive admin management portal demonstrating Bootstrap 5.3, its grid, utilities, components, forms, tables, JavaScript plugins, and custom branding.

## Run locally

This is a static front-end project and loads Bootstrap 5.3.8 from the official jsDelivr CDN. An internet connection is required for Bootstrap assets and remote avatar images.

You can open `index.html` directly, or serve the folder with a local static server:

```bash
npx serve .
```

Then open the local URL printed by the server.

## Pages / views

- Dashboard: summary metrics, recent activity and account distribution.
- User management: sample users, search, status and role filters, pagination, add/edit/delete modals and CSV export.
- Registration: required profile fields, image preview, terms acceptance and client-side validation.
- Settings: profile, account, password and notification tabs.
- Components: examples of buttons, button groups, badges, alerts, breadcrumbs, progress bars, list groups, spinners, accordion, dropdown, tooltip, popover, toast, modal and offcanvas.

## Project structure

```text
17-Bootstrap 5/
├── index.html
├── package.json
├── README.md
├── .gitignore
└── assets/
    ├── css/
    │   └── styles.css
    └── js/
        └── app.js
```

## Bootstrap concepts demonstrated

- Bootstrap 5.3.8 CSS CDN and JavaScript bundle (includes Popper).
- Containers, fluid layout, rows, responsive columns, nested rows and gutters.
- Breakpoint utility classes: `sm`, `md`, `lg`, `xl`, `xxl`, plus mobile-first default behavior.
- Display, flex, spacing, alignment, sizing, responsive visibility and positioning utilities.
- Typography, contextual colors, badges, alerts and progress.
- Navbar-like responsive top navigation, sidebar/offcanvas navigation, cards, buttons, button groups, breadcrumbs, pagination, list groups, spinners, tables, modals, dropdowns, collapse, accordion, tabs, tooltips, popovers, offcanvas and toast.
- Form controls, input groups, selects, floating-ready Bootstrap form architecture, checkboxes, switches and validation feedback.
- CSS custom properties and separate custom stylesheet; no blanket Bootstrap override or unnecessary `!important`.
- Bootstrap data attributes, component initialization and JavaScript API calls.
- Semantic landmarks, explicit labels, ARIA names, keyboard-operable controls and focus-visible styling.

## Data and security note

The sample user directory is stored in browser `localStorage` so CRUD changes persist in that browser. Registration is a front-end demonstration. Password fields are validated but passwords are not stored. There is no backend, authentication, email delivery or real account update. Do not enter real personal or password information.

## Responsive checks

Test the interface at:
- 375px phone width
- 768px tablet width
- 1440px desktop width

The user table uses Bootstrap's `.table-responsive` wrapper to keep wide tabular data contained rather than forcing page-level horizontal scrolling.
