import Web3 from "web3"

const isInstalled = () => {
  const {
    tronLink
  } = window;
  return Boolean(tronLink);
};
// const Web3Modal = window.Web3Modal.default;
// const WalletConnectProvider = window.WalletConnectProvider.default;
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

// 获取系统网络id
export const getChainId = async () => {
  const web3 = new Web3(window.ethereum);
  const chainId = await web3.eth.getChainId();
  return chainId;
}

export const connect = async () => {  
  if (!isInstalled()) {
    alert('您未安装TronLink')
    return
  };
  // console.log('connect');
  // __ownInstance__.$store.commit("setWeb3Model", web3Modal);
  // console.log(web3Modal);
  try {

    let tronWeb = await networkSetup02();
    console.log(tronWeb);
    if(tronWeb) {

      // new Web3(tronWeb);

      localStorage.setItem('connectorId', 'injected');

      localStorage.setItem('walletName', 'TronLink');
      
      __ownInstance__.$store.commit("setWalletName", 'TronLink');

      localStorage.setItem('chainName', 'TronGrid');

      let address = tronWeb.defaultAddress.base58;
      // console.log(address);
      if (window.location.host === "localhost:8018") {
        address = "TXdskkJkmShWUz1gJDS1Xtk8idaqngkBvL";
      }
      await getBaseData(address);
      return true;
    }

  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return false;
  }
};

export const disconnectWallet = async () => {
  __ownInstance__.$store.dispatch("disconnectMetaMask");
  localStorage.removeItem('connectorId');
  localStorage.removeItem('WEB3_CONNECT_CACHED_PROVIDER');
};

/**
 * 切换网络
 * @returns tronWeb
 */
export const networkSetup02 = async () => { 
  return new Promise(async (resolve, reject) => {
    let tronWeb;
    if (window.tronLink.ready) {
      tronWeb = tronLink.tronWeb;
      resolve(tronWeb);
      // console.log(tronLink, tronWeb.defaultAddress.base58);
    } else {
      const res = await tronLink.request({ method: 'tron_requestAccounts' });
      console.log(tronLink, res);
      if(res) {
        if (res.code === 200) {
          tronWeb = tronLink.tronWeb;
          resolve(tronWeb);
        } else {
          localStorage.setItem('connectorId', '');
          localStorage.removeItem('walletName');
          __ownInstance__.$store.commit("setWalletName", '');
          // alert(res.message)
        }
      } else {
        alert('Please confirm whether the TronLink wallet is successfully connected')
      }
    }
    resolve(false);
  })
};

export const connectTronWebWallet = async () => {
  // console.log(window.tronLink);
  if (window.tronLink) {
    await connect();
  } else {
    alert("您未安装tronLink")
  }
}


async function getBaseData( address) {
  if (address) {
    // console.log(web3Modal);
    // __ownInstance__.$store.commit("getChainId", chainId);
    // __ownInstance__.$store.commit("getAccounts", accounts);
    __ownInstance__.$store.commit("getAddress", address);
    localStorage.setItem('connectorId', 'injected');
  }
  const versionName = localStorage.getItem('versionName');
  if(versionName === 'chain') { //公链版才获取pools池子数据
    // __ownInstance__.$store.dispatch('poolsTokenList') //获取pools池子数据
  }
  __ownInstance__.$store.commit("isConnected", true);
}
