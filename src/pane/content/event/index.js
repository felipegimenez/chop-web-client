//@flow
import { connect } from 'react-redux';
import Event from './event';
import { isOffline, isChatEnabled } from '../../../selectors/eventSelectors';
import { getPublicChannel } from '../../../selectors/channelSelectors';

const mapStateToProps = state => {
  const feedState = state.feed;
  const channel = getPublicChannel(feedState);
  return {
    isOffline: isOffline(feedState),
    isChatEnabled: isChatEnabled(feedState),
    channel,
  };
};

const VisibleEvent = connect(
  mapStateToProps,
)(Event);

export default VisibleEvent;
