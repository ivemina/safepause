# SafePause

**Find a little breathing room nearby.**

SafePause is a web app that helps people find nearby places to take a break, such as parks, gardens and libraries, and shows how much to trust each detail.

**Live demo:** TODO: paste your stable Vercel address

> Places are loaded live from OpenStreetMap and are **not independently verified** by SafePause. Any detail OpenStreetMap does not state is shown as "Not confirmed yet".

## The problem

When you feel overwhelmed while out, finding somewhere suitable to pause is hard. Map apps show places, but not whether seating or step-free access is confirmed, or how recently anyone checked.

## What makes it different

Every detail is **confirmed, confirmed absent, or not confirmed**. Unknown is never shown as "no". Each place shows when its information was last checked, with a gentle flag when it is old or missing.

SafePause is a practical tool, not a medical or diagnostic app.

## Features

- Search any town or city (Nominatim) and load nearby parks, gardens and libraries (Overpass API)
- Interactive map (Leaflet and OpenStreetMap) linked to the list: selecting a pin or a card selects the same place
- Search by name or description
- Filters: type of place, seating confirmed, step-free access confirmed, open now (from listed hours)
- Details panel with source link, last-checked stamp and freshness note
- Conservative tag mapping: only explicit tags such as `wheelchair=yes` become confirmed details
- Strict filters: only a confirmed "yes" passes, so unknown values never slip through
- Record validation that drops malformed places instead of breaking the map
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

## Tests

```
npm test
```

Automated tests cover filtering, freshness, opening status, record validation and OpenStreetMap tag mapping.

## Accessibility

A manual keyboard, zoom, phone-width and contrast check was completed on 22 October 2026. TODO: add the contrast ratio you measured.

## Data and attribution

Map tiles and place data: © OpenStreetMap contributors (ODbL). Place search uses Nominatim and nearby places use the Overpass API, both light-use public services. Place details come only from OpenStreetMap tags and are not verified by SafePause.

## Known limitations

- Most OpenStreetMap places lack seating, accessibility and opening-hours tags, so many details show "Not confirmed yet"
- Results depend on the visible map area and are capped at 60 per search
- Opening hours are only understood in two strict formats
- Relies on free public services with usage limits, so it is not suitable for heavy traffic
- No database or user-submitted corrections yet

## Future improvements

- A small hand-checked set of places with real verification dates
- Supabase database and reviewed correction submissions
- A fallback Overpass server and clearer error messages

