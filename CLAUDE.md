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

```bash
npx tsc --noEmit      # Type checking
npm run lint:fix      # Linting (ESLint + SonarLint)
npm test              # Run ALL tests
```

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

## Critical Patterns

### Always use Fluent UI makeStyles for styling
```tsx
import { makeStyles, tokens, shorthands } from '@fluentui/react-components';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    ...shorthands.padding('8px', '12px'),
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorNeutralBackground2,
  },
});
```

### Use tokens for colors, never hardcode
```tsx
// ✅ Correct
color: tokens.colorNeutralForeground1
backgroundColor: tokens.colorBrandBackground

// ❌ Wrong
color: '#ffffff'
backgroundColor: '#0078d4'
```

### Use shorthands for multi-value CSS properties
```tsx
// ✅ Correct
...shorthands.padding('8px', '12px')
...shorthands.border('1px', 'solid', tokens.colorNeutralStroke1)
...shorthands.borderRadius('8px')

// ❌ Wrong - causes CSS-in-JS parsing errors
padding: '8px 12px'
border: '1px solid #ccc'
```

### Grid Layout uses 12-row system
- KPI widgets: `h: 1` (1/12th of available height)
- Chart widgets: `h: 3-4` (3/12th to 4/12th)
- Use `MARGIN_Y` constant for consistent gaps (currently 16px)
- `preventCollision={true}` - widgets cannot overlap
- `compactType={null}` - widgets stay in fixed positions

### Component Organization
| Directory | Purpose |
|-----------|---------|
| `src/routes/` | TanStack Router file-based routes |
| `src/components/layout/` | Grid, Sidebar, Toolbar |
| `src/components/widgets/` | Widget components (KPI, charts) |
| `src/components/common/` | Shared UI components |
| `src/stores/` | Zustand state stores |
| `src/api/` | TanStack Query hooks, MSW handlers |
| `src/mocks/` | Mock data and MSW setup |

### Widget Development Pattern
1. Define widget config type in `src/types/widget.ts`
2. Create widget component in `src/components/widgets/`
3. Register in `WidgetRenderer.tsx`
4. Add mock data in `src/mocks/data/widgets.ts`
5. Add to dashboard layout in `src/mocks/data/dashboards.ts`

### Flex Layout Rules
- Always add `minHeight: 0` on flex children for proper sizing
- Use `flex: 1` instead of `height: '100%'` in flex containers
- This prevents overflow issues in nested flex layouts

## Environment Variables

Set `GEMINI_API_KEY` in `.env.local` for API integration (currently using placeholder).

## Testing Philosophy

**Test the User Journey, Not Implementation Details**

### The "Refactor Proof" Checklist

Before finalizing a test, ask: "If I rename the component helper functions, does this test still pass?"

- **YES** → Good Test
- **NO** → Bad Test (needs rewriting)

### Pattern Matcher

| Do NOT Test | DO Test |
|-------------|---------|
| `spyOn(instance, '_privateMethod')` | `expect(publicAPI.result).toBe(x)` |
| `expect(div).toHaveClass('bg-red')` | `expect(screen.getByRole('alert'))` |
| `expect(useQuery).toHaveBeenCalled()` | `await screen.findByText('Data Loaded')` |
| `fireEvent.click()` | `userEvent.click()` |

### TDD Flow

1. Write Failing Test
2. Implement
3. Refactor
4. Delete `.agent-plan-*.json`

### Verification Loop (Mandatory)

After generating code, you must run all verification commands:

```bash
npx tsc --noEmit      # Type checking
npm run lint:fix      # Linting (ESLint + SonarLint)
npm test              # Run ALL tests
```

All three must pass before considering a task complete.

### Key Principles

- Test user behavior (`userEvent.click()`) not implementation (`fireEvent.click()`)
- Query by accessibility roles (`getByRole('alert')`) not CSS classes (`toHaveClass('bg-red')`)
- Assert on visible outcomes (`findByText('Data Loaded')`) not internal hooks (`useQuery.toHaveBeenCalled()`)
- Tests should survive refactoring—if renaming internal functions breaks tests, those tests are too coupled

### Testing Stack

| Testing Layer | Tool | Purpose |
|---------------|------|---------|
| Unit & Logic | Vitest + React Testing Library | Speed. Native to Vite, 10x faster than Jest, shares vite.config.ts. Use for Zustand logic and simple UI components. |
| Visual & DnD | Playwright | Physics. Drag-and-drop relies on real browser geometry (pixels, scroll positions). JSDOM fails at this. Playwright runs a real browser, making it the only reliable way to test react-grid-layout. |
| API Mocking | MSW | Consistency. Works in both layers. Vitest uses it to test data logic; Playwright uses it to mock the Microsoft Fabric backend during E2E runs. |
