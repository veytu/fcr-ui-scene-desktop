import fs from 'fs';
import path from 'path';
import snakeCase from 'lodash/snakeCase';
import htmlParser from 'node-html-parser';
import { ESLint } from 'eslint';
// const fs = require('fs');
// const path = require('path');
// const snakeCase = require('lodash/snakeCase');
// const htmlParser = require('node-html-parser');
// const { ESLint } = require('eslint');

const SVG_COM_DIR = path.resolve(__dirname, 'components/svg-img');
const SVG_PATHS_DIR = path.resolve(__dirname, 'components/svg-img/paths');

const keys = new Set<string>();

function interpolateIcon(tag: string, viewBox: string, needWrap: boolean) {
  const template = `
    import React from 'react';
    
    import { PathOptions } from '../svg-dict';
    
    export const path = ({ iconPrimary }: PathOptions) => (
      ${needWrap ? '<g>' : ''}
      ${tag}
      ${needWrap ? '</g>' : ''}
    );
    export const viewBox = '${viewBox}';
    `;

  return template;
}

function interpolateType(content: string) {
  const template = `
  export enum SvgIconEnum {
    ${content}
  }
  `;
  return template;
}

fs.readdirSync(SVG_PATHS_DIR).forEach(async (fn: string) => {
  if (!fn.toLowerCase().endsWith('.svg')) {
    return;
  }

  const content = fs.readFileSync(path.resolve(SVG_PATHS_DIR, fn), 'utf-8');

  const svgRoot = htmlParser.parse(content).querySelector('svg')!;

  const viewBox = svgRoot.getAttribute('viewBox')!;

  const inplate = interpolateIcon(svgRoot.innerHTML, viewBox, svgRoot.childNodes.length > 1);

  fs.writeFileSync(path.resolve(SVG_PATHS_DIR, path.basename(fn, '.svg') + '.tsx'), inplate);

  fs.unlinkSync(path.resolve(SVG_PATHS_DIR, fn));

  const fsn = snakeCase(path.basename(fn, '.svg'));

  keys.add(fsn.toUpperCase());
});

const eslint = new ESLint({ fix: true });
eslint.lintFiles([path.resolve(SVG_PATHS_DIR, '*.tsx')]).then(async (results) => {
  ESLint.outputFixes(results);
});

// write type

const keyContent = Array.from(keys)
  .map((k: string) => `\t${k} = '${k.toLowerCase()}',\n`)
  .join('');

const inplate = interpolateType(keyContent);

fs.writeFileSync(path.resolve(SVG_COM_DIR, 'type.ts'), inplate);

export default {};
