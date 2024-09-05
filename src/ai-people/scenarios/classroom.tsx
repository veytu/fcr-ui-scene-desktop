import { ClassroomLoading } from "@ui-scene/containers/loading";
import { ClassroomAiPeopleLayout } from "./layout";
import { observer } from "mobx-react";
import './index.css'

export const ClassroomAiPeople = observer(() => {
  return (
    <div className="ai-people-container">
      <ClassroomAiPeopleLayout></ClassroomAiPeopleLayout>
      <ClassroomLoading></ClassroomLoading>
    </div>
  );
});
