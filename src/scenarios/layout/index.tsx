import { CoverView } from '@onlineclass/containers/layout/cover-view';
import { GalleryView } from '@onlineclass/containers/layout/gallery-view';
import { PresentationView } from '@onlineclass/containers/layout/presentation-view';
import { Layout } from '@onlineclass/uistores/type';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
export const ClassroomLayout = observer(() => {
  const {
    layoutUIStore: { layout },
  } = useStore();
  return (
    <>
      <CoverView></CoverView>
      {layout === Layout.Grid ? <GalleryView></GalleryView> : <PresentationView></PresentationView>}
    </>
  );
});
