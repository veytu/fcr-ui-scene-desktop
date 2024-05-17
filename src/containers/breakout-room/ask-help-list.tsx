import { Button } from '@components/button';
import { SvgImg, SvgIconEnum } from '@components/svg-img';
import { useStore } from '@ui-scene/utils/hooks/use-store';
import { transI18n, useI18n } from 'agora-common-libs';
import { observer } from 'mobx-react';
import { FC, useEffect } from 'react';
import { notification } from 'antd';

type AskHelpRequest = {
  groupUuid: string;
  groupName: string;
};

export const AskHelpList = observer(() => {
  const {
    breakoutUIStore: { currentActionGroup, acceptInvite, helpRequestList, rejectInvite, addToast },
  } = useStore();
  const [api, contextHolder] = notification.useNotification({
    top: 80,
  });
  const handleOk = (item: AskHelpRequest) => {
    acceptInvite(item.groupUuid);
    api.destroy(item.groupUuid);
  };
  const handleCancel = (item: AskHelpRequest) => {
    rejectInvite(item.groupUuid);
    addToast({ text: transI18n('fcr_group_reject_help', {
      reason1: item.groupName
    })})
    api.destroy(item.groupUuid);
  };
  const openNotification = (list: AskHelpRequest) => {
    api.open({
      key: list.groupUuid,
      message: <div className="fcr-breakout-room__ask-for-help__list-item-label">{list.groupName} {transI18n('fcr_group_ask_for_help')}</div>,
      duration: null,
      description: '',
      placement: 'topLeft',
      closeIcon: <div className="fcr-breakout-room__ask-for-help__list-item-close">
          <SvgImg type={SvgIconEnum.FCR_CLOSE} size={9.6} />
        </div>,
      icon: <div className='fcr-breakout-room__ask-for-help__list-item-icon'>
          <SvgImg type={SvgIconEnum.FCR_INVITE} size={40} />
        </div>,
      btn:  <div className="fcr-breakout-room__askhelp-buttons">
        <span className='fcr-breakout-room__create-panel-button' onClick={() => handleCancel(list)}>
          {transI18n('fcr_group_not_now')}
        </span>
        <span className='fcr-breakout-room__create-panel-button active' onClick={() => handleOk(list)}>
          {transI18n('fcr_group_go_to')}
        </span>
      </div>,
      className: 'fcr-breakout-room__ask-for-help__list-item',
    });
  };
  useEffect(() => {
    if (helpRequestList.length) {
      openNotification(helpRequestList[helpRequestList.length - 1]);
    }
   
  }, [helpRequestList.length])
  useEffect(() => {
    if (currentActionGroup) {
      api.destroy(currentActionGroup.groupUuid)
    }
  }, [currentActionGroup])
  return (
    <>
    {contextHolder}
  </>
    // <div className="fcr-breakout-room__ask-for-help fcr-breakout-room--scroll">
    //   {helpRequestList.map((item, index) => (
    //     <AskForHelpListItem key={index.toString()} item={item} />
    //   ))}
    // </div>
  );
});

export const AskForHelpListItem: FC<{ item: AskHelpRequest }> = ({ item }) => {
  const {
    breakoutUIStore: { acceptInvite, rejectInvite },
  } = useStore();
  const transI18n = useI18n();

  const handleOk = () => {
    acceptInvite(item.groupUuid);
  };
  const handleCancel = () => {
    rejectInvite(item.groupUuid);
   
  };

  return (
    <div className="fcr-breakout-room__ask-for-help__list-item">
      <div className="fcr-breakout-room__ask-for-help__list-item-header">
        {/* top right close */}
        <div className="fcr-breakout-room__ask-for-help__list-item-close" onClick={handleCancel}>
          <SvgImg type={SvgIconEnum.FCR_CLOSE} size={9.6} />
        </div>
      </div>
      <div className="fcr-breakout-room__ask-for-help__list-item-icon">
        <SvgImg type={SvgIconEnum.FCR_STUDENT_RASIEHAND} size={32} />
      </div>
      <div className="fcr-breakout-room__ask-for-help__list-item-label">
        <p>
          {transI18n('fcr_group_from')}{' '}
          <span className="fcr-breakout-room__ask-for-help__list-item-emph-1">
            {item.groupName}
          </span>
        </p>
        <p className="fcr-breakout-room__ask-for-help__list-item-emph-2">
          {transI18n('fcr_group_ask_for_help')}
        </p>
      </div>
      <div className="fcr-breakout-room__askhelp-buttons">
        <Button size="XS" styleType="gray" onClick={handleCancel}>
          {transI18n('fcr_group_not_now')}
        </Button>
        <Button size="XS" onClick={handleOk}>
          {transI18n('fcr_group_go_to')}
        </Button>
      </div>
    </div>
  );
};
