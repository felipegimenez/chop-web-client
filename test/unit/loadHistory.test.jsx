// @flow
import Chat from '../../src/io/chat';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import reducer, { defaultState } from '../../src/feed/dux';
import { mockHistory } from 'pubnub';
import { createStore } from 'redux';

jest.mock('pubnub');

Enzyme.configure({ adapter: new Adapter() });

describe('Load history', () => {
  const history = [
    {
      entry: {
        action: 'newMessage',
        channel: '123456',
        data: {
          channelToken: '123456',
          eventStartTime: 1536847200,
          eventTimeId: 1001,
          eventTimeOffset: '1538424243602',
          eventTitle: 'Mastermind',
          fromAvatar: 'https://chop-v3-media.s3.amazonaws.com/users/avatars/1022905/thumb/photo.jpg',
          fromNickname: 'G. Boole',
          fromToken: 'f2211608e7c78001db3a7674dc4d98194586e491fd0e117709b4d8df607c9a3c',
          isHost: true,
          isUser: true,
          isVolunteer: true,
          label: 'Admin',
          language: 'en',
          messageText: 'Hello',
          msgId: '16e434d2-7d53-4b64-b2d7-b61bd91a433b',
          organizationId: 3,
          organizationName: 'Freedom Church',
          roomType: 'public',
          timestamp: '2018-10-19 14:58:10 +0000',
          translations: [
            {
              languageCode: 'en',
              text: 'Hello',
            },
          ],
          uniqueMessageToken: '16e434d2-7d53-4b64-b2d7-b61bd91a433b',
        },
      },
    },
    {
      entry: {
        action: 'newMessage',
        channel: '123456',
        data: {
          channelToken: '123456',
          eventStartTime: 1536847200,
          eventTimeId: 1001,
          eventTimeOffset: '1538424243602',
          eventTitle: 'Mastermind',
          fromAvatar: 'https://chop-v3-media.s3.amazonaws.com/users/avatars/1022905/thumb/photo.jpg',
          fromNickname: 'G. Boole',
          fromToken: 'f2211608e7c78001db3a7674dc4d98194586e491fd0e117709b4d8df607c9a3c',
          isHost: true,
          isUser: true,
          isVolunteer: true,
          label: 'Admin',
          language: 'en',
          messageText: 'hello',
          msgId: '16e434d2-7d53-4b64-b2d7-b61bd91a433c',
          organizationId: 3,
          organizationName: 'Freedom Church',
          roomType: 'public',
          timestamp: '2018-10-19 14:58:10 +0000',
          translations: [
            {
              languageCode: 'en',
              text: 'hello',
            },
          ],
          uniqueMessageToken: '16e434d2-7d53-4b64-b2d7-b61bd91a433c',
        },
      },
    },
    {
      entry: {
        action: 'muteMessage',
        channel: '123456',
        data: {
          channelToken: '123456',
          umt: '16e434d2-7d53-4b64-b2d7-b61bd91a433c',
        },
      },
    },
  ];

  test('History is called', () => {
    const store = {
      ...defaultState,
      currentUser: {
        id: 134,
        name: 'Kylo Ren',
        avatar: 'http://someimageons3.com/image/123',
        role: {
          label: 'Supreme Leader of the First Order',
          permissions: ['event.event.manage'],
        },
        pubnubToken: '123456',
        pubnubAccessKey: '1533912921585',
        preferences: {
          textMode: 'COMPACT',
        },
      },
      organization: {
        id: 2,
        name: 'Life.Church',
        logoUrl: '',
      },
      pubnubKeys: {
        publish: 'pub-c-1d485d00-14f5-4078-9ca7-19a6fe6411a7',
        subscribe: 'sub-c-1dc5ff9a-86b2-11e8-ba2a-d686872c68e7',
      },
      channels: {
        ...defaultState.channels,
        '123456': {
          name: 'public',
          id: '123456',
          direct: false,
          moments: [],
          anchorMoments: [],
          scrollPosition: 0,
          sawLastMomentAt: 1546896104521,
        },
        '789012': {
          name: 'Host',
          id: '789012',
          direct: false,
          moments: [],
          anchorMoments: [],
          scrollPosition: 0,
          sawLastMomentAt: 1546896104521,
        },
      },
    };

    const dispatch = jest.fn();
    const getState = jest.fn();
    getState.mockReturnValue(store);

    const chat = new Chat(dispatch, getState);
    chat.init();

    // TODO: This should dispatch addChannel and verify that loadHistory was called
    expect(mockHistory).toHaveBeenCalledTimes(0);
  });

  test('Load history adds moments to the channel', () => {
    const store = createStore(
      reducer,
      {
        ...defaultState,
        currentUser: {
          id: 134,
          name: 'Kylo Ren',
          avatar: 'http://someimageons3.com/image/123',
          role: {
            label: 'Supreme Leader of the First Order',
            permissions: ['event.event.manage'],
          },
          pubnubToken: '123456',
          pubnubAccessKey: '1533912921585',
        },
        organization: {
          id: 2,
          name: 'Life.Church',
          logoUrl: '',
        },
        pubnubKeys: {
          publish: 'pub-c-1d485d00-14f5-4078-9ca7-19a6fe6411a7',
          subscribe: 'sub-c-1dc5ff9a-86b2-11e8-ba2a-d686872c68e7',
        },
        channels: {
          ...defaultState.channels,
          '123456': {
            name: 'public',
            id: '123456',
            moments: [],
          },
          '789012': {
            name: 'Host',
            id: '789012',
            moments: [],
          },
        },
      }
    );

    const chat = new Chat(store.dispatch, store.getState);
    chat.loadHistory(history, '123456');

    expect(store.getState().channels['123456'].moments.length).toBe(1);
    expect(store.getState().channels['123456'].moments).toEqual([
      {
        type: 'MESSAGE',
        id: '16e434d2-7d53-4b64-b2d7-b61bd91a433b',
        timestamp: 1539961090000,
        lang: 'en',
        text: 'Hello',
        messageTrayOpen: false,
        isMuted: false,
        translations: [
          {
            languageCode: 'en',
            text: 'Hello',
          },
        ],
        sender:
        {
          id: 0,
          name: 'G. Boole',
          avatar: 'https://chop-v3-media.s3.amazonaws.com/users/avatars/1022905/thumb/photo.jpg',
          pubnubToken: 'f2211608e7c78001db3a7674dc4d98194586e491fd0e117709b4d8df607c9a3c',
          role: {
            label: 'Admin',
          },
        },
      },
    ]);
  });
});
