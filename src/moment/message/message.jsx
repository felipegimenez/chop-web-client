// @flow
import React from 'react';

import type { MessageType } from './dux';
import type { SharedUserType } from '../../feed/dux';
import Avatar from '../../avatar';

import OpenTrayButtonIcon from '../../../assets/open-tray-button.svg';
import MessageTray from '../../components/messageTray';
import Actionable from '../../components/Actionable';
import linkifyHtml from 'linkifyjs/html';
import { sanitizeString } from '../../util';
import Label from '../../components/label';

import { MessageWrapper, Wrapper, BodyWrapper, NameWrapper, OpenTrayButton, TextWrapper, AnimatedMessageTray } from './styles';
import { useTransition } from 'react-spring';

type MessagePropsType = {
  message: MessageType,
  currentChannel: string,
  hostChannel: string,
  currentUser: SharedUserType,
  openMessageTray: (id: string) => void,
  closeMessageTray: (id: string) => void,
  deleteMessage: (id: string, channel: string) => void,
  publishDeleteMessage: (id: string) => void,
  toggleCloseTrayButton: (id: string) => void,
  muteUser: (channel: string, nickname: string) => void,
  publishMuteUserNotification: (host: string, guest: string, channel: string) => void,
  directChat: (pubnubToken: string, nickname: string) => void,
  mutedNotificationBanner: (guestName: string) => void,
};

const Message = (
  {
    message: {
      sender,
      messageTrayOpen,
      text,
      id:messageId,
    },
    currentChannel,
    hostChannel,
    currentUser: {
      name:currentUserName,
    },
    ...otherProps
  }: MessagePropsType
) => {
  const { name: senderName, pubnubToken: senderToken, role: { label: senderLabel } = {} } = sender;
  const renderText = linkifyHtml(text, { target: '_blank' });

  const openMessageTray = () => otherProps.openMessageTray(messageId);
  const closeMessageTray = () => messageTrayOpen ? otherProps.closeMessageTray(messageId) : undefined;
  const deleteMessage = () => {
    otherProps.publishDeleteMessage(messageId);
    otherProps.deleteMessage(messageId, currentChannel);
  };
  const muteUser = () => {
    otherProps.muteUser(currentChannel, senderName);
    otherProps.mutedNotificationBanner(senderName);
    otherProps.publishMuteUserNotification(currentUserName, senderName, hostChannel);
    closeMessageTray();
  };
  const directChat = () => otherProps.directChat(senderToken, senderName);

  const OpenMessageTrayButton = () => (
    <Actionable onClick={openMessageTray} keepFocus={true}>
      <OpenTrayButton
        dangerouslySetInnerHTML={{ __html: OpenTrayButtonIcon }}
      />
    </Actionable>
  );

  const MessageBody = () => (
    <>
      <Avatar user={sender} />
      <BodyWrapper>
        <NameWrapper>{senderName}</NameWrapper>
        {senderLabel &&
          <Label text={senderLabel} />
        }
        <TextWrapper key={messageId} data-node='text' dangerouslySetInnerHTML={{ __html: sanitizeString(renderText) }} />
      </BodyWrapper>
    </>
  );

  const transitions = useTransition(messageTrayOpen, null, {
    from: { transform:  'translate3d(100%,0,0)' },
    enter: { transform: 'translate3d(2px,0,0)' },
    leave: { transform: 'translate3d(125%,0,0)' },
  });

  return (
    <Wrapper data-component='messageContainer'>
      <Actionable onClick={closeMessageTray} keepFocus={true} tabable={false}>
        <MessageWrapper messageTrayOpen={messageTrayOpen}>
          <MessageBody />
          <OpenMessageTrayButton />
        </MessageWrapper>
      </Actionable>

      { transitions.map(({ item, props, key }) => (
        item &&
          <AnimatedMessageTray style={props} key={key}>
            <MessageTray
              closeTray={closeMessageTray}
              deleteMessage={deleteMessage}
              muteUser={muteUser}
              directChat={directChat}
            />
          </AnimatedMessageTray>
      ))}

    </Wrapper>
  );
};

export default React.memo < MessagePropsType > (Message);
