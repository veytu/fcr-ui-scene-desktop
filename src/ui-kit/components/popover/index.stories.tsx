import React from 'react';
import { FcrDoubleDeckPopover, FcrPopover } from '.';
import { FcrButton } from '../button';

export default {
  title: 'Components/Popover',
};
export const Docs = () => {
  return (
    <div>
      <FcrPopover>
        <FcrButton size="XS">FcrPopover</FcrButton>
      </FcrPopover>
      <FcrDoubleDeckPopover>
        <FcrButton size="XS">FcrDoubleDeckPopover</FcrButton>
      </FcrDoubleDeckPopover>
    </div>
  );
};
Docs.argTypes = {};
