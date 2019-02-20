import styled from 'styled-components';
import { theme } from '../styles';
import { getAvatarColor } from '../util';

const NavBarItemWrapper = styled.button`
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: ${props => props.isCurrent ? theme.colors.textColor : theme.colors.gray50};
  text-transform: uppercase;
  position: relative;
  font-weight: 500;
  border: none;
  background: transparent;
`;

const NavBarHamburgerWrapper = styled.button`
  display: flex;
  align-items: center;
  color: ${ theme.colors.textColor };
  text-transform: uppercase;
  text-decoration: none;
  position: relative;
  font-weight: 500;
  padding: 0 8px;
  margin:0px;
  border: none;
  background: transparent;
`;

const Pip = styled.span`
  height:8px;
  width:8px;
  border-radius: 50%;
  background-color: ${theme.colors.primary};
  position: absolute;
  top: 6px;
  right: 3px;
`;

const DirectChatAvatar = styled.div`
  border-radius: 24px;
  height: 28px;
  width: 28px;
  font-size: 12px;
  color: ${theme.colors.alternateTextColor};
  text-align: center;
  line-height: 28px;
  background-color: ${ props =>  getAvatarColor(props.name, props.isCurrent ? 1.0 : 0.5) };
`;

const Underline = styled.div`
  display: flex;
  content: "";
  position: absolute;
  height: 2px;
  bottom: 8px;
  background-color: ${theme.colors.textColor};
  transition: width ${ theme.animation.duration } ${ theme.animation.easeOut }, left ${ theme.animation.duration } ${ theme.animation.easeOut }, opacity ${ theme.animation.duration } ${ theme.animation.easeOut };
  left: ${ props => props.left }px;
  width: ${ props => props.width }px;
  opacity: ${ props => props.opacity };
`;

export {
  NavBarItemWrapper,
  NavBarHamburgerWrapper,
  Pip,
  DirectChatAvatar,
  Underline,
};