# SafeStep — Lisbon Women's Safety Navigation

SafeStep is a women's safety navigation web app for Lisbon, built by NOVA SBE students. It provides pedestrian routing prioritized by safety features, well-lit streets, and verified "Safe Spots" (sanctuaries).

## Walking routing setup

SafeStep uses **OpenRouteService (ORS)** foot-walking for real, high-quality pedestrian routes. To enable this locally:

1.  **Get an API key:** Register for a free account and get an API key at [https://openrouteservice.org/](https://openrouteservice.org/).
2.  **Create a local environment file:** Create a file called `.env.local` in the project root directory.
3.  **Add your key:** Add the following line to the file:
    ```
    VITE_ORS_API_KEY=your_openrouteservice_key_here
    ```
4.  **Restart the app:** If the dev server is already running, restart it to load the new key:
    ```bash
    pnpm dev
    ```

### Important Notes
- **Security:** Do NOT commit `.env.local` to GitHub. It is already included in `.gitignore`.
- **Fallback:** If the API key is missing, the app will automatically use the **Prototype fallback route (OSRM)** and display a visible warning in the route selection list.
- **Production:** For Vercel deployments, `VITE_ORS_API_KEY` must be added to the project's Environment Variables by the project owner.

## Development

```bash
pnpm dev                 # Start local development server
pnpm build               # Type-check and build for production
pnpm db:types            # Regenerate database types from Supabase
```

## React + TypeScript + Vite
... (rest of the template content)

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Prototype Note: Local Storage
The current version of SafeStep stores user profiles, feedback, and hazard reports locally on the user's device (using localStorage). The development team cannot yet see a centralized list of users or shared reports. To track records across devices and sync data globally, a backend integration (like Supabase Auth and persistent tables) will be implemented in a future version.
