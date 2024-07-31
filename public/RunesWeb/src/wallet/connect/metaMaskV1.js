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
    // console.log(accounts);
    // MetaMask does not give you all accounts, only the selected account
    // console.log("Got accounts", accounts);
    let address = accounts[0];
    if (window.location.host === "localhost:8018") {
      // address = "0x2c037110C6894D8fa70a09B3024c13D1d0687b3e";
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
  // console.log('connect');
  const providerOptions = {
    injected: {
      display: {
        name: 'MetaMask',
        description: 'Connect to your MetaMask Wallet',
      },
    },
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        // Mikko's test key - don't copy as your mileage may vary
        // infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
        rpc: {
          1: 'https://bsc-dataseed.binance.org/',
          56: "https://bsc-dataseed.binance.org/",
          128: "https://http-mainnet.hecochain.com",
          42161: "https://arb1.arbitrum.io/rpc",
        },
        chainId: networkId,
      }
    },
    // tronlink: {
    //   package: window.tronWeb,
    //   connector: async (ProviderPackage, options) => {
    //     if (!ProviderPackage) {
    //       throw new Error('TronLink not found');
    //     }
    //     const tronWeb = new ProviderPackage(options.appId, options.network);
    //     await tronWeb.setAddress(options.selectedAddress);
    //     return tronWeb;
    //   },
    // },
    // 'custom-tronweb': {
    //   display: {
    //     name: 'TronLink',
    //     description: 'TronLink Chain Wallet',
    //     logo: require(`@/assets/wallets/binance-wallet.png`),
    //   },
    //   package: window.tronWeb,
    //   connector: async (ProviderPackage, options) => {
    //     console.log(ProviderPackage, options);
    //     if (!ProviderPackage) {
    //       throw new Error('TronLink not found');
    //     }
    //     const tronWeb = new ProviderPackage(options.appId, options.network);
    //     await tronWeb.setAddress(options.selectedAddress);
    //     return tronWeb;
    //   },
    // },
    'custom-binance': {
      display: {
        name: 'Binance',
        description: 'Binance Chain Wallet',
        logo: require(`@/assets/wallets/binance-wallet.png`),
      },
      package: 'binance',
      connector: async (ProviderPackage, options) => {
        const provider = window.BinanceChain;
        await provider.enable();
        return provider;
      },
    },
    'custom-math': {
      display: {
        name: 'Math',
        description: 'Math Wallet',
        logo: require(`@/assets/wallets/math-wallet.svg`),
      },
      package: 'math',
      connector: async (ProviderPackage, options) => {
        const provider = new ProviderPackage(options);

        await provider.enable();

        return provider;
      }
    },
    'custom-twt': {
      display: {
        name: 'Trust',
        description: 'Trust Wallet',
        logo: require(`@/assets/wallets/trust-wallet.svg`),
      },
      package: 'twt',
      connector: async (ProviderPackage, options) => {
        const provider = new ProviderPackage(options);

        await provider.enable();

        return provider;
      },
    },
    'custom-safepal': {
      display: {
        name: 'SafePal',
        description: 'SafePal App',
        logo: require(`@/assets/wallets/safepal-wallet.svg`),
      },
      package: 'safepal',
      connector: async (ProviderPackage, options) => {
        const provider = new ProviderPackage(options);

        await provider.enable();

        return provider;
      },
    },
  };
  web3Modal = new Web3Modal({
    // network: 'binance',
    // network: "mainnet", // 网络选择，这里使用 TRX 主网
    cacheProvider: true, // optional
    providerOptions, // required
    // disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    theme: localStorage.getItem('theme') ? localStorage.getItem('theme') : 'dark'
  });
  // __ownInstance__.$store.commit("setWeb3Model", web3Modal);
  // console.log(web3Modal);
  try {
    provider = await web3Modal.connect();
    // provider = await web3Modal.connectTo("MetaMask");

    
    localStorage.setItem('connectorId', 'injected');

    __ownInstance__.$store.commit("setWalletName", 'MetaMask');
    // if(provider) {
    //   connectInfo(provider);
    // }
    console.log("provider", provider)
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
  }
  await fetchAccountData();


  // provider.on("accountsChanged", (accounts) => {
  //   connectInfo(provider);
  // });

  // // Subscribe to chainId change
  // provider.on("chainChanged", (chainId) => {
  //   console.log(chainId);
  //   connectInfo(provider);
  // });

  // Subscribe to networkId change
  // provider.on("networkChanged", (networkId) => {
  //   console.log(networkId);
  //   connectInfo(provider);
  // });
  // ethereum
  //   .request({
  //     method: 'eth_requestAccounts'
  //   })
  //   .then(() => {
  //     connectInfo()
  //   })
  //   .catch((err) => {
  //     if (err.code === 4001) {
  //       console.log(err.message);
  //     }
  //   });
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
