import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {};
const defaultProps = {};

/**
 * ConnectIcon
 * gethのコネクト状態をアイコンで表示
 */
const ConnectIcon = (props) => {
  const { connecting } = props;
  const bgImage = connecting ? 'images/connected.png' : 'images/disconnected.png';
  return (
    <span
      className="icon icon__connect"
      style={{backgroundImage: `url(${bgImage})`}}
    />
  );
};

ConnectIcon.propTypes = propTypes;
ConnectIcon.defaultProps = defaultProps;

export default ConnectIcon;
