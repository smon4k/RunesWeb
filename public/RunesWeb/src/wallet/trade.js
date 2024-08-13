
import {  fromWei , toWei, keepDecimalNotRounding } from '@/utils/tools'
import { toolNumber, numMulti } from '@/utils/tools'
import  tokenABI from './abis/token.json'
import CFXsContractMainABI from './abis/CFXsContractMainABI.json'
import gameFillingABIV2 from './abis/gameFillingABIV2.json'
import LuClsSysABI from './abis/LuClsSysABI.json'
import hashpowerABI from './abis/hashpowerABI.json'
import goblinPoolsABI from './abis/goblinPools.json'
import DicePoolsABI from './abis/DicePoolsABI.json'
import {saveNotifyStatus, setDepositWithdraw, saveTransactionTask} from "@/wallet/serve";
import Address from '@/wallet/address.json'

// 领取空投奖励

const mintBankErr = [
  {
    key:'Debt scale is out of scope',
    val:'Debt scale is out of scope'
  },
  {
    key:'bad work factor',
    val:'Price matters too much'
  },
]

// 授权
export const approve =  function (tokenAddress, otherAddress, amount, decimals) {
  const account = __ownInstance__.$store.state.base.address;
  const approveAmount = (amount &&  decimals)? web3.utils.toHex(toWei(amount , decimals))  : web3.utils.toHex(toolNumber(1.157920892373163*Math.pow(10 , 59)))
  const tokenContract = new web3.eth.Contract(tokenABI, tokenAddress);
  const contract = otherAddress;
  const approveEncodedABI = tokenContract.methods
    .approve(contract, approveAmount)
    .encodeABI();
  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(account).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateParams ={
        from: account,
        to: tokenAddress, // 池地址
        data: approveEncodedABI, // Required
      }
      let estimateGas = await web3.eth.estimateGas(estimateParams)
        const params = [{
          chainId: __ownInstance__.$store.state.base.chainId,
          nonce: web3.utils.toHex(transactionNonce),
          // gasLimit: web3.utils.toHex(6000000),
          gasLimit: web3.utils.toHex(estimateGas),
          gasPrice: web3.utils.toHex(gasPrice),
          to: tokenAddress,
          from: account,
          data: approveEncodedABI
        }];
        web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
      
    });
  })
}

// 购买
export const unlockingScriptbatch = async function (cfxsIds=[], amounts=[], usdIds=[]) {
  console.log(cfxsIds, amounts);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = Address.CFXsContractAddress;
  const contract = new web3.eth.Contract(CFXsContractMainABI, contractAddress);
  // let amount = web3.utils.toHex(toWei(recomAmount, 18));
  let encodedABI = contract.methods.UnlockingScriptbatch(cfxsIds, amounts, usdIds).encodeABI();
  let timestamp = new Date().getTime().toString();
  __ownInstance__.$store.dispatch('createOrderForm', { val: 0, id: timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress,
        data: encodedABI,
      })
      console.log('estimateGas', estimateGas)
      const params = [{
        from: address,
        to: contractAddress,
        data: encodedABI,
        gasPrice: web3.utils.toHex(gasPrice),
        gas: web3.utils.toHex(estimateGas),
        // gas: web3.utils.toHex(50000),
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', async (hash) => {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
            const params = {
              "address": address,
              "hash": hash,
              "type": 1,
              "data": {
                  "cfxsIds": cfxsIds,
                  "sendaddr": address,
                  "hash": hash,
              }
            };
            await saveTransactionTask(params);
            // __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 1, hash: hashInfo })
          resolve()
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 2, hash: hashInfo, isUserDeny: isUserDeny, isFailed: true })
          console.log('err', err)
          reject(err)
        })
    })
      .catch(err => {
        console.log('getTransactionCount', err)
        __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 2, hash: hashInfo, isUserDeny: false, isFailed: true })
        reject(err)
      })
  })
}

// 出售
export const lockingScriptbatch = async function (cfxsIds=[], amounts=[], usdIds=[], lockhours=24) {
  console.log(cfxsIds, amounts);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = Address.CFXsContractAddress;
  const contract = new web3.eth.Contract(CFXsContractMainABI, contractAddress);
  // let amount = web3.utils.toHex(toWei(recomAmount, 18));
  let encodedABI = contract.methods.LockingScriptbatch(cfxsIds, usdIds, amounts, lockhours).encodeABI();
  let timestamp = new Date().getTime().toString();
  __ownInstance__.$store.dispatch('createOrderForm', { val: 0, id: timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress,
        data: encodedABI,
      })
      console.log('estimateGas', estimateGas)
      const params = [{
        from: address,
        to: contractAddress,
        data: encodedABI,
        gasPrice: web3.utils.toHex(gasPrice),
        gas: web3.utils.toHex(estimateGas),
        // gas: web3.utils.toHex(50000),
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', async (hash) => {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
            const params = {
              "address": address,
              "hash": hash,
              "type": 2,
              "data": {
                  "cfxsIds": cfxsIds,
                  "amounts": amounts,
                  "sendaddr": address,
                  "hash": hash,
                  "lockhours": lockhours,
              }
          };
          await saveTransactionTask(params);
            // __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 1, hash: hashInfo })
          resolve()
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 2, hash: hashInfo, isUserDeny: isUserDeny, isFailed: true })
          console.log('err', err)
          reject(err)
        })
    })
      .catch(err => {
        console.log('getTransactionCount', err)
        __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 2, hash: hashInfo, isUserDeny: false, isFailed: true })
        reject(err)
      })
  })
}

//取消出售
export const ownerUnlockingScript = async function (cfxsId='') {
  console.log(cfxsId);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = Address.CFXsContractAddress;
  const contract = new web3.eth.Contract(CFXsContractMainABI, contractAddress);
  // let amount = web3.utils.toHex(toWei(recomAmount, 18));
  let encodedABI = contract.methods.OwnerUnlockingScript(cfxsId).encodeABI();
  let timestamp = new Date().getTime().toString();
  __ownInstance__.$store.dispatch('createOrderForm', { val: 0, id: timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress,
        data: encodedABI,
      })
      console.log('estimateGas', estimateGas)
      const params = [{
        from: address,
        to: contractAddress,
        data: encodedABI,
        gasPrice: web3.utils.toHex(gasPrice),
        gas: web3.utils.toHex(estimateGas),
        // gas: web3.utils.toHex(50000),
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', async (hash) => {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
            const params = {
              "address": address,
              "hash": hash,
              "type": 3,
              "data": {
                  "cfxsId": cfxsId,
                  "sendaddr": address,
                  "hash": hash,
              }
            };
            await saveTransactionTask(params);
            // __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 1, hash: hashInfo })
          resolve()
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 2, hash: hashInfo, isUserDeny: isUserDeny, isFailed: true })
          console.log('err', err)
          reject(err)
        })
    })
      .catch(err => {
        console.log('getTransactionCount', err)
        __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 2, hash: hashInfo, isUserDeny: false, isFailed: true })
        reject(err)
      })
  })
}

//合并、拆分交易
export const processTransaction = async function (cfxsIds=[], outputs=[], type=0) {
  console.log(cfxsIds, outputs);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = Address.CFXsContractAddress;
  const contract = new web3.eth.Contract(CFXsContractMainABI, contractAddress);
  // let amount = web3.utils.toHex(toWei(recomAmount, 18));
  let encodedABI = contract.methods.processTransaction(cfxsIds, outputs).encodeABI();
  let timestamp = new Date().getTime().toString();
  __ownInstance__.$store.dispatch('createOrderForm', { val: 0, id: timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress,
        data: encodedABI,
      })
      console.log('estimateGas', estimateGas)
      const params = [{
        from: address,
        to: contractAddress,
        data: encodedABI,
        gasPrice: web3.utils.toHex(gasPrice),
        gas: web3.utils.toHex(estimateGas),
        // gas: web3.utils.toHex(50000),
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', async (hash) => {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
            let params = {};
            if(type == 1) {
              params = {
                "address": address,
                "hash": hash,
                "type": 4,
                "data": {
                    "cfxsIds": cfxsIds,
                    "amount": outputs[0],
                    "sendaddr": address,
                    "newCfxId": "",
                    "hash": hash,
                }
              };
            } else {
              params = {
                "address": address,
                "hash": hash,
                "type": 5,
                "data": {
                    "cfxsId": cfxsIds[0],
                    "amounts": outputs,
                    "sendaddr": address,
                    "newCfxIds": [],
                    "hash": hash,
                }
              };
            }
            await saveTransactionTask(params);
            // __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 1, hash: hashInfo })
          resolve()
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 2, hash: hashInfo, isUserDeny: isUserDeny, isFailed: true })
          console.log('err', err)
          reject(err)
        })
    })
      .catch(err => {
        console.log('getTransactionCount', err)
        __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 2, hash: hashInfo, isUserDeny: false, isFailed: true })
        reject(err)
      })
  })
}

//转增交易
export const transfer = async function (cfxsIds=[], toaddress="") {
  console.log(cfxsIds, toaddress);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = Address.CFXsContractAddress;
  const contract = new web3.eth.Contract(CFXsContractMainABI, contractAddress);
  // let amount = web3.utils.toHex(toWei(recomAmount, 18));
  let encodedABI = contract.methods.transfer(cfxsIds, toaddress).encodeABI();
  let timestamp = new Date().getTime().toString();
  __ownInstance__.$store.dispatch('createOrderForm', { val: 0, id: timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress,
        data: encodedABI,
      })
      console.log('estimateGas', estimateGas)
      const params = [{
        from: address,
        to: contractAddress,
        data: encodedABI,
        gasPrice: web3.utils.toHex(gasPrice),
        gas: web3.utils.toHex(estimateGas),
        // gas: web3.utils.toHex(50000),
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', async (hash) => {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
            const params = {
              "address": address,
              "hash": hash,
              "type": 6,
              "data": {
                  "cfxsIds": cfxsIds,
                  "sendaddr": address,
                  "toaddr": toaddress,
                  "hash": hash,
              }
            };
            await saveTransactionTask(params);
            // __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 1, hash: hashInfo })
          resolve()
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 2, hash: hashInfo, isUserDeny: isUserDeny, isFailed: true })
          console.log('err', err)
          reject(err)
        })
    })
      .catch(err => {
        console.log('getTransactionCount', err)
        __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 2, hash: hashInfo, isUserDeny: false, isFailed: true })
        reject(err)
      })
  })
}
























/**
 * 极速版-充值-支持多币种
 * @param {*} gTokenAmt 充值的数量
 * @param {*} buyToken 提的Token地址
 * @param {*} decimals 长度
 * @param {*} fillingRecordParams 记录数据库参数
 * @returns 
 */
export const gamesBuyTokenTogToken = async function (gTokenAmt=0, buyToken='', decimals=18, fillingRecordParams={}, orderId=null, hand_fee=0) {
  // const tokenAddress = __ownInstance__.$store.state.base.tokenAddress
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.gamesFillingAddress;
  const contract = new web3.eth.Contract(LuClsSysABI, contractAddress);
  let depositAmount = 0;
  if(decimals == 18) {
    depositAmount = toWei(gTokenAmt, decimals);
  } else {
    let pow = Math.pow(10, decimals);
    depositAmount = numMulti(gTokenAmt, pow);
    // console.log(decimals, pow, depositAmount);
  }
  let fee_num = keepDecimalNotRounding(hand_fee, 5);
  let value = toWei(fee_num, decimals);
  console.log(value);
  
  const encodedABI = contract.methods.BuyTokenTogToken(depositAmount, buyToken).encodeABI();
  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        // value: web3.utils.toHex(value)
      })
      console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(400000), // Optional
      }];
      params[0].value =  web3.utils.toHex(value) 
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', async function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
            //开始记录数据库充提记录 修改用户充提状态为充提进行中
            fillingRecordParams.hash = hash;
            await setDepositWithdraw(fillingRecordParams);
            //开始修改用户充提状态为充提进行中
            // saveNotifyStatus(1);
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('BuyTokenTogToken_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}

/**
 * 极速版-充值-ETH
 * @param {*} gTokenAmt 充值的数量
 * @param {*} decimals 长度
 * @param {*} fillingRecordParams 记录数据库参数
 * @returns 
 */
export const gameETHTogToken = async function (gTokenAmt=0, buyToken='', decimals=18, fillingRecordParams={}, orderId=null, hand_fee=0) {
  // const tokenAddress = __ownInstance__.$store.state.base.tokenAddress
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.gamesFillingAddress;
  const contract = new web3.eth.Contract(LuClsSysABI, contractAddress);
  const depositAmount = toWei(gTokenAmt, decimals);
  let encodedABI = contract.methods.ETHTogToken(depositAmount).encodeABI();

  let fee_num = keepDecimalNotRounding(hand_fee, 5);
  let value = toWei(fee_num, decimals);

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        // value: web3.utils.toHex(value)
      })
      console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(400000), // Optional
      }];
      params[0].value =  web3.utils.toHex(value) 
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', async function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
            //开始记录数据库充提记录 修改用户充提状态为充提进行中
            fillingRecordParams.hash = hash;
            await setDepositWithdraw(fillingRecordParams);
            //开始修改用户充提状态为充提进行中
            // saveNotifyStatus(1);
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('ETHTogToken_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}

/**
 * 极速版-提取-支持多币种
 * @param {*} gTokenAmt 提的数量
 * @param {*} buyToken 提的Token地址
 * @param {*} decimals 长度
 * @param {*} fillingRecordParams 记录数据库参数
 * @param {*} hand_fee 手续费
 * @returns 
 */
export const gamesGTokenToBuyToken = function (gTokenAmt=0, buyToken='', decimals=18, fillingRecordParams={}, orderId='', hand_fee=0) {
  // const tokenAddress = __ownInstance__.$store.state.base.tokenAddress
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.gamesFillingAddress;
  const withdrawAmount = toWei(gTokenAmt, decimals);
  const contract = new web3.eth.Contract(gameFillingABIV2, contractAddress);
  const encodedABI = contract.methods.gTokenToBuyToken(withdrawAmount, buyToken, orderId).encodeABI();
  // const contract = new web3.eth.Contract(gameFillingABI, contractAddress);
  // const encodedABI = contract.methods.gTokenToBuyToken(withdrawAmount, buyToken).encodeABI();
  // let value = toWei('0.00201', decimals);
  let fee_num = keepDecimalNotRounding(hand_fee, 5);
  let value = toWei(fee_num, decimals);
  // console.log("fee_num", value);

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        value: web3.utils.toHex(value)
      })
      // estimateParams.value = web3.utils.toHex(borrow) 
      console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(400000), // Optional
      }];
      params[0].value =  web3.utils.toHex(value) 
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', async function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
            fillingRecordParams.hash = hash;
            await setDepositWithdraw(fillingRecordParams);
            //开始修改用户充提状态为充提进行中
            // saveNotifyStatus(1);
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('gTokenToBuyToken_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}


// 上庄 存款存入
export const depositPoolsIn = function (goblinAddress, amount, decimals, fillingRecordParams={}, orderId='', type=0){
  console.log('amount' , amount);
  console.log('goblinAddress' , goblinAddress);
  // const tokenAddress = __ownInstance__.$store.state.base.tokenAddress
  // let isCoinbase = tokenAddress === '0x0000000000000000000000000000000000000000'
  const address = __ownInstance__.$store.state.base.address;
  const chainName = __ownInstance__.$store.state.base.chainName;
  const contractAddress = goblinAddress;
  const contract = new web3.eth.Contract(goblinPoolsABI, contractAddress);
  const depositAmount = toWei(amount, decimals)
  // console.log(depositAmount);
  const value = web3.utils.toHex(depositAmount)
  let encodedABI = contract.methods.deposit(value).encodeABI();

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateParams = {
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
      }
      // if(isCoinbase) estimateParams.value = web3.utils.toHex(depositAmount) 
      let estimateGas = parseInt(await web3.eth.estimateGas(estimateParams) * 1.4)
      console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(2000000), // Optional
      }];
      // if(isCoinbase) params[0].value =  web3.utils.toHex(depositAmount) 
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', async function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('receiveAirdrop_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}

// 下庄 提取
export const depositPoolsOut = function (goblinAddress, amount, decimals, fillingRecordParams={}, orderId='', type=0){
  console.log('depositPoolsOut' , amount);
  // const tokenAddress = __ownInstance__.$store.state.base.tokenAddress
  const address = __ownInstance__.$store.state.base.address;
  const chainName = __ownInstance__.$store.state.base.chainName;
  const contractAddress = goblinAddress;
  const contract = new web3.eth.Contract(goblinPoolsABI, contractAddress);
  const depositAmount = toWei(amount, decimals)
  let encodedABI = contract.methods.withdraw(web3.utils.toHex(depositAmount)).encodeABI();

  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
      })
      console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(400000), // Optional
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', async function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('receiveAirdrop_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}


/**
 * Dice 下注 转账
 * @param {*} contractAddress 币种 合约 地址 LUSD
 * @param {*} tableAddress 台子地址
 * @param {*} amount 下注金额
 * @param {*} decimals 位数
 * @returns 
 */
export const bettingTransfer = function (contractAddress, tableAddress, amount, decimals=18){
  console.log('bettingTransfer' , amount);
  // const tokenAddress = __ownInstance__.$store.state.base.tokenAddress
  const address = __ownInstance__.$store.state.base.address;
  const chainName = __ownInstance__.$store.state.base.chainName;
  
  // const contractAddress = "0x369F2BCe29d30E8C49b3A7A4c0F2c1e8AF5de56B";
  const contract = new web3.eth.Contract(DicePoolsABI, contractAddress);
  const depositAmount = toWei(amount, decimals)
  let encodedABI = contract.methods.transfer(tableAddress, web3.utils.toHex(depositAmount)).encodeABI();
  // let value = toWei(amount, decimals);
  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas;
      if(chainName === 'HECO') {
        estimateGas = web3.utils.toHex(400000)
      } else {
        estimateGas = await web3.eth.estimateGas({
          from: address,
          to: contractAddress, // 池地址
          data: encodedABI, // Required
        })
      }
      // console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(400000), // Optional
        // chainId: 128,
      }];
      // params[0].value =  web3.utils.toHex(value) 
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(receipt)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('bettingTransfer_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}

/**
 * Luck001 USDT 兑换 Luck001 1:1
 * @param {*} amount 数量
 * @param {*} decimals 位数
 * @returns 
 */
export const BuyTokenToLuck001 = function (amount, decimals=18){
  console.log('BuyTokenToLuck001' , amount);
  // const tokenAddress = __ownInstance__.$store.state.base.tokenAddress
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.luck001Address;
  const contract = new web3.eth.Contract(LuClsSysABI, contractAddress);
  const depositAmount = toWei(amount, decimals)
  let encodedABI = contract.methods.BuyTokenToLuck001(depositAmount).encodeABI();
  // let value = toWei(amount, decimals);
  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
      })
      // console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(400000), // Optional
        // chainId: 128,
      }];
      // params[0].value =  web3.utils.toHex(value) 
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', function (hash) {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(receipt)
        })
        .on('confirmation', function (confirmationNumber, receipt) {
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('BuyTokenToLuck001_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}

/**
 * tronWeb 转账处理
 * @param {*} amount 转账数量
 */
export const tronWebSendTrx = function (amount=0, recipientAddress='', fillingRecordParams={}){
  // tronLink;
  const privateKey = __ownInstance__.$store.state.base.tronPrivateKey;
  const amountNum = Number(amount);
  return new Promise(async (resolve, reject) => {
    // 调用TronWeb的相应方法执行转账
    const transaction = await tronLink.tronWeb.transactionBuilder.sendTrx(
      recipientAddress,
      amountNum
    );
    console.log('transaction', transaction);
    const signedTransaction = await tronLink.tronWeb.trx.sign(
      transaction,
      privateKey
    );
    console.log('signedTransaction', signedTransaction);
    const result = await tronLink.tronWeb.trx.sendRawTransaction(
      signedTransaction
    );
    console.log('result', result);
    resolve(result);
  })
}

/**
 * 调用智能合约 进行转账
 * @param {*} amount 数量
 * @param {*} contractAddress 币种合约地址
 * @param {*} turnoutAddress 转出钱包地址
 * @param {*} recipientAddress 接受钱包地址
 * @param {*} fillingRecordParams 参数
 * @returns 
 */
export const tronWebTriggerSmartContract = function (amount=0, contractAddress='', recipientAddress='',  fillingRecordParams={}, hand_fee=0){
  const privateKey = __ownInstance__.$store.state.base.tronPrivateKey;
  const address = __ownInstance__.$store.state.base.address;
  // const recipientAddress = fromAddress || __ownInstance__.$store.state.base.gamesFillingAddress;
  const amountNum = Number(amount);
  let timestamp = new Date().getTime().toString()
  console.log(contractAddress, recipientAddress);
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise(async (resolve, reject) => {
    let hashInfo;
    try {
      // 构建方法参数，将接收地址和金额转为对应的Hex格式
      let parameter = [{type:'address', value: recipientAddress},{type:'uint256',value: amountNum * 10 ** 6}];
      let options = {
        feeLimit: tronLink.tronWeb.toSun(hand_fee),
        // callValue: 0.00021 * 10 ** 6,
        // tokenValue: amountNum * 10 ** 6,
      };
      console.log(options);
      // 调用TronWeb的相应方法执行转账
      let transferData;
      let transaction;
      if(contractAddress == 'T000000000000000000000000000000000') {
        transferData = await tronLink.tronWeb.transactionBuilder.sendTrx(
          recipientAddress,
          amountNum * 10 ** 6,
          address
        );
        transaction = transferData;
      } else {
        transferData = await tronLink.tronWeb.transactionBuilder.triggerSmartContract(
          contractAddress,
          'transfer(address,uint256)',
          options,
          parameter,
          address
        );
        transaction = transferData.transaction;
      }
      if(transferData) {
        console.log('transferData', transferData);
        const signedTransaction = await tronLink.tronWeb.trx.sign(
          transaction,
          privateKey
        );
        console.log('signedTransaction', signedTransaction);
        if(signedTransaction) {
          const result = await tronLink.tronWeb.trx.sendRawTransaction(signedTransaction);
          console.log('result', result);
          if(result && result.result) {
            hashInfo = result.txID || result.txid;
            // console.log("hashInfo", hashInfo);
            fillingRecordParams.hash = hashInfo;
            // console.log("hashInfo", fillingRecordParams);
            await setDepositWithdraw(fillingRecordParams);
            // 交易成功
            __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
            resolve(hashInfo);
          } else {
            __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, errMessage: result.code})
          }
        }
      }
      // __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, errMessage: 'Error'})
      reject(false)
    } catch (err) {
      console.log('error', err);
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, errMessage: err})
      reject(false)
      // error handling
    }
    reject(false);
  }).catch((e) => {
    return e;
  });
}
