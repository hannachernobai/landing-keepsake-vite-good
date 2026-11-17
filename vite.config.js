import fs from 'node:fs';
import path from 'node:path';
import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';

// base потрібен лише для GitHub Pages: https://<user>.github.io/landing-keepsake-vite/
// У GitHub Actions змінна GITHUB_ACTIONS=true, локально її немає
const base = process.env.GITHUB_ACTIONS ? '/landing-keepsake-vite/' : '/';

// vituum зберігає зібрану сторінку як index.pug.html, а серверам потрібен index.html
const renamePugHtml = () => {
  let outDir;

  return {
    name: 'rename-pug-html',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      for (const file of fs.readdirSync(outDir)) {
        if (file.endsWith('.pug.html')) {
          fs.renameSync(
            path.join(outDir, file),
            path.join(outDir, file.replace('.pug.html', '.html')),
          );
        }
      }
    },
  };
};

export default {
  base,
  plugins: [
    vituum({
      imports: {
        filenamePattern: {
          '+.css': [],
          '+.scss': [],
        },
      },
    }),
    pug({ root: './src' }),
    renamePugHtml(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, 'src/assets'),
    },
  },
};
