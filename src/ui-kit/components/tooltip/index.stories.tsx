import React, { FC, useState } from "react";
import { Meta } from "@storybook/react";
import { FcrToolTip, FcrGuideToolTip } from ".";

const meta: Meta = {
  title: "Components/ToolTip",
};
const placementMap = [
  "left",
  "top",
  "bottom",
  "right",
  "leftTop",
  "leftBottom",
  "rightTop",
  "rightBottom",
  "topLeft",
  "topRight",
  "bottomLeft",
  "bottomRight",
];
export const Docs: FC = (props) => {
  return (
    <div className="grid grid-cols-3 gap-6 p-56">
      {placementMap.map((placement) => {
        return (
          <FcrToolTip trigger="click" placement={placement} content={placement}>
            <a className="w-26 h-8 text-center text-blue-300 underline cursor-pointer bg-gray-200">
              {placement}
            </a>
          </FcrToolTip>
        );
      })}
    </div>
  );
};

export default meta;
