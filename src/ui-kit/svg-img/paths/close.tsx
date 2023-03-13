import React from "react";

import { PathOptions } from "../svg-dict";

export const path = ({ iconPrimary }: PathOptions) => (
  <>
    <g clip-path="url(#clip0_3300_30270)">
      <rect
        x="5.58594"
        y="17.3359"
        width="16.6209"
        height="1.52822"
        rx="0.764111"
        transform="rotate(-45 5.58594 17.3359)"
        fill="white"
      />
      <rect
        x="6.66406"
        y="5.58301"
        width="16.6209"
        height="1.52822"
        rx="0.764111"
        transform="rotate(45 6.66406 5.58301)"
        fill="white"
      />
    </g>
    <defs>
      <clipPath id="clip0_3300_30270">
        <rect width="14" height="14" fill="white" transform="translate(5 5)" />
      </clipPath>
    </defs>
  </>
);

export const viewBox = "0 0 24 24";
