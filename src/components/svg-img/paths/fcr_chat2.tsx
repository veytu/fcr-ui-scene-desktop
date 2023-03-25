import React from 'react';

import { PathOptions } from '../svg-dict';

export const path = ({ iconPrimary }: PathOptions) => (
  <g>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27.4283 11.9277C33.8452 11.9277 38.9998 17.1349 38.9998 23.4992C38.9998 26.5541 37.8445 29.3109 35.9416 31.3617C35.2625 32.0937 34.792 33.0201 34.792 34.0186C34.792 34.5446 34.266 35.0706 33.74 35.0706H26.955C20.8011 34.8076 15.8569 29.7057 15.8569 23.4991C15.8569 17.1349 21.0115 11.9277 27.4283 11.9277ZM31.2857 23.9276H22.7143C21.7675 23.9276 21 24.6951 21 25.6419C21 28.9556 23.6863 31.6419 27 31.6419C30.3137 31.6419 33 28.9556 33 25.6419C33 24.6951 32.2325 23.9276 31.2857 23.9276ZM24 22.2141C25.1835 22.2141 26.1429 21.2548 26.1429 20.0713C26.1429 18.8878 25.1835 17.9284 24 17.9284C22.8165 17.9284 21.8571 18.8878 21.8571 20.0713C21.8571 21.2548 22.8165 22.2141 24 22.2141ZM32.1429 20.0713C32.1429 21.2548 31.1835 22.2141 30 22.2141C28.8165 22.2141 27.8571 21.2548 27.8571 20.0713C27.8571 18.8878 28.8165 17.9284 30 17.9284C31.1835 17.9284 32.1429 18.8878 32.1429 20.0713ZM9 25.8982C9 21.8738 12.0132 18.5258 15.9363 18.043C15.0432 19.8121 14.5409 21.8099 14.5409 23.9204C14.5409 27.7385 16.1988 31.1862 18.8319 33.5811C18.3186 33.7106 17.7857 33.7898 17.2388 33.8132H12.5977C12.238 33.8132 11.8782 33.4534 11.8782 33.0936V32.0143C10.1153 30.5752 9 28.3806 9 25.8982Z"
      fill={iconPrimary}></path>
  </g>
);
export const viewBox = '0 0 48 48';