// @flow
import {
  getCurrentChannel,
  getPublicChannelObject as publicChannel,
  getHostChannelObject as hostChannel,
  getDirectChannels as directChannels,
} from '../selectors/channelSelectors';
import { createSelector } from 'reselect';
import { paneContentSelector } from '../selectors/paneSelectors';
import { PRIMARY_PANE } from '../pane/dux';
import { TAB } from '../pane/content/tab/dux';
import { EVENT } from '../pane/content/event/dux';
import { CHAT } from '../pane/content/chat/dux';
import type { TabTypeType } from '../pane/content/tab/dux';

// Action Types
const SET_NAVBAR_INDEX = 'SET_NAVBAR_INDEX';

// Flow Type Definitions

type NavbarItemType = {
  name: string,
  id: string,
  isCurrent: boolean,
  hasActions: boolean,
  otherUsersNames: Array<string>,
  isDirect: boolean,
  type: typeof EVENT | typeof CHAT | typeof TAB,
  tabType?: TabTypeType,
};

type SetNavbarIndexType = {
  type: 'SET_NAVBAR_INDEX',
  index: number,
};

// Action Creators

const setNavbarIndex = (index:number):SetNavbarIndexType => (
  {
    type: SET_NAVBAR_INDEX,
    index,
  }
);

// Selectors

const getOtherUserNames = (channel, currentUser) => {
  const { participants } = channel;
  if (participants && participants.length) {
    return participants
      .filter(user => user.pubnubToken !== currentUser.pubnubToken)
      .map(user => user.name);
  } else {
    return [];
  }
};

// eslint is dumb when it comes to optional chaining
const hasAction = channel => channel && channel.moments && channel.moments.filter ?
  channel.moments.filter(moment => ( // eslint-disable-line no-undef
    moment.type === 'ACTIONABLE_NOTIFICATION' &&
    moment.active === true)).length > 0
  : undefined;

const getCurrentUser = state => state.currentUser;

const createNavChannel = (channel, currentChannel, currentUser) => (
  {
    name: channel.name,
    id: channel.id,
    isCurrent: currentChannel === channel.id,
    hasActions: hasAction(channel),
    otherUsersNames: getOtherUserNames(channel, currentUser),
    isDirect: channel.direct,
    type: channel.name === 'Public' ? EVENT : CHAT,
  }
);

const getPublicChannel = createSelector(
  state => publicChannel(state) || { name: 'Public', id: 'event', moments: [], direct: false },
  getCurrentChannel,
  getCurrentUser,
  createNavChannel
);

const getHostChannel = createSelector(
  state => hostChannel(state) || { name: 'Host', id: 'host', moments: [], direct: false },
  getCurrentChannel,
  getCurrentUser,
  createNavChannel
);

const getDirectChannels = createSelector(
  directChannels,
  getCurrentChannel,
  getCurrentUser,
  (channels, currentChannel, currentUser) =>
    Object.keys(channels).map(id => createNavChannel(channels[id], currentChannel, currentUser))
);

const getTabs = createSelector(
  state => state.tabs,
  state => paneContentSelector(state, PRIMARY_PANE),
  (tabs, currentPane) =>
    tabs.map(tab => ({
      name: tab.name,
      id: tab.id,
      isCurrent: currentPane.type === TAB && currentPane.content.type === tab.type,
      hasActions: false,
      otherUsersNames: [],
      isDirect: false,
      type: TAB,
      tabType: tab.type,
    }))
);

// Exports

export {
  getHostChannel,
  getPublicChannel,
  getDirectChannels,
  getTabs,
  setNavbarIndex,
  SET_NAVBAR_INDEX,
};

export type {
  NavbarItemType,
  SetNavbarIndexType,
};