import router from '@/router'
import { getUserAddressInfo, getPoolBtcData, getHashPowerPoolsTokensData, getHashpowerDetail } from '@/wallet/serve'
import {
    deepCopy,
    fromWei,
    toolNumber,
    numberFormat,
    accordingToAprSeekApy,
    calcDaily
} from '@/utils/tools'
import hashPoolsList from '@/wallet/hashpower_pools.js'
import Address from '@/wallet/address.json'
import Web3 from 'web3'
import Vue from 'vue'
import { keepDecimalNotRounding } from "@/utils/tools";
let copyBaseState;







export default {
    state :{
        address:'',
        isConnected:false,
        accounts:'',
        userId: 0, //用户ID
        userInfo: {}, //用户ID
        isAdmin: false, //是否管理员
        chainId:'',
        tradeStatus:{
            current:"",
            list:[],
            SuccessHash:'',
            FailedHash:'',
            userDenyId:''
        },
        domainHostAddress:'https://bscscan.com/tx/',
        apiUrl: window.location.host === 'localhost:8007' ? 'http://www.rune.com' : 'http://www.yutstly.xyz',
        // apiUrl: 'https://www.swanlake.club',
        nftUrl: window.location.host === 'localhost:8008' || window.location.host === '192.168.1.3:8007' ? 'http://www.api.com' : 'https://api.bitguru.finance',
        // nftUrl: 'https://api.h2o.live',
        // Env: window.location.host === 'localhost:8001' || window.location.host === '192.168.1.6:8001' ? 'dev' : 'prod',
        Env: 'dev',
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
        async getAddress(state, value) { //设置钱包地址
            state.address = value;
            let userInfo = await getUserAddressInfo(value);
            // console.log(userInfo)
            if(userInfo) {
                state.userInfo = userInfo;
                state.isAdmin = userInfo.is_admin;
            }
        },  
        async removeAddress(state) {
            state.address = '';
            state.userId = 0;
        },
        getAccounts(state, value) {
            state.accounts = value;
        },
        setUserInfo(state, value) {
            state.userInfo = value;
            state.userId = value.uid;
            if(value.address && value.address !== '') {
                state.address = value.address;
            }
            console.log(value);
        },
        CREATE_ORDER(state, { val, id }) {
            state.tradeStatus.list = [];
            state.tradeStatus.list.push({ id, val });
            console.log("tradeStatus", state.tradeStatus.list);
            state.tradeStatus.Current = id;
        },
        CHANGE_TRADESTATUS(state, status) {
            if (!status.id) return;
            let index = state.tradeStatus.list.findIndex((item) => {
              return item.id === status.id;
            });
            if (index !== -1) {
              state.tradeStatus.list[index].val = status.val; // 1成功 2失败 3进行中
              status.val === 2 ? (state.tradeStatus.list[index].isUserDeny = status.isUserDeny) : null;
            }
        },
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
    },
    actions:{
        async disconnectMetaMask({commit}){
            commit('disconnect')
        },
        createOrderForm({commit } , info){
            commit('CREATE_ORDER' , info)
        },
        changeTradePadding({ commit, dispatch, state }, status) {
            commit("CHANGE_TRADESTATUS", status);
            dispatch("showPopUp", {
                kind: "pending",
                hash: status.hash,
                id: status.id,
            });
        },
        changeTradeStatus({ commit, dispatch, state }, status) {
            console.log("改变状态", status);
            commit("CHANGE_TRADESTATUS", status);
      
            if(status.val === 3){
              dispatch('showPopUp' , {kind:'pending' , isUserDeny:status.isUserDeny , hash:status.hash , id:status.id})
            }
            if (status.val === 1) {
              dispatch("showPopUp", {
                kind: "success",
                hash: status.hash,
                id: status.id,
              });
            }
            if (status.val === 2) {
              dispatch("showPopUp", {
                kind: "fail",
                isUserDeny: status.isUserDeny,
                hash: status.hash,
                id: status.id,
              });
            }
          },
    }
}