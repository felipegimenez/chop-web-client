// @flow
import serviceActor from '../../src/io/serviceActor';
import ChatActor from '../../src/io/chat';
import { mockFetch } from 'graphql.js';
import { mockLeaveChannel } from '../../src/io/graphQL';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reducer from '../../src/chop/dux';
import { defaultState, addChannel, changeChannel, togglePopUpModal } from '../../src/feed/dux';
import PopUpModal from '../../src/popUpModal';
import actorMiddleware from '../../src/middleware/actor-middleware';
import testData from './io/test-data.json';
import accessToken from './io/access-token.json';
import { mockPublish, mockUnsubscribe, __messageEvent } from 'pubnub';
import { mockDate } from '../testUtils';

jest.mock('../../src/io/location');
jest.mock('graphql.js');
jest.mock('../../src/io/graphQL');
jest.mock('pubnub');

Enzyme.configure({ adapter: new Adapter() });

describe('Test leave channel', () => {
  mockDate('Wed Jun 27 2018 16:53:06 GMT-0500');
  const message = {
    channelToken: 'test',
    messageText: 'Tony Hoare has left the chat',
    userId: 'abc123xyz',
    fromNickname: 'Tony Hoare',
    type: 'system',
    roomType: 'public',
    timestamp: '2018-06-27 21:53:6 +0000',
  };
  global.document.cookie  = 'legacy_token=12345; ';
  mockFetch.mockResolvedValueOnce(accessToken);
  mockFetch.mockResolvedValueOnce(testData);
  const actorMiddlewareApplied = actorMiddleware(
    serviceActor,
    ChatActor,
  );

  test('Remove channel and send pubnub notification', async () => {
    const participants = [
      {
        pubnubToken: 'abc123xyz',
        name: 'Tony Hoare',
        role: { label: '' },
      },
      {
        pubnubToken: '54353',
        name: 'Shaq O.',
        role: { label: '' },
      },
    ];
    const store = createStore(
      reducer,
      compose(
        applyMiddleware(actorMiddlewareApplied)
      )
    );

    // await for both stages of starting up application
    await await store.dispatch({ type: 'INIT' });

    store.dispatch(
      addChannel('test', 'test', participants)
    );
    store.dispatch(
      changeChannel('test')
    );
    store.dispatch(
      togglePopUpModal()
    );

    mockFetch.mockResolvedValueOnce(accessToken);

    const wrapper = Enzyme.mount(
      <Provider store={store}>
        <div>
          <PopUpModal />
        </div>
      </Provider>
    );

    wrapper.find('button').at(1).simulate('click');
    expect(mockPublish).toHaveBeenCalledTimes(1);
    expect(mockPublish.mock.calls[0][0]).toEqual(
      {
        channel: 'test',
        message: {
          action: 'newMessage',
          channel: 'test',
          data: message,
        },
      }
    );
    expect(mockUnsubscribe).toHaveBeenCalledTimes(1);
    expect(mockUnsubscribe).toHaveBeenCalledWith(
      {
        channels: ['test'],
      }
    );
    expect(Object.keys(store.getState().feed.channels).length).toEqual(4);
    expect(store.getState().feed.currentChannel).toEqual('');
    expect(mockLeaveChannel).toHaveBeenCalledTimes(1);
    expect(mockLeaveChannel).toHaveBeenCalledWith('test');
  });

  test('Receive leave channel and publish notification', () => {
    const store = {
      ...defaultState,
      currentUser: {
        id: '12234',
        pubnubToken: '54353',
        pubnubAccessKey: '09876',
        name: 'Shaq O.',
        role: {
          label: '',
          permissions: [],
        },
      },
      organization: {
        id: 2,
        name: 'Life.Church',
      },
      pubnubKeys: {
        publish: 'pub-c-1d485d00-14f5-4078-9ca7-19a6fe6411a7',
        subscribe: 'sub-c-1dc5ff9a-86b2-11e8-ba2a-d686872c68e7',
      },
      channels: {
        ...defaultState.channels,
        test: {
          name: 'test',
          id: 'test',
          moments: [],
          participants: [
            {
              pubnubToken: 'abc123xyz',
              name: 'Tony Hoare',
              role: { label: '' },
            },
            {
              pubnubToken: '54353',
              name: 'Shaq O.',
              role: { label: '' },
            },
          ],
        },
      },
    };

    const dispatch = jest.fn();
    const getState = jest.fn();
    getState.mockReturnValue(store);

    const chat = new ChatActor(dispatch, getState);

    chat.init();

    __messageEvent(
      {
        channel: 'test',
        message: {
          action: 'newMessage',
          channel: 'test',
          data: message,
        },
      }
    );

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[0][0]).toEqual(
      {
        type: 'LEAVE_CHANNEL',
        channel: 'test',
        pubnubToken: 'abc123xyz',
      }
    );
    // expect(dispatch.mock.calls[1][0]).toMatchObject(
    //   {
    //     type: 'PUBLISH_MOMENT_TO_CHANNEL',
    //     channel: 'test',
    //     moment: {
    //       type: 'NOTIFICATION',
    //       notificationType: 'LEFT_CHANNEL',
    //       id: expect.stringMatching(/^[a-z0-9]{8}-([a-z0-9]{4}-){3}[a-z0-9]{12}$/),
    //       name: 'Tony Hoare',
    //       timeStamp: '4:53pm',
    //     },
    //   }
    // );
  });
});