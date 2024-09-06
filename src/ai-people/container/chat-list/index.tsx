import { SvgIconEnum, SvgImg } from "@components/svg-img";
import './index.css'
import { useEffect, useRef, useState } from "react";
import { useAutoScroll } from "../../utils/hooks";
import ChatItem from "./chatItem";
import { observer } from "mobx-react";
import { IChatItem } from "@ui-scene/ai-people/types";
import { useStore } from "@ui-scene/ai-people/utils/hooks/use-store";

export const ChatListView = observer(() => {
    const { rtcStore: { chatItems } } = useStore();
    const [showItems, setShowItems] = useState<IChatItem[]>([])
    useEffect(() => {
        if (chatItems) {
            setShowItems(chatItems);
            if (chatItems.length > 0 && chatRef && chatRef.current) {
                //@ts-ignore
                chatRef.current.scrollTop = chatRef.current.scrollHeight;
            }
        }
    }, [chatItems])
    const chatRef = useRef(null)
    useAutoScroll(chatRef)
    return (
        <div className="chat-list-container">
            {(!showItems || showItems.length === 0) && <div className="empty">
                <div className="icon-container">
                    <SvgImg
                        className="item"
                        size={36}
                        type={SvgIconEnum.FCR_CHAT_LIST_EMPTY}></SvgImg>
                    <SvgImg
                        className="item"
                        size={36}
                        type={SvgIconEnum.FCR_CHAT_LIST_EMPTY}></SvgImg>
                    <SvgImg
                        className="item"
                        size={36}
                        type={SvgIconEnum.FCR_CHAT_LIST_EMPTY}></SvgImg>
                </div>
                <div>Chat with agent</div>
            </div>}
            <div className="chat-list-content" ref={chatRef}>
                {showItems.map((item, index) => {
                    return <ChatItem data={item} key={index} ></ChatItem>
                })}
            </div>
        </div>
    );
})