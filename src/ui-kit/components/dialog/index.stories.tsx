import React, { FC, useState } from 'react';
import { Meta } from '@storybook/react';
import { FcrBaseDialog, FcrClassDialog, FcrConfirmDialog } from '.';
import { SvgIconEnum, SvgImg } from '../svg-img';
import { FcrButton } from '../button';
const meta: Meta = {
  title: 'Components/Dialog',
};

export const Docs = () => {
  const [visible, setVisible] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [classDialogVisible, setClassDialogVisible] = useState(false);

  return (
    <div>
      <FcrButton onClick={() => setVisible(true)}>open base dialog</FcrButton>
      <FcrButton onClick={() => setConfirmDialogVisible(true)}>open confirm dialog</FcrButton>
      <FcrButton onClick={() => setClassDialogVisible(true)}>open class dialog</FcrButton>

      <FcrBaseDialog visible={visible} onClose={() => setVisible(false)}></FcrBaseDialog>
      <FcrConfirmDialog
        icon={<SvgImg type={SvgIconEnum.FCR_FILE_ALF} size={50}></SvgImg>}
        checkedProps={{
          label: '不再显示',
        }}
        checkable
        maskClosable={false}
        onOk={() => setConfirmDialogVisible(false)}
        title={'移到垃圾桶'}
        visible={confirmDialogVisible}
        onClose={() => setConfirmDialogVisible(false)}>
        <div>此白板将移到垃圾桶，协作组将不再拥有其访问权限。</div>
      </FcrConfirmDialog>
      <FcrClassDialog
        imgUrl=" "
        maskClosable={false}
        visible={classDialogVisible}
        onClose={() => setClassDialogVisible(false)}
        title={'本节课程已结束！'}
        content={'你可以去预约其它的课程啦'}
        cancelBtn={false}
        actions={[
          {
            text: '我知道了，离开教室',
            styleType: 'danger',
            onClick: () => setClassDialogVisible(false),
          },
        ]}></FcrClassDialog>
    </div>
  );
};

export default meta;
/* <FcrBaseDialog
        
// </FcrBaseDialog> */
