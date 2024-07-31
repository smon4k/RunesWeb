import {  fromWei , toWei } from '@/utils/tools'
import erc20ABI from './abis/erc20ABI.json'
import swapABI from './abis/swapABI.json'
import swapRouterABI from './abis/swapRouterABI.json'
import { splitSignature } from '@ethersproject/bytes';

/**
 * 批准操作
 * @param {*} tokenAddress 
 * @returns 
 */
export const clickApprove = function (tokenAddress) {
  // const tokenAddress = __ownInstance__.$store.state.base.tokenAddress
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = tokenAddress;
  const contract = new web3.eth.Contract(erc20ABI, contractAddress);
  const value = "10000000000000000000000000000000000000000000000000000000";
  let encodedABI = contract.methods.approve(publicAddress.CONTRACT_ADDRESS_V2, value).encodeABI();

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
    })
    .catch(err=>{
      console.log('receiveAirdrop_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}

/**
 * 出金
 * 逆兑换操作 LUSD 兑换 USDT
 * @param {*} input inputAmount 装换数量
 * @param {*} output outputAmount 输入值 最小
 * @param {*} TK1_CONTRACT_ADDR tk0
 * @param {*} TK2_CONTRACT_ADDR tk1
 */
export const swapGTokenTogBuyToken = function (inputAmount, outputAmount, TK1_CONTRACT_ADDR, TK2_CONTRACT_ADDR, minimumReceived=0){
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.exchangeAddress;
  // const contractAddress = publicAddress.CONTRACT_ADDRESS;
  // const contract = new web3.eth.Contract(swapABI, contractAddress);
  const contract = new web3.eth.Contract(swapABI, contractAddress);
  // const now =  Math.round(Date.now()/1000) + 1800;
  console.log(inputAmount);
  const amountIn = web3.utils.toWei(inputAmount.toString(), "ether");
  // const amountOutMinNum = (output * (1 - publicAddress.SLIPOINT)).toFixed(9);
  // const amountOutMin = publicAddress.SLIPOINT;
  // const minimumReceivedValue = minimumReceived * (1 - publicAddress.SLIPOINT);
  // const amountOutMin = web3.utils.toWei(minimumReceivedValue.toString(), "ether");
  // const path = [TK1_CONTRACT_ADDR, TK2_CONTRACT_ADDR];
  // console.log(publicAddress);
  // console.log("amountIn", amountIn, "amountOutMin",amountOutMin, "path", path);
  // console.log("1->minimumReceived", minimumReceived, "minimumReceivedValue", minimumReceivedValue, "amountOutMin",amountOutMin);
  let encodedABI = contract.methods.gTokenTogBuyToken(amountIn).encodeABI();
  // let encodedABI = contract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn, amountOutMin, path, address, now).encodeABI();
  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      // let estimateGas = await web3.eth.estimateGas({
      //   from: address,
      //   to: contractAddress, // 池地址
      //   data: encodedABI, // Required
      // })
      // console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        // gas: web3.utils.toHex(estimateGas), // Optional
        gas: web3.utils.toHex(400000), // Optional
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
    })
    .catch(err=>{
      console.log('receiveAirdrop_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}

/**
 * 入金
 * USDT 兑换 LUSD
 * @param {*} input input 输入值
 * @param {*} output output 输入值 最小
 * @param {*} TK1_CONTRACT_ADDR tk0
 * @param {*} TK2_CONTRACT_ADDR tk1
 */
export const swapBuyTokenTogToken = function (inputAmount, outputAmount, TK1_CONTRACT_ADDR, TK2_CONTRACT_ADDR, minimumReceived=0){
  const address = __ownInstance__.$store.state.base.address;
  const contractAddress = __ownInstance__.$store.state.base.exchangeAddress;
  // const contractAddress = publicAddress.CONTRACT_ADDRESS;
  // const contract = new web3.eth.Contract(swapABI, contractAddress);
  const contract = new web3.eth.Contract(swapABI, contractAddress);
  // const now =  Math.round(Date.now()/1000) + 1800;
  console.log(inputAmount);
  const amountIn = web3.utils.toWei(inputAmount.toString(), "ether");
  // const amountOutMinNum = (output * (1 - publicAddress.SLIPOINT)).toFixed(9);
  // const amountOutMin = publicAddress.SLIPOINT;
  // const minimumReceivedValue = minimumReceived * (1 - publicAddress.SLIPOINT);
  // const amountOutMin = web3.utils.toWei(minimumReceivedValue.toString(), "ether");
  // const path = [TK1_CONTRACT_ADDR, TK2_CONTRACT_ADDR];
  // console.log(publicAddress);
  // console.log("amountIn", amountIn, "amountOutMin",amountOutMin, "path", path);
  // console.log("1->minimumReceived", minimumReceived, "minimumReceivedValue", minimumReceivedValue, "amountOutMin",amountOutMin);
  let encodedABI = contract.methods.BuyTokenTogToken(amountIn).encodeABI();
  // let encodedABI = contract.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn, amountOutMin, path, address, now).encodeABI();
  let timestamp = new Date().getTime().toString()
  __ownInstance__.$store.dispatch('createOrderForm' , {val:0 ,id:timestamp })
  return new Promise((resolve, reject) => {
    let hashInfo
    web3.eth.getTransactionCount(address).then(async transactionNonce => {
      let gasPrice = await web3.eth.getGasPrice();
      // let estimateGas = await web3.eth.estimateGas({
      //   from: address,
      //   to: contractAddress, // 池地址
      //   data: encodedABI, // Required
      // })
      // console.log('estimateGas' ,estimateGas)
      const params = [{
        from: address,
        to: contractAddress, // 池地址
        data: encodedABI, // Required
        gasPrice: web3.utils.toHex(gasPrice), // Optional
        // gas: web3.utils.toHex(estimateGas), // Optional
        gas: web3.utils.toHex(400000), // Optional
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
    })
    .catch(err=>{
      console.log('receiveAirdrop_err',err)
      __ownInstance__.$store.dispatch('changeTradeStatus' , {  id:timestamp , val:2, hash:hashInfo})
      reject(err)
    })
  })
}


