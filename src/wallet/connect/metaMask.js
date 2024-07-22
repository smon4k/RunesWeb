import { ethers } from "ethers";
import Web3 from "web3"
// import WalletConnectProvider from "@walletconnect/web3-provider";
// import Web3Modal from "web3modal"
// import { WalletConnectWallet } from '@tronweb3/walletconnect-tron';

const isInstalled = () => {
  const {
    ethereum
  } = window;
  return Boolean(ethereum);
};
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
// console.log(window.WalletConnectProvider);
// console.log(window);
let web3Modal;

let provider;
let networkId;
//获取链id
export const getChainNameId = async (name) => {
  let chainName = name || localStorage.getItem('chainName');
  let networkId = 128; 
  if(chainName && chainName !== undefined) {
    if(chainName === 'HECO') {
      networkId = 128;
    }
    if(chainName === 'ARB') {
      networkId = 42161;
    }
    if(chainName === 'BSC') {
      networkId = 56;
    }
  }
  return networkId;
}
setTimeout(async () => {
  networkId = await getChainNameId();  //获取链网络id
}, 100)

export const fetchAccountData = async () => {
  if (!isInstalled()) {
    alert('您未安装metamask')
    return
  };
  // console.log('selectedAddress', ethereum.selectedAddress, localStorage.getItem('connectorId'));
  if (ethereum.selectedAddress && ethereum.selectedAddress !== null && localStorage.getItem('connectorId')) {
    // if(provider || localStorage.getItem('connectorId')) {}
    const web3 = new Web3(window.ethereum);

    // console.log("Web3 instance is", web3);

    // Get connected chain id from Ethereum node
    const chainId = await web3.eth.getChainId();
    const versionName = localStorage.getItem('versionName');
    if(chainId !== networkId && versionName === 'chain') { //如果网络chainId不一致 且公链版的话切换网络
      await networkSetup();
    }

    // Get list of accounts of the connected wallet
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);
    // MetaMask does not give you all accounts, only the selected account
    // console.log("Got accounts", accounts);
    let address = accounts[0];
    if (window.location.host === "localhost:8007") {
      address = "0x6Bc76D2224E6Fbd45E8E910aecAd1b4b15bdFb70";
      // address = "0x8936feb1b6834b979E1F6dE5A73ef14D4218F9eC";
      // address = "0x669515B8B042174deF89229c8135435a8207bFc4";
    }
    await getBaseData(chainId, accounts, address);
  } else {
    await getBaseData();
    return
  }
};

// 获取系统网络id
export const getChainId = async () => {
  const web3 = new Web3(window.ethereum);
  const chainId = await web3.eth.getChainId();
  return chainId;
}

export const connect = async () => {  
  if (!isInstalled()) {
    alert('您未安装metamask')
    return
  };
  if(window.ethereum){
    try {
      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({
        method: 'eth_requestAccounts',
        params: [
          { 
            chainId: web3.utils.numberToHex(networkId)
          }
        ], 
      }).then(async (accounts) => {
        console.log('eth_requestAccounts', accounts);
        localStorage.setItem('connectorId', 'injected');
        localStorage.setItem('walletName', 'MetaMask');
        __ownInstance__.$store.commit("setWalletName", 'MetaMask');
        const chainId = await web3.eth.getChainId();
        // console.log(chainId, networkId);
        const versionName = localStorage.getItem('versionName');
        if(chainId == 56) {
          localStorage.setItem('chainName', 'BSC');
        }
        if(chainId == 42161) {
          localStorage.setItem('chainName', 'ARB');
        }
        if(chainId == 128) {
          localStorage.setItem('chainName', 'HECO');
        }
        
        if(chainId !== networkId && versionName === 'chain') { //如果网络chainId不一致 且公链版的话切换网络
          await networkSetup();
        }
        // console.log(333);
        await fetchAccountData();
        return true;
      }).catch((error) => {
        localStorage.setItem('connectorId', '');
        localStorage.removeItem('walletName');
        __ownInstance__.$store.commit("setWalletName", '');
        console.log('eth_requestAccounts' ,error);
        return false;
      })
      // await networkSetup();
    } catch (error) {
      console.log('eth_requestAccounts' ,error);
      return false;
    }
  } else {
    alert(333);
  }
};

export const disconnectWallet = async () => {
  __ownInstance__.$store.dispatch("disconnectMetaMask");
  localStorage.removeItem('connectorId');
  localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
};

export const networkSetup = async (chainNameId) => { //切换网络
  return new Promise((resolve, reject) => {
      const provider = window.ethereum
      const web3 = new Web3(window.ethereum);
      if (provider) {
          provider.request({
              method: 'wallet_switchEthereumChain',
              params: [
                  { 
                    chainId: web3.utils.numberToHex(chainNameId || networkId)
                  }
              ], 
          }).then(() => {
            resolve(true);
          }).catch((error) => {
            resolve(false)
          })
      } else {
          reject(new Error(`window.ethereum is '${typeof provider}'`))
      }
  })
};

export const networkSetup02 = async () => { //切换网络
  return new Promise(async (resolve, reject) => {
    let tronWeb;
    if (window.tronLink.ready) {
      tronWeb = tronLink.tronWeb;
      // console.log(tronWeb.defaultAddress.base58);
    } else {
      const res = await tronLink.request({ method: 'tron_requestAccounts' });
      // console.log(res);
      if (res.code === 200) {
        tronWeb = tronLink.tronWeb;
      }
    }
    resolve(tronWeb);
  })
};

export const connectWallet = () => {
  if (window.ethereum.isMetaMask) {
    connect();
  } else {
    alert("您未安装MetaMask")
  }
}


async function getBaseData(chainId, accounts, address) {
  if (chainId && accounts && address) {
    // console.log(web3Modal);
    __ownInstance__.$store.commit("getChainId", chainId);
    __ownInstance__.$store.commit("getAccounts", accounts);
    __ownInstance__.$store.commit("getAddress", address);
    localStorage.setItem('connectorId', 'injected');
  }
  const versionName = localStorage.getItem('versionName');
  if(versionName === 'chain') { //公链版才获取pools池子数据
    // __ownInstance__.$store.dispatch('poolsTokenList') //获取pools池子数据
  }
  __ownInstance__.$store.commit("isConnected", true);
}
