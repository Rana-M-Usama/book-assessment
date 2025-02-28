# Frontend Project

A modern React TypeScript frontend project with Material-UI and React Query.

## Tech Stack

- React 18 with Hooks
- TypeScript
- Vite
- Material-UI (MUI)
- React Query (TanStack Query) - For server state management
- React Router DOM
- Axios
- ESLint & Prettier for code quality

## Prerequisites

- Node.js 18.19.0
- npm (Node Package Manager)

## Getting Started

1. **Use the correct Node.js version**

   ```bash
   nvm use
   ```
2. **Install dependencies**

   ```bash
   npm install
   ```
3. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Check for linting issues
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

## Project Configuration

- `.nvmrc` - Specifies Node.js version (18.17.0)
- `.npmrc` - NPM configuration
  - `save-exact=true`: Ensures exact versions for dependencies
  - `engine-strict=true`: Enforces Node.js version requirements
- `.eslintrc.js` - ESLint configuration with TypeScript and React support
- `.prettierrc.js` - Prettier code formatting rules

## Code Quality

### ESLint Rules

- No console.log statements (console.warn and console.error allowed)
- Strict TypeScript checks
- React Hooks rules
- Unused imports/variables detection

### Prettier Configuration

- No semicolons
- Single quotes
- 2 spaces indentation
- 80 characters line length
- ES5 trailing commas

## Dependencies

### Main Dependencies

- `@mui/material` & `@mui/icons-material` - Material UI components
- `@tanstack/react-query` - Data fetching and caching
- `axios` - HTTP client
- `react-router-dom` - Routing
- `lodash` - Utility functions

### Development Dependencies

- `typescript` - Type checking
- `vite` - Build tool and dev server
- `eslint` - Code linting
- `prettier` - Code formatting

## Project Structure

```
├── src/
│   ├── components/     # Reusable components
│   ├── pages/         # Page components
│   ├── api/           # API integration
│   ├── hooks/         # Custom hooks
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── public/            # Static assets
└── config files...    # Various configuration files
```

## Best Practices

1. Follow the established ESLint and Prettier rules
2. Use TypeScript types appropriately
3. Keep components small and focused
4. Use React built-in hooks for local state and lifecycle
5. Follow Material-UI best practices
6. Write meaningful commit messages

## Contributing

1. Ensure you're using the correct Node version (`nvm use`)
2. Create a new branch for your feature
3. Make your changes
4. Run linting and formatting before committing
   ```bash
   npm run lint
   npm run format
   ```
