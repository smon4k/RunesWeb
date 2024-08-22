
import {  fromWei , toWei, keepDecimalNotRounding } from '@/utils/tools'
import { toolNumber } from '@/utils/tools'
import  tokenABI from './abis/token.json'
import CFXsContractMainABI from './abis/CFXsContractMainABI.json'
import CFXsIdAndDataServiceABI from './abis/CFXsIdAndDataServiceABI.json'
import CFXsERCBridgeABI from './abis/CFXsERCBridgeABI.json'
import {saveTransactionTask} from "@/wallet/serve";
import Address from '@/wallet/address.json'

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
  __ownInstance__.$store.dispatch('createOrderForm' , { val:0, id:timestamp })
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
            __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(hashInfo)
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id: timestamp, val: 2, hash: hashInfo, isUserDeny: isUserDeny, isFailed: true })
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err => {
      console.log('approve', err)
      __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 2, hash: hashInfo, isUserDeny: false, isFailed: true })
      reject(err)
    })
  })
}

// 购买
export const unlockingScriptbatch = async function (cfxsIds=[], amounts=[], usdIds=[], totalAmount=0) {
  console.log(cfxsIds, amounts, usdIds);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = Address.CFXsContractAddress;
  const contract = new web3.eth.Contract(CFXsContractMainABI, contractAddress);
  const amount = toWei("0", 18);
  // console.log(totalAmount, amount);
  let encodedABI = contract.methods.UnlockingScriptbatch(cfxsIds, usdIds, amounts).encodeABI();
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
        value: amount
      })
      // console.log('estimateGas', estimateGas)
      const params = [{
        from: address,
        to: contractAddress,
        data: encodedABI,
        gasPrice: web3.utils.toHex(gasPrice),
        gas: web3.utils.toHex(estimateGas),
        // gas: web3.utils.toHex(200000),
        value: web3.utils.toHex(amount) 
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', async (hash) => {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
            const queryParams = {
              "address": address,
              "hash": hash,
              "type": 1,
              "data": {
                  "cfxsIds": cfxsIds,
                  "sendaddr": address,
                  "hash": hash,
              }
            };
            await saveTransactionTask(queryParams);
            __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 1, hash: hashInfo })
          resolve(hashInfo)
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
            const queryParams = {
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
          await saveTransactionTask(queryParams);
            __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 1, hash: hashInfo })
          resolve(hashInfo)
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
            const queryParams = {
              "address": address,
              "hash": hash,
              "type": 3,
              "data": {
                  "cfxsId": cfxsId,
                  "sendaddr": address,
                  "hash": hash,
              }
            };
            await saveTransactionTask(queryParams);
            __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 1, hash: hashInfo })
          resolve(hashInfo)
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
            let queryParams = {};
            if(type == 4) {
              queryParams = {
                "address": address,
                "hash": hash,
                "type": type,
                "data": {
                    "cfxsIds": cfxsIds,
                    "amount": outputs[0],
                    "sendaddr": address,
                    "newCfxId": "",
                    "hash": hash,
                }
              };
            } else {
              queryParams = {
                "address": address,
                "hash": hash,
                "type": type,
                "data": {
                    "cfxsId": cfxsIds[0],
                    "amounts": outputs,
                    "sendaddr": address,
                    "newCfxIds": [],
                    "hash": hash,
                }
              };
            }
            await saveTransactionTask(queryParams);
            __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 1, hash: hashInfo })
          resolve(hashInfo)
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
  let encodedABI = contract.methods.transfer(cfxsIds, toaddress).encodeABI();
  let timestamp = new Date().getTime().toString();
  __ownInstance__.$store.dispatch('createOrderForm', { val: 0, id: timestamp })
  return new Promise(async (resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      // let estimateGas = await web3.eth.estimateGas({
      //   from: address,
      //   to: contractAddress,
      //   data: encodedABI,
      // })
      // console.log('estimateGas', estimateGas)
      const params = [{
        from: address,
        to: contractAddress,
        data: encodedABI,
        gasPrice: web3.utils.toHex(gasPrice),
        // gas: web3.utils.toHex(estimateGas),
        gas: web3.utils.toHex(50000),
      }];
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', async (hash) => {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
            const queryParams = {
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
            await saveTransactionTask(queryParams);
            __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 1, hash: hashInfo })
          resolve(hashInfo)
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

//CLS Resolve address
export const idRegist = async function (cfxsId="", userAddr="") {
  console.log(cfxsId, userAddr);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = Address.CFXsAndDataContractAddress;
  const contract = new web3.eth.Contract(CFXsIdAndDataServiceABI, contractAddress);
  let encodedABI = contract.methods.idRegist(cfxsId, userAddr).encodeABI();
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
            __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 1, hash: hashInfo })
          resolve(hashInfo)
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

//CLS Set Name
export const addrRegist = async function (cfxsId="") {
  console.log(cfxsId);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = Address.CFXsAndDataContractAddress;
  const contract = new web3.eth.Contract(CFXsIdAndDataServiceABI, contractAddress);
  let encodedABI = contract.methods.addrRegist(cfxsId).encodeABI();
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
            __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 1, hash: hashInfo })
          resolve(hashInfo)
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

//Inscrible 
export const inscribe = async function (cfxsId="", data="") {
  console.log(cfxsId, data);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = Address.CFXsContractAddress;
  const contract = new web3.eth.Contract(CFXsContractMainABI, contractAddress);
  let encodedABI = contract.methods.inscribe(cfxsId, data).encodeABI();
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
            __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 1, hash: hashInfo })
          resolve(hashInfo)
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

//Inscrible Regist
export const userDataRegist = async function (cfxsIds=[], dataTypes=[], names=[], series="") {
  console.log(cfxsIds, dataTypes, names, series);
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = Address.CFXsAndDataContractAddress;
  const contract = new web3.eth.Contract(CFXsIdAndDataServiceABI, contractAddress);
  let encodedABI = contract.methods.userDataRegist(cfxsIds, dataTypes, names, series).encodeABI();
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
            __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          __ownInstance__.$store.dispatch('changeTradeStatus', { id: timestamp, val: 1, hash: hashInfo })
          resolve(hashInfo)
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
 * CFXs 兑换 NFT
 * @param {*} amount 数量
 * @returns 
 */
export const ExchangeCFXsForECR20721 = function (cfxsIds=[], amount=0, decimals=18){
  console.log('ExchangeCFXsForECR20721', cfxsIds, amount);
  // const tokenAddress = __ownInstance__.$store.state.base.tokenAddress
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = Address.CFXsERC20BridgeContractAddress;
  const contract = new web3.eth.Contract(CFXsERCBridgeABI, contractAddress);
  const encodedABI = contract.methods.ExchangeCFXsForECR20721(cfxsIds).encodeABI();
  const value = toWei(amount, decimals);
  const timestamp = new Date().getTime().toString();
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
      // console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(500000), // Optional
        // chainId: 128,
      }];
      params[0].value =  web3.utils.toHex(value);
      web3.eth.sendTransaction(params[0]).on('transactionHash', async (hash) => {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
            const queryParams = {
              "address": address,
              "hash": hash,
              "type": 8,
              "data": {
                  "cfxsIds": cfxsIds,
                  "sendaddr": address,
                  "hash": hash,
              }
            };
            await saveTransactionTask(queryParams);
            __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
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
      console.log('ExchangeCFXsForECR20721_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}

/**
 * NFT 兑换 CFXs
 * @param {*} amount 数量
 * @returns 
 */
export const ECR20721RedemptionOfCFXs = function (cfxsIds=[], amount=0, decimals=18){
  console.log('ECR20721RedemptionOfCFXs', cfxsIds, amount);
  // const tokenAddress = __ownInstance__.$store.state.base.tokenAddress
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = Address.CFXsERC20BridgeContractAddress;
  const contract = new web3.eth.Contract(CFXsERCBridgeABI, contractAddress);
  const encodedABI = contract.methods.ECR20721RedemptionOfCFXs(cfxsIds).encodeABI();
  const value = toWei(amount, decimals);
  const timestamp = new Date().getTime().toString();
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
      params[0].value =  web3.utils.toHex(value) 
      web3.eth.sendTransaction(params[0]).on('transactionHash', async (hash) => {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
            const queryParams = {
              "address": address,
              "hash": hash,
              "type": 9,
              "data": {
                  "cfxsIds": cfxsIds,
                  "sendaddr": address,
                  "hash": hash,
              }
            };
            await saveTransactionTask(queryParams);
            __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
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
 * CFXs 兑换 Coin
 * @param {*} amount 数量
 * @returns 
 */
export const ExchangeCFXsForOnlyECR20 = function (cfxsIds=[], amount=0, decimals=18){
  console.log('ExchangeCFXsForOnlyECR20', cfxsIds);
  // const tokenAddress = __ownInstance__.$store.state.base.tokenAddress
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = Address.CFXsERC20BridgeContractAddress;
  const contract = new web3.eth.Contract(CFXsERCBridgeABI, contractAddress);
  const encodedABI = contract.methods.ExchangeCFXsForOnlyECR20(cfxsIds).encodeABI();
  const value = toWei(amount, decimals);
  const timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo = null;
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        value: web3.utils.toHex(value)
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
      params[0].value =  web3.utils.toHex(value) 
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', async (hash) => {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
            const queryParams = {
              "address": address,
              "hash": hash,
              "type": 10,
              "data": {
                  "cfxsIds": cfxsIds,
                  "sendaddr": address,
                  "hash": hash,
              }
            };
            await saveTransactionTask(queryParams);
            __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
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
 * Coin 兑换 CFXs
 * @param {*} amount 数量
 * @returns 
 */
export const ECR20RedemptionOfCFXs = function (amount=0, fee=0, decimals=18){
  console.log('ECR20RedemptionOfCFXs', amount, fee);
  // const tokenAddress = __ownInstance__.$store.state.base.tokenAddress
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = Address.CFXsERC20BridgeContractAddress;
  const contract = new web3.eth.Contract(CFXsERCBridgeABI, contractAddress);
  const amountWei = toWei(amount, decimals);
  const encodedABI = contract.methods.ECR20RedemptionOfCFXs(amountWei).encodeABI();
  const value = toWei(fee, decimals);
  const timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      let estimateGas = await web3.eth.estimateGas({
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        value:  web3.utils.toHex(value)
      })
      console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        gas: web3.utils.toHex(estimateGas), // Optional
        // gas: web3.utils.toHex(400000), // Optional
        // chainId: 128,
      }];
      params[0].value =  web3.utils.toHex(value) 
      web3.eth.sendTransaction(params[0])
        .on('transactionHash', async (hash) => {
          console.log('hash', hash);
          if (hash) {
            hashInfo = hash
            const queryParams = {
              "address": address,
              "hash": hash,
              "type": 11,
              "data": {
                  "amount": amount,
                  "newCfxId": "",
                  "sendaddr": address,
                  "hash": hash,
              }
            };
            await saveTransactionTask(queryParams);
            __ownInstance__.$store.dispatch('changeTradePadding', { val: 3, id: timestamp, hash: hash })
          }
        })
        .on('receipt', function (receipt) {
          // 交易成功
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:1 , hash:hashInfo})
          resolve(receipt)
        })
        .on('error', function (err) {
          let isUserDeny = err.code === 4001 
          __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2 , isUserDeny, hash:hashInfo})
          console.log('err' , err)
          reject(err)
        })
    })
    .catch(err=>{
      console.log('ExchangeCFXsForOnlyECR20_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}
