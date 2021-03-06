// @flow
import Adapter from 'enzyme-adapter-react-16';
import Message from '../../src/moment/message/message';
import { MESSAGE } from '../../src/moment/message/dux';
import Enzyme from 'enzyme';
import React from 'react';
import { mountWithTheme } from '../testUtils';
import Label from '../../src/components/label';
import { TextWrapper } from '../../src/moment/message/styles';

Enzyme.configure({ adapter: new Adapter() });

const otherUser = {
  id: 12345,
  pubnubToken: '12345',
  avatar: null,
  name: 'Billy Bob',
  role: {
    label: 'Host',
  },
  preferences: {
    textMode: 'COMPACT',
  },
};

describe('Message', () => {
  test('has correct text', () => {
    const wrapper = mountWithTheme(
      <Message
        message={
          {
            type: MESSAGE,
            id: '1234',
            timestamp: 1546570485391,
            lang: 'en',
            text: 'Go to https://live.life.church young man!<script>sinister script</script>',
            sender: otherUser,
            messageTrayOpen: false,
            isMuted: false,
          }
        }
        currentChannel='public'
        toggleMessageTray={() => {}}
        deleteMessage={() => {}}
        publishDeleteMessage={() => {}}
        muteUser={() => {}}
        addPlaceholderChannel={() => ''}
        setPaneToChat={() => {}}
        hostChannel='host'
        directChat={() => {}}
        isCompact={true}
        chatPermissions={true}
        moderationPermissions={true}
      />
    );
    expect(wrapper.find(TextWrapper).html()).toContain('Go to <a target="_blank" class="linkified" href="https://live.life.church">https://live.life.church</a> young man!');
  });

  test('displays the role label', () => {
    const wrapper = mountWithTheme(
      <Message
        message={
          {
            type: MESSAGE,
            id: '1234',
            timestamp: 1546570485391,
            lang: 'en',
            text: 'Go west young man!',
            sender: otherUser,
            messageTrayOpen: false,
            isMuted: false,
          }
        }
        currentChannel='public'
        toggleMessageTray={() => {}}
        deleteMessage={() => {}}
        publishDeleteMessage={() => {}}
        muteUser={() => {}}
        addPlaceholderChannel={() => ''}
        setPaneToChat={() => {}}
        hostChannel='host'
        directChat={() => {}}
        isCompact={true}
        chatPermissions={true}
        moderationPermissions={true}
      />
    );
    expect(wrapper.find(Label).text()).toEqual('Host');
  });
});
