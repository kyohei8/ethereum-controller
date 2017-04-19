import React, { Component, PropTypes } from 'react';

const propTypes = {};
const defaultProps = {};

/**
 * Setting
 */
class Setting extends Component{
  constructor(props){
    super(props);
    this.state = {
      dir: '/Users/ktsukuda/work/ethereum_2017-03-07',
      networkId: '19081',
      port: '2001',
      noDiscover: true,
      dev: true,
      rpc: false,
      rpcAddress: '',
      rpcPort: '',
      connecting: false,
      command: ''
    };

    this.handleNetworkIdChange = ::this.handleNetworkIdChange;
    this.handleRpcAddressChange = ::this.handleRpcAddressChange;
    this.handleRpcPortChange = ::this.handleRpcPortChange;
    this.handleCommandChange = ::this.handleCommandChange;
    this.handlePortChange = ::this.handlePortChange;
    this.handleDirChange = ::this.handleDirChange;
    this.handleNoDiscoverChange = ::this.handleNoDiscoverChange;
    this.handleDevChange = ::this.handleDevChange;
    this.handleRPCChange = ::this.handleRPCChange;
    this.execGeth = ::this.execGeth;
    this.sendGethCommand = ::this.sendGethCommand;
    this.onChangeConnectButtonName = ::this.onChangeConnectButtonName;
    this.onResetConnectButtonName = ::this.onResetConnectButtonName;

    ipcRenderer.on('success', (obj, res) => {
      this.setState({ connecting: true });
    });

    ipcRenderer.on('disconnected', (obj, res) => {
      this.setState({ connecting: false });
    });

    ipcRenderer.on('reply', function(obj, res) {
      console.log(res);
    });
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
   * コマンド
   * @param {event} e
   */
  handleCommandChange(e){
    this.setState({
      command: e.target.value
    });
  }

  onChangeConnectButtonName(){
    this.setState({
      hoverButton: true
    });
  }

  onResetConnectButtonName(){
    this.setState({
      hoverButton: false
    });
  }

  execGeth(e) {
    e.preventDefault();
    const { connecting } = this.state;
    if(connecting){
      // 接続終了
      ipcRenderer.send('disconnect');
    }else{
      // 接続開始
      ipcRenderer.send('start', this.state);
    }
  }

  /**
   * mainにコマンドを送信
   */
  sendGethCommand(){
    ipcRenderer.send('send', this.state.command);
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
      hoverButton
    } = this.state;

    const connectButtonTitle = connecting ? (hoverButton ? 'disconnect': 'connecting...') : 'connect';
    return (
      <div className="container">
        <fieldset className="geth-options">
          { connecting ? <div className="curtain"></div> : null }
          <label htmlFor="directory">Ethereum directory</label>
          <input type="text" placeholder="/Users/user/work/ethereum" id="directory" value={dir} onChange={this.handleDirChange}/>

          <div className="row">
            <div className="column column-25">
              <label htmlFor="networkid">networkId</label>
              <input type="number" placeholder="19081" id="networkid" value={networkId} onChange={this.handleNetworkIdChange}/>
            </div>
            <div className="column column-25">
              <label htmlFor="port">port</label>
              <input type="number" placeholder="2000" id="port" value={port} onChange={this.handlePortChange} />
            </div>
          </div>

          <div className="row">
            <div className="column column-25">
              <div>
                <input type="checkbox" id="nodiscover" checked={noDiscover} onChange={this.handleNoDiscoverChange} />
                <label className="label-inline" htmlFor="nodiscover">noDiscover</label>
              </div>
              <div>
                <input type="checkbox" id="dev" checked={dev} onChange={this.handleDevChange} />
                <label className="label-inline" htmlFor="dev">Developer mode</label>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="column column-100">
              <input type="checkbox" id="rpc" checked={rpc} onChange={this.handleRPCChange} />
              <label className="label-inline" htmlFor="rpc">HTTP-RPC server</label>
            </div>
          </div>

          <div className="row">
            <div className="column column-50">
              <label htmlFor="rpcAddress">HTTP-RPC server Address</label>
              <input type="text" placeholder="localhost" id="rpcAddress" value={rpcAddress} onChange={this.handleRpcAddressChange}/>
            </div>
            <div className="column column-50">
              <label htmlFor="rpcPort">HTTP-RPC server Port</label>
              <input type="text" placeholder="8545" id="rpcPort" value={rpcPort} onChange={this.handleRpcPortChange}/>
            </div>
          </div>
        </fieldset>

        <div className="row">
          <div className="column column-50">
            <input
              className="button-primary"
              type="submit"
              value={connectButtonTitle}
              onMouseOver={this.onChangeConnectButtonName}
              onMouseOut={this.onResetConnectButtonName}
              onClick={this.execGeth}
            />
          </div>
        </div>

        <div className="row">
          <div className="column column-75">
            <label htmlFor="cmd">command</label>
          </div>
        </div>
        <div className="row">
          <div className="column column-75">
            <input type="text" placeholder="eth" id="cmd" value={command} onChange={this.handleCommandChange}/>
          </div>
          <div className="column column-25">
            <input
              className="button-primary"
              type="submit"
              value="send"
              onClick={this.sendGethCommand}
            />
          </div>
        </div>

      </div>
    );
  }
}

Setting.propTypes = propTypes;
Setting.defaultProps = defaultProps;

export default Setting;
