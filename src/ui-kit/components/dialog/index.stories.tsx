import React, { FC, useState } from 'react';
import { Meta } from '@storybook/react';
import { FcrDialog } from '.';
import { FcrButton } from '../button';
import { InputNumber } from '../input-number';
import { SvgIconEnum, SvgImg } from '../svg-img';
const meta: Meta = {
  title: 'Components/Dialog',
};

export const Docs = (props) => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <FcrButton onClick={() => setVisible(true)}>open dialog</FcrButton>
      <FcrDialog
        icon={<SvgImg type={SvgIconEnum.FCR_FILE_ALF} size={50}></SvgImg>}
        checkedProps={{
          label: '不再显示',
        }}
        checkable
        onOk={() => setVisible(false)}
        title={'移到垃圾桶'}
        visible={visible}
        onClose={() => setVisible(false)}>
        <div>
          此白板将移到垃圾桶，协作组将不再拥有其访问权限。
          {/* <div>
            <span>number</span>
            <InputNumber />
          </div> */}
        </div>
      </FcrDialog>
    </div>
  );
};

export default meta;
