import { SvgImg, SvgIconEnum } from '@components/svg-img'
import './index.css'
import { IChatItem } from '@ui-scene/ai-people/types'

interface ChatItemProps {
  data: IChatItem
}

const AgentChatItem = (props: ChatItemProps) => {
  const { data } = props
  const { text } = data
  return <div className='chat-item-container'>
    <div>
      <SvgImg
        className="chat-item-header chat-item-header-agent"
        size={28}
        type={SvgIconEnum.FCR_CHAT_LIST_AGENT}></SvgImg>
    </div>
    <div className='chat-item-content chat-item-content-agent'>
      {text}
    </div>
  </div >
}
const UserChatItem = (props: ChatItemProps) => {
  const { data } = props
  const { text,userName } = data
  return <div className='chat-item-container'>
    <div className='chat-item-header chat-item-header-user'>
      You
    </div>
    <div className='chat-item-content chat-item-content-user'>
      {text}
    </div>
  </div >
}


const ChatItem = (props: ChatItemProps) => {
  const { data } = props
  return (
    data.type === "agent" ? <AgentChatItem {...props} /> : <UserChatItem {...props} />
  );
}

export default ChatItem
