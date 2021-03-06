import React, { Component, PropTypes } from 'react';

const propTypes = {};
const defaultProps = {};

/**
 * Setting
 */
class Setting extends Component{
  constructor(props){
    super(props);

    this.execGeth = ::this.execGeth;
    this.toggleMining = ::this.toggleMining;

    // 接続成功
    ipcRenderer.on('success', (obj, res) => {
      this.props.handleConnectingChange(true);
    });

    // 切断成功
    ipcRenderer.on('disconnected', (obj, res) => {
      this.props.handleConnectingChange(false);
    });

    // outはGeth JavaScript consoleのメッセージ
    ipcRenderer.on('replyOut', (obj, text) => {
      this.props.handleReply({
        type: 'out',
        text
      });
      // console.log(res);
    });

    // errはシステム由来のメッセージ
    ipcRenderer.on('replyErr', (obj, text) => {
      this.props.handleReply({
        type: 'err',
        text
      });
      // console.log(res);
    });
  }


  execGeth(e) {
    e.preventDefault();
    const { connecting } = this.props;
    if(connecting){
      // 接続終了
      ipcRenderer.send('disconnect');
    }else{
      // 接続開始
      ipcRenderer.send('start', this.props);
    }
  }


  toggleMining(){
    const { mining, handleMinigChange } = this.props

    if(mining){
      ipcRenderer.send('minerStop');
      handleMinigChange(false);
    }else{
      ipcRenderer.send('minerStart');
      handleMinigChange(true);
    }
  }

  render(){
    const {
      dir,
      handleDirChange,
      networkId,
      handleNetworkIdChange,
      port,
      handlePortChange,
      noDiscover,
      handleNoDiscoverChange,
      dev,
      handleDevChange,
      rpc,
      handleRPCChange,
      rpcAddress,
      handleRpcAddressChange,
      rpcPort,
      handleRpcPortChange,
      connecting,
      command,
      hoverButton,
      onChangeConnectButtonName,
      onResetConnectButtonName,
      mining
    } = this.props;

    const connectButtonTitle = connecting ? (hoverButton ? 'disconnect': 'connecting...') : 'connect';
    return (
      <div className="container">
        <fieldset className="geth-options">
          { connecting ? <div className="curtain"></div> : null }
          <label htmlFor="directory">Ethereum directory</label>
          <input type="text" placeholder="/Users/user/work/ethereum" id="directory" value={dir} onChange={handleDirChange}/>

          <div className="row">
            <div className="column column-25">
              <label htmlFor="networkid">networkId</label>
              <input type="number" placeholder="19081" id="networkid" value={networkId} onChange={handleNetworkIdChange}/>
            </div>
            <div className="column column-25">
              <label htmlFor="port">port</label>
              <input type="number" placeholder="2000" id="port" value={port} onChange={handlePortChange} />
            </div>
          </div>

          <div className="row">
            <div className="column column-50">
              <div>
                <input type="checkbox" id="nodiscover" checked={noDiscover} onChange={handleNoDiscoverChange} />
                <label className="label-inline" htmlFor="nodiscover">noDiscover</label>
              </div>
              <div>
                <input type="checkbox" id="dev" checked={dev} onChange={handleDevChange} />
                <label className="label-inline" htmlFor="dev">Developer mode</label>
              </div>
            </div>
          </div>

          {/* rpcはデフォルトでON
          <div className="row">
            <div className="column column-100">
              <input type="checkbox" id="rpc" checked={rpc} onChange={handleRPCChange} />
              <label className="label-inline" htmlFor="rpc">HTTP-RPC server</label>
            </div>
          </div>

          <div className="row">
            <div className="column column-50">
              <label htmlFor="rpcAddress">HTTP-RPC server Address</label>
              <input type="text" placeholder="localhost" id="rpcAddress" value={rpcAddress} onChange={handleRpcAddressChange}/>
            </div>
            <div className="column column-50">
              <label htmlFor="rpcPort">HTTP-RPC server Port</label>
              <input type="text" placeholder="8545" id="rpcPort" value={rpcPort} onChange={handleRpcPortChange}/>
            </div>
          </div>
          */}
        </fieldset>

        <div className="row">
          <div className="column column-50">
            <input
              className="button-primary"
              type="submit"
              value={connectButtonTitle}
              onMouseOver={onChangeConnectButtonName}
              onMouseOut={onResetConnectButtonName}
              onClick={this.execGeth}
            />
          </div>
        </div>

        { connecting ?
        <div>
          <div className="row">
            <div className="column column-25">
              <button
                className="button-primary"
                onClick={this.toggleMining}
                > { mining ? 'mining...' : 'miner start' }</button>
            </div>
          </div>
        </div>
        : null}

      </div>
    );
  }
}

Setting.propTypes = propTypes;
Setting.defaultProps = defaultProps;

export default Setting;
