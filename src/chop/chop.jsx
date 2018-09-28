// @flow
import * as React from 'react';

import Chat from '../chat';
import Feed from '../feed';
import NavBar from '../navBar';
import VideoFeed from '../videoFeed';
import SideMenu from '../sideMenu';
import Placeholder from '../placeholder';
import PopUpModal from '../popUpModal';
import ReactionsContainer from '../reactions/reactionsContainer';

import '../../assets/global.css';
import chopStyles from './styles.css';

const ChopContainer = ()  => (
  <div className={chopStyles.wrapper}>
    <SideMenu />
    <div className={chopStyles.chop}>
      <PopUpModal />
      <NavBar />
      <VideoFeed />
      <Feed />
      <Placeholder />
      <Chat />
      <ReactionsContainer />
    </div>
  </div>
);

export default ChopContainer;
