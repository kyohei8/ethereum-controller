import React, { Component, PropTypes } from 'react';

const propTypes = {};
const defaultProps = {};

/**
 * App
 */
class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      dir: '/Users/ktsukuda/work/ethereum_2017-03-07',
      networkId: '19081',
      port: '2001',
      noDiscover: true,
      connecting: false
    };

    this.handleNetworkIdChange = ::this.handleNetworkIdChange;
    this.handlePortChange = ::this.handlePortChange;
    this.handleDirChange = ::this.handleDirChange;
    this.handleNoDiscoverChange = ::this.handleNoDiscoverChange;
    this.execGeth = ::this.execGeth;
    this.onChangeConnectButtonName = ::this.onChangeConnectButtonName;
    this.onResetConnectButtonName = ::this.onResetConnectButtonName;

    ipcRenderer.on('success', (obj, res) => {
      this.setState({ connecting: true });
    });

    ipcRenderer.on('disconnected', (obj, res) => {
      this.setState({ connecting: false });
    });

  }

  handleDirChange(e) {
    this.setState({ dir: e.target.value });
  }

  handlePortChange(e) {
    this.setState({ port: e.target.value });
  }

  handleNoDiscoverChange(e) {
    console.log(e.target.checked);
    this.setState({ noDiscover: e.target.checked });
  }

  handleNetworkIdChange(e) {
    this.setState({ networkId: e.target.value });
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

  render(){
    const {
      dir,
      networkId,
      port,
      noDiscover,
      connecting,
      hoverButton
    } = this.state;

    const connectButtonTitle = connecting ? (hoverButton ? 'disconnect': 'connecting...') : 'connect';
    return (
      <div className="container">
        <fieldset>
          <label htmlFor="directory">Ethereum directory</label>
          <input type="text" placeholder="/Users/user/work/ethereum" id="directory" value={dir} onChange={this.handleDirChange}/>
          <div className="row">
            <div className="column column-50">
              <label htmlFor="networkid">networkId</label>
              <input type="text" placeholder="19081" id="networkid" value={networkId} onChange={this.handleNetworkIdChange}/>
            </div>
            <div className="column column-50">
              <label htmlFor="port">port</label>
              <input type="text" placeholder="2000" id="port" value={port} onChange={this.handlePortChange} />
            </div>
          </div>

          <div className="row">
            <div className="column column-50">
              <div className="">
                <input type="checkbox" id="nodiscover" checked={noDiscover} onChange={this.handleNoDiscoverChange} />
                <label className="label-inline" htmlFor="nodiscover">noDiscover</label>
              </div>
            </div>
            <div className="column column-50">
            </div>
          </div>

          <input
            className="button-primary"
            type="submit"
            value={connectButtonTitle}
            onMouseOver={this.onChangeConnectButtonName}
            onMouseOut={this.onResetConnectButtonName}
            onClick={this.execGeth}
          />
        </fieldset>


        <div className="row">
          <div className="column">.column</div>
          <div className="column column-50 column-offset-25">.column column-50 column-offset-25</div>
        </div>

      </div>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

export default App;
