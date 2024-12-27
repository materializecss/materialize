import type { RollupOptions } from 'rollup';

import typescriptPlugin from '@rollup/plugin-typescript';
import terserPlugin from '@rollup/plugin-terser';
import dtsPlugin from 'rollup-plugin-dts';
import scss from 'rollup-plugin-scss';
import copy from 'rollup-plugin-copy';

import { readFileSync } from 'fs';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
const packageJson = JSON.parse(readFileSync('./package.json').toString());

const outputPath = 'dist/js/materialize';

const version = packageJson.version;

const bannerText = `/*!
* Materialize v${version} (https://materializeweb.com)
* Copyright 2014-${new Date().getFullYear()} Materialize
* MIT License (https://raw.githubusercontent.com/materializecss/materialize/master/LICENSE)
*/`;

const config: RollupOptions[] = [
  //--- Replace version in index.ts
  {
    input: './ci/empty.js',
    plugins: [
      copy({
        targets: [
          {
            src: `src/index.ts`,
            dest: `src`,
            transform: (contents) =>
              contents
                .toString()
                .replace(
                  new RegExp(/export const version = '.*/),
                  `export const version = '${version}';`
                )
          }
        ]
      })
    ],
    onwarn: (warning, defaultHandler) => {
      if (warning.code !== 'EMPTY_BUNDLE') defaultHandler(warning);
    }
  },

  //--- JS
  {
    input: 'src/index.ts',
    plugins: [typescriptPlugin()],
    output: [
      {
        file: `${outputPath}.cjs.js`,
        banner: bannerText,
        format: 'cjs'
      }
    ]
  },
  {
    input: 'src/index.ts',
    plugins: [typescriptPlugin()],
    output: [
      {
        file: `${outputPath}.mjs`,
        banner: bannerText,
        format: 'esm'
      }
    ]
  },
  {
    input: 'src/index.ts',
    plugins: [typescriptPlugin()],
    output: [
      {
        name: 'M',
        file: `${outputPath}.js`,
        banner: bannerText,
        format: 'iife'
      },
      {
        name: 'M',
        file: `${outputPath}.min.js`,
        format: 'iife',
        banner: bannerText,
        plugins: [terserPlugin()]
      }
    ]
  },
  //--- Types
  {
    input: 'src/index.ts',
    plugins: [typescriptPlugin(), dtsPlugin()],
    output: [
      {
        file: `${outputPath}.d.ts`,
        format: 'esm'
      }
    ]
  },

  //--- CSS
  {
    input: 'sass/materialize.scss',
    output: [{ file: 'dist/css/materialize.css' }], // overwritten
    plugins: [
      scss({
        fileName: 'materialize.css',
        processor: css => postcss([autoprefixer]).process(css).then(result => result.css),
        })
    ],
    onwarn: (warning, defaultHandler) => {
      if (!(warning.code === 'FILE_NAME_CONFLICT' || warning.code === 'EMPTY_BUNDLE'))
        defaultHandler(warning);
    }
  },
  {
    input: 'dist/css/materialize.css',
    output: [{ file: 'dist/css/materialize.min.css' }], // overwritten
    plugins: [
      scss({
        fileName: 'materialize.min.css',
        sourceMap: !(process.env.BUILD === 'release'),
      })
    ],
    onwarn: (warning, defaultHandler) => {
      if (!(warning.code === 'FILE_NAME_CONFLICT' || warning.code === 'EMPTY_BUNDLE'))
        defaultHandler(warning);
    }
  },
  {
    input: 'dist/css/materialize.css',
    output: [{ file: 'dist/css/materialize.min.css' }], // overwritten
    plugins: [
      scss({
        fileName: 'materialize.min.css',
        outputStyle: 'compressed',
        processor: (css, map) => postcss([autoprefixer]).process(css, { from: 'materialize.min.css' }).then(result => result.css),
      })
    ],
    onwarn: (warning, defaultHandler) => {
      if (!(warning.code === 'FILE_NAME_CONFLICT' || warning.code === 'EMPTY_BUNDLE'))
        defaultHandler(warning);
    }
  },

  //--- CSS Banners
  {
    input: './ci/empty.js',
    plugins: [
      copy({
        targets: [
          {
            src: `dist/css/materialize.css`,
            dest: `dist/css`,
            transform: (contents) => [bannerText, contents].join('\n')
          },
          {
            src: `dist/css/*.min.css`,
            dest: `dist/css`,
            transform: (contents) => [bannerText, contents.toString().substring(1)].join('\n') // bug => workaround
          }
        ]
      })
    ],
    onwarn: (warning, defaultHandler) => {
      if (warning.code !== 'EMPTY_BUNDLE') defaultHandler(warning);
    }
  }

  // TODO: Compress as zip files

  // compress: {
  //   main: {
  //     options: {
  //       archive: 'bin/materialize-v'+version+'.zip',
  //       level: 6
  //     },
  //     files: [
  //       { expand: true, cwd: 'dist/', src: ['**/*'], dest: 'materialize/' },
  //       { expand: true, cwd: './', src: ['LICENSE', 'README.md'], dest: 'materialize/' }
  //     ]
  //   },
  //   src: {
  //     options: {
  //       archive: 'bin/materialize-src-v'+version+'.zip',
  //       level: 6
  //     },
  //     files: [
  //       { expand: true, cwd: 'sass/', src: ['materialize.scss'], dest: 'materialize-src/sass/' },
  //       { expand: true, cwd: 'sass/', src: ['components/**/*'], dest: 'materialize-src/sass/' },
  //       { expand: true, cwd: 'src/', src: ['**/*'], dest: 'materialize-src/ts/' },
  //       { expand: true, cwd: 'dist/js/', src: ['**/*'], dest: 'materialize-src/js/bin/' },
  //       { expand: true, cwd: './', src: ['LICENSE', 'README.md'], dest: 'materialize-src/' }
  //     ]
  //   }
  // },
];

export default config;
