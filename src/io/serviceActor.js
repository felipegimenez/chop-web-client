// @flow
import {
  addChannel,
  inviteToChannel,
  setEvent,
  setOrganization,
  setPubnubKeys,
  setUser,
  changeChannel,
  setLanguageOptions,
  REMOVE_CHANNEL,
} from '../feed/dux';
import type { RemoveChannelType } from '../feed/dux';
import { setVideo } from '../videoFeed/dux';
import {
  PUBLISH_ACCEPTED_PRAYER_REQUEST,
  PublishAcceptedPrayerRequestType,
} from '../moment';
import { MUTE_USER } from '../moment/message/dux';
import type { MuteUserType } from '../moment/message/dux';
import { avatarImageExists } from '../util';
import Cookies from './cookies';
import Location from './location';
import GraphQl from './graphQL';

class GraphQlActor {
  storeDispatch: (action: any) => void
  graph: GraphQl
  location: Location
  getAll: any
  graphAuth: any
  getStore: () => any
  getAuthentication: (variables: any) => any
  cookies: Cookies

  constructor (dispatch: (action: any) => void, getStore: () => any ) {
    this.storeDispatch = dispatch;
    this.getStore = getStore;
    this.cookies = new Cookies();
    this.location = new Location();
    this.graph = new GraphQl();
  }

  getAccessToken () {
    const token = this.cookies.legacyToken();
    if (!token) {
      alert('You have no token. You should get one.');
      return;
    }
    const hostname = this.location.hostname();
    this.graph.authenticate(token, hostname).then(() => {
      this.graph.currentState().then(this.getInitialData.bind(this), payload => {
        // TODO: log these errors better (new-relic?)
        if (payload.errors) {
          console.log('The graphql response returned errors:');  // eslint-disable-line no-console
          for (const err in payload.errors) {
            if (payload.errors[err].message) console.log(' - ' + payload.errors[err].message);  // eslint-disable-line no-console
          }
        } else {
          console.log('The graphql response returned an error code but no error messages.');  // eslint-disable-line no-console
        }
        // TODO: give a nicer error message to the user
        alert('It was not possible to get the event information.');
      });
    });
  }

  getInitialData (payload: any) {
    Object.keys(payload).forEach(key => {
      switch (key) {
      case 'currentFeeds': {
        const channels = payload.currentFeeds;
        channels.forEach(channel => {
          this.storeDispatch(
            addChannel(
              channel.name,
              channel.id
            )
          );
          if (channel.name === 'Public') {
            this.storeDispatch(
              changeChannel(channel.id)
            );
          }
        });
        break;
      }
      case 'currentEvent': {
        const event = payload.currentEvent;
        this.storeDispatch(
          setEvent(
            event.title,
            event.eventTimeId,
            event.eventStartTime,
            event.eventTimezone
          )
        );
        const { video } = event;
        if (video) {
          this.storeDispatch(
            setVideo(
              video.url,
              video.type,
            )
          );
        }
        break;
      }
      case 'currentOrganization': {
        // const organization = payload.currentOrganization;
        this.storeDispatch(
          setOrganization(
            3, 'Freedom Church'
            // organization.id,
            // organization.name,
          )
        );
        break;
      }
      case 'currentUser': {
        const user = payload.currentUser;
        this.storeDispatch(
          setUser(
            {
              id: user.id,
              name: user.nickname,
              avatar: user.avatar,
              pubnubAccessKey: user.pubnubAccessKey,
              pubnubToken: user.pubnubToken,
              role: {
                label: user.role.label,
                permissions: [],
              },
            }
          )
        );
        break;
      }
      case 'pubnubKeys': {
        const { publishKey, subscribeKey } = payload.pubnubKeys;
        this.storeDispatch(
          setPubnubKeys(
            publishKey,
            subscribeKey
          )
        );
        break;
      }
      case 'currentLanguages': {
        const languages = payload.currentLanguages;
        this.storeDispatch(
          setLanguageOptions(languages)
        );
        break;
      }
      }
    });
    avatarImageExists(payload.currentUser.id).then(exists => {
      if (exists) {
        this.storeDispatch(
          {
            type: 'SET_AVATAR',
            url: `https://chop-v3-media.s3.amazonaws.com/users/avatars/${payload.currentUser.id}/thumb/photo.jpg`,
          }
        );
      }
    }) ;
  }

  publishAcceptedPrayerRequest (action:PublishAcceptedPrayerRequestType) {
    const { currentChannel } = this.getStore();
    const { channels } = this.getStore();
    const currentMoments = channels[currentChannel].moments;
    const moment = currentMoments.find(moment => moment.id === action.id);
    const { user } = moment;
    const now = new Date().getTime();
    const channel = `direct-chat-${now}`;


    this.graph.acceptPrayer(channel, user.pubnubToken)
      .then(data => {
        const { name, id } = data.acceptPrayer;
        this.storeDispatch(addChannel(name, id));
        this.storeDispatch(inviteToChannel(user, id, name));
      });
  }

  muteUser (action:MuteUserType) {
    this.graph.muteUser(action.pubnubToken);
  }

  removeChannel (action:RemoveChannelType) {
    this.graph.leaveChannel(action.channel);
  }

  dispatch (action: any) {
    if (!action && !action.type) {
      return;
    }
    switch (action.type) {
    case 'INIT':
      this.getAccessToken();
      return;
    case PUBLISH_ACCEPTED_PRAYER_REQUEST:
      this.publishAcceptedPrayerRequest(action);
      return;
    case REMOVE_CHANNEL:
      this.removeChannel(action);
      return;
    case MUTE_USER:
      this.muteUser(action);
      return;
    default:
      return;
    }
  }
}

export default GraphQlActor;