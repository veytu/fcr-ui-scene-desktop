import { Avatar } from '@components/avatar';
import { Button } from '@components/button';
import { Input } from '@components/input';
import { PopoverWithTooltip } from '@components/popover';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import classNames from 'classnames';
import React, { useState, FC, useEffect } from 'react';
import { GroupPanel } from './group-panel';
import { SearchPanel } from './search-panel';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { observer } from 'mobx-react';
import { useStore } from '@ui-scene/utils/hooks/use-store';
import { useI18n, useUIConfig } from 'agora-common-libs';
import { message } from 'antd';
import { isEmpty } from 'lodash';
import { EduClassroomConfig } from 'agora-edu-core';
import AgoraRTC from 'agora-rtc-sdk-ng';

type GroupItem = {
  id: string;
  name: string;
  tag?: string;
};

enum DraggableTypes {
  NameCard = 'name-card',
}

export const BreakoutRoomGrouping = observer(() => {
  const {
    breakoutUIStore: {
      addGroup,
      moveUserToGroup,
      groupDetails,
      ungroupedCount,
      numberToBeAssigned,
      groupState,
      ungroupedList,
      groups,
      selectedUnGroupMember,
      selectedGroupMember,
      selectedGroup,
      getUserGroupUuid,
      addToast
    },
  } = useStore();
  const transI18n = useI18n();
  const isHasGroupedMember = groups?.filter(item => item?.children?.length > 0);

  console.log('ungroupedList', ungroupedList, groups);
  console.log('groupDetails', JSON.stringify(groupDetails));

  const handleMoveGroup = (type: string) => {
    console.log('selectedGroup', JSON.stringify(selectedGroup));

    //移动选中的所有
    if (type === 'single-to-right') {
      if (selectedGroup && !isEmpty(selectedGroup)) {
        const arr = selectedUnGroupMember?.map(item => item?.userUuid);
        moveUserToGroup('', selectedGroup?.groupId, arr as string[]);
      } else {
        // message.info('请先选择分组');
        addToast({ text: transI18n('fcr_group_choose_group') });
      }
    } else if (type === 'single-to-left') {
      selectedGroupMember?.map(item => {
        moveUserToGroup(item?.groupId, '', item?.userUuid as string);
      })
    } else if (type === 'all-to-right') {
      ungroupedList?.map(item => {
        moveUserToGroup('', selectedGroup?.groupId, item?.id);
      })

    } else if (type === 'all-to-left') {
      groups?.map(item => {
        if (item?.children?.length > 0) {
          item?.children?.map(chi => {
            const groupUuid = getUserGroupUuid(chi?.id);
            moveUserToGroup(groupUuid as string, '', chi?.id);
          })
        }
      })
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="fcr-breakout-room__grouping">
        {/* column header */}
        <div className="fcr-breakout-room__grouping-column-header">
          <div className="fcr-breakout-room__grouping-column--ungroupped">
            <span>{transI18n('fcr_group_ungrouped')}</span>&nbsp;({ungroupedCount})
          </div>
          <div className="fcr-breakout-room__grouping-column--grouped">
            <div>
              <span>{transI18n('fcr_group_grouped')}</span>&nbsp;(
              {numberToBeAssigned - ungroupedCount})
            </div>
            {!groupState && (
              <div>
                <Button
                  size="XXS"
                  preIcon={SvgIconEnum.FCR_V2_PHONE_MORE1}
                  type={'secondary'}
                  onClick={addGroup}>
                  {transI18n('fcr_group_button_add_room')}
                </Button>
              </div>
            )}
          </div>
        </div>
        {/* content */}
        <div className="fcr-breakout-room__grouping-column-content">
          {/* ungrouped member list */}
          <div className="fcr-breakout-room__grouping-column--ungroupped">
            <div className='fcr-breakout-room--ungrounpped-list fcr-breakout-room--scroll'>
              <UngroupedList />
            </div>
            {/* operator panel*/}
            <div className="fcr-breakout-room__grouping-column--operator-panel">
              <div className='fcr-breakout-room__grouping-column--operator-panel-button-wrapped'>
                <Button
                  size="XXS"
                  type={selectedUnGroupMember?.length ? 'primary' : 'secondary'}
                  shape='circle'
                  disabled={!selectedUnGroupMember?.length}
                  onClick={() => handleMoveGroup('single-to-right')}>
                  <SvgImg type={SvgIconEnum.FCR_V2_CHEVRON_RIGHT} />
                </Button>
                <Button
                  size="XXS"
                  type={selectedGroupMember?.length ? 'primary' : 'secondary'}
                  onClick={() => handleMoveGroup('single-to-left')}
                  disabled={!selectedGroupMember?.length}
                >
                  <SvgImg type={SvgIconEnum.FCR_V2_CHEVRON_LEFT} />
                </Button>
                <Button
                  size="XXS"
                  type={ungroupedList?.length ? 'primary' : 'secondary'}
                  onClick={() => handleMoveGroup('all-to-right')}
                  disabled={!ungroupedList?.length}
                >
                  <SvgImg type={SvgIconEnum.FCR_V2_CHEVRON_DOUBLE_RIGHT} />
                </Button>
                <Button
                  size="XXS"
                  type={isHasGroupedMember?.length ? 'primary' : 'secondary'}
                  onClick={() => handleMoveGroup('all-to-left')}
                  disabled={!isHasGroupedMember?.length}
                >
                  <SvgImg type={SvgIconEnum.FCR_V2_LOGOUT} />
                </Button>
              </div>

            </div>
          </div>

          {/* grouped member list */}
          <div className="fcr-breakout-room__grouping-column--grouped fcr-breakout-room--scroll">
            <Groups />
          </div>
        </div>
      </div>
    </DndProvider>
  );
});

export const UngroupedList = observer(() => {
  const {
    breakoutUIStore: { ungroupedList, groupState },
  } = useStore();
  const [{ isOver }, drop] = useDrop({
    accept: DraggableTypes.NameCard,
    collect(monitor) {
      return { isOver: monitor.isOver() };
    },
    drop: (item: GroupItem) => {
      return {};
    },
  });

  const canDrop = !groupState;


  const ulCls = classNames(
    'fcr-breakout-room__grouping-ungrouped-list',
    'fcr-breakout-room__grouping__drop-container',
    {
      // 'fcr-breakout-room--drop-not-allowed': !!groupState,
      'fcr-breakout-room__grouping--dashed-border': canDrop && isOver,
    },
  );

  return (
    <ul ref={drop} className={ulCls}>
      {ungroupedList.map((item) => (
        <DraggableNameCard key={item.id} item={{ id: item.id, name: item.text }} />
      ))}
    </ul>
  );
});

export const Groups = observer(() => {
  const {
    breakoutUIStore: { groups },
  } = useStore();

  return (
    <React.Fragment>
      {groups.map(({ text, id, children }) => {
        const list = children.map(({ id, text }) => ({ id, name: text }));
        return <GroupedList key={id} list={list} groupName={text} groupId={id} />;
      })}
    </React.Fragment>
  );
});

export const GroupedList = observer(
  ({ groupId, groupName, list }: { groupId: string; groupName: string; list: GroupItem[] }) => {
    const {
      layoutUIStore: { addDialog },
      breakoutUIStore: {
        removeGroup,
        renameGroupName,
        setGroupUsers,
        groupState,
        joinSubRoom,
        studentInvites,
        setSelectedGroup,
        selectedGroup,
        attendDiscussion,
        isStartDiscussion,
        teacherInCurrentRoom,
        getUserToken
      },
    } = useStore();
    const transI18n = useI18n();
    const [expanded, setExpanded] = useState(true);

    const [editing, setEditing] = useState(false);

    const [inputVal, setInputVal] = useState('');

    const [isSelected, setIsSelected] = useState(false);//当前选中的分组

    const [discussionBtn, setDiscussionBtn] = useState(false);//是否开启旁听讨论

    const [{ isOver }, drop] = useDrop({
      accept: DraggableTypes.NameCard,
      collect: (monitor) => {
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
      drop: (item) => {
        return { groupId };
      },
    });

    const isTeacherInRoom: boolean = teacherInCurrentRoom(groupId);

    const toggleExpand = () => {
      setExpanded(!expanded);
    };

    const handleRename = () => {
      setEditing(true);
      setInputVal(groupName);
    };

    const handleSubmit = () => {
      setEditing(false);
      setInputVal('');
      if (inputVal) {
        renameGroupName(groupId, inputVal);
      }
    };

    const handleDelete = () => {
      addDialog('confirm', {
        title: transI18n('fcr_group_delete_room_title'),
        content: discussionBtn ? transI18n('fcr_group_delete_room_listening_confirm') : transI18n('fcr_group_delete_room_confirm', { reason1: groupName }),
        onOk: () => {
          removeGroup(groupId);
        },
        okButtonProps: {
          styleType: 'danger',
        },
      });
    };

    const handleBlur = () => {
      handleSubmit();
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    };

    const handleUsersChange = (users: string[]) => {
      setGroupUsers(groupId, users);
    };

    const handleJoin = () => {
      console.log('join', groupId);
      joinSubRoom(groupId);
    };

    const handleChooseGroup = () => {
      console.log('selectedGroup', isSelected);
      console.log('selectedGroup selectedGroup', JSON.stringify(selectedGroup));
      console.log('selectedGroup groupId', groupId);
      console.log('selectedGroup groupId === selectedGroup?.groupId', groupId === selectedGroup?.groupId);

      //已选择了一个分组
      if (selectedGroup && !isEmpty(selectedGroup) && groupId === selectedGroup?.groupId) {
        //当前点击的是已选中的那个
        isSelected ? setSelectedGroup(null) : setSelectedGroup({ groupId, groupName });
        setIsSelected(!isSelected);
      } else {
        //还未选择 |  取消当前选中，选择另一个
        setIsSelected(!isSelected);
        setSelectedGroup({ groupId, groupName });
      }
    }

    const handleDiscussion = async () => {
      debugger
      console.log('旁听讨论');
      // fcr_group_attend_discussion_join_room_confirm
      addDialog('confirm', {
        title: discussionBtn ? transI18n('fcr_board_close_discussion') : transI18n('fcr_board_attend_discussion'),
        content: discussionBtn ? transI18n('fcr_group_close_discussion_confirm') : transI18n('fcr_group_attend_discussion_confirm', { reason1: groupName }),
        onOk: async () => {
          //创建频道
          let client;
          if (!client) {
            client = AgoraRTC.createClient({
              codec: "vp8",
              mode: "rtc",
            });
          }
          if (discussionBtn) {
            //关闭 - 离开频道
            client && await client.leave();
          } else {
            const { appId } = EduClassroomConfig.shared;
            //streamUuid用户频道号
            // const data = await getUserToken(groupId as string);

            const { localUser: { streamUuid, userToken, userUuid } } = await getUserToken(groupId as string);

            // { localUser: { streamUuid, userToken, userUuid } } 
            await client.join(appId, "attend-discussion-room", userToken, userUuid);
            const subscribe = () => {
              client.on("user-published", async (user: { audioTrack: any; }, mediaType: string) => {
                // 发起订阅
                await client.subscribe(user, mediaType);
                // 如果订阅的是音频轨道
                if (mediaType === "audio") {
                  const audioTrack = user.audioTrack;
                  // 自动播放音频
                  audioTrack && audioTrack.play();
                }
              });
            }
            const unsubscribe = () => {
              client.removeAllListeners("user-published");
            }
            try {
              subscribe();
            } catch (e) {
              console.log('error', e);
            } finally {
              unsubscribe();
            }
          }
          setDiscussionBtn(!discussionBtn);
        },
        okButtonProps: {
          styleType: 'danger',
        },
      });
    }

    const haveRequest = studentInvites.some((request: { groupUuid: string; }) => {
      return request.groupUuid === groupId;
    });

    const ulCls = classNames('fcr-breakout-room__grouping-grouped-list', {
      'fcr-breakout-room__grouping-grouped-list--hidden': !expanded,
    });

    const containerCls = classNames('fcr-breakout-room__grouping__drop-container', {
      'fcr-breakout-room__grouping--dashed-border': isOver,
    });

    return (
      <React.Fragment>
        <div ref={drop} className={containerCls}>
          <div className="fcr-breakout-room__grouping-grouped-title" style={selectedGroup?.groupId === groupId ? { backgroundColor: 'rgba(201, 207, 224, 0.3)' } : {}} onClick={handleChooseGroup}>
            <SvgImg
              onClick={toggleExpand}
              type={SvgIconEnum.FCR_DROPDOWN}
              style={{ transform: `rotate(${expanded ? 0 : -90}deg)`, transition: '.3s all' }}
              size={20}
            />
            {haveRequest && (
              <ToolTip content={transI18n('fcr_group_tips_ask_help')}>
                <Button size="XXS" shape="rounded" type="secondary">
                  <SvgImg type={SvgIconEnum.FCR_STUDENT_HELPHAND} />
                </Button>
              </ToolTip>
            )}
            {!editing ? (
              <React.Fragment>
                <span
                  className="fcr-breakout-room__grouping-grouped-group-name"
                  onClick={toggleExpand}>
                  {groupName} ({list.length})
                </span>
                <div className="fcr-breakout-room__grouping-grouped-group-actions">
                  <Button disabled={!isStartDiscussion} type='secondary' onClick={handleDiscussion} size="XXS" styleType={discussionBtn ? "danger" : 'gray'}>
                    {transI18n(discussionBtn ? 'fcr_board_close_discussion' : 'fcr_board_attend_discussion')}
                  </Button>
                  <Button disabled={!isStartDiscussion || isTeacherInRoom} onClick={handleJoin} size="XXS">
                    {transI18n('fcr_board_join_group')}
                  </Button>
                  {/* 折叠按钮 */}
                  <ToolTip
                    placement='bottom'
                    showArrow={false}
                    overlayInnerStyle={{
                      background: '#404043',
                      padding: '0 5px'
                    }}
                    overlayClassName='fcr-breakout-room_tooltip'
                    content={
                      <div className='fcr-breakout-room_fold-btn-wrapped'>
                        <div className='fcr-breakout-room_fold-btn-item' style={{ marginBottom: 6 }} onClick={handleDelete}>
                          <SvgImg type={SvgIconEnum.FCR_DELETE3} size={24} />
                          <span>删除该组</span>
                        </div>
                        <div className='fcr-breakout-room_fold-btn-item' onClick={handleRename} >
                          <SvgImg type={SvgIconEnum.FCR_RENAME} size={24} />
                          <span>重命名</span>
                        </div>
                      </div>
                    }>
                    <div className='fcr-breakout-room_fold-svg-wrapped'>
                      <SvgImg
                        onClick={toggleExpand}
                        type={SvgIconEnum.FCR_V2_FOLD_BTN}
                      />
                    </div>
                    {/* <Button onClick={handleDelete} size="XXS">
                      <SvgImg
                        onClick={toggleExpand}
                        type={SvgIconEnum.FCR_V2_FOLD_BTN}
                      />
                    </Button> */}
                  </ToolTip>

                  {/* 分组 */}
                  {/* {!groupState ? (
                    <PopoverWithTooltip
                      toolTipProps={{
                        placement: 'top',
                        content: transI18n('fcr_group_button_move_to'),
                      }}
                      popoverProps={{
                        overlayOffset: 20,
                        placement: 'rightTop',
                        content: <SearchPanel groupId={groupId} onChange={handleUsersChange} />,
                        overlayClassName: 'fcr-breakout-room__search__overlay',
                      }}>
                      <Button
                        size="XXS"
                        shape="circle"
                        type="secondary"
                        preIcon={SvgIconEnum.FCR_MOVETO}>
                        {transI18n('fcr_group_button_assign')}
                      </Button>
                    </PopoverWithTooltip>
                  ) : (
                    <Button
                      size="XXS"
                      shape="circle"
                      type="secondary"
                      preIcon={SvgIconEnum.FCR_MOVETO}
                      onClick={handleJoin}>
                      {transI18n('fcr_group_button_join')}
                    </Button>
                  )} */}


                </div>
              </React.Fragment>
            ) : (
              <Input
                maxLength={15}
                size="small"
                value={inputVal}
                onChange={setInputVal}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                autoFocus
              />
            )}
          </div>
          <ul className={ulCls}>
            {list.map((item) => {
              return <DraggableNameCard key={item.id} item={item} groupId={groupId} />;
            })}
          </ul>
        </div>
      </React.Fragment>
    );
  },
);

// const DraggableNameCard: FC<{ item: GroupItem; groupId?: string }> = ({ item, groupId }) => {
//   const {
//     breakoutUIStore: { moveUserToGroup, groupDetails },
//   } = useStore();

//   const [{ isDragging }, drag] = useDrag({
//     type: DraggableTypes.NameCard,
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//     item,
//     end: (item, monitor) => {
//       const getGroupDetails = (groupId: string) => groupDetails.get(groupId);

//       if (!monitor.didDrop()) {
//         return;
//       }
//       const { groupId: toGroupId } = monitor.getDropResult() as { groupId: string };

//       if (toGroupId === groupId) {
//         return;
//       }

//       if (!groupId) {
//         // move from ungrouped to a group
//         const groupDetails = getGroupDetails(toGroupId);

//         if (groupDetails) {
//           // const groupUsers = groupDetails.users
//           //   .concat([{ userUuid: item.id }])
//           //   .map(({ userUuid }) => userUuid);
//           // setGroupUsers(toGroupId, groupUsers);
//           moveUserToGroup('', toGroupId, item.id);
//         }
//       } else if (!toGroupId) {
//         // remove from current group
//         const groupDetails = getGroupDetails(groupId);

//         if (groupDetails) {
//           // const groupUsers = groupDetails.users
//           //   .filter(({ userUuid }) => userUuid !== item.id)
//           //   .map(({ userUuid }) => userUuid);
//           // setGroupUsers(groupId, groupUsers);
//           moveUserToGroup(groupId, '', item.id);
//         }
//       } else {
//         moveUserToGroup(groupId, toGroupId, item.id);
//       }
//     },
//   });

//   return (
//     <li ref={drag} style={{ visibility: isDragging ? 'hidden' : 'visible' }}>
//       <NamePlate nickname={item.name} tag={item.tag} userId={item.id} groupId={groupId} />
//     </li>
//   );
// };

const DraggableNameCard: FC<{ item: GroupItem; groupId?: string }> = ({ item, groupId }) => {
  const {
    breakoutUIStore: {
      selectedUnGroupMember,
      setSelectedUnGroupMember,
      selectedGroupMember,
      setSelectedGroupMember,
      removeSelectedGroupMember,
      removeSelectedUnGroupMember,
    },
  } = useStore();
  const [isSelected, setIsSelected] = useState(false);

  const handleSelected = () => {
    setIsSelected(!isSelected);
    console.log('groupId', groupId);

    if (groupId) {
      //已分组
      isSelected ? removeSelectedGroupMember({ groupId, userUuid: item?.id, ...item }) : setSelectedGroupMember({ groupId, userUuid: item?.id, ...item });
    } else {
      //未分组
      isSelected ? removeSelectedUnGroupMember({ groupId: '', userUuid: item?.id, ...item }) : setSelectedUnGroupMember({ groupId: '', userUuid: item?.id, ...item });
    }
  }
  console.log('selectedUnGroupMember', JSON.stringify(selectedUnGroupMember));
  console.log('selectedGroupMember', JSON.stringify(selectedGroupMember));
  console.log('selectedUnGroupMember groupId', groupId);


  return (
    <li onClick={handleSelected} style={isSelected ? { background: 'rgba(44, 39, 39, 0.8)' } : {}}>
      <NamePlate isSelected={isSelected} nickname={item.name} tag={item.tag} userId={item.id} groupId={groupId} />
    </li>
  );
};

const NamePlate: FC<{ nickname: string; tag?: string; userId: string; groupId?: string, isSelected: boolean }> = ({
  nickname,
  tag,
  userId,
  groupId,
  isSelected,
}) => {
  const {
    breakoutUIStore: { moveUserToGroup },
  } = useStore();
  const transI18n = useI18n();

  const handleChange = (toGroupId: string) => {
    if (groupId) {
      moveUserToGroup(groupId, toGroupId, userId);
    }
  };

  return (
    <div className="fcr-breakout-room__grouping-name-plate">
      {isSelected && <SvgImg type={SvgIconEnum.FCR_CHOOSE_VERTICAL_RECT} />}
      {/* <SvgImg type={SvgIconEnum.FCR_MOVE} colors={{ iconPrimary: 'currentColor' }} /> */}
      <Avatar style={{ marginLeft: isSelected ? 0 : '24px' }} size={24} textSize={12} nickName={nickname} />
      <div className="fcr-breakout-room__grouping-name-plate-name">
        {tag && <div className="fcr-breakout-room__grouping-name-plate-name-tag">{tag}</div>}
        <div>{nickname}</div>
      </div>
      {groupId && (
        <PopoverWithTooltip
          toolTipProps={{ placement: 'top', content: transI18n('fcr_group_button_move_to') }}
          popoverProps={{
            placement: 'rightTop',
            content: <GroupPanel groupId={groupId} onChange={handleChange} />,
            overlayClassName: 'fcr-breakout-room__group__overlay',
          }}>
          <Button size="XXS" shape="rounded" type="secondary">
            <SvgImg type={SvgIconEnum.FCR_MOVETO} size={24} />
          </Button>
        </PopoverWithTooltip>
      )}
      {isSelected && <SvgImg size={12} type={SvgIconEnum.FCR_V2_CHOOSE} />}
    </div>
  );
};
