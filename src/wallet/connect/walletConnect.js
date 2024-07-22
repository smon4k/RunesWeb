import Web3 from "web3"
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
console.log(WalletConnectProvider);
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

export const walletConnect = async () => {  
  // console.log('connect');
  // __ownInstance__.$store.commit("setWeb3Model", web3Modal);
  // console.log(web3Modal);
  try {

    provider = new WalletConnectProvider({
      // 配置选项
      qrcodeModalOptions: {
        title: 'Scan QR Code',
        description: 'Scan the QR code with your WalletConnect app',
      },
      network: {
        chainId: networkId,
        networkName: '',
      },
      rpc: {
        // 取决于你要连接的网络
        rpcUrl: '',
      },
    });
    provider.disconnect();
    provider.enable().then(async (accounts) => {
      // 连接成功，获取连接的账户
      localStorage.setItem('connectorId', 'injected');

      localStorage.setItem('walletName', 'WalletConnect');
      
      __ownInstance__.$store.commit("setWalletName", 'WalletConnect');

      let address = accounts[0];
      // console.log(address);
      if (window.location.host === "localhost:8007") {
        // address = "0x6Bc76D2224E6Fbd45E8E910aecAd1b4b15bdFb70";
        // address = "0x8936feb1b6834b979E1F6dE5A73ef14D4218F9eC";
        // address = "0x669515B8B042174deF89229c8135435a8207bFc4";
      }
      await getBaseData(networkId, accounts, address);
    }).catch((error) => {
      // 连接失败，处理错误
      localStorage.setItem('connectorId', '');
      localStorage.removeItem('walletName');
      __ownInstance__.$store.commit("setWalletName", '');
      console.error(error);
    });
    
    
    

  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
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
          alert(res.message)
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


async function getBaseData( chainId, accounts, address ) {
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
