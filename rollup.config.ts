import type { RollupOptions } from 'rollup';

import typescriptPlugin from '@rollup/plugin-typescript';
import terserPlugin from '@rollup/plugin-terser';
import dtsPlugin from 'rollup-plugin-dts';
import scss from 'rollup-plugin-scss';
import zip from 'rollup-plugin-zip';
import copy from 'rollup-plugin-copy';
import { assert } from 'console';

import { readFileSync } from 'fs';
const packageJson = JSON.parse(readFileSync('./package.json').toString());

const outputPath = 'dist/js/materialize';

const version = packageJson.version;

const bannerText = `/*!
* Materialize v${version} (https://materializeweb.com)
* Copyright 2014-${new Date().getFullYear()} Materialize
* MIT License (https://raw.githubusercontent.com/materializecss/materialize/master/LICENSE)
*/`;

const config: RollupOptions[] = [
  //--- JS
  {
    input: 'src/index.ts',
    plugins: [typescriptPlugin()],
    output: [
      {
        file: `${outputPath}.cjs.js`,
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
        format: 'iife'
      },
      {
        name: 'M',
        file: `${outputPath}.min.js`,
        format: 'iife',
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
    plugins: [
      scss({
        fileName: 'materialize.min.css',
        outputStyle: 'compressed',
        sourceMap: true
      })
    ],
    output: [{ file: 'dist/css/materialize.min.css' }] // gets overwritten
  },
  {
    input: 'sass/materialize.scss',
    plugins: [
      scss({
        fileName: 'materialize.css'
      })
    ],
    output: [{ file: 'dist/css/materialize.css' }] // gets overwritten
  },

  //--- Banner
  {
    input: './empty.js',
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
            transform: (contents) => [bannerText, contents.toString().substring(1)].join('\n')
          }, // bug => workaround
          {
            src: `dist/js/*.js`,
            dest: `dist/js`,
            transform: (contents) => [bannerText, contents].join('\n')
          }
        ]
      })
    ]
  }

  //--- Compress
  /*
  {
    input: 'dist/js/materialize.js',
    output: {
      dir: 'dist',
      format: 'es'
    },
    plugins: [zip()]
  }
    */

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
