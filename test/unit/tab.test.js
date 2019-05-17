// @flow
import { createStore } from 'redux';
import reducer from '../../src/chop/dux';
import { defaultState } from '../../src/feed/dux';
import { addTab, removeTab, setPaneToTab, TAB } from '../../src/pane/content/tab/dux';
import { HOST_INFO } from '../../src/hostInfo/dux';
import {EVENT} from '../../src/pane/content/event/dux';
import { mockDate } from '../testUtils';

describe('Tab tests', () => {
  test('Pane can be set to tab', () => {
    mockDate(1546896104521);
    const store = createStore(
      reducer,
      {
        feed: {
          ...defaultState,
          panes: {
            primary: {
              type: 'CHAT',
              content: {
                channelId: 'Public',
              },
            },
          },
        },
      }
    );

    store.dispatch(
      setPaneToTab('primary', HOST_INFO)
    );

    const { lastAction, ...result } = store.getState().feed; // eslint-disable-line no-unused-vars

    expect(result).toEqual(
      {
        ...defaultState,
        channels: {
          Public: {
            sawLastMomentAt: 1546896104521,
          },
        },
        panes: {
          primary: {
            type: TAB,
            content: {
              type: HOST_INFO,
            },
          },
        },
      }
    );
  });

  test('Tab can be added to state.', () => {
    const store = createStore(
      reducer,
      {
        feed: defaultState,
      }
    );

    store.dispatch(
      addTab(HOST_INFO, 'hostInfo', 'Host Info')
    );

    const { lastAction, ...result } = store.getState().feed; // eslint-disable-line no-unused-vars

    expect(result).toEqual(
      {
        ...defaultState,
        tabs: [
          {
            type: HOST_INFO,
            id: 'hostInfo',
            name: 'Host Info',
          },
        ],
      }
    );
  });

  test('Duplicate tabs are not added.', () => {
    const store = createStore(
      reducer,
      {
        feed: {
          ...defaultState,
          tabs: [
            {
              type: HOST_INFO,
              id: 'hostInfo',
              name: 'Host Info',
            },
          ],
        },
      }
    );

    store.dispatch(
      addTab(HOST_INFO, 'hostInfo', 'Host Info')
    );

    const { lastAction, ...result } = store.getState().feed; // eslint-disable-line no-unused-vars

    expect(result).toEqual(
      {
        ...defaultState,
        tabs: [
          {
            type: HOST_INFO,
            id: 'hostInfo',
            name: 'Host Info',
          },
        ],
      }
    );
  });


  test('Tab can be removed from state.', () => {
    const store = createStore(
      reducer,
      {
        feed: {
          ...defaultState,
          tabs: [
            {
              type: HOST_INFO,
              name: 'Host Info',
            },
          ],
          channels: {
            public: {
              id: 'public',
              name: 'Public',
              moments: [],
              anchorMoments: [],
              participants: [],
              scrollPosition: 0,
            },
          },
        },
      }
    );

    store.dispatch(
      removeTab(HOST_INFO)
    );

    const { lastAction, ...result } = store.getState().feed; // eslint-disable-line no-unused-vars

    expect(result).toEqual(
      {
        ...defaultState,
        channels: {
          public: {
            id: 'public',
            name: 'Public',
            moments: [],
            anchorMoments: [],
            participants: [],
            scrollPosition: 0,
          },
        },
        panes: {
          primary: {
            type: EVENT,
            content: {
              channelId: 'public',
            },
          },
        },
      }
    );
  });
});
