import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { VerticalSlider } from '.';

const meta: ComponentMeta<typeof VerticalSlider> = {
  title: 'Components/VerticalSlider',
  component: VerticalSlider,
  args: {},
};

export const Docs: ComponentStory<typeof VerticalSlider> = (props) => {
  return (
    <div>
      <div
        style={{
          width: 200,
          height: 300,
          marginBottom: 50,
        }}>
        <VerticalSlider {...props} />
      </div>
    </div>
  );
};

export default meta;
