import { configure } from '@storybook/react';

function loadStories() {
  require('../../stories/button.jsx');
  require('../../stories/text-field.jsx');
  require('../../stories/chat.jsx');
  require('../../stories/feed.jsx');
  require('../../stories/message.jsx');
  require('../../stories/navBar.jsx');
  require('../../stories/videoFeed.jsx');
  require('../../stories/sideMenu.jsx');
}

configure(loadStories, module);
