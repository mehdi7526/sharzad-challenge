import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'iconsax-react',
              message: 'Use icons with shared defaults from @/shared/components/icons.',
            },
            { name: 'antd', message: 'Use UI components and hooks from @/shared/components.' },
            {
              name: 'axios',
              message: 'Use the configured API instance from @/shared/lib/api-request.',
            },
          ],
        },
      ],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
