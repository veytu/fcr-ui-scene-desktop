import React from 'react';
import { DoubleDeckPopover, Popover } from '.';
import { Button } from '../button';

export default {
  title: 'Components/Popover',
};
export const Docs = () => {
  return (
    <div>
      <Popover>
        <Button size="XS">FcrPopover</Button>
      </Popover>
      <DoubleDeckPopover>
        <Button size="XS">FcrDoubleDeckPopover</Button>
      </DoubleDeckPopover>
    </div>
  );
};
Docs.argTypes = {};
