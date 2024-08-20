<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="24" align="center">
        <div class="token-application">{{ $t('airdrops:title') }}</div>
      </el-col>
      <el-col :span="24" align="center">
        <div class="marginTop" :style="{ width: isMobel ? '90%' : '60%' }">

            <!-- 邀请地址 -->
            <!-- <div class="common-top-nav">
                <img src="@/assets/airdrop.png" alt="">
                <span class="tit">{{ $t('airdrops:invite') }}</span>
            </div>
            <div class="content">
                <div class="link-address" :style="{ display: isMobel ? '' : 'flex' }">
                    <div class="link">
                        {{reAddress}}
                    </div>
                    <div class="copy-outer">
                        <div class="copy" v-clipboard:copy="reAddress" v-clipboard:success="copySuccess">
                            {{ $t('airdrops:copy') }}
                        </div>
                    </div>
                </div>
            </div> -->

            <!-- 邀请奖励 -->
            <div class="common-top-nav">
                <span class="tit">{{ $t('airdrops:recommend-rewards') }}</span>
            </div>
            <div class="rules">
                <!-- <p class="tit">Invitation reward rules:</p> -->
                <p>{{ $t('airdrops:airdrop-02-content-1') }}</p>
                <p>{{ $t('airdrops:airdrop-02-content-2') }}</p>
                <br>
                <p>{{ $t('airdrops:airdrop-02-content-3') }}</p>
                <p>{{ $t('airdrops:airdrop-02-content-4') }}</p>
                <br>
                <p>{{ $t('airdrops:airdrop-02-content-5') }}</p>
                <p>{{ $t('airdrops:airdrop-02-content-6') }}</p>
                <br>
                <p>{{ $t('airdrops:airdrop-02-content-7') }}</p>
                <p>{{ $t('airdrops:airdrop-02-content-8') }}</p>

                <!-- 1:1兑换 -->
                <div class="common-top-nav" style="text-align:center;margin-top:20px;">
                    <!-- <img src="@/assets/rules.png" alt=""> -->
                    <span class="tit" style="font-size:18px;">{{ $t('swap:Exchange') }}</span>
                </div>
                <el-row class="swap">
                    <el-col :span="isMobel ? 24 : 11">
                        <div class="title">{{ $t('swap:Balance') }} {{ inputBalance }} USDT <i class="el-icon-refresh" @click="switchChain()"></i></div>
                        <el-input placeholder="" type="number" v-model="inputValue" max="98" class="operate chance" @input="inputChangeValue">
                            <template slot="prepend">USDT</template>
                            <template slot="append">
                                <div @click="maxInputValue()" style="cursor: pointer;">MAX</div>
                            </template>
                        </el-input>
                    </el-col>
                    <el-col :span="isMobel ? 24 : 2" class="icon" align="center">
                        <i class="el-icon-right" v-if="!isMobel"></i>
                        <i v-else class="el-icon-bottom"></i>
                        <!-- <img src="@/assets/swap.png" alt="" width="20">   -->
                    </el-col>
                    <el-col :span="isMobel ? 24 : 11">
                        <div class="title">{{ $t('swap:Balance') }} {{ outputBalance }} luck001 <i class="el-icon-refresh" @click="switchChain()"></i></div>
                        <el-input placeholder="" type="number" v-model="outputValue" max="98" class="operate chance" @input="outputChangeValue" :readonly="true">
                            <template slot="prepend">luck001</template>
                            <!-- <template slot="append">MAX</template> -->
                        </el-input>
                    </el-col>
                    <el-col :span="24" align="center">
                        <el-button :style="{ width: isMobel ? '50%' : '30%' }" class="exchangeButton" v-if="!inputApproved" :loading="btnLoading" :disabled="btnLoading" @click="startApprove('USDT')">批准 USDT</el-button>
                        <el-button :style="{ width: isMobel ? '50%' : '30%' }" class="exchangeButton" v-else-if="!outputApproved" :loading="btnLoading" :disabled="btnLoading" @click="startApprove('luck001')">批准 luck001</el-button>
                        <el-button :style="{ width: isMobel ? '50%' : '30%' }" class="exchangeButton" v-else v-loading="btnLoading" :disabled="btnDisabled" @click="confirmExchange">{{ $t('swap:Exchange') }}</el-button>
                    </el-col>
                </el-row>
            </div>

            <br>
            <!-- 我的邀请名单 -->
            <div class="common-top-nav">
                <!-- <img src="@/assets/rules.png" alt=""> -->
                <span class="tit">{{ $t('airdrops:MyInvitationList') }}</span>
            </div>
            <div class="reward">
                <el-row :gutter="10" class="list-outer" v-if="inviteList.length">
                      <el-col :span="12" v-for="(item,index) in inviteList" :key="index" class="item">
                            <el-button @click="showMyCommission(item['address'])" type="text" size="small">{{ item['address'] }}</el-button>
                            <span>{{ keepDecimalNotRounding(item['count_amount'], 10, true) }} USDT</span>
                      </el-col>
                </el-row>
                <div class="loading" v-else >
                    {{inviteListText}}
                </div>
            </div>            
        </div>
      </el-col>
    </el-row>

    <!-- 我的返佣  -->
    <el-dialog :title="$t('airdrops:myCommission')" :visible.sync="myCommissionShow" :show-close="true" :width="isMobel ? '90%' : '80%'">
        <div class="">
            <el-table :data="myCommissionList" style="width: 90%;" height="500">
                <!-- <el-table-column sortable prop="id" label="ID" width="100" align="center" fixed="left" type="index"></el-table-column> -->
                <!-- <el-table-column prop="address" label="User" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ addressStr(scope.row.address) }}</span>
                    </template>
                </el-table-column> -->
                <!-- 币种 -->
                <el-table-column prop="currency" :label="$t('game:currency')" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.currency.toUpperCase() }}</span>
                    </template>
                </el-table-column>
                <!-- 奖励 数量 -->
                <el-table-column prop="" :label="$t('game:rewarded')" align="center">
                    <template slot-scope="scope">
                        <span>{{ keepDecimalNotRounding(Number(scope.row.amount), 14, true)}}</span>
                    </template>
                </el-table-column>
                <!-- 时间 -->
                <el-table-column prop="" :label="$t('game:Time')" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.time }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="pages">
                <el-col :span="24">
                    <div style="float:right;">
                    <wbc-page
                        :total="total"
                        :pageSize="pageSize"
                        :currPage="currPage"
                        @changeLimit="limitPaging"
                        @changeSkip="skipPaging"
                    ></wbc-page>
                    </div>
                </el-col>
            </el-row>
        </div>
    </el-dialog>

    <el-dialog title="选择网络" :visible.sync="selectNetworkShow" :show-close="false" :width="isMobel ? '90%' : '50%'">
        <div class="networlk-list">
            <el-button :class="chainName === 'BSC' ? 'active' : ''" @click="selectNetworkClick('BSC')">
                <div class="item">
                    <!-- <img src="@/assets/BSC.png" alt="" width="50"> -->
                    <span class="name">BNB CHAIN mainnet</span>
                </div>
            </el-button>
            <el-button :class="chainName === 'ARB' ? 'active' : ''" @click="selectNetworkClick('ARB')">
                <div class="item">
                    <!-- <img src="@/assets/ARB.png" alt="" width="50"> -->
                    <span class="name">Arbitrum mainnet</span>
                </div>
            </el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { get, post } from "@/common/axios.js";
import Page from "@/components/Page.vue";
import TOKEN from '@/wallet/token.js'
import { networkSetup, getChainNameId, getChainId } from '@/wallet/connect/metaMask'
import { keepDecimalNotRounding, byDecimals} from '@/utils/tools'
import { clickApprove, swapGTokenTogBuyToken, swapBuyTokenTogToken } from '@/wallet/swap'
import { getMyInvitationList, getBalance, isApproved, getSwapPoolsAmountsOut } from "@/wallet/serve";
import { approve, BuyTokenToLuck001 } from "@/wallet/trade";
export default {
  name: "",
  data() {
    return {
        activeName: '1',
        screenWidth: document.body.clientWidth,
        size: "",
        loading: false,
        btnLoading: false,
        btnDisabled:true,
        currPage: 1,
        pageSize: 30,
        total: 0,
        inviteList: [],
        showApplyDialog: false,
        amount1: 0,
        amount2: 0,
        inputApproved: false,
        outputApproved: false,
        inputBalance: 0,
        outputBalance: 0,
        inputValue: 0,
        outputValue: 0,
        exchangePrice: 1,
        myCommissionShow: false,
        myCommissionList: [],
        selectNetworkShow: false,
    };
  },
  computed: {
    ...mapState({
      address: (state) => state.base.address,
      chainName:state=>state.base.chainName,
      isConnected: (state) => state.base.isConnected,
      mainTheme: (state) => state.comps.mainTheme,
      apiUrl: (state) => state.base.apiUrl,
      luck001Address: (state) => state.base.luck001Address,
      isMobel: (state) => state.comps.isMobel,
    }),
    reAddress(){
        return window.origin + `/#/recommend?re=${this.address}`
    },
    inviteListText(){
        let text = ''
        if(this.isConnected){
            if(this.listLoading ){
                text = ''
            }else {
                if(!this.inviteList.length){
                    text = "There's nothing here"
                }
            }
        }else {
            text = 'Connect Wallet'
        }
        return text
    },
  },
  mounted() {
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth;
    };
  },
  created() {
    try {
        setTimeout(async() => {
            // this.inviteList = await getMyInvitationList();
            // console.log(this.inviteList);
        }, 300);
    } catch (err) {}
  },
  watch: {
    isConnected:{
        immediate:true,
        async handler(val){
            if(val){
                let chainId = await getChainId();
                let chainNameId = await getChainNameId('ARB');
                if(chainNameId == chainId) {
                    await this.getApprovedBalance();
                }
               this.inviteList = await getMyInvitationList();
            //    console.log(this.inviteList);
            //    await this.getLusdBalance();
            }
        }
    },
    chainName:{
        immediate:true,
        async handler(val){
            if(val){
            }
        }
    }
  },
  components: {
    "wbc-page": Page, //加载分页组件
  },
  methods: {
    async getApprovedBalance() {  //获取币种余额 及 是否批准
        let inputBalance = await getBalance(TOKEN[this.chainName]['USDT'], 6);
        let outputBalance = await getBalance(TOKEN[this.chainName]['luck001'], 18);
        console.log("input balance", TOKEN[this.chainName]['USDT'], inputBalance);
        console.log("output balance", TOKEN[this.chainName]['luck001'], outputBalance);
        this.inputBalance = keepDecimalNotRounding(inputBalance, 4, true);
        this.outputBalance = keepDecimalNotRounding(outputBalance, 4, true);
        let inputApproved = await isApproved(TOKEN[this.chainName]['USDT'], 18, this.inputBalance, this.luck001Address);
        let outputApproved = await isApproved(TOKEN[this.chainName]['luck001'], 18, this.outputBalance, this.luck001Address);
        this.inputApproved = inputApproved;
        this.outputApproved = outputApproved;
        console.log("input approved", inputApproved);
        console.log("output approved", outputApproved);
        // await this.getExchangePrice();
        return true;
    },
    //To Value 触发事件
    async inputChangeValue(toValue) {
      console.log(toValue);
      if(toValue > this.inputBalance) {// 如果超过余额 给最大值
        this.inputValue = this.inputBalance;
      }
      if(toValue) { 
        let outputValue = Number(this.inputValue) * this.exchangePrice;
        this.outputValue = outputValue;
        this.btnDisabled = false;
      } else {
        this.outputValue = 0;
        this.btnDisabled = true;
      }
    },
    //out Value 触发事件
    async outputChangeValue(toValue) {
      console.log(toValue);
      if(toValue > this.outputBalance) { // 如果超过余额 给最大值
        this.outputValue = this.outputBalance;
      }
      if(toValue) {
        let inputValue = Number(this.outputValue) / this.exchangePrice;
        if(inputValue > this.inputBalance) {
          this.btnDisabled = true;
          this.btnName = this.inputName + this.$t('swap:InsufficientBalance');
        } else {
          this.btnDisabled = false;
        }
        this.inputValue = inputValue;
      } else {
        this.inputValue = 0;
        this.btnDisabled = true;
      }
    },
    async startApprove(name) { //批准LUSD
        this.btnLoading = true;
        this.btnDisabled = true;
        let isChainName = await this.switchChain();
        if(isChainName) {
            approve(TOKEN[this.chainName][name], this.luck001Address).then(async(hash) => {
                // console.log(result);
                if(hash) {
                    await this.getApprovedBalance();
                    this.btnLoading = false;
                    this.btnDisabled = false;
                }
            }).finally(() => {
                this.btnLoading = false;
                this.btnDisabled = false;
            });
        } else {
            this.btnLoading = false;
            this.btnDisabled = false;
        }
    },
    //用户开始兑换操作
    async confirmExchange() {
        let isChainName = await this.switchChain();
        if(isChainName) {
            this.btnLoading = true
            BuyTokenToLuck001(this.inputValue).then(async (result)=> {
                console.log(result);
                if(result) {
                    this.btnLoading = false;
                    this.inputValue = 0;
                    this.outputValue = 0;
                    setTimeout(async() => {
                        await this.getApprovedBalance();
                    }, 1000)
                }
            }).finally(()=>{
                this.btnLoading = false
            })
        }
    },
    maxInputValue() {
        this.inputValue = this.inputBalance;
        this.inputChangeValue(this.inputBalance);
    },
    async getIsChainId() { // 判断是否网络id一致
        let chainId = await getChainId();
        let chainNameId = await getChainNameId('ARB');
        // console.log(chainId, chainNameId);
        if(chainNameId !== chainId) {
            return false;
        }
        return true;
    },
    async switchChain() { //切换ARB链
        let chainId = await getChainId();
        let chainNameId = await getChainNameId('ARB');
        // console.log(chainId, chainNameId);
        if(chainNameId !== chainId) {
            let switchRes = await this.dropdownChainMenuClick('ARB', false);
            console.log(switchRes);
            if(switchRes) {
                setTimeout(async () => {
                    location.reload(); //网络切换成功 刷新页面
                }, 300)
            } else {
                return false;
            }
        } else {
            localStorage.setItem('chainName', 'ARB');
            await this.getApprovedBalance();
            return true;
        }
    },
    async dropdownChainMenuClick(command, isRefresh=true) { //切换链 下拉事件
        // console.log(command);
        // localStorage.setItem('chainName', command);
        let chainId = await getChainNameId(command);
        let netWorkRes = await networkSetup(chainId, command);
        console.log(chainId, netWorkRes);
        if(netWorkRes) {
            this.chain_name = command;
            localStorage.setItem('chainName', command);
            if(isRefresh) {
                location.reload(); //网络切换成功 刷新页面
            }
            return true;
        }
        return false;
    },
    async showMyCommission(row) { //查看我的返佣
        console.log(row);
        this.myCommissionList = [];
        await this.getMyCommissionList(row);
        this.myCommissionShow = true;
    },
    limitPaging(limit) {
        //赋值当前条数
        this.pageSize = limit;
        this.getMyCommissionList(); //刷新列表
    },
    skipPaging(page) {
        //赋值当前页数
        this.currPage = page;
        this.getMyCommissionList(); //刷新列表
    },
    async getMyCommissionList(player_address) { //获取我的返佣记录
        let serverWhere = {
            address: this.address,
            player_address: player_address,
            page: this.currPage,
            limit: this.pageSize,
        };
        this.loading = true;
        axios.get(this.apiUrl + "/Api/User/getMyCommissionList", {
            params: serverWhere
        }).then((json) => {
            console.log(json);
            if (json.code == 10000) {
                if (json.data.lists.length > 0) {
                    this.myCommissionList = json.data.lists;
                    this.total = json.data.count;
                }
            } else {
                this.$message.error("加载数据失败");
            }
            this.loading = false;
        }).catch((error) => {
            this.loading = false;
            this.$message.error(error);
        });
    },
    async selectNetworkClick(command) { //切换链 下拉事件
        // console.log(command);
        // localStorage.setItem('chainName', command);
        let chainId = await getChainNameId(command);
        let netWorkRes = await networkSetup(chainId, command);
        // console.log(chainId, netWorkRes);
        if(netWorkRes) {
            this.chain_name = command;
            localStorage.setItem('chainName', command);
            this.selectNetworkShow = false;
            location.reload(); //网络切换成功 刷新页面
            return true;
        }
        return false;
    },
    copySuccess() {
      this.$message({
        message: "Copy successfully!",
        type: "success",
      });
    },
    addressStr(address){
        return address.substring(0, 4) + "***" + address.substring(address.length - 3)
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  /deep/ {
    height: 120vh;
    .token-application {
      color: rgb(255, 255, 255);
      line-height: 1.5;
      margin-top: 2rem;
      margin-bottom: 2rem;
      font-size: 26px;
      font-weight: 900;
    }
    .radio-nav {
        margin-bottom: 10px;
        border: 2px solid #454848;
        border-radius: 50px;
        .el-radio-button:first-child .el-radio-button__inner,.el-radio-button:last-child .el-radio-button__inner {
            border-radius: 50px;
        }
        .el-radio-button__orig-radio:checked+.el-radio-button__inner {
            background-color: #e09320;
        }
        .el-radio-button__inner {
            background: transparent;
            color: #fff;
            border: 0;
        }
    }
    .marginTop {
        // width: 100%;
        // margin-top: 50px;
        text-align: left;
        margin-bottom: 30px;
        border: 2px solid #454848;
        padding: 20px;
        border-radius: 10px;
        // background-color: rgb(0, 59, 89);
        .common-top-nav {
            img {
                height: 25px;
                vertical-align: middle;
                margin-right: 8px;
            }
            .tit {
                display: inline-block;
                vertical-align: middle;
                font-weight: 700;
                font-size: 16px;
                margin-top: 3px;
            }
        }
        .rules {
            margin-top: 10px;
            padding: 10px;
            background-color: #21313b;
            border-radius: 8px;
            p{
                // text-indent: 10px; 
                margin: 3px;
                position: relative;
            }
        }
        .content {
            padding: .3rem;
            .link-address {
                // display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px 0 10px;
                .link {
                    width: 85%;
                    // line-height: 20px;
                    padding: 12px 12px;
                    word-break: break-all;
                    background-color: #21313b;
                    border-radius: 10px;
                    color: #fff;
                }
                .copy-outer {
                    display: flex;
                    justify-content: flex-end;
                    padding: 10px 0 10px 0;
                    .copy {
                        cursor: pointer;
                        padding: 12px 16px;
                        // width: 50px;
                        // height: 30px;
                        border-radius: 10px;
                        // border: 1px solid #002EFF;
                        // color: #002EFF;
                        // line-height: 30px;
                        text-align: center;
                        font-size: 13px;
                        background-color: #21313b;
                        color: #0096ff;
                        text-decoration:underline;
                    }
                }
            }
        }
        .reward {
            .list-outer {
                // display: flex;
                // flex-wrap: wrap;
                // justify-content: space-between;
                .item {
                    line-height: 20px;
                    padding: 7px 0;
                    color: #fff;
                    background-color: #21313b;
                    border-radius: 8px;
                    // color: #333333;
                    margin-top: 10px;
                    font-size: 10px;
                    width: 350px;
                    text-align: center;
                    margin-right: 20px;
                    .el-button--small {
                        padding: 0px 15px;
                    }
                }
                // .item:nth-of-type(1){
                //     margin-top: 0;
                // }
                
            }
            .loading {
                margin-top: 10px;
                height: 40px;
                line-height: 40px;
                text-align: center; 
                font-size: 16px;
                font-weight: 600;
                background-color: #21313b;
                border-radius: 10px;
            }
        }
        .swap {
            background: #182730;
            padding: 20px;
            margin-top: 10px;
            border-radius: 10px;
            .title {
                margin-bottom: 5px;
                i {
                    color: #0096ff;
                    cursor: pointer;
                    font-size: 15px;
                    font-weight: 900;
                }
            }
            .icon {
                margin-top: 30px;
                i {
                    font-size: 20px;
                    font-weight: 900;
                }
            }
            .operate {
                text-align: center;
                height: 40px;
                border: 1px solid #454848;
                .el-input__inner {
                    border: 0;
                    color: #fff;
                    display: flex;
                    width: 100%;
                    height: 40px;
                    // border-radius: 0.8rem;
                    background-color: #21313b;
                }
                .el-input-group__prepend {
                    border: 0;
                    color: #fff;
                    background-color: #141a1f;
                    padding: 0 10px;
                    font-size: 10px;
                }
                .el-input-group__append {
                    border: 0;
                    color: #fff;
                    background-color: #141a1f;
                    font-size: 10px;
                    padding: 0 10px;
                }
                .function-button {
                    padding: 9px 9px;
                    height: 40px;
                    // width: 10px;
                    font-size: 10px;
                    border-color: #fff;
                    margin-left: 20px;
                    border: 2px solid #fff;
                }
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                }
                input[type="number"]{
                    -moz-appearance: textfield;
                }
            }
            .exchangeButton {
                margin-top: 30px;
                background: #141a1f;
                color: #fff;
                line-height: 26px;
                margin-right: 23px;
                position: relative;
                overflow: hidden;
                // width: 60%;
                height: 48px;
                border: none;
                border-radius: 19px;
                outline: none;
                cursor: pointer;
            }
            .exchangeButton:disabled {
                background: #8b8b9b;
            }
        }
        .el-table {
            background-color: transparent !important;
            tr {
                background-color: transparent !important;
                color: #fff;
                font-size: 10px;
            }
            .el-table__cell {
                background-color: transparent !important;
            }
        }
        .pagination {
            .el-input__inner {
                height: 30px;
                background-color: #21313b !important;
                color: #fff !important;
            }
            .el-pagination__total,.el-pagination__jump {
                color: #fff !important;
            }
            .el-pagination button:disabled {
                background-color: #21313b;
            }
            .el-pager li {
                background-color: #21313b;
            }
        }
    }
    .el-dialog {
        // width: 50%;
        background-color: rgb(33, 36, 41);
        .el-dialog__body {
            padding: 0;
        }
        .el-dialog__title {
            color: #fff;
        }
        .el-descriptions__body {
            background-color: rgb(33, 36, 41);
            padding: 20px;
            color: #fff;
        }
        .el-table {
            margin: 0 auto;
            background-color: transparent !important;
            tr {
                background-color: transparent !important;
                color: #fff;
                font-size: 10px;
            }
            .el-table__cell {
                background-color: transparent !important;
            }
            .red {
                color: red;
            }
            .green {
                color: #06ff00;
            }
            .blue {
                color: #0af;
            }
        }
        .el-table::before {
            height: 0;
        }
        .pagination {
            .el-input__inner {
                height: 30px;
                background-color: #21313b !important;
                color: #fff !important;
            }
            .el-pagination__total,.el-pagination__jump {
                color: #fff !important;
            }
            .el-pagination button:disabled {
                background-color: #21313b;
            }
            .el-pager li {
                background-color: #21313b;
            }
        }
    }
    .el-loading-mask {
        border-radius: 5px;
        background-color: rgba(0,0,0,0.8);
        border: 0;
    }
  }
}
</style>
