import React, { Component, PropTypes } from 'react';
import Setting from '../components/setting.jsx';
import TabBar from '../components/tabBar.jsx';
import { TAB_STATE } from '../constants';

const propTypes = {};
const defaultProps = {};

const initialState = {
  tabIndex: TAB_STATE.SETTING
};

/**
 * App
 */
class App extends Component{
  constructor(props){
    super(props);
    this.state = initialState;
    this.handleTabChange = ::this.handleTabChange;
  }

  handleTabChange(tabIndex) {
    this.setState({ tabIndex });
  }

  render(){
    const { tabIndex } = this.state;
    return (
      <div>
        <div className="nav-bar">
          <div className="icon-box">
            <span className="icon -connect"></span>
            <span className="icon -mining"></span>
          </div>
        </div>
        <TabBar
          tabIndex={tabIndex}
          handleTabChange={this.handleTabChange}
        />
        <main>
          { tabIndex === TAB_STATE.STATE ? <div>state</div> : null}
          { tabIndex === TAB_STATE.SETTING ? <Setting /> : null}
        </main>
      </div>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;
