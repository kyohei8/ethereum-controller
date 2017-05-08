/*
import React from 'react'
import Head from 'next/head'
import 'isomorphic-fetch'
import Web3 from 'web3';

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

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

export default class extends React.Component {
  static async getInitialProps () {
    const { api } = web3.version;
    const network = await new Promise((resolve, reject) => {
      web3.version.getNetwork((error, result) => {
        resolve(result);
      });
    });
    const node = await new Promise((resolve, reject) => {
      web3.version.getNode((error, result) => {
        resolve(result);
      });
    });
    const { host } = web3.currentProvider;
    const compilers = web3.eth.getCompilers();
    const isConnected = web3.isConnected();
    // net
    const { peerCount } = web3.net;
    // eth
    const { accounts, coinbase, mining, blockNumber, hashrate, syncing, getBalance } = web3.eth;
    const balance = web3.fromWei(getBalance(coinbase), 'ether').toString(10);
    // block
    const blockInfo  = web3.eth.getBlock(blockNumber);

    return {
      network, api, node,
      host, compilers,
      isConnected, peerCount, accounts,
      coinbase, mining, blockNumber,
      hashrate, syncing, balance, blockInfo
    }
  }

  constructor (props) {
    super(props)
    this._timer = null;
    // propsとしてもつものとそうでないものを分ける・・？
    this.state = {
      isLoading: false,
      mining: props.mining,
      coinbase: props.coinbase,
      blockNumber: props.blockNumber,
      hashrate: props.hashrate,
      peerCount: props.peerCount,
      price: 0,
      blockInfo: props.blockInfo,
      balance: props.balance,
      autoRefresh: false,
    }
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
      web3.eth.getCoinbase((error, result) => {
        resolve(result);
      });
    });

    const _balance = await new Promise((resolve, reject) => {
      web3.eth.getBalance(coinbase, (error, result) => {
        resolve(result.toString(10));
      });
    });

    const balance = web3.fromWei(_balance, 'ether').toString(10);

    const mining = await new Promise((resolve, reject) => {
      web3.eth.getMining((error, result) => {
        resolve(result);
      });
    });

    const blockNumber = await new Promise((resolve, reject) => {
      web3.eth.getBlockNumber((error, result) => {
        resolve(result);
      });
    });

    const blockInfo = await new Promise((resolve, reject) => {
      web3.eth.getBlock(blockNumber, (error, result) => {
        resolve(result);
      });
    });

    const hashrate = await new Promise((resolve, reject) => {
      web3.eth.getHashrate((error, result) => {
        resolve(result);
      });
    });

    const price = await new Promise((resolve, reject) => {
      web3.eth.getGasPrice((error, result) => {
        resolve(result.toString(10));
      });
    });

    const peerCount = await new Promise((resolve, reject) => {
      web3.net.getPeerCount((error, result) => {
        resolve(result);
      });
    });

    this.setState({
      mining, hashrate, coinbase,
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
      coinbase,
      mining,
      hashrate,
      peerCount,
      price,
      balance,
      blockInfo,
      blockNumber,
      isLoading,
      autoRefresh
    } = this.state;
    const {
      network, api, node,
      host, compilers,
      isConnected,
      accounts,
      syncing
    } = this.props;

    const autoRefreshText = autoRefresh ? 'disable auto refresh' : 'enable auto refresh';
    const autoRefreshText2 = autoRefresh ? 'Running' : '';
    return (
      <div>
        <Head>
          <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Roboto:300,300italic,700,700italic" />
          <link rel="stylesheet" href="/static/styles/normalize.css" />
          <link rel="stylesheet" href="/static/styles/milligram.min.css" />
          <link rel="stylesheet" href="/static/styles/app.css" />
        </Head>
        <div className="wrapper">
          <div className="container">
            <h3><span>eth</span>
              <button className="button" href="#" onClick={this.refresh.bind(this)}>refresh</button>
              <button className="button button-outline" href="#" onClick={this.toggleAutoRefresh.bind(this)}>{autoRefreshText}</button>
              <span className="running">{autoRefreshText2}</span>
            </h3>
            <div className="row">
               <div className="column">coinbase</div>
               <div className="column column-75">{coinbase}</div>
            </div>
            <div className="row">
              <div className="column">isMining</div>
              <div className="column column-75">{mining ? '⛏' : '👷'}</div>
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
              <div className="column column-75">{balance} ehter</div>
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
*/
