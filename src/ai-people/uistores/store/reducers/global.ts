import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IOptions, VoiceType, IChatItem, Language } from "../../../types/index"
import { setOptionsToLocal } from "../../../utils/storage"
import { COLOR_LIST, DEFAULT_OPTIONS } from "../../../utils/constant"

export interface InitialState {
  options: IOptions
  roomConnected: boolean,
  agentConnected: boolean,
  themeColor: string,
  language: Language
  voiceType: VoiceType
  chatItems: IChatItem[],
  graphName: string
}

const getInitialState = (): InitialState => {
  return {
    options: DEFAULT_OPTIONS,
    themeColor: COLOR_LIST[0].active,
    roomConnected: false,
    agentConnected: false,
    language: "en-US",
    voiceType: "male",
    chatItems: [],
    graphName: "camera.va.openai.azure"
  }
}

export const globalSlice = createSlice({
  name: "global",
  initialState: getInitialState(),
  reducers: {
    setOptions: (state, action: PayloadAction<Partial<IOptions>>) => {
      state.options = { ...state.options, ...action.payload }
      setOptionsToLocal(state.options)
    },
    setThemeColor: (state, action: PayloadAction<string>) => {
      state.themeColor = action.payload
      document.documentElement.style.setProperty('--theme-color', action.payload);
    },
    setRoomConnected: (state, action: PayloadAction<boolean>) => {
      state.roomConnected = action.payload
    },
    addChatItem: (state, action: PayloadAction<IChatItem>) => {
      state.chatItems = paramsChatData(state.chatItems, action.payload)
    },
    setAgentConnected: (state, action: PayloadAction<boolean>) => {
      state.agentConnected = action.payload
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload
    },
    setGraphName: (state, action: PayloadAction<string>) => {
      state.graphName = action.payload
    },
    setVoiceType: (state, action: PayloadAction<VoiceType>) => {
      state.voiceType = action.payload
    },
    reset: (state) => {
      Object.assign(state, getInitialState())
      document.documentElement.style.setProperty('--theme-color', COLOR_LIST[0].active);
    },
  },
})

export const { reset, setOptions,
  setRoomConnected, setAgentConnected, setVoiceType,
  addChatItem, setThemeColor, setLanguage, setGraphName } =
  globalSlice.actions

export default globalSlice.reducer
//格式化聊天数据
export function paramsChatData(chatItems: IChatItem[], payload: IChatItem):IChatItem[] {
  const { userId, text, isFinal, type, time } = payload
  const LastFinalIndex = chatItems.findLastIndex((el) => {
    return el.userId == userId && el.isFinal
  })
  const LastNonFinalIndex = chatItems.findLastIndex((el) => {
    return el.userId == userId && !el.isFinal
  })
  const LastFinalItem = chatItems[LastFinalIndex]
  const LastNonFinalItem = chatItems[LastNonFinalIndex]
  if (LastFinalItem) {
    // has last final Item
    if (time <= LastFinalItem.time) {
      // discard
      console.log("[test] addChatItem, time < last final item, discard!:", text, isFinal, type)
      return []
    } else {
      if (LastNonFinalItem) {
        console.log("[test] addChatItem, update last item(none final):", text, isFinal, type)
        chatItems[LastNonFinalIndex] = payload
      } else {
        console.log("[test] addChatItem, add new item:", text, isFinal, type)
        chatItems.push(payload)
      }
    }
  } else {
    // no last final Item
    if (LastNonFinalItem) {
      console.log("[test] addChatItem, update last item(none final):", text, isFinal, type)
      chatItems[LastNonFinalIndex] = payload
    } else {
      console.log("[test] addChatItem, add new item:", text, isFinal, type)
      chatItems.push(payload)
    }
  }
  return chatItems.sort((a, b) => a.time - b.time)
}