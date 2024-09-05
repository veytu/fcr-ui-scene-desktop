import { CoverView } from "@ui-scene/ai-people/container/layout/cover-view";
import { SpeakView } from "@ui-scene/ai-people/container/layout/speak-view";
import { useStore } from "@ui-scene/ai-people/utils/hooks/use-store";
import { ZIndexContext } from "@ui-scene/utils/hooks/use-z-index";
import { ZIndexController } from "@ui-scene/utils/z-index-controller";
import { observer } from "mobx-react";
import { useEffect, useRef } from "react";
import './index.css'

export const ClassroomAiPeopleLayout = observer(() => {
  const { init } = useStore();
  useEffect(() => { init() }, [])
  const zIndexControllerRef = useRef(new ZIndexController());
  return (
    <ZIndexContext.Provider value={zIndexControllerRef.current} >
      <div className='ai-people-container-content'>
      <CoverView></CoverView>
      <SpeakView></SpeakView>
      </div>
    </ZIndexContext.Provider>
  );
});
