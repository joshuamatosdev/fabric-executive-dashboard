# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fabric Executive Dashboard is a React 19 + TypeScript single-page application built with Vite. It displays executive KPIs, bar charts, and trend line visualizations for business metrics (recruiting, retention, readiness, financials).

## Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run preview  # Preview production build
```

**Note:** No test or lint commands are configured.

## Architecture

### Tech Stack
- React 19 with TypeScript
- Vite 6 build system
- Recharts for data visualization
- Tailwind CSS (loaded via CDN in index.html)
- Lucide React for icons

### Key Files
- `App.tsx` - Main dashboard layout with all chart sections
- `constants.tsx` - All configuration data, mock data, color palette, and utility functions
- `types.ts` - TypeScript interfaces (KPIData, ChartDataPoint, ComparisonData)
- `components/KPICard.tsx` - Reusable KPI metric card component
- `components/ChartWrapper.tsx` - Chart container with title/subtitle

### Data Flow
All data is currently static mock data defined in `constants.tsx`. The dashboard includes:
- KPI cards rendered from `KPI_CONFIG`
- Bar charts using `MOCK_BAR_DATA_BY_CATEGORY`
- Line/trend charts using various `MOCK_*_DATA` arrays
- Division filter dropdown populated from `DIVISIONS`

### Styling
- Dark theme: zinc-950 background
- Microsoft color palette defined in `COLORS` constant:
  - Blue: #0078d4
  - Red: #d83b01
  - Green: #107c10
  - Yellow: #ffb900
- Responsive grid layout (1-5 columns depending on screen size)

### Path Alias
`@/*` maps to the project root directory (configured in vite.config.ts and tsconfig.json).

## Environment Variables

Set `GEMINI_API_KEY` in `.env.local` for API integration (currently using placeholder).
