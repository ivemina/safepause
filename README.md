# SafePause

**Find a little breathing room nearby.**

SafePause is a web app that helps people find nearby places to take a break, such as parks, libraries and quiet public spaces, and shows how much to trust each detail.

**Live demo:** TODO: paste your stable Vercel address

> All places currently shown are **fictional demo data**, clearly labelled in the app. They are not real recommendations.

## The problem

When you feel overwhelmed while out, finding somewhere suitable to pause is hard. Map apps show places, but not whether seating or step-free access is confirmed, or how recently anyone checked.

## What makes it different

Every detail is **confirmed, confirmed absent, or not confirmed**. Unknown is never shown as "no". Each place shows when its information was last checked, with a gentle flag when it is old or missing.

SafePause is a practical tool, not a medical or diagnostic app.

## Features

- Interactive map (Leaflet and OpenStreetMap) linked to the list: selecting a pin or a card selects the same place
- Search by name or description
- Filters: type of place, seating confirmed, step-free access confirmed, open now (from listed hours)
- Details panel with source link, last-checked stamp and freshness note
- Strict filters: only a confirmed "yes" passes, so unknown values never slip through
- Record validation that drops malformed places instead of breaking the map
- Keyboard-friendly, with visible focus and a list alternative to the map

## Tech stack

React, TypeScript, Vite, Leaflet and React-Leaflet, Vitest, deployed on Vercel.

## Run it locally

    git clone https://github.com/ivemina/safepause.git
    cd safepause
    npm install
    npm run dev

## Tests

    npm test

23 automated tests cover filtering, freshness, opening status and record validation.

## Accessibility

A manual keyboard, zoom, phone-width and contrast check was completed on 22 October 2026. TODO: add the actual contrast ratio you measured.

## Data and attribution

Map tiles and map data: © OpenStreetMap contributors (ODbL). Current places are fictional demo data.

## Known limitations

- Demo data only, with no real venue information yet
- Opening hours are only understood in two strict formats
- The public OpenStreetMap tile server is suitable for demos, not heavy traffic
- No database or user-submitted corrections yet

## Future improvements

- A small, hand-checked set of real places from OpenStreetMap
- Supabase database and reviewed correction submissions
- Location search

## Screenshots

TODO: add a screenshot of the live app