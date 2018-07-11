// @flow
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import Chop from './chop';
import reducer from './chop/dux';
import thunk from 'redux-thunk';
import {setStore} from './io/chat';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(thunk)
  )
);

setStore(store);

const content = document.getElementById('content');

if (content) {
  ReactDOM.render(
    <Provider store={store}>
      <Chop />
    </Provider>,
    content);
}

if (document.body) {
  document.body.addEventListener('touchstart', (event: Event) => {
    const targetElement = event.target;
    if (
      !(targetElement instanceof HTMLInputElement ||
      targetElement instanceof HTMLAnchorElement ||
      targetElement instanceof HTMLButtonElement)
    ) {
      if (document.activeElement) {
        document.activeElement.blur();
      }
    }
  });
}

// All this is a hacety Hack to get chat working before 
// Our services are ready, enjoy
store.dispatch(
  {
    type: 'SET_VIDEO_URL',
    url: 
`https://www.youtube.com/embed/bz2kN31m_S0?
rel=0&
autoplay=1&
fs=0&
playsinline=1`,
  }
);

store.dispatch(
  {
    type: 'SET_CHAT_KEYS',
    publishKey: 'pub-c-09e2a65a-062e-46ae-a169-34368baf04ca',
    subscribeKey: 'sub-c-a0ba8ad8-5854-11e8-8e44-e61bc5f8fbda',
  }
);

const characters = [
  'George Jettson',
  'Judy Jettson',
  'Jane Jettson',
  'Astro',
  'Elroy Jettson',
  'Rosie',
  'Orbitty',
  'Cosmo Spacely',
  'Fred Flintstone',
  'Wilma Flintstone',
  'Pebbles FlintStone',
  'Barney Rubble',
  'Betty Rubble',
  'Bamm-Bamm Rubble',
  'Mr. Slate',
  'Dino',
  'Yogi Bear',
  'Boo Boo Bear',
  'Ranger Smith',
  'Atom Ant',
  'Snagglepuss',
  'Dick Dastardly',
  'Penelope Pitstop',
  'Space Ghost',
  'Huckleberry Hound',
  'Bobby G.',
  'Craig G.',
  'Sam R.',
  'Jerry H.',
];

const characterName = characters[Math.floor(Math.random() * characters.length)];

store.dispatch(
  {
    type: 'SET_USER',
    id: new Date().getTime().toString(),
    nickname: characterName,
  }
);

setTimeout(() => {
  store.dispatch(
    {
      type: 'ADD_CHANNEL',
      channel: {
        id: 'public',
        name: 'public',
      },
    }
  );

  store.dispatch(
    {
      type: 'ADD_CHANNEL',
      channel: {
        id: 'host',
        name: 'host',
      },
    }
  );

  store.dispatch(
    {
      type: 'ADD_CHANNEL',
      channel: {
        id: 'request',
        name: 'request',
      },
    }
  );

  store.dispatch(
    {
      type: 'ADD_CHANNEL',
      channel: {
        id: 'command',
        name: 'command',
      },
    }
  );

  const participantName = characters[Math.floor(Math.random() * characters.length)];

  store.dispatch(
    {
      type: 'ADD_CHANNEL',
      channel: {
        id: 'direct',
        name: 'direct',
        participants: [
          {
            id: new Date().getTime().toString(),
            nickname: participantName,
          },
        ],
      },
    }
  );

  store.dispatch(
    {
      type: 'CHANGE_CHANNEL',
      channel: 'public',
    }
  );
}, 2000);
