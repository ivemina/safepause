# SafePause

**Find a little breathing room nearby.**

SafePause is a web app that helps people find nearby places to take a break, such as parks, gardens and libraries, and shows how much to trust each detail.

**Live demo:** [safepause.vercel.app](https://safepause.vercel.app)

> Places are loaded live and are **not independently verified** by SafePause. Any detail the source does not state is shown as "Not confirmed yet".

## The problem

When you feel overwhelmed while out, finding somewhere suitable to pause is hard. Map apps show places, but not whether seating or step-free access is confirmed, or how recently anyone checked.

## What makes it different

Every detail is **confirmed, confirmed absent, or not confirmed**. Unknown is never shown as "no". Each place shows when its information was last checked, with a gentle flag when it is old or missing. Places loaded from the live source have never been checked by SafePause, so they say so.

SafePause is a practical tool, not a medical or diagnostic app.

## Features

- Search any town or city (Nominatim), then load nearby parks and libraries for the visible map area (Geoapify Places API, built on OpenStreetMap data)
- Interactive map (Leaflet and OpenStreetMap) linked to the list: selecting a pin or a card selects the same place
- Search by name or description
- Filters: type of place, seating confirmed, step-free access confirmed, open now (from listed hours)
- Details panel with source link, last-checked stamp and freshness note
- Conservative data mapping: only an explicit condition such as `wheelchair.yes` becomes a confirmed detail
- Strict filters: only a confirmed "yes" passes, so unknown values never slip through
- Record validation that drops malformed places instead of breaking the map
- Clear loading, empty and error messages, including a "zoom in" message for areas that are too large
- Keyboard-friendly, with visible focus and a list alternative to the map

## Tech stack

React, TypeScript, Vite, Leaflet and React-Leaflet, Vitest, deployed on Vercel.

## Run it locally

```
git clone https://github.com/ivemina/safepause.git
cd safepause
npm install
npm run dev
```

Create a file named `.env.local` in the project folder containing:

```
VITE_GEOAPIFY_KEY=your_key_here
```

You can get a free key at geoapify.com. Never commit this file. Variables starting with `VITE_` are included in the browser build, so restrict your key to your own domains in the Geoapify dashboard.

## Tests

```
npm test
```

Automated tests cover filtering, freshness, opening status, record validation and data mapping.

## Accessibility

A manual keyboard, zoom and phone-width check was completed on 22 October 2026. A contrast check found the original accent colour at 4.15:1 on the page background, below the 4.5:1 target for small text, so it was darkened; the main text and accent colours now measure 6.2:1 to 7.28:1. Not every colour combination has been measured.

## Privacy

SafePause does not ask for an account or store personal data. The town you search for is sent to Nominatim, and the visible map area is sent to Geoapify, to return results.

## Data and attribution

Map tiles and place data: © OpenStreetMap contributors (ODbL). Town search uses Nominatim; nearby places come from the Geoapify Places API. Place details come only from what the source states and are not verified by SafePause.

TODO: add Geoapify's required attribution wording, copied from their site.

## Known limitations

- Most places lack seating, accessibility and opening-hours data, so many details show "Not confirmed yet"
- Results depend on the visible map area, which must be zoomed in, and are capped at 60 per search
- Opening hours are only understood in two strict formats
- The Geoapify free plan has a daily request limit
- The API key is visible in the browser, so it is restricted to this site's domains
- No database or user-submitted corrections yet

## Future improvements

- A small hand-checked set of places with real verification dates
- Supabase database and reviewed correction submissions
- Opening hours and seating where a source states them

