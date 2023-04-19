import { Layout } from '@onlineclass/uistores/type';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import './index.css';
import { StreamWindow } from '../window';
import { convertStreamUIStatus, StreamWindowContext } from '../window/context';
import { FC, PropsWithChildren, useEffect } from 'react';
import { ListViewFloatPagination } from '@components/pagination';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { CSSTransition } from 'react-transition-group';
export const PresentationView = observer(() => {
  const {
    streamUIStore: { subscribeMass },
    layoutUIStore: { layout },
    presentationUIStore: {
      mainViewStream,
      listViewStreamsByPage,
      totalPage,
      currentPage,
      setCurrentPage,
      showPager,
      showListView,
    },
  } = useStore();
  useEffect(() => {
    const mainViewStreamList = mainViewStream ? [mainViewStream] : [];
    subscribeMass(listViewStreamsByPage.concat(mainViewStreamList).map((stream) => stream.stream));
  }, [listViewStreamsByPage, mainViewStream]);
  const direction =
    layout === Layout.ListOnTop ? 'row' : layout === Layout.ListOnRight ? 'col' : 'row';
  return (
    <div className={classnames(`fcr-layout-content-${layout}`)}>
      <CSSTransition timeout={200} in={showListView} classNames={'fcr-layout-content-list-view'}>
        <div className={classnames(`fcr-layout-content-list-view`)}>
          <div
            className={classnames(
              `fcr-layout-content-video-list`,
              `fcr-layout-content-video-list-${direction}`,
            )}>
            {showPager && (
              <ListViewFloatPagination
                onChange={setCurrentPage}
                direction={direction}
                total={totalPage}
                current={currentPage}></ListViewFloatPagination>
            )}

            {listViewStreamsByPage.map((stream) => {
              const sideStreamSize = { width: 192, height: 114 };

              return (
                <div key={stream.stream.streamUuid} style={{ ...sideStreamSize }}>
                  <StreamWindowContext.Provider
                    value={convertStreamUIStatus(stream, 'list-view', layout, false)}>
                    <StreamWindow></StreamWindow>
                  </StreamWindowContext.Provider>
                </div>
              );
            })}
          </div>
          <ListViewCollapseButton></ListViewCollapseButton>
        </div>
      </CSSTransition>

      <div className={classnames(`fcr-layout-content-main-view`)}>
        {mainViewStream ? (
          <StreamWindowContext.Provider
            value={convertStreamUIStatus(mainViewStream, 'main-view', layout, false)}>
            <StreamWindow></StreamWindow>
          </StreamWindowContext.Provider>
        ) : null}
        <BoardViewContainer></BoardViewContainer>
      </div>
    </div>
  );
});
const ListViewCollapseButton = observer(() => {
  const {
    layoutUIStore: { layout },
    presentationUIStore: { toggleShowListView, showListView },
  } = useStore();
  const direction =
    layout === Layout.ListOnTop ? 'row' : layout === Layout.ListOnRight ? 'col' : 'row';
  return (
    <div
      onClick={toggleShowListView}
      className={classnames(
        'fcr-layout-content-list-view-collapse-button',
        `fcr-layout-content-list-view-collapse-button-${direction}`,
        { 'fcr-layout-content-list-view-collapse-button-collapsed': !showListView },
      )}>
      <SvgImg type={SvgIconEnum.FCR_RIGHT2} size={48}></SvgImg>
    </div>
  );
});
const BoardViewContainer: FC<PropsWithChildren> = observer(() => {
  const {
    layoutUIStore: { showActiobBar, showStatusBar, layout },
    presentationUIStore: { addBoardViewportResizeObserver, boardViewportSize, showListView },
  } = useStore();
  useEffect(() => {
    const observer = addBoardViewportResizeObserver();
    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <div
      className={classnames('fcr-layout-board-container', {
        'fcr-layout-board-container-with-action-bar': showActiobBar,
        'fcr-layout-board-container-with-status-bar':
          showStatusBar && (layout !== Layout.ListOnTop || !showListView),
      })}>
      <div className={classnames('fcr-layout-board-viewport')}>
        <div style={{ ...boardViewportSize }} className="fcr-layout-board-view" />
      </div>
    </div>
  );
});
