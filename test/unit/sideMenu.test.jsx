// @flow
import React from 'react';
import sinon from 'sinon';
import { renderWithReduxAndTheme } from '../testUtils';

import SideMenu from '../../src/sideMenu/sideMenu';
import { fireEvent } from 'react-testing-library';
import type {PrivateUserType} from '../../src/users/dux';

const languageOptions = [
  {
    code: 'en',
    name: 'English',
  },
  {
    code: 'ja-jp',
    name: 'Japanese',
  },
  {
    code: 'fr',
    name: 'French',
  },
  {
    code: 'sp',
    name: 'Spanish',
  },
  {
    code: 'gm',
    name: 'German',
  },
  {
    code: 'it',
    name: 'Italian',
  },
  {
    code: 'ko',
    name: 'Korean',
  },
];

const currentPane = {
  type: 'EVENT',
  content: {
    channelId: 'host',
  },
};

const currentUser: PrivateUserType = {
  id: 134,
  pubnubToken: '12sd0fj230jsdf;',
  name: 'Kylo Ren',
  avatar: 'http://someimageons3.com/image/123',
  pubnubAccessKey: '12347893456',
  role: {
    label: 'Supreme Leader of the First Order',
    permissions: ['event.event.manage'],
  },
  preferences: {
    textMode: 'COMPACT',
  },
};

describe('SideBar tests', () => {
  test('SideBar renders', () => {
    const closeFunction = () => {};
    const { queryByTestId } = renderWithReduxAndTheme(
      <SideMenu
        logout={() => {}}
        close={closeFunction}
        isClosed={false}
        languageOptions={languageOptions}
        setLanguage={() => {}}
        currentPane={currentPane}
        hostChannel='host'
        publicChannel='public'
        setPaneToChat={() => {}}
        setPaneToEvent={() => {}}
        setPaneToTab={() => {}}
        addTab={() => {}}
        currentUser={currentUser}
        eventDescription='The Description'
        eventTitle='Evenet Title'
        organizationName='The Church'
        currentLanguage='en'
      />
    );
    expect(queryByTestId('side-menu')).toBeTruthy();
    expect(queryByTestId('languageSelector-select')).toBeTruthy();
  });

  test('SideBar has link to guest experience', () => {
    const { queryByTestId } = renderWithReduxAndTheme(
      <SideMenu
        logout={() => {}}
        close={() => {}}
        isClosed={false}
        languageOptions={languageOptions}
        setLanguage={() => {}}
        currentPane={currentPane}
        hostChannel='host'
        publicChannel='public'
        setPaneToChat={() => {}}
        setPaneToEvent={() => {}}
        setPaneToTab={() => {}}
        addTab={() => {}}
        currentUser={currentUser}
        eventDescription='The Description'
        eventTitle='Evenet Title'
        organizationName='The Church'
        currentLanguage='en'
      />
    );
    expect(queryByTestId('guest-experience')).toBeTruthy();
    expect(queryByTestId('guest-experience').textContent).toEqual('guest_experience');
  });

  test('SideBar has link to give feedback', () => {
    const { queryByTestId } = renderWithReduxAndTheme(
      <SideMenu
        logout={() => {}}
        close={() => {}}
        isClosed={false}
        languageOptions={languageOptions}
        setLanguage={() => {}}
        currentPane={currentPane}
        hostChannel='host'
        publicChannel='public'
        setPaneToChat={() => {}}
        setPaneToEvent={() => {}}
        setPaneToTab={() => {}}
        addTab={() => {}}
        currentUser={currentUser}
        eventDescription='The Description'
        eventTitle='Evenet Title'
        organizationName='The Church'
        currentLanguage='en'
      />
    );
    expect(queryByTestId('feedback')).toBeTruthy();
    expect(queryByTestId('feedback').textContent).toEqual('give_feedback');
    expect(queryByTestId('feedback').href).toEqual('https://lifechurch.formstack.com/forms/host_feedback_2');
  });

  test('SideBar has logout button', () => {
    const logoutButton = sinon.spy();
    const { getByTestId } = renderWithReduxAndTheme(
      <SideMenu
        logout={logoutButton}
        close={() => {}}
        isClosed={false}
        languageOptions={languageOptions}
        setLanguage={() => {}}
        currentPane={currentPane}
        hostChannel='host'
        publicChannel='public'
        setPaneToChat={() => {}}
        setPaneToEvent={() => {}}
        setPaneToTab={() => {}}
        addTab={() => {}}
        currentUser={currentUser}
        eventDescription='The Description'
        eventTitle='Evenet Title'
        organizationName='The Church'
        currentLanguage='en'
      />
    );
    const logout = getByTestId('logout');
    expect(logout).toBeTruthy();
    expect(logout.textContent).toEqual('File log_out');
    fireEvent.click(logout);
    expect(logoutButton.calledOnce).toBeTruthy();
  });

  test('SideBar has organization title', () => {
    const { queryByTestId } = renderWithReduxAndTheme(
      <SideMenu
        logout={() => {}}
        close={() => {}}
        isClosed={false}
        languageOptions={languageOptions}
        setLanguage={() => {}}
        currentPane={currentPane}
        hostChannel='host'
        publicChannel='public'
        setPaneToChat={() => {}}
        setPaneToEvent={() => {}}
        setPaneToTab={() => {}}
        addTab={() => {}}
        currentUser={currentUser}
        eventDescription='The Description'
        eventTitle='Event Title'
        organizationName='The Church'
        currentLanguage='en'
      />
    );
    expect(queryByTestId('organization-title')).toBeTruthy();
    expect(queryByTestId('organization-title').textContent).toEqual('The Church');
  });

  test('SideBar has event information', () => {
    const { queryByTestId } = renderWithReduxAndTheme(
      <SideMenu
        logout={() => {}}
        close={() => {}}
        isClosed={false}
        languageOptions={languageOptions}
        setLanguage={() => {}}
        currentPane={currentPane}
        hostChannel='host'
        publicChannel='public'
        setPaneToChat={() => {}}
        setPaneToEvent={() => {}}
        setPaneToTab={() => {}}
        addTab={() => {}}
        currentUser={currentUser}
        eventDescription='The Description'
        eventTitle='Event Title'
        organizationName='The Church'
        currentLanguage='en'
      />
    );
    expect(queryByTestId('event-title')).toBeTruthy();
    expect(queryByTestId('event-title').textContent).toEqual('Event Title');
    expect(queryByTestId('event-description')).toBeTruthy();
    expect(queryByTestId('event-description').textContent).toEqual('The Description');
  });

  test('SideBar has avatar', () => {
    const { queryByTestId } = renderWithReduxAndTheme(
      <SideMenu
        logout={() => {}}
        close={() => {}}
        isClosed={false}
        languageOptions={languageOptions}
        setLanguage={() => {}}
        currentPane={currentPane}
        hostChannel='host'
        publicChannel='public'
        setPaneToChat={() => {}}
        setPaneToEvent={() => {}}
        setPaneToTab={() => {}}
        addTab={() => {}}
        currentUser={currentUser}
        eventDescription='The Description'
        eventTitle='Event Title'
        organizationName='The Church'
        currentLanguage='en'
      />
    );
    expect(queryByTestId('side-menu-avatar')).toBeTruthy;
  });
});
