// @flow

import { charaterCount, inputValue } from '../../../src/chat/ducks';
import type { ChatState } from '../../../src/chat/ducks';

test('Test Chat charaterCount', () => {
  const state: ChatState = {
    currentInput: 'Kenny is great!',
    currentChannel: '',
    channels: {}
  }
  expect(charaterCount(state)).toEqual(15);
});

test('Test Chat inputValue', () => {
  const state: ChatState = {
    currentInput: '@kenny you rock!',
    currentChannel: '',
    channels: {}
  }
  expect(inputValue(state)).toEqual('<b>@kenny</b> you rock!');
});