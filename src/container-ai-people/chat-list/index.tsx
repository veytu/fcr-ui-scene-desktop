import { SvgIconEnum, SvgImg } from "@components/svg-img";
import './index.css'
import { makeStore } from "../stream-people/store";
import { useRef } from "react";
import { setLanguage, setGraphName } from "../stream-people/store/reducers/global";
import { useAutoScroll } from "../stream-people/common/hooks";
import ChatItem from "./chatItem";
import { IChatItem } from "@ui-scene/container-ai-people/stream-people/types"

export const ChatListView = () => {
    const dispatch = makeStore().dispatch

    // todo 当前是测试数据
    const state = makeStore().getState()
    const chatItems = [{
        userId: 1,
        userName: "测试",
        text: "I’m right here with you, ready to chat! It’s like having a friend by your side, no matter where you are. What would you like to talk about？",
        type: "agent",
        isFinal: true,
        time: 30000
    } as IChatItem,{
        userId: 1,
        userName: "You",
        text: "what is your name？",
        type: "user",
        isFinal: true,
        time: 30000
    } as IChatItem,{
        userId: 1,
        userName: "测试",
        text: "I’m right here with you, ready to chat! It’s like having a friend by your side, no matter where you are. What would you like to talk about？",
        type: "agent",
        isFinal: true,
        time: 30000
    } as IChatItem,{
        userId: 1,
        userName: "You",
        text: "Please, you get me something wrong? Oh, oh, it's like a toast. So small.",
        type: "user",
        isFinal: true,
        time: 30000
    } as IChatItem,{
        userId: 1,
        userName: "测试",
        text: "It seems like there might have been a misunderstanding. Are you referring to something that feels too small or not quite right, like a portion of food or maybe an item? If you could share a bit more detail, I’d love to help clarify things for you!",
        type: "agent",
        isFinal: true,
        time: 30000
    } as IChatItem]; state.global.chatItems

    // const chatItems = genRandomChatList(10)
    const chatRef = useRef(null)
    useAutoScroll(chatRef)

    const onLanguageChange = (val: any) => {
        dispatch(setLanguage(val))
    }

    const onGraphNameChange = (val: any) => {
        dispatch(setGraphName(val))
    }

    return (
        <div className="chat-list-container">
            {(!chatItems || chatItems.length === 0) && <div className="empty">
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
                {chatItems.map((item, index) => {
                    return <ChatItem data={item} key={index} ></ChatItem>
                })}
            </div>
        </div>
    );
};
