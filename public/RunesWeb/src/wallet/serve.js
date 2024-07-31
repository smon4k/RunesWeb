import { fromWei, toWei, toolNumber, toFixed, byDecimals, keepDecimalNotRounding, numDiv } from '@/utils/tools'
// import { $get } from '@/utils/request'
import tokenABI from './abis/token.json'
import gameFillingABI from './abis/gameFillingABI.json'
import goblinPoolsABI from './abis/goblinPools.json'
import fairLaunchABI from './abis/fairLaunch.json'

import DicePoolsABI from './abis/DicePoolsABI.json'
import erc20ABI from './abis/erc20ABI.json'

import cakeRouterABI from './abis/cakeRouter.json'
import mdexABI from './abis/mdexABI.json'
import LuClsSysABI from './abis/LuClsSysABI.json'

import { get, post } from "@/common/axios.js";
import { $get } from '@/utils/request'
import axios from 'axios'
import { getUrlParams, getQueryString } from '@/utils/tools'
import router from '@/router'
import Address from '@/wallet/address.json'
import TOKEN from '@/wallet/token.js'
import { stripZeros } from '@ethersproject/bytes'

/**
 * 获取用户信息
 * @param {*} type 
 * @returns 
 */
export const getUserAddressInfo = async function (userAddress, currency) {
  const apiUrl = __ownInstance__.$store.state.base.apiUrl
  const address = userAddress || __ownInstance__.$store.state.base.address;
  const chainName = __ownInstance__.$store.state.base.chainName
  const re_address = getQueryString('re');
  // console.log(re_address);
  let result = [];
  if (address && address !== '') {
    let data = await $get(apiUrl + '/Api/User/getUserAddressInfo?address=' + address + '&re_address=' + re_address + '&currency=' + currency);
    if (data && data.code == 10000) {
      result = data.data;
    }
  }
  return result;
}

/* 根据币种获取币种信息
 * @param {*} type 
 * @returns 
 */
export const getCurrencyToken = async function (currency) {
  const apiUrl = __ownInstance__.$store.state.base.apiUrl
  const chainName = __ownInstance__.$store.state.base.chainName
  let result = [];
  if (currency && currency !== '') {
    let data = await $get(apiUrl + '/Api/User/getCurrencyToken?currency=' + currency + '&chainName=' + chainName);
    if (data && data.code == 10000) {
      result = data.data;
    }
  }
  return result;
}

/* 根据币种获取币种信息

 * @param {*} type 
 * @returns 
 */
export const getCurrencyTokenList = async function () {
  const apiUrl = __ownInstance__.$store.state.base.apiUrl
  const chainName = __ownInstance__.$store.state.base.chainName
  let result = [];
  if (chainName && chainName !== '') {
    let data = await $get(apiUrl + '/Api/User/getCurrencyTokenList?chainName=' + chainName);
    if (data && data.code == 10000) {
      result = data.data;
    }
  }
  return result;
}

/**
 * 获取用户余额信息
 * @param {*} type 
 * @returns 
 */
export const getUserBalanceInfo = async function (currency) {
  const apiUrl = __ownInstance__.$store.state.base.apiUrl
  const address = __ownInstance__.$store.state.base.address;
  const chainName = __ownInstance__.$store.state.base.chainName
  let result = [];
  if (address && address !== '') {
    let data = await $get(apiUrl + '/Api/User/getUserInfo?address=' + address + '&currency=' + currency + '&chain=' + chainName);
    if (data && data.code == 10000) {
      result = data.data;
    }
  }
  return result;
}

// 获取用户平台余额
export const getUserPlatformBalance = async function (currency, decimal=4) {
  // console.log(currency);
  const transactionCurrency = __ownInstance__.$store.state.base.transactionCurrency;
  let transactionCurrencyCase = currency && currency.toLowerCase() || transactionCurrency.toLowerCase();
  let userBalanceInfo = await getUserBalanceInfo(transactionCurrencyCase);
  let balance = Number(userBalanceInfo.local_balance) + Number(userBalanceInfo.wallet_balance) + Number(userBalanceInfo.trial_balance);
  // console.log(userBalanceInfo);
  let platformBalance = keepDecimalNotRounding(balance, decimal, true);
  return platformBalance;

}

// 获取余额
export async function getBalance(tokenAddress, decimals, poolAddress) {
  const address = poolAddress || __ownInstance__.$store.state.base.address
  const walletName = poolAddress || __ownInstance__.$store.state.base.walletName
  const chainName = __ownInstance__.$store.state.base.chainName
  const transactionCurrency = __ownInstance__.$store.state.base.transactionCurrency
  if (!address || address == undefined || address == '') {
    return 0;
  }
  if(!tokenAddress || tokenAddress == '') {
    return 0;
  }
  let balance = 0;
  if (tokenAddress === '0x0000000000000000000000000000000000000000') {
    balance = await new web3.eth.getBalance(address)
    return fromWei(balance, decimals)
  }
  let Gwei1 = 0;
  if(decimals !== 18) {
    Gwei1 = Math.pow(10, decimals);
  }
  // console.log(tokenAddress, address);
  // const contract = await tronLink.tronWeb.contract().at('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t');
  // let balances = await contract.balanceOf(address).call();
  // balances = balances.toNumber() / 10 ** 6; // 将余额从最小单位转换为USDT

  // console.log(balances);
  try {
    if(walletName === 'MetaMask') {
      const contract = new web3.eth.Contract(tokenABI, tokenAddress);
      await contract.methods.balanceOf(address).call(function (error, result) {
        if (!error) {
          // console.log(result);
          if(decimals == 18) {
            balance = fromWei(result, decimals);
          } else {
            balance = numDiv(result, Gwei1);
          }
        } else {
          console.log('balanceErr', error);
        }
      });
    } else {
      if(chainName === 'TronGrid' && transactionCurrency === 'TRX') {
        let result = await tronLink.tronWeb.trx.getBalance(address);
        balance = result / 10 ** 6; // 将余额从最小单位转换为USDT
      } else {
        const contract = await tronLink.tronWeb.contract().at(tokenAddress);
        let result = await contract.balanceOf(address).call();
        balance = result.toNumber() / 10 ** 6; // 将余额从最小单位转换为USDT
      }
    }
  } catch (err) {
    console.log(err);
  }
  return balance;
}

// 是否授权
export const isApproved = async function (tokenAddress, decimals, amount, otherAddress) {
  if (tokenAddress === '0x0000000000000000000000000000000000000000') return true
  const account = __ownInstance__.$store.state.base.address;
  if (!account || account == undefined || account == '') {
    return false;
  }
  const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
  let contract = otherAddress || __ownInstance__.$store.state.base.bankAddress
  let approveAmount = 0;
  await tokenContract.methods.allowance(account, contract).call(function (error, result) {
    if (error) {
      return false;
    }
    approveAmount = result;
    // console.log('检查授权' , approveAmount);

  })
  return Number(toWei(amount.toString(), decimals)) < approveAmount;
}

/**
 * 庄家 获取用户庄家余额 桌子的balance *  lusdshares/sharesTotal
 * @param {*} tokenAddress 桌子地址
 * @param {*} userAddress 用户钱包地址
 * @param {*} decimals 位数
 * @returns 
 */
export async function getDiceDealerBalance(tokenAddress = '', userAddress='', decimals=18) {
  const address = userAddress || __ownInstance__.$store.state.base.address;
  const contractAddress = tokenAddress;
  console.log(tokenAddress);
  const contract = new web3.eth.Contract(DicePoolsABI, contractAddress);
  let num = 0;
  try{
    let balance = await getDiceBalanceOf(tokenAddress);
    let lusdshares = await getDiceLusdShares(tokenAddress, address);
    let sharesTotal = await getDiceSharesTotal(tokenAddress);
    let num = balance * lusdshares / sharesTotal;
    // console.log(sharesTotal);
    return keepDecimalNotRounding(num, 8);
  } catch (err) {
    console.log(err);
  }
}

// 庄家 用户每个庄家的股份数
export async function getDiceLusdShares(tokenAddress = '', userAddress='', decimals=18) {
  const address = userAddress || __ownInstance__.$store.state.base.address;
  const contractAddress = tokenAddress;
  const contract = new web3.eth.Contract(DicePoolsABI, contractAddress);
  let num = 0;
  await contract.methods.lusdshares(address).call((error, result) => {
    console.log(result);
    if (!error) {
      num = keepDecimalNotRounding(fromWei(result.toString(), decimals), 8, true)
    } else {
      console.log('lusdshares', error);
    }
  });
  return num;
}

//庄家 获取币的总余额
export async function getDiceBalanceOf(tokenAddress = '', decimals=18) {
  const contractAddress = tokenAddress;
  const chainName = __ownInstance__.$store.state.base.chainName;
  const contract = new web3.eth.Contract(erc20ABI, TOKEN[chainName].LUSD);
  let num = 0;
  await contract.methods.balanceOf(contractAddress).call((error, result) => {
    if (!error) {
      num = keepDecimalNotRounding(fromWei(result.toString(), decimals), 8, true)
    } else {
      console.log('balanceOf', error);
    }
  });
  return num;
}

//庄家 获取合约总股份余额
export async function getDiceSharesTotal(tokenAddress = '', decimals=18) {
  const contractAddress = tokenAddress;
  const contract = new web3.eth.Contract(DicePoolsABI, contractAddress);
  let num = 0;
  await contract.methods.sharesTotal().call((error, result) => {
    if (!error) {
      num = keepDecimalNotRounding(fromWei(result.toString(), decimals), 8, true)
    } else {
      console.log('sharesTotal', error);
    }
  });
  return num;
}

//上下庄 - 记录上下庄记录到数据库 修改上下庄状态为进行中
export const setDealerRecord = async (params = {}) => {
  const apiUrl = __ownInstance__.$store.state.base.apiUrl;
  if (params && params.hash !== '') {
    await axios.post(apiUrl + '/Api/Dealerrecord/depositWithdraw', params).then((json) => {
      if (json && json.code == 10000) {
        return true;
      }
    }).catch((error) => {
      console.log(error);
      return false;
    });
  }
  return false;
};

//上下庄-获取上下庄下一个自增id
export const getFillingIncreasingId = async function () {
  const apiUrl = __ownInstance__.$store.state.base.apiUrl;
  const address = __ownInstance__.$store.state.base.address;
  let status = 0;
  let data = await $get(apiUrl + '/Api/Depositwithdrawal/getIncreasingId?address=' + address);
  if (data && data.code == 10000) {
    status = data.data;
  }
  return status;
}


//上下庄-修改充提状态
export const saveNotifyStatus = async function (status, type = true) {
  const apiUrl = __ownInstance__.$store.state.base.apiUrl;
  const address = __ownInstance__.$store.state.base.address;
  await $get(apiUrl + '/Api/Depositwithdrawal/saveNotifyStatus?address=' + address + '&status=' + status + '&type=' + type);
}

//获取庄家余额
export const getUserDealerBalance = async function (type=0, version_type=1, user_address='') {
    const apiUrl = __ownInstance__.$store.state.base.apiUrl;
    const address = user_address || __ownInstance__.$store.state.base.address;
    const chainName = __ownInstance__.$store.state.base.chainName;
    const transactionCurrency = __ownInstance__.$store.state.base.transactionCurrency;
    let result = [];
    if(type) {
      let data = await $get(apiUrl + '/Api/Dealerrecord/getUserDealerBalance?address='+address+'&game_type=' + type + '&version_type=' + version_type + '&transactionCurrency=' + transactionCurrency);
      if (data && data.code == 10000) {
        result = data.data;
      }
    }
    return result;
}

//获取我的GLS余额汇总
export const getUserGlsBalance = async function (type=0, user_address='') {
    const apiUrl = __ownInstance__.$store.state.base.apiUrl;
    const address = user_address || __ownInstance__.$store.state.base.address;
    const chainName = __ownInstance__.$store.state.base.chainName;
    const transactionCurrency = __ownInstance__.$store.state.base.transactionCurrency;
    let result = [];
    let data = await $get(apiUrl + '/Api/Bet/getUserGlsBalance?address='+address+'&transactionCurrency=' + transactionCurrency);
    if (data && data.code == 10000) {
      result = data.data;
    }
    return result;
}

//获取币种价格
export const getCurrencyPrice = async function (type=0, user_address='') {
  const apiUrl = __ownInstance__.$store.state.base.apiUrl;
  const address = user_address || __ownInstance__.$store.state.base.address;
  const transactionCurrency = __ownInstance__.$store.state.base.transactionCurrency;
  let result = [];
  let data = await $get(apiUrl + '/Api/Bet/getCurrencyPrice?transactionCurrency=' + transactionCurrency);
  if (data && data.code == 10000) {
    result = data.data;
  }
  return result;
}

//获取所有用户钱包地址列表
export const getUserProfitData = async function (chainName='', type=0, version_type=1) {
    const apiUrl = __ownInstance__.$store.state.base.apiUrl;
    const address = __ownInstance__.$store.state.base.address;
    const transactionCurrency = __ownInstance__.$store.state.base.transactionCurrency;
    // const chainName = __ownInstance__.$store.state.base.chainName;
    let result = [];
    if(type) {
      let data = await $get(apiUrl + '/Api/Bet/getUserProfitData?page=1&game_type=' + type + '&chain=' + chainName + '&version_type=' + version_type + '&transactionCurrency=' + transactionCurrency);
      if (data && data.code == 10000) {
        result = data.data;
      }
    }
    return result;
}

//获取估值
export const getSwapPoolsAmountsOut = async function (routerContractAddress, tk0Address, tk1Address, bnbAddress, decimals=18) {
  // console.log(routerContractAddress, tk0Address, tk1Address);

  const contract = new web3.eth.Contract(mdexABI, routerContractAddress);
  let amountsOut = 0;
  let path = [];
  if (bnbAddress && bnbAddress !== '') {
    path = [tk0Address, bnbAddress, tk1Address];
  } else {
    path = [tk0Address, tk1Address];
  }
  // console.log(path);
  // const Gwei1 = 1000000000;
  let Gwei1;
  let Gwei2;
  if(decimals == 18) {
    Gwei1 = Math.pow(10, 9);
    Gwei2 = Math.pow(10, 9);
  }
  if(decimals == 6) {
    Gwei1 = Math.pow(10, 15);
    Gwei2 = Math.pow(10, 3);
  }
  await contract.methods.getAmountsOut(Gwei1, path).call(function (error, result) {
    if (!error) {
      console.log(result);
      if (bnbAddress && bnbAddress !== '') {
        amountsOut = result[2] ? result[2] / Gwei2 : 0;
      } else {
        amountsOut = result[1] ? result[1] / Gwei2 : 0;
      }
    } else {
      console.log('getAmountsOutErr', error);
    }
  });
  return amountsOut;
}


//获取 Pools 池子数据
export async function getPoolsTokensData(goblinAddress, currencyToken, pId){
  const address = __ownInstance__.$store.state.base.address
  const decimals = __ownInstance__.$store.state.base.tokenDecimals
  const chainName = __ownInstance__.$store.state.base.chainName;
  let totalTvl = await getPoolsTotalShare(goblinAddress, decimals);
  let tokenPrice = 1;
  // let tokenPrice = await getSwapPoolsAmountsOut(TOKEN[chainName].MdexRouter, currencyToken, TOKEN[chainName].USDC, null, 6) //获取池子价格
  let userBalance = 0;
  let userBalanceUsd = 0;
  let reward = 0;
  let YearPer = 0;
  let YearPerAPR = 0;
  // reward = await getPositionRewardBalance(pId, decimals); //获取奖励
  // console.log(pId, reward);
  if(address && address !== undefined && address !== '') {
    userBalance = await getPoolsUserInfo(goblinAddress); //获取我的存款余额
  }
  reward = await getPoolsPendingBonus(goblinAddress); //获取奖励
  
  let bonusPerShare = await getPoolsAccBonusPerShare(goblinAddress); //累计收益
  let lastAccBonusPerShare = await getPoolsLastAccBonusPerShare(goblinAddress); //上次累计收益
  // let lusdPrice = await getSwapPoolsAmountsOut(TOKEN[chainName].MdexRouter, TOKEN[chainName].LUSD, TOKEN[chainName].USDC) //获取lusd价格
  let lusdPrice = 1; //获取lusd价格
  let glsPrice = 1; //获取GLS价格
  let accBonus = (bonusPerShare - lastAccBonusPerShare) * 12;
  // console.log(accBonus);
  if(accBonus > 0) {
    YearPer =  (Math.pow((accBonus * lusdPrice / glsPrice / Math.pow(10, 12)) + 1, 365) - 1) * 100;
    YearPerAPR =  calcDailyDefault0(YearPer / 100, false); //apy or apr
    console.log(YearPerAPR);
  }
  // console.log(pId, bonusPerShare, tokenPrice)
  
   
  let reObj = {
    totalTvl: totalTvl,
    tokenPrice: tokenPrice,
    userBalance: userBalance,
    userBalanceUsd: userBalanceUsd,
    reward: reward,
    yearPer: YearPer,
    yearPerAPR: YearPerAPR,
  };
  return reObj;
}

//获取 Pools 总的TVL
export const getPoolsTotalShare = async function (goblinAddress, decimals) {
  const contract = new web3.eth.Contract(goblinPoolsABI, goblinAddress);
  let total = 0;
  await contract.methods.totalShare().call(function (error, result) {
    if (!error) {
      // console.log(result);
      total = fromWei(result, decimals);
    }else {
      console.log('totalShareErr' , error);
    }
  });
  return total;
}

// 获取Pools池子我的存款余额
export async function getPoolsUserInfo(contractAddr, userAddress) {
  const address = userAddress || __ownInstance__.$store.state.base.address;
  const contractAddress = contractAddr || __ownInstance__.$store.state.base.h2oPoolAddress
  const contract = new web3.eth.Contract(DicePoolsABI, contractAddress);
  let balance = 0;
  const Gwei1 = 1000000000;
  await contract.methods.userInfo(address).call(function (error, result) {
    if (!error) {
      // console.log(result);
      if(result && result['shares']) {
        balance = keepDecimalNotRounding(byDecimals(result['shares'], 18), 6, true)
      }
    }else{
      console.log('userInfo' ,error);
    }
  });
  return balance;
}

// 获取Pools池子奖励
export async function getPoolsPendingBonus(goblinAddress, number=6) {
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = goblinAddress || __ownInstance__.$store.state.base.h2oPoolAddress
  const contract = new web3.eth.Contract(DicePoolsABI, contractAddress);
  let num = 0;
  if(!address || address == undefined || address == '') {
    return num;
  }
  await contract.methods.pendingBonus(address).call((error, result) => {
    if (!error) {
      // console.log(result);
      // console.log(fromWei(result, 18));
      // num = keepDecimalNotRounding(fromWei(result, 18), number, true)
      num = fromWei(result, 18);
    }else{
      console.log('pendingBonus' ,error);
    }
  });
  return num;
}

// 获取Pools池子累计收益
export async function getPoolsAccBonusPerShare(goblinAddress) {
  const contractAddress = goblinAddress || __ownInstance__.$store.state.base.h2oPoolAddress
  const contract = new web3.eth.Contract(DicePoolsABI, contractAddress);
  let num = 0;
  await contract.methods.accBonusPerShare().call((error, result) => {
    if (!error) {
      num = result;
    }else{
      console.log('accBonusPerShare' ,error);
    }
  });
  return num;
}

// 获取H2O池子上次收益块编号数
export async function getPoolsLastAccBonusPerShare(goblinAddress) {
  const contractAddress = goblinAddress || __ownInstance__.$store.state.base.h2oPoolAddress
  const contract = new web3.eth.Contract(DicePoolsABI, contractAddress);
  let num = 0;
  await contract.methods.lastAccBonusPerShare().call((error, result) => {
    if (!error) {
      num = result
    }else{
      console.log('lastAccBonusPerShare' ,error);
    }
  });
  return num;
}

//验牌
export async function keccak256LVerify(cardsAddress) {
  const chainName = __ownInstance__.$store.state.base.chainName;
  const contractAddress = TOKEN[chainName].lverifyAddress;
  const contract = new web3.eth.Contract(DicePoolsABI, contractAddress);
  let receipt = 0;
  await contract.methods.verify(cardsAddress).call((error, result) => {
    if (!error) {
      receipt = result
    }else{
      console.log('verify' ,error);
    }
  });
  return receipt;
}

// 读取合约历史事件
export async function getPastEvents(tableAddress) {
  const chainName = __ownInstance__.$store.state.base.chainName;
  const contractAddress = tableAddress;
  const contract = new web3.eth.Contract(DicePoolsABI, contractAddress);
  let receipt = 0;
  // console.log(contract);
  await contract.getPastEvents('Dealed', {filter: {}, fromBlock: 10000, toBlock: 'latest'}).call((error, result) => {
    if (!error) {
      console.log(result);
      receipt = result
    }else{
      console.log('getPastEvents' ,error);
    }
  });
  return receipt;
}

// 获取币种充提合约余额
export async function getDepWithUserInfo(token) {
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.gamesFillingAddress
  const chainName = __ownInstance__.$store.state.base.chainName;
  const transactionCurrency = __ownInstance__.$store.state.base.transactionCurrency;
  const contract = new web3.eth.Contract(LuClsSysABI, contractAddress);
  let balance = 0;
  const Gwei1 = 1000000000;
  // console.log(token);
  await contract.methods.userInfo(token, address).call(function (error, result) {
    if (!error) {
      // console.log(result);
      if(result && result['shares']) {
        balance = keepDecimalNotRounding(byDecimals(result['shares'], 18), 6, true)
      }
    }else{
      console.log('userInfo' ,error);
    }
  });
  return balance;
}

//充提 - 记录充提记录到数据库 修改充提状态为进行中
export const setDepositWithdraw = async (params = {}) => {
  console.log(params);
  const apiUrl = __ownInstance__.$store.state.base.apiUrl;
  if (params) {
    return await axios.post(apiUrl + '/Api/Depositwithdrawal/depositWithdraw', params).then((json) => {
      if (json && json.code == 10000) {
        // console.log(111);
        return true;
      }
    }).catch((error) => {
      console.log(error);
      return false;
    });
  }
  // return false;
};

// 获取推荐关系
export const getRelations = async () => {
  const address = __ownInstance__.$store.state.base.address;
  const chainName = __ownInstance__.$store.state.base.chainName;
  const contractAddress = TOKEN[chainName].luck001;
  const contract = new web3.eth.Contract(LuClsSysABI, contractAddress);
  let resultArr = [];
  console.log(address, contractAddress);
  await contract.methods.getRelations(address).call((error, result) => {
    if (!error) {
      console.log('我的上级邀请', result);
      result.forEach(item => {
        if(item !== "0x0000000000000000000000000000000000000000") {
          resultArr.push(item);
        }
      })
      // console.log(resultArr);
    }else{
      console.log('getRelations' ,error);
    }
  });
  return resultArr;
}

//创建推荐关系
export const setRelations = async (relations = {}) => {
  // console.log(params);
  const apiUrl = __ownInstance__.$store.state.base.apiUrl;
  const address = __ownInstance__.$store.state.base.address;
  if (relations) {
    const params = {
      address: address,
      relations: relations,
    };
    await axios.post(apiUrl + '/Api/User/setRelations', params).then((json) => {
      if (json && json.code == 10000) {
        return true;
      }
    }).catch((error) => {
      console.log(error);
      return false;
    });
  }
  return false;
};

/**
 * 获取用户空投邀请人列表
 * @param {*} type 
 * @returns 
 */
export const getMyInvitationList = async function(){
  const apiUrl = __ownInstance__.$store.state.base.apiUrl
  const address = __ownInstance__.$store.state.base.address;
  let result = [];
  if(address && address !== '') {
    let data = await $get(apiUrl + '/Api/User/getUserRecommended?address='+address)
    if(data && data.code == 10000) {
      result = data.data;
    }
  }
  return result;
}







/**
 * 绑定户钱包地址
 * @param {*} type 
 * @returns 
 */
export const saveUserInfo = async function (userId = 0, address = '') {
  const apiUrl = __ownInstance__.$store.state.base.apiUrl
  let result = false;
  if (userId > 0 && address && address !== '') {
    const params = {
      userId: userId,
      address: address,
    };
    await post(apiUrl + '/Api/User/saveUserInfo', params, async (json) => {
      console.log(json);
      if (json && json.code == 10000) {
        result = true;
      } else if (json && json.code == 70001) {
        // Notify({ type: 'warning', message: json.msg });
        result = false;
      } else {
        // Notify({ type: 'warning', message: 'Error' });
        result = false;
      }
    })
  }
  return result;
}

// 获取杠杆价格
export const getToken2TokenPrice = async function (token0, token1, type, amount = 1, routerContractAddress = '') {

  if (type === 'TEST') {
    // if(token0 === Address.BUSDT) return 1
    return 1
  }


  if (token1 === 'USDT') return 1
  if (token0 === '0x0000000000000000000000000000000000000000') token0 = Address.WBNB
  if (token1 === '0x0000000000000000000000000000000000000000') token1 = Address.WBNB
  // console.log('token0' , token0);
  // console.log('token1' , token1);
  // console.log('Address.BUSDT' , Address.BUSDT);
  // if(token0 === Address.BUSDT || token1 === Address.BUSDT) return 1
  let contractAddress;
  if (token0 === Address.H2O || token1 === Address.H2O) {
    contractAddress = publicAddress.routerContractAddress;
  } else {
    contractAddress = Address.cakeRouter
  }
  // console.log('contractAddress' , contractAddress);
  const contract = new web3.eth.Contract(cakeRouterABI, contractAddress);
  let price = 0
  await contract.methods.getAmountsOut(web3.utils.toHex(toWei(amount, 18)), [token0, token1]).call(function (error, result) {
    if (!error && Array.isArray(result) && result[1]) {
      // console.log(token0, result);
      price = fromWei(result[1], 18);
    } else {
      // console.log(token0, token1, type);
      console.log('getToken2TokenPrice_err', error)
    }
  })
  return price
}


//获取游戏-充提系统-充提余额
export async function getGameFillingBalance(decimals = 18, gamesFillingAddress = '') {
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = gamesFillingAddress || __ownInstance__.$store.state.base.gamesFillingAddress;
  // console.log(contractAddress);
  const contract = new web3.eth.Contract(gameFillingABI, contractAddress);
  let num = 0;
  await contract.methods.userInfo(address).call((error, result) => {
    if (!error) {
      // console.log(result);
      num = fromWei(result.shares, decimals);
      if (result.minus) {
        num = -num;
      }
    } else {
      console.log('userInfo', error);
    }
  });
  return num;
}


//获取游戏-充提系统-修改充提记录日志状态
export const setDepWithdrawStatus = async function (deWithId, status, type = true) {
  const apiUrl = __ownInstance__.$store.state.base.apiUrl;
  const address = __ownInstance__.$store.state.base.address;
  await $get(apiUrl + '/Api/Depositwithdrawal/setDepWithdrawStatus?address=' + address + '&deWithId=' + deWithId + '&status=' + status + '&type=' + type);
}

//获取游戏-充提系统-监听充提状态是否执行完成
export const getGameFillingWithdrawStatus = async function (withdrawId) {
  const apiUrl = __ownInstance__.$store.state.base.apiUrl;
  const address = __ownInstance__.$store.state.base.address;
  let status = 0;
  let data = await $get(apiUrl + '/Api/Depositwithdrawal/getGameFillingWithdrawStatus?address=' + address + '&withdrawId=' + withdrawId);
  if (data && data.code == 10000) {
    status = data.data;
  }
  return status;
}

//记录Dice数据统计
export const setStatiscData = async function (type = 0, hashId = 0) {
  const nftUrl = __ownInstance__.$store.state.base.nftUrl;
  const address = __ownInstance__.$store.state.base.address;
  let result = [];
  let data = await $get(nftUrl + '/Hashpower/Hashpower/setStatiscData?hashId=' + hashId + '&type=' + type);
  if (data && data.code == 10000) {
    result = data.data;
  }
  return result;
}

/**
 * 获取BTC爬虫数据
 * @param {*} type 
 * @returns 
 */
export const getPoolBtcData = async function(){
  const apiUrl = __ownInstance__.$store.state.base.apiUrl
  const address = __ownInstance__.$store.state.base.address;
  let result = [];
  let data = await $get('https://www.h2o.live/getPoolBtc')
  if(data) {
    result = data;
  }
  return result;
}

//获取 HashPowerPools 池子数据
export async function getHashPowerPoolsTokensData(goblinAddress, currencyToken, pId, id){
  const address = __ownInstance__.$store.state.base.address
  const decimals = __ownInstance__.$store.state.base.tokenDecimals
  let HashpowerDetail = await getHashpowerDetail(id); //获取算力币详情
  if(!HashpowerDetail || HashpowerDetail.length < 0) {
    return false;
  }
  let totalTvl = await getPledgeNumber(id);
  // console.log(totalTvl);
  let tokenPrice = 50;
  // tokenPrice = await getToken2TokenPrice(currencyToken, Address.BUSDT) //获取池子价格
  let userBalance = 0;
  let hash_balance = 0;
  let reward = 0;
  let btcbReward = 0;
  let luckReward = 0;
  let YearPer = 0
  let H2OYearPer = 0
  let BTCBYearPer = 0
  let btcbPrice = 0
  let btcb19ProBalance = 0
  let cost_revenue = 0
  let daily_income = 0
  let currency = 0
  let annualized_income = 0
  let harvest_btcb_amount = 0
  let is_give_income = 0
  let daily_expenditure_usdt = 0
  let daily_expenditure_btc = 0
  let daily_income_usdt = 0
  let daily_income_btc = 0
  let power_consumption_ratio = 0
  let chain_address = ''
  let duration = 0
  let used_profit = 0
  let end_profit = 0
  let total_luck_income = 0
  if(id) {
    // const transaction = await new web3.eth.getTransaction("0x8247f33547a65ae8e774442a5091c8ce613b6614fd1b5fe815d4ae9126fb0de7");
    // console.log(transaction);
    let rewardHarved = await getUserIncomeHarvestedNumber(id);
    if(rewardHarved) {
      btcbReward = rewardHarved.btcb_amount;
      luckReward = rewardHarved.luck_amount;
    }
    // console.log(rewardHarved);
    // h2oReward = await getPositionRewardBalance(pId, decimals); //获取H2O奖励
    // btcbReward = await getH2OPendingBonus(goblinAddress, 8); //获取BTCB奖励
    if(address && address !== undefined && address !== '') {
      userBalance = await getPledgeNumber(id, address);
    }
    // console.log(pId, totalTvl, tokenPrice, userBalance)
    // console.log(pId, h2oReward, btcbReward)
    // let bonusPerShare = await getH2OAccBonusPerShare(goblinAddress); //累计收益
    // let lastAccBonusPerShare = await getH2OLastAccBonusPerShare(goblinAddress); //上次累计收益
    // let cakePrice = await getToken2TokenPrice("0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82", Address.BUSDT) //获取Cake价格
    // let btcbPrice = await getSwapPoolsAmountsOut(publicAddress.routerContractAddress, Address.BTCB , Address.BUSDT ); //获取水价格
    btcbPrice = await getToken2TokenPrice(Address.BTCB, Address.BUSDT) //获取btcb价格
    // console.log(btcbPrice);
    // console.log(reptileBtcData);
    // btcb19ProBalance = await getBalance(currencyToken, 18); //获取购买算力币余额
    cost_revenue = HashpowerDetail.cost_revenue; //估值
    daily_income = HashpowerDetail.daily_income; //日收益率
    currency = HashpowerDetail.currency; //交易币种
    annualized_income = HashpowerDetail.annualized_income; //年化收益率
    harvest_btcb_amount = HashpowerDetail.harvest_btcb_amount; //已收割奖励数量
    is_give_income = HashpowerDetail.is_give_income; //是否显示昨日收益 大于第一次质押时间一天 给收益
    daily_expenditure_usdt = HashpowerDetail.daily_expenditure_usdt //日支出 usdt
    daily_expenditure_btc = HashpowerDetail.daily_expenditure_btc //日支出 btc
    daily_income_usdt = HashpowerDetail.daily_income_usdt //日收益 usdt
    daily_income_btc = HashpowerDetail.daily_income_btc //日收益 btc
    power_consumption_ratio = HashpowerDetail.power_consumption_ratio //功耗比
    chain_address = HashpowerDetail.chain_address //合约地址
    duration = HashpowerDetail.duration //剩余毫秒时间戳
    used_profit = HashpowerDetail.used_profit //已使用收益数量
    end_profit = HashpowerDetail.end_profit //已使用收益数量
    total_luck_income = HashpowerDetail.total_luck_income //已使用收益数量
    hash_balance = HashpowerDetail.hash_balance //用户算力余额
  } 
  let reObj = {
    totalTvl: totalTvl,
    tokenPrice: tokenPrice,
    userBalance: userBalance,
    hash_balance: hash_balance,
    reward: reward,
    btcbReward: btcbReward,
    luckReward: luckReward,
    yearPer: YearPer,
    h2oYearPer: H2OYearPer,
    btcbYearPer: BTCBYearPer,
    btcbPrice: btcbPrice,
    btcb19ProBalance: btcb19ProBalance,
    cost_revenue: cost_revenue,
    daily_income: daily_income,
    currency: currency,
    annualized_income: annualized_income,
    harvest_btcb_amount: harvest_btcb_amount,
    is_give_income: is_give_income,
    daily_expenditure_usdt: daily_expenditure_usdt,
    daily_expenditure_btc: daily_expenditure_btc,
    daily_income_usdt: daily_income_usdt,
    daily_income_btc: daily_income_btc,
    power_consumption_ratio: power_consumption_ratio,
    chain_address: chain_address,
    duration: duration,
    used_profit: used_profit,
    end_profit: end_profit,
    total_luck_income: total_luck_income,
  };
  return reObj;
}

//获取算力币详情
export const getHashpowerDetail = async function(hashId){
  const apiUrl = __ownInstance__.$store.state.base.apiUrl;
  const address = __ownInstance__.$store.state.base.address;
  let result = [];
  let data = await $get(apiUrl + '/Hashpower/Hashpower/getHashpowerDetail?hashId='+hashId+'&address='+address);
  if(data && data.code == 10000) {
    result = data.data;
  }
  return result;
}

//获取用户购买算力币余额
export const getUserHashpowerBalance = async function(hashId){
  const apiUrl = __ownInstance__.$store.state.base.apiUrl;
  const address = __ownInstance__.$store.state.base.address;
  let result = [];
  let data = await $get(apiUrl + '/Hashpower/Hashpower/getUserHashpowerBalance?hashId='+hashId+'&address='+address);
  if(data && data.code == 10000) {
    result = data.data;
  }
  return result;
}

//获取用户购买质押余额
export const getUserHashpowerPledgeBalance = async function(hashId){
  const apiUrl = __ownInstance__.$store.state.base.apiUrl;
  const address = __ownInstance__.$store.state.base.address;
  let result = [];
  let data = await $get(apiUrl + '/Hashpower/Hashpower/getUserHashpowerPledgeBalance?hashId='+hashId+'&address='+address);
  if(data && data.code == 10000) {
    result = data.data;
  }
  return result;
}

//获取用户购买质押余额
export const getPledgeNumber = async function(hashId){
  const apiUrl = __ownInstance__.$store.state.base.apiUrl;
  const address = __ownInstance__.$store.state.base.address;
  let result = [];
  let data = await $get(apiUrl + '/Hashpower/Hashpower/getPledgeNumber?hashId='+hashId+'&address='+address);
  if(data && data.code == 10000) {
    // console.log(data);
    result = data.data;
  }
  return result;
}

//获取用户收益待收获数量
export const getUserIncomeHarvestedNumber = async function(hashId){
  const apiUrl = __ownInstance__.$store.state.base.apiUrl;
  const address = __ownInstance__.$store.state.base.address;
  let result = [];
  let data = await $get(apiUrl + '/Hashpower/Hashpower/getUserIncomeNumber?hashId='+hashId+'&address='+address);
  if(data && data.code == 10000) {
    // console.log(data);
    result = data.data;
  }
  return result;
}