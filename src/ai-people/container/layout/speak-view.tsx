import { SpeakAiView } from "../stream-ai";
import { SpeakPeopleView } from "../stream-people";
import { ChatListView } from "../chat-list";
import { useStore } from '@ui-scene/ai-people/utils/hooks/use-store';
import { useEffect, useState } from "react";
import { observer } from "mobx-react";

export const SpeakView = observer(() => {
    const { rtcStore:{agentRtcUser} } = useStore();
    const [widthAiPercent,setWidthAiPercent]= useState<number>(36)
    const [heightAiPercent,setHeightAiPercent]= useState<number>(40)

    useEffect(() => {
        try {
            if (agentRtcUser?.videoTrack || false) {
                setTimeout(() => {
                    const data = agentRtcUser?.videoTrack?.getCurrentFrameData()
                    if (!!data?.width) {
                        //屏幕宽高
                        const { width, height } = document.body.getBoundingClientRect()
                        //显示区域的高度
                        const showAiHeight = height * (heightAiPercent / 100.0) - 40
                        //实际显示区域的宽度
                        const realShowAiWidth = data.width * 1.0 / data.height * showAiHeight
                        //初始化比例
                        setWidthAiPercent(realShowAiWidth / width * 100)
                    }
                }, 300);
            }else{
                setWidthAiPercent(36)
            }
        } finally { }
    }, [agentRtcUser?.videoTrack])
   
    return (
        <div style={{ width: 'calc(100% - 10px)', paddingBottom: '10px', flexGrow: 1, display: 'grid', gridTemplateColumns: `${widthAiPercent}% ${100 - widthAiPercent}%`, gridTemplateRows: `${heightAiPercent}% ${100 - heightAiPercent}%`, gridGap: '10px', minWidth: '861px', minHeight: '811px' }}>
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
});
