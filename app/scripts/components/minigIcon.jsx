import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {};
const defaultProps = {};

/**
 * MinigIcon
 * マイニングアイコン
 */
const MinigIcon = (props) => {
  const { mining } = props;
  // const icon = mining ? '🔨' : '👷';
  return (
    <span className="icon icon__mining"></span>
  );
};

MinigIcon.propTypes = propTypes;
MinigIcon.defaultProps = defaultProps;

export default MinigIcon;
