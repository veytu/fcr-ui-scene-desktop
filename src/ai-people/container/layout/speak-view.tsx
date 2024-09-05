import { SpeakAiView } from "../stream-ai";
import { SpeakPeopleView } from "../stream-people";
import { ChatListView } from "../chat-list";

export const SpeakView = () => {
    return (
        <div style={{ width: 'calc(100% - 10px)', paddingBottom: '10px', flexGrow: 1, display: 'grid', gridTemplateColumns: '36% 64%', gridTemplateRows: '40% 60%', gridGap: '10px', minWidth: '861px', minHeight: '811px' }}>
            <div style={{ maxWidth: '750px' }}>
                <SpeakAiView></SpeakAiView>
            </div>
            <div style={{ gridArea: 'span 2', }}>
                <ChatListView></ChatListView>
            </div>
            <div style={{ maxWidth: '750px' }}>
                <SpeakPeopleView></SpeakPeopleView>
            </div>

        </div>
    );
};
