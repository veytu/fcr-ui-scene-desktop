import { ClassroomAiPeopleLayout } from "./layout";
import { observer } from "mobx-react";
import './index.css'
import { ClassroomLoading } from "../container/loading";

export const ClassroomAiPeople = observer(() => {
  return (
    <div className="ai-people-container">
      <ClassroomAiPeopleLayout></ClassroomAiPeopleLayout>
      <ClassroomLoading></ClassroomLoading>
    </div>
  );
});
