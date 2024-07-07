import router from '@/router'
import { 
    getUserAddressInfo, 
    getPoolBtcData, 
    getHashPowerPoolsTokensData, 
    getUserProfitData, 
    getDiceBalanceOf, 
    getDiceDealerBalance,
    getPoolsTokensData,
    getUserDealerBalance,
    getCurrencyToken,
    getUserPlatformBalance
} from '@/wallet/serve'
import {
    deepCopy,
    fromWei,
    toolNumber,
    numberFormat,
    accordingToAprSeekApy,
    calcDaily
} from '@/utils/tools'
import hashPoolsList from '@/wallet/hashpower_pools.js'
import TOKEN from '@/wallet/token.js'
import poolsList from '@/wallet/pools.js'
import Web3 from 'web3'
import Vue from 'vue'
import { keepDecimalNotRounding } from "@/utils/tools";
let copyBaseState;
const walletName = localStorage.getItem('walletName') ? localStorage.getItem('walletName') : 'MetaMask'; //钱包MetaMask、TronLink
let chainName;
if(walletName === 'MetaMask') {
    chainName = localStorage.getItem('chainName') ? localStorage.getItem('chainName') : 'HECO';
} else if(walletName === 'TronLink') {
    chainName = 'TronGrid';
} else if(walletName === 'WalletConnect') {
    chainName = localStorage.getItem('chainName') ? localStorage.getItem('chainName') : 'HECO';;
}

const versionName = localStorage.getItem('versionName') ? localStorage.getItem('versionName') : 'speed';
// let transactionCurrency = 'ETH';
// let transactionCurrencyName = localStorage.getItem(chainName + '_transactionCurrency');
// if(transactionCurrencyName) {
//     transactionCurrency = transactionCurrencyName;
// } else {
//     if(chainName === 'BSC') {
//         transactionCurrency = 'BTCB';
//     }
//     if(chainName === 'ARB') {
//         transactionCurrency = 'BTC';
//     }
// }
const transactionCurrency = localStorage.getItem('transactionCurrency') ? localStorage.getItem('transactionCurrency') : 'USDT';
let transactionSpareCurrency = localStorage.getItem('transactionCurrency') ? localStorage.getItem('transactionCurrency') : 'USDT';
console.log(chainName, transactionCurrency);
let decimalLen = 4; //保留位数
let decimalPrecision = 8; //计算精度
if(transactionCurrency === 'BTCB') {
    decimalLen = 10;
    decimalPrecision = 8;
}
if(transactionCurrency === 'ETH') {
    decimalLen = 8;
    decimalPrecision = 10;
}
if(transactionCurrency === 'BNB') {
    decimalLen = 6;
    decimalPrecision = 10;
}
if(transactionCurrency === 'LUNC') {
    decimalLen = 4;
    decimalPrecision = 4;
}

if(transactionCurrency === 'GLS') {
    transactionSpareCurrency = "LUCK"
}


export default {
    state :{
        address:'',
        isConnected:false,
        accounts:'',
        userId: 0, //用户ID
        userInfo: {}, //用户ID
        isAdmin: false, //是否管理员
        walletName: walletName, //钱包
        chainId:'',
        chainName: chainName,
        tradeStatus:{
            current:"",
            list:[],
            SuccessHash:'',
            FailedHash:'',
            userDenyId:''
        },
        domainHostAddress: TOKEN[chainName].browserUrl,
        apiUrl: window.location.host === 'localhost:8018' ? 'http://www.dice.com' : 'https://www.luck365.win',
        // apiUrl: 'https://www.luck365.win',
        nftUrl: window.location.host === 'localhost:8018' || window.location.host === '192.168.1.3:8007' ? 'http://www.api.com' : 'https://api.bitguru.finance',
        // nftUrl: 'https://api.h2o.live',
        // Env: window.location.host === 'localhost:8001' || window.location.host === '192.168.1.6:8001' ? 'dev' : 'prod',
        Env: 'dev',
        // gamesFillingAddress: '0x079bDC8845D0C6878716A3f5219f1D0DcdF15308', //游戏系统-充提清算系统-合约地址
        gamesFillingAddress: TOKEN[chainName].gamesFillingAddress,//极速版-充提合约
        luck001Address: TOKEN[chainName].luck001Address,//极速版-luck001兑换合约地址
        btcbFillingAddress: '0x92403c4dddC9275C186d1aFBE2ff64D003aa13f1', //Dice短期租赁-BTCB充提池子合约地址
        hashpowerAddress: '0x5fE319Cad2B7203891AC9a9536A4a054636A2340', //Dice合约地址 测试
        fairLaunchAddress:'0x08D027B330F3A8ace9290235D575475150EA14Ff', //_launch
        numberAddress: TOKEN[chainName].numberAddress ? TOKEN[chainName].numberAddress : '', //猜数字台子合约地址
        sizeAddress: TOKEN[chainName].sizeAddress ? TOKEN[chainName].sizeAddress : '', //猜大小台子合约地址
        singDoubleAddress: TOKEN[chainName].singDoubleAddress ? TOKEN[chainName].singDoubleAddress : '', //猜单双台子合约地址
        baccaratAddress: TOKEN[chainName].baccaratAddress ? TOKEN[chainName].baccaratAddress : '', //百家乐台子合约地址
        exchangeAddress: TOKEN[chainName].exchangeAddress ? TOKEN[chainName].exchangeAddress : '', //兑换合约地址
        hashPowerPoolsList: [],
        userDealerProportion: [],
        totalPledgePower: 0, //总的质押算力
        swapPoolsList: [],
        poolsList: [],
        versionName: versionName, // 极速:speed 手动：chain
        transactionCurrency: transactionCurrency, //交易币种
        transactionSpareCurrency: transactionSpareCurrency, //交易币种 备用名称
        transactionCurrencyToken: '', //币种余额
        minBetNum: 0, //最小下单量
        decimalLen: decimalLen, //币种保留位数
        decimalPrecision: decimalPrecision, //币种计算精度
        platformBalance: 0, //极速版 - 平台余额
        tronPrivateKey: '', //tronweb 时传入的私钥 
    },
    mutations: {
        isConnected(state , val ){
            state.isConnected = val
        },
        disconnect(state){
          for(let key in state){
            if(key === 'accounts'){
              state[key] = ''
            }else [
              state[key] = copyBaseState[key]
            ]
          }
          console.log('state',state)
          
        },
        copyDefaultState(state){
            copyBaseState = deepCopy(state)
        },
        getChainId(state , value) {
            state.chainId = value;
        },
        setWalletName(state , value) {
            state.walletName = value;
        },
        async getAddress(state, value) { //设置钱包地址
            state.address = value;
            let userInfo = await getUserAddressInfo(value, state.transactionCurrency);
            console.log(userInfo)
            if(userInfo) {
                state.userInfo = userInfo;
                state.isAdmin = userInfo.is_admin;
                state.userId = userInfo.id;
            }
            // console.log(state.transactionCurrency);
            let currencyTokenInfo = await getCurrencyToken(state.transactionCurrency);
            if(currencyTokenInfo) {
                console.log(currencyTokenInfo)
                state.transactionCurrencyToken = currencyTokenInfo.token;
                state.minBetNum = keepDecimalNotRounding(currencyTokenInfo.minbet_num, 10, true);
            }
            if(state.versionName === 'speed') {
                // console.log(transactionCurrency);
                let platformBalance = await getUserPlatformBalance(transactionCurrency, state.decimalLen);
                // console.log(platformBalance);
                state.platformBalance = platformBalance;
            }
        },  
        // async setCurrencyTokenInfo(state, value) {
        //     let currencyTokenInfo = await getCurrencyToken(value);
        //     state.transactionCurrency = value;
        //     // console.log(currencyTokenInfo)
        //     if(currencyTokenInfo) {
        //         state.transactionCurrencyToken = currencyTokenInfo.token;
        //         state.minBetNum = keepDecimalNotRounding(currencyTokenInfo.minbet_num, 6, true);
        //     }
        //     if(state.versionName === 'speed') {
        //         let platformBalance = await getUserPlatformBalance();
        //         // console.log(platformBalance);
        //         state.platformBalance = platformBalance;
        //     }
        // },
        async removeAddress(state) {
            state.address = '';
            state.userId = 0;
        },
        getAccounts(state, value) {
            state.accounts = value;
        },
        async refreshPlatformBalance(state) {
            let platformBalance = await getUserPlatformBalance(null, state.decimalLen);
            state.platformBalance = platformBalance;
        },
        setUserInfo(state, value) {
            state.userInfo = value;
            state.userId = value.uid;
            if(value.address && value.address !== '') {
                state.address = value.address;
            }
            console.log(value);
        },
        createOrder(state , {id , val}){
            state.tradeStatus.list.push({id , val })
            state.tradeStatus.current = id
        },
        change_TradeStatus(state , {id , val , isUserDeny , hash , errMessage}){
            if(!id) return 
            let index = state.tradeStatus.list.findIndex(item=>{
                return item.id === id
            })
            console.log(index, id, val, errMessage, isUserDeny);
            if(errMessage){
                state.errMessage = errMessage
            }
            if(index !== -1){
                state.tradeStatus.list[index].val = val 
                state.tradeStatus.list[index].hash = hash // 1成功 2失败

                if(val === 1){
                    state.tradeStatus.SuccessHash = hash
                }else {
                    state.tradeStatus.list[index].isUserDeny = isUserDeny
                    if(isUserDeny){
                        state.tradeStatus.userDenyId = id
                        console.log('userDenyId' , state.tradeStatus.userDenyId);
                    }
                    state.tradeStatus.FailedHash = hash || id
                }
            }
        },
        setHashPowerPoolsList(state, {fixed}){
            state.hashPowerPoolsList = [];
            // console.log(fixed);
            if(fixed.length > 0) {
                fixed.forEach(async item => {
                    state.hashPowerPoolsList.push({
                        id: item.id,
                        hashpowerAddress: item.hashpowerAddress,
                        currencyToken: item.currencyToken,
                        goblin: item.goblin,
                        address:item.originToken,
                        pId:item.pId,
                        name:item.name,
                        decimals:18,
                        hash_balance:'',
                        balance:'',
                        reward:'',
                        total:'',
                        tokenPrice: 0,
                        yearPer: 0,
                        h2oYearPer: 0,
                        btcbYearPer: 0,
                        btcb19ProBalance: 0,
                        cost_revenue: 0,
                        annualized_income: 0,
                        daily_income: 0,
                        harvest_btcb_amount: 0,
                        yest_income_usdt: 0,
                        yest_income_btcb: 0,
                        total_income_usdt: 0,
                        total_income_btcb: 0,
                        daily_expenditure_usdt: 0,
                        daily_expenditure_btc: 0,
                        daily_income_usdt: 0,
                        daily_income_btc: 0,
                        power_consumption_ratio: 0,
                        currency: 0,
                        loading:false,
                        btcbPrice: 0,
                        chain_address: '',
                        duration: 0,
                        used_profit: 0,
                        end_profit: 0,
                        total_luck_income: 0,
                        claimLoading:false
                    })
                })
            }
            state.hashPowerPoolsList.loading = false
        },
        setHashPowerPoolsListLoading(state, val){
            state.hashPowerPoolsList.loading = val
        },
        setHashPowerPoolsBalance(state, info) {
            if(!state.hashPowerPoolsList) return 
            let index = state.hashPowerPoolsList.findIndex(item=>item.goblin === info.t)
            if(index !== -1 ){
                state.hashPowerPoolsList[index].tokenPrice = info.tokenPrice
                state.hashPowerPoolsList[index].btcbPrice = info.btcbPrice
                state.hashPowerPoolsList[index].hash_balance = info.hash_balance
                state.hashPowerPoolsList[index].balance = info.userBalance
                state.hashPowerPoolsList[index].total = info.totalTvl
                state.hashPowerPoolsList[index].btcbReward = info.btcbReward
                state.hashPowerPoolsList[index].luckReward = info.luckReward
                state.hashPowerPoolsList[index].reward = info.reward
                state.hashPowerPoolsList[index].yearPer = info.yearPer
                state.hashPowerPoolsList[index].h2oYearPer = info.h2oYearPer
                state.hashPowerPoolsList[index].btcbYearPer = info.btcbYearPer
                state.hashPowerPoolsList[index].btcb19ProBalance = info.btcb19ProBalance
                state.hashPowerPoolsList[index].cost_revenue = info.cost_revenue
                state.hashPowerPoolsList[index].annualized_income = info.annualized_income
                state.hashPowerPoolsList[index].daily_income = info.daily_income
                state.hashPowerPoolsList[index].currency = info.currency
                state.hashPowerPoolsList[index].harvest_btcb_amount = info.harvest_btcb_amount
                state.hashPowerPoolsList[index].yest_income_usdt = info.yest_income_usdt
                state.hashPowerPoolsList[index].yest_income_btcb = info.yest_income_btcb
                state.hashPowerPoolsList[index].total_income_usdt = info.total_income_usdt
                state.hashPowerPoolsList[index].total_income_btcb = info.total_income_btcb
                state.hashPowerPoolsList[index].daily_expenditure_usdt = info.daily_expenditure_usdt
                state.hashPowerPoolsList[index].daily_expenditure_btc = info.daily_expenditure_btc
                state.hashPowerPoolsList[index].daily_income_usdt = info.daily_income_usdt
                state.hashPowerPoolsList[index].daily_income_btc = info.daily_income_btc
                state.hashPowerPoolsList[index].power_consumption_ratio = info.power_consumption_ratio
                state.hashPowerPoolsList[index].chain_address = info.chain_address
                state.hashPowerPoolsList[index].duration = info.duration
                state.hashPowerPoolsList[index].used_profit = info.used_profit
                state.hashPowerPoolsList[index].end_profit = info.end_profit
                state.hashPowerPoolsList[index].total_luck_income = info.total_luck_income
                state.hashPowerPoolsList[index].loading = false
            }
        },
        sethashPowerPoolsListClaimLoading(state , {goblin , val}){
            let index = state.hashPowerPoolsList.findIndex(item=>item.goblin === goblin)
            if(index !== -1){
                state.hashPowerPoolsList[index].loading = val
            }
        },

        setUserDealerProportion(state, {fixedList}) {
            state.userDealerProportion = [];
            if(fixedList.length > 0) {
                fixedList.forEach(async item => {
                    state.userDealerProportion.push({
                        address: item.address,
                        user_balance: 0,
                        proportion: 0,
                        profit: 0,
                        rate: 0,
                    })
                })
            }
        },
        setUserDealerProportionLoading(state, val){
            state.userDealerProportion.loading = val
        },
        setUserDealerProportionProfit(state, info) {
            if(!state.userDealerProportion) return 
            let index = state.userDealerProportion.findIndex(item=>item.address === info.address)
            if(index !== -1 ){
                state.userDealerProportion[index].user_balance = info.user_balance
                state.userDealerProportion[index].proportion = info.proportion
                state.userDealerProportion[index].profit = info.profit
                state.userDealerProportion[index].rate = info.rate
            }
        },
        setPoolsListLoading(state ,val){
            state.poolsList.loading = val
        },
        setPoolsList(state , {fixed}){
            state.poolsList = []
            if(fixed) {
                fixed.forEach(item=>{
                    state.poolsList.push({
                        currencyToken: item.currencyToken,
                        goblin: item.goblin,
                        address:item.originToken,
                        address_h:item.token,
                        pId:item.pId,
                        name:item.name,
                        log:item.log,
                        decimals:18,
                        balance:'',
                        balanceUsd:'',
                        reward:'',
                        total:'',
                        tokenPrice: 0,
                        yearPer: 0,
                        yearPerAPR: 0,
                        loading:true,
                        tk0Address: item.tk0Address,
                        tk1Address: item.tk1Address,
                        claimLoading:false
                    })
                })
            }
            state.poolsList.loading = false
        },
        setPoolsBalance(state , info  ){
            if(!state.poolsList) return 
            let index = state.poolsList.findIndex(item=>item.goblin === info.t)
            if(index !== -1 ){
                state.poolsList[index].tokenPrice = info.tokenPrice
                state.poolsList[index].balance = info.userBalance
                state.poolsList[index].balanceUsd = info.userBalanceUsd
                state.poolsList[index].total = info.totalTvl * info.tokenPrice
                state.poolsList[index].reward = info.reward
                state.poolsList[index].yearPer = info.yearPer
                state.poolsList[index].yearPerAPR = info.yearPerAPR
                state.poolsList[index].loading = false
            }
        },
        setVersion(state, val) { //修改版本
            state.versionName = val;
        },
        setTransactionCurrency(state, val) {
            state.transactionCurrency = val;
        }
    },
    getters:{
        pendingOrderAmount: state=>{
            let filter = state.tradeStatus.list.filter(ele=> ele.val === 0)
            return filter.length
        },
        successOrderAmount: state=>{
            let filter = state.tradeStatus.list.filter(ele=> ele.val === 1)
            return filter.length
        },
        failedOrderAmount: state=>{
            let filter = state.tradeStatus.list.filter(ele=> ele.val === 2)
            return filter.length
        },
        MDEXMintingList:state=>{
            return state.totalMint.list.filter(item=>item.type === 'MDEX')
        },
        PSMintingList:state=>{
            return state.totalMint.list.filter(item=>item.type === 'PS' || item.type === 'HS')
        },
        MDEXPositionList:state=>{
            return state.userPosition.list.filter(item=>item.type === 'MDEX')
        },
        PSPositionList:state=>{
            return state.userPosition.list.filter(item=>item.type === 'PS' || item.type === 'HS')
        }
    },
    actions:{
        async disconnectMetaMask({commit}){
            commit('disconnect')
        },
        async getInviteList({commit}){
            let res = await getOneLevelLists()
            commit('setInviteList'  ,res)
        },
        async getAirdropValue({commit}){
            let res = await getAirdropValue()
            commit('getAirdropBalance'  ,res)
        },
        async getTokenDecimals({commit}){
            let res = await getDecimals()
            if(res){
                commit('setTokenDecimals' , res)
            }
        },
        async getAirDropDrawed({commit}){
            let res = await getAirDropDrawed()
            commit('setAirDropDrawed' , res)
        },
        createOrderForm({commit } , info){
            commit('createOrder' , info)
        },
        changeTradeStatus({commit} , status){
            commit('change_TradeStatus' , status)
        },
        //获取所有用户庄家占比
        async getUserDealerProportion({commit, state}, params) {
            // console.log(game_type, isLoding);
            let game_type = params.game_type;
            let isLoding = params.isLoding;
            // console.log(isLoding);
            if(state.userDealerProportion.loading) return 
            if(!isLoding || isLoding == undefined) {
                commit('setUserDealerProportionLoading' , true);
            }
            let fixedList = [];
            let chainName = state.chainName;
            if(state.versionName === 'chain') {
                fixedList = await getUserProfitData(chainName, game_type, 1);
            } else {
                fixedList = await getUserProfitData('', game_type, 2);
            }
            console.log(fixedList);
            if(!isLoding || isLoding == undefined) {
                commit('setUserDealerProportion' , {fixedList} )
            }
            if(fixedList.length) {
                let dealerBalance = {};
                let totalBalance = 0;
                if(state.versionName === 'chain') {
                    let tokenAddress = '';
                    if(game_type == 1) {
                        tokenAddress = state.numberAddress
                    }
                    if(game_type == 2) {
                        tokenAddress = state.sizeAddress
                    }
                    if(game_type == 3) {
                        tokenAddress = state.singDoubleAddress
                    }
                    if(game_type == 4) {
                        tokenAddress = state.baccaratAddress
                    }
                    totalBalance = await getDiceBalanceOf(tokenAddress);
                } 
                // else {
                //     dealerBalance = await getUserDealerBalance(game_type, 2);
                //     console.log(dealerBalance);
                //     totalBalance = dealerBalance.total_balance;
                // }
                // console.log(totalBalance);
                let profit = 0; //盈利
                let proportion = 0.0; //占比
                let rate = 0.0; //收益率
                let info = {};
                fixedList.forEach(async item => {
                    // console.log(tokenAddress, item.address);
                    let userBalance = 0;
                    if(state.versionName === 'chain') {
                        userBalance = await getDiceDealerBalance(tokenAddress, item.address);
                    } else {
                        dealerBalance = await getUserDealerBalance(game_type, 2, item.address);
                        // console.log(dealerBalance);
                        totalBalance = dealerBalance.total_balance;
                        userBalance = dealerBalance.user_balance;
                    }
                    if(Number(userBalance) > 0) {
                        //占比
                        proportion = Number(userBalance) / Number(totalBalance) * 100;
                        //盈利
                        profit = Number(userBalance) - Number(item.recharging);
                        // 收益率
                        rate = (Number(userBalance) - profit) > 0 ? (profit / (Number(userBalance) - profit)) : 0;
                        // rate = (Number(userBalance) - profit) > 0 ? (profit / (Number(userBalance))) : 0;
                        // console.log(userBalance, item.recharging, rate);
                    }
                    // console.log(profit, proportion );
                    info.user_balance = userBalance;
                    info.proportion = proportion;
                    info.profit = profit;
                    info.rate = rate;
                    info.address = item.address;
                    commit('setUserDealerProportionProfit', info)
                })
            }
        },
        async refreshUserDealerProportion({commit , state , dispatch}, params){
            // console.log('更新所有用户盈利数据', params.game_type, params.isLoding)
            // commit('setUserPositionLoading' , false);
            dispatch('getUserDealerProportion', {game_type: params.game_type, isLoding: params.isLoding})
        },
        //pools
        async poolsTokenList({commit , state} ,){
            if(state.poolsList.loading) return 
            commit("setPoolsListLoading" , true)
            const fixed  = poolsList[state.chainName];
            commit('setPoolsList' , {fixed} )
            if(fixed && fixed.length){
                let fixedList = [...fixed]
                // console.log(fixedList);
                fixedList.forEach(async item=>{
                    let info = await getPoolsTokensData(item.goblin, item.currencyToken, item.pId, item.tk0Address, item.tk1Address)
                    console.log(info);
                    info.t = item.goblin
                    commit('setPoolsBalance' ,info)
                })
            }
            commit("setPoolsListLoading" , false)
            // console.log('state.poolsList' , state.poolsList);
        },
        async refreshPoolsList({commit , state}){
            if(!state.poolsList.length) return
            // state.countStakeTvlMintNum = 0;
            state.poolsList.forEach(async item=>{
                // console.log(item);
                let info = await getPoolsTokensData(item.goblin, item.currencyToken, item.pId, item.tk0Address, item.tk1Address)
                // console.log(info);
                info.t = item.goblin
                commit('setPoolsBalance' ,info)
            })
        },
        // 获取算力币Pools数据
        async getHashPowerPoolsList({commit , state}, isLoding){
            if(state.hashPowerPoolsList.loading) return 
            if(!isLoding || isLoding == undefined) {
                commit('setHashPowerPoolsListLoading' , true);
            }
            const { fixed } = hashPoolsList;
            if(!isLoding || isLoding == undefined) {
                // console.log(fixed);
                commit('setHashPowerPoolsList' , {fixed} )
            }
            // console.log(fixed);
            if(fixed.length) {
                let poolBtcData = await getPoolBtcData();
                console.log(poolBtcData);
                let fixedList = [...fixed]
                fixedList.forEach(async item => {
                    // console.log(item);
                    let info = await getHashPowerPoolsTokensData(item.goblin, item.currencyToken, item.pId, item.id);
                    // console.log(info);
                    if(info) {
                        if(info.is_give_income && info.is_give_income > 0) { //大于第一次购买 第二天 给收益
                            let yest_income_usdt = Number(info.userBalance) * Number(info.daily_income); //昨日收益 usdt
                            let yest_income_btcb = keepDecimalNotRounding(Number(info.userBalance) * (Number(info.daily_income) / Number(poolBtcData[0].currency_price))); //昨日收益 btcb
                            info.yest_income_usdt = yest_income_usdt;
                            info.yest_income_btcb = yest_income_btcb;
                        }
                        let countIncome = keepDecimalNotRounding(Number(info.btcbReward) + Number(info.harvest_btcb_amount)); // 总的收益 = 奖励收益数量 + 已收割奖励数量
                        info.total_income_btcb = countIncome; //btcb总收益
                        let total_income_usdt = countIncome * Number(poolBtcData[0].currency_price); //usdt总收益
                        info.total_income_usdt = total_income_usdt;
                        console.log(info);
                        info.t = item.goblin
                        commit('setHashPowerPoolsBalance', info)
                    }
                })
            }
            commit("setHashPowerPoolsListLoading" , false)
            // console.log('state.poolsList' , state.poolsList);
        },
        async refreshHashPowerPoolsList({commit , state , dispatch}){
            console.log('更新算力数据')
            // commit('setUserPositionLoading' , false);
            dispatch('getHashPowerPoolsList', true)
        },
    }
}