import React, { Component, PropTypes } from 'react';
import Setting from '../components/setting.jsx';
import State from '../components/statePage.jsx';
import TabBar from '../components/tabBar.jsx';
import { TAB_STATE } from '../constants';

const propTypes = {};
const defaultProps = {};

const initialState = {
  tabIndex: TAB_STATE.SETTING,
  dir: '/Users/ktsukuda/work/ethereum_2017-03-07',
  networkId: '19081',
  port: '2001',
  noDiscover: true,
  dev: true,
  rpc: true,
  rpcAddress: '',
  rpcPort: '',
  connecting: false,
  command: '',
  mining: false
};

/**
 * App
 */
class App extends Component{
  constructor(props){
    super(props);
    this.state = initialState;
    this.handleTabChange = ::this.handleTabChange;

    this.handleDirChange = ::this.handleDirChange;
    this.handlePortChange = ::this.handlePortChange;
    this.handleNetworkIdChange = ::this.handleNetworkIdChange;
    this.handleRpcAddressChange = ::this.handleRpcAddressChange;
    this.handleRpcPortChange = ::this.handleRpcPortChange;
    this.handleCommandChange = ::this.handleCommandChange;
    this.handleNoDiscoverChange = ::this.handleNoDiscoverChange;
    this.handleDevChange = ::this.handleDevChange;
    this.handleRPCChange = ::this.handleRPCChange;
    this.handleConnectingChange = ::this.handleConnectingChange;
    this.onChangeConnectButtonName = ::this.onChangeConnectButtonName;
    this.onResetConnectButtonName = ::this.onResetConnectButtonName;
    this.handleMinigChange = ::this.handleMinigChange;
  }

  handleTabChange(tabIndex) {
    this.setState({ tabIndex });
  }

  handleDirChange(e) {
    this.setState({ dir: e.target.value });
  }

  handlePortChange(e) {
    this.setState({ port: e.target.value });
  }

  handleNoDiscoverChange(e) {
    this.setState({ noDiscover: e.target.checked });
  }

  handleDevChange(e) {
    this.setState({ dev: e.target.checked });
  }

  handleRPCChange(e) {
    this.setState({ rpc: e.target.checked });
  }

  handleNetworkIdChange(e) {
    this.setState({ networkId: e.target.value });
  }

  /**
   * RPCアドレスを変更
   * @param {event} e
   */
  handleRpcAddressChange(e) {
    this.setState({ rpcAddress: e.target.value });
  }

  /**
   * RPCポートを変更
   * @param {event} e
   */
  handleRpcPortChange(e) {
    this.setState({ rpcPort: e.target.value });
  }

  /**
   * gethコマンド
   * @param {event} e
   */
  handleCommandChange(e){
    this.setState({
      command: e.target.value
    });
  }


  /**
   * Connectボタンをホバーした
   */
  onChangeConnectButtonName(){
    this.setState({ hoverButton: true });
  }

  /**
   * Connectボタンをホバー解除した
   */
  onResetConnectButtonName(){
    this.setState({ hoverButton: false });
  }

  handleConnectingChange(connecting){
    this.setState({ connecting });
  }

  handleMinigChange(mining){
    if(this.state.mining){
      this.setState({ mining: false });
    } else {
      this.setState({ mining: true });
    }
  }


  render(){
    const {
      dir,
      networkId,
      port,
      noDiscover,
      dev,
      rpc,
      connecting,
      rpcAddress,
      rpcPort,
      command,
      tabIndex,
      mining,
      hoverButton
    } = this.state;

    const settingCompornent = <Setting
      dir={dir}
      handleDirChange={this.handleDirChange}
      networkId={networkId}
      handleNetworkIdChange={this.handleNetworkIdChange}
      port={port}
      handlePortChange={this.handlePortChange}
      noDiscover={noDiscover}
      handleNoDiscoverChange={this.handleNoDiscoverChange}
      dev={dev}
      handleDevChange={this.handleDevChange}
      rpc={rpc}
      handleRPCChange={this.handleRPCChange}
      connecting={connecting}
      handleConnectingChange={this.handleConnectingChange}
      rpcAddress={rpcAddress}
      handleRpcAddressChange={this.handleRpcAddressChange}
      rpcPort={rpcPort}
      handleRpcPortChange={this.handleRpcPortChange}
      command={command}
      handleCommandChange={this.handleCommandChange}
      mining={mining}
      handleMinigChange={this.handleMinigChange}
      hoverButton={hoverButton}
    />

    return (
      <div>
        <TabBar
          tabIndex={tabIndex}
          handleTabChange={this.handleTabChange}
          connecting={connecting}
          mining={mining}
        />
        <main>
          { tabIndex === TAB_STATE.STATE ? <State/> : null}
          { tabIndex === TAB_STATE.SETTING ? settingCompornent : null}
        </main>
      </div>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;
