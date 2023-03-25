import React from 'react';

import { PathOptions } from '../svg-dict';

export const path = ({ iconPrimary }: PathOptions) => (
  <g>
    <path d="M4 4V0L0 4H4Z" fill={iconPrimary}></path>
  </g>
);
export const viewBox = '0 0 4 4';
