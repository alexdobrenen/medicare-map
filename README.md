# Medicare Map

An interactive choropleth map visualizing Medicare enrollment across US counties. Built with React, TypeScript, Mapbox GL, and Tailwind CSS.

## Data Source

This app uses **real, live data** from the Centers for Medicare & Medicaid Services (CMS) public API.

**Dataset:** [Medicare Monthly Enrollment](https://data.cms.gov/summary-statistics-on-beneficiary-enrollment/medicare-and-medicaid-reports/medicare-monthly-enrollment)

- **API endpoint:** `https://data.cms.gov/data-api/v1/dataset/d7fabe1e-d19b-4333-9eff-e80e0643f2fd/data`
- **Granularity:** County-level (identified by FIPS code)
- **Year:** 2023 (annual summary)
- **Records:** ~3,278 counties across all US states and territories
- **No API key required** — CMS data is publicly accessible with CORS enabled

### What the data includes

Each county record contains:

| Field | Description |
|-------|-------------|
| `TOT_BENES` | Total Medicare beneficiaries |
| `ORGNL_MDCR_BENES` | Beneficiaries enrolled in Original Medicare |
| `MA_AND_OTH_BENES` | Beneficiaries enrolled in Medicare Advantage |
| `AGE_*_BENES` | Enrollment broken down by age bracket (Under 25, 25-44, 45-64, 65-69, 70-74, 75-79, 80-84, 85-89, 90-94, 95+) |

CMS suppresses values below 11 enrollees (displayed as `*`) to protect beneficiary privacy. These counties appear as "Data Suppressed" in the app.

### How data is fetched

1. On page load, the app requests all county-level records for 2023 from the CMS API
2. The API returns a maximum of 1,000 records per page, so the app fetches 4 pages in parallel (~3,278 total records)
3. When a state filter is applied, only that state's counties are fetched (typically a single page)
4. Age bracket and plan type filters are applied client-side — no additional API calls needed
5. Data is cached for 10 minutes using TanStack Query to avoid redundant requests

### Geographic boundaries

County boundaries come from the [us-atlas](https://github.com/topojson/us-atlas) npm package, which provides US Census Bureau TIGER/Line county geometries as TopoJSON (~89KB). Counties are matched to CMS enrollment data by their 5-digit FIPS code.

## Local Development

```bash
npm install
npm run dev
```

Requires a Mapbox access token in `.env.local`:

```
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

Get a free token at [mapbox.com](https://account.mapbox.com/access-tokens/).

## Deployment

The app deploys to GitHub Pages via the included GitHub Actions workflow. The `VITE_MAPBOX_TOKEN` must be added as a repository secret under **Settings > Secrets and variables > Actions**.
