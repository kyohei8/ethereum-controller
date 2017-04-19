import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TAB_STATE } from '../constants';

const propTypes = {
  tabIndex: PropTypes.string,
  handleTabChange: PropTypes.func
};

const defaultProps = {};

/**
 * TabBar
 */
class TabBar extends Component{
  constructor(props){
    super(props);
  }

  render(){
    const { tabIndex, handleTabChange } = this.props;
    const tabs = Object.keys(TAB_STATE).map((k) => {
      const tabName = TAB_STATE[k];
      const _className = tabIndex === tabName ? 'tab -active' : 'tab';
      return (
        <div
          className={_className}
          key={tabName}
          onClick={handleTabChange.bind(null, tabName)}
          >
          {tabName}
        </div>
      );
    });
    return (
      <div className="tab-bar">
        { tabs }
      </div>
    );
  }
}

TabBar.propTypes = propTypes;
TabBar.defaultProps = defaultProps;

export default TabBar;
