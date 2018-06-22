// @flow
import NavBar from './navBar';
import { connect } from 'react-redux';

import { changeChannel } from '../feed/dux';
import { getChannels } from '../navBar/dux';
import { openMenu } from '../sideMenu/dux';

const mapStateToProps = state => {
  const stateState = state.feed;
  return {
    channels: getChannels(stateState),
  };
};

const mapDispatchToProps = dispatch => (
  {
    onClick: id => dispatch(changeChannel(id)),
    openMenu: () => dispatch(openMenu()),
  }
);

const VisibleNavBar = connect(
  mapStateToProps,
  mapDispatchToProps
)(NavBar);

export default VisibleNavBar;
