import { CoverView } from '@ui-scene/container-ai-people/layout/cover-view';
import { SpeakView } from '@ui-scene/container-ai-people/layout/speak-view';
import { AskHelpList } from '@ui-scene/containers/breakout-room/ask-help-list';
import { GroupInfoPanel } from '@ui-scene/containers/breakout-room/group-info-panel';
import { GroupStatusPanel } from '@ui-scene/containers/breakout-room/group-status-panel';
import { GalleryView } from '@ui-scene/containers/layout/gallery-view';
import { PresentationView } from '@ui-scene/containers/layout/presentation-view';
import { WidgetContainer } from '@ui-scene/containers/widget';
import { Layout } from '@ui-scene/uistores/type';
import { useStore } from '@ui-scene/utils/hooks/use-store';
import { ZIndexContext } from '@ui-scene/utils/hooks/use-z-index';
import { ZIndexController } from '@ui-scene/utils/z-index-controller';
import { observer } from 'mobx-react';
import { useEffect, useRef } from 'react';
import './index.css'
export const ClassroomLayout = observer(() => {
  const {
    layoutUIStore: { layout, setLayoutReady },
  } = useStore();
  const zIndexControllerRef = useRef(new ZIndexController());
  useEffect(() => {
    setLayoutReady(true);
  }, []);
  return (
    <ZIndexContext.Provider value={zIndexControllerRef.current}>
      <>
        {layout === Layout.Grid ? (
          <GalleryView></GalleryView>
        ) : (
          <PresentationView></PresentationView>
        )}
        <CoverView></CoverView>
        <WidgetContainer />
        <GroupInfoPanel />
        <GroupStatusPanel />
        <AskHelpList />
      </>
    </ZIndexContext.Provider>
  );
});
export const ClassroomAiPeopleLayout = observer(() => {
  const {
    layoutUIStore: { layout, setLayoutReady },
  } = useStore();
  const zIndexControllerRef = useRef(new ZIndexController());
  useEffect(() => {
    setLayoutReady(true);
  }, []);
  return (
    <ZIndexContext.Provider value={zIndexControllerRef.current} >
      <div className='ai-people-container'>
      <CoverView></CoverView>
      <SpeakView></SpeakView>
      </div>
    </ZIndexContext.Provider>
  );
});
