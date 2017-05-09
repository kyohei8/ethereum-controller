import "babel-polyfill";
import React, { Component } from 'react'
// import 'isomorphic-fetch'
import Web3 from 'web3';


const unix2datetime = (unixtime) => {
  var date = new Date( unixtime * 1000 );
  var year  = date.getFullYear();
  var month = date.getMonth() + 1;
  var day   = date.getDate();
  var hour  = ( date.getHours()   < 10 ) ? '0' + date.getHours()   : date.getHours();
  var min   = ( date.getMinutes() < 10 ) ? '0' + date.getMinutes() : date.getMinutes();
  var sec   = ( date.getSeconds() < 10 ) ? '0' + date.getSeconds() : date.getSeconds();
  var datetimeString = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec ;
  return datetimeString;
};

export default class extends Component {
  constructor (props) {
    super(props)
    this._timer = null;
    this.state = {
      accounts: null,
      api: null,
      autoRefresh: false,
      balance: {},
      blockInfo: {},
      blockNumber: null,
      coinbase: null,
      compilers: null,
      hashrate: null,
      host: null,
      isConnected: null,
      isLoading: false,
      network: null,
      node: null,
      peerCount: null,
      price: 0,
      syncing: null
    }
  }

  componentDidMount(){
    if (typeof this.web3 !== 'undefined') {
      this.web3 = new Web3(this.web3.currentProvider);
    } else {
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }
    // check
    this.web3.version.getNode((error, result) => {
      if(error){
        console.log('RPC is not connected.');
        return;
      }
      console.log(result);
      this.getInitialProps();
    })

  }

  componentWillUnmount(){
    console.log('unmount');
  }

  /**
   * 所持etherを取得
   * @param {string} coinbase コインベース
   * @returns {object} wei,szabo,etherの値
   */
  getBalance(coinbase){
    const {  getBalance } = this.web3.eth;
    const wei = getBalance(coinbase);
    return {
      wei: wei.toString(10),
      ether: this.web3.fromWei(wei, 'ether').toString(10),
      szabo: this.web3.fromWei(wei, 'szabo').toString(10)
    }
  }

  async getInitialProps () {
    const { api } = this.web3.version;
    const network = await new Promise((resolve, reject) => {
      this.web3.version.getNetwork((error, result) => {
        resolve(result);
      });
    });
    const node = await new Promise((resolve, reject) => {
      this.web3.version.getNode((error, result) => {
        resolve(result);
      });
    });
    const { host } = this.web3.currentProvider;
    const compilers = this.web3.eth.getCompilers();
    const isConnected = this.web3.isConnected();
    // net
    const { peerCount } = this.web3.net;
    // eth
    const { accounts, coinbase, mining, blockNumber, hashrate, syncing } = this.web3.eth;
    const balance = this.getBalance(coinbase);
    // block
    const blockInfo  = this.web3.eth.getBlock(blockNumber);

    this.setState({
      network, api, node,
      host, compilers,
      isConnected, peerCount, accounts,
      coinbase, blockNumber,
      hashrate, syncing, balance, blockInfo
    });
  }

  async refresh(e){
    e && e.preventDefault();
    await new Promise((resolve, reject) => {
      this.setState({
        isLoading: true
      }, () => {
        resolve();
      });
    });

    const coinbase = await new Promise((resolve, reject) => {
      this.web3.eth.getCoinbase((error, result) => {
        resolve(result);
      });
    });

    const balance = this.getBalance(coinbase);

    const blockNumber = await new Promise((resolve, reject) => {
      this.web3.eth.getBlockNumber((error, result) => {
        resolve(result);
      });
    });

    const blockInfo = await new Promise((resolve, reject) => {
      this.web3.eth.getBlock(blockNumber, (error, result) => {
        resolve(result);
      });
    });

    const hashrate = await new Promise((resolve, reject) => {
      this.web3.eth.getHashrate((error, result) => {
        resolve(result);
      });
    });

    const price = await new Promise((resolve, reject) => {
      this.web3.eth.getGasPrice((error, result) => {
        resolve(result.toString(10));
      });
    });

    const peerCount = await new Promise((resolve, reject) => {
      this.web3.net.getPeerCount((error, result) => {
        resolve(result);
      });
    });

    this.setState({
      hashrate, coinbase,
      peerCount, price, blockInfo,
      balance, blockNumber,
      isLoading: false
    })
  }


  toggleAutoRefresh(e) {
    e.preventDefault();
    this.setState({
      autoRefresh: !this.state.autoRefresh
    }, () => {
      if(this.state.autoRefresh){
        this.refresh();
        this._timer = setInterval(this.refresh.bind(this), 2000);
      } else {
        if(this._timer){
          clearTimeout(this._timer);
          this._timer = null;
        }
      }
    });
  }

  render() {
    const {
      accounts,
      api,
      autoRefresh,
      balance,
      blockInfo,
      blockNumber,
      coinbase,
      compilers,
      hashrate,
      host,
      isConnected,
      isLoading,
      network,
      node,
      peerCount,
      price,
      syncing
    } = this.state;

    const autoRefreshText = autoRefresh ? 'disable auto refresh' : 'enable auto refresh';
    const autoRefreshText2 = autoRefresh ? 'Running' : '';
    return (
      <div>
        <div className="wrapper">
          <div className="container">
            <h3>
              <button className="button" href="#" onClick={this.refresh.bind(this)}>refresh</button>
              <button className="button button-outline" href="#" onClick={this.toggleAutoRefresh.bind(this)}>{autoRefreshText}</button>
              <span className="running">{autoRefreshText2}</span>
            </h3>
            <div className="row">
               <div className="column">coinbase</div>
               <div className="column column-75">{coinbase}</div>
            </div>
            <div className="row">
              <div className="column">currentHashrate</div>
              <div className="column column-75">{hashrate}</div>
            </div>
            <div className="row">
              <div className="column">currentPeerCount</div>
              <div className="column column-75">{peerCount}</div>
            </div>
            <div className="row">
              <div className="column">isSyncing</div>
              <div className="column column-75">{syncing ? 'true' : 'false'}</div>
            </div>
            <div className="row">
              <div className="column">currentBalance</div>
              <div className="column column-25">{balance.ether} ehter</div>
              <div className="column column-25">{balance.szabo} szabo</div>
              <div className="column column-25">{balance.wei} wei</div>
            </div>
          </div>
          <div className="container">
            <h3>Block Stats</h3>
            <div className="row">
               <div className="column">Block Number</div>
               <div className="column column-75">{blockNumber}</div>
            </div>
            <div className="row">
               <div className="column">Block Hash</div>
               <div className="column column-75">{blockInfo.hash}</div>
            </div>
            <div className="row">
               <div className="column">ParentHash</div>
               <div className="column column-75">{blockInfo.parentHash}</div>
            </div>
            <div className="row">
               <div className="column">Miner</div>
               <div className="column column-75">{blockInfo.miner}</div>
            </div>
            <div className="row">
               <div className="column">Mined Datetime</div>
               <div className="column column-75">{unix2datetime(blockInfo.timestamp)}</div>
            </div>
            <div className="row">
               <div className="column">Nonce</div>
               <div className="column column-75">{blockInfo.nonce}</div>
            </div>
            <div className="row">
              <div className="column">price</div>
              <div className="column column-75">{price}</div>
            </div>
          </div>
          <div className="container">
            <h3>info</h3>
            <div className="row">
               <div className="column">accounts</div>
               <div className="column column-75">{accounts}</div>
            </div>
            <div className="row">
              <div className="column">network ID</div>
              <div className="column column-75">{network}</div>
            </div>
            <div className="row">
              <div className="column">node</div>
              <div className="column column-75">{node}</div>
            </div>
            <div className="row">
              <div className="column">api</div>
              <div className="column column-75">{api}</div>
            </div>
            <div className="row">
              <div className="column">host</div>
              <div className="column column-75">{host}</div>
            </div>
            <div className="row">
              <div className="column">isConnected</div>
              <div className="column column-75">{isConnected ? 'true' : 'false'}</div>
            </div>
            <div className="row">
              <div className="column">compilers</div>
              <div className="column column-75">{compilers}</div>
            </div>
          </div>
        </div>
        { isLoading ? <div className="loading" /> : null }
      </div>
    )
  }
}
