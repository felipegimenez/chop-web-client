// @flow
import type { SharedUserType } from '../../users/dux';
import type { PublishMomentToChannelType } from '../dux';
import { PUBLISH_MOMENT_TO_CHANNEL } from '../dux';
import {createUid, newTimestamp} from '../../util';
import type {
  UIDType,
  DateTimeType,
  System,
  MomentNameType,
  LanguageType,
} from '../../cwc-types';

// Action Types

const TOGGLE_MESSAGE_TRAY = 'TOGGLE_MESSAGE_TRAY';
const DELETE_MESSAGE = 'DELETE_MESSAGE';
const MESSAGE = 'MESSAGE';
const RECEIVE_MUTE_USER = 'RECEIVE_MUTE_USER';
const PUBLISH_MUTE_USER = 'PUBLISH_MUTE_USER';
const MUTE_USER_FAILED = 'MUTE_USER_FAILED';
const DIRECT_CHAT = 'DIRECT_CHAT';
const MUTE_USER_SUCCEEDED = 'MUTE_USER_SUCCEEDED';
const DIRECT_CHAT_FAILED = 'DIRECT_CHAT_FAILED';
const PUBLISH_DELETE_MESSAGE = 'PUBLISH_DELETE_MESSAGE';

// Flow Type Definitions

type SenderType = System | SharedUserType;

type BaseMomentType<T: MomentNameType, S: SenderType> = {
  id: UIDType,
  timestamp: DateTimeType,
  sender: S,
  type: T,
};

type MessageType = {
  lang: LanguageType,
  text: string,
  messageTrayOpen: boolean,
  isMuted: boolean,
} & BaseMomentType<typeof MESSAGE, SharedUserType>;

type ToggleMessageTrayType = {
  type: 'TOGGLE_MESSAGE_TRAY',
  channel: string,
  id: string,
};

type DeleteMessageType = {
  type: 'DELETE_MESSAGE',
  id: string,
  channel: string,
};

type ReceiveMuteUserType = {
  type: 'RECEIVE_MUTE_USER',
  nickname: string,
};

type PublishMuteUserType = {
  type: 'PUBLISH_MUTE_USER',
  channelId: string,
  userName: string,
};

type PublishDeleteMessageType = {
  type: 'PUBLISH_DELETE_MESSAGE',
  id: string,
};

type PublishDirectChatType = {
  type: typeof DIRECT_CHAT,
  otherUserPubnubToken: string,
  otherUserNickname: string,
};

// Action Creators

const newMessage = (
  text: string,
  sender: SharedUserType,
  lang: LanguageType
): MessageType => (
  {
    type: MESSAGE,
    id: createUid(),
    timestamp: newTimestamp(),
    lang,
    text,
    sender,
    messageTrayOpen: false,
    isMuted: false,
  }
);

const publishMessage = (
  channel: string,
  text: string,
  user: SharedUserType,
  language: string,
): PublishMomentToChannelType => (
  {
    type: PUBLISH_MOMENT_TO_CHANNEL,
    channel,
    moment: newMessage(text, user, language),
  }
);

const toggleMessageTray = (channel: string, id: string): ToggleMessageTrayType => (
  {
    type: TOGGLE_MESSAGE_TRAY,
    channel,
    id,
  }
);

const deleteMessage = (id:string, channel:string): DeleteMessageType => (
  {
    type: DELETE_MESSAGE,
    id,
    channel,
  }
);

const publishDeleteMessage = (id:string): PublishDeleteMessageType => (
  {
    type: PUBLISH_DELETE_MESSAGE,
    id,
  }
);

const receiveMuteUser = (nickname:string): ReceiveMuteUserType => (
  {
    type: RECEIVE_MUTE_USER,
    nickname,
  }
);

const publishMuteUser = (channelId:string, userName:string): PublishMuteUserType => (
  {
    type: PUBLISH_MUTE_USER,
    channelId,
    userName,
  }
);

const directChat = (otherUserPubnubToken: string, otherUserNickname: string): PublishDirectChatType => (
  {
    type: DIRECT_CHAT,
    otherUserPubnubToken,
    otherUserNickname,
  }
);

// Exports

export {
  TOGGLE_MESSAGE_TRAY,
  DELETE_MESSAGE,
  MESSAGE,
  MUTE_USER_SUCCEEDED,
  MUTE_USER_FAILED,
  PUBLISH_MUTE_USER,
  RECEIVE_MUTE_USER,
  DIRECT_CHAT,
  DIRECT_CHAT_FAILED,
  PUBLISH_DELETE_MESSAGE,
};

export {
  toggleMessageTray,
  deleteMessage,
  publishMessage,
  publishDeleteMessage,
  publishMuteUser,
  receiveMuteUser,
  directChat,
  newMessage,
};

export type {
  MessageType,
  ToggleMessageTrayType,
  DeleteMessageType,
  PublishMuteUserType,
  ReceiveMuteUserType,
  PublishDeleteMessageType,
  PublishDirectChatType,
};
