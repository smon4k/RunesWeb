<template>
    <div 
        class="container"
    >
        <el-row class="main" :style="{width: isMobel ? '90%' : '80%', marginTop: isMobel ? '' : '30px'}">
            <el-col :span="24">
                <!-- 入金 -->
                <div v-if="depositWithdrawType == 1">
                    <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
                        <el-tab-pane :label="$t('game:Deposit')" name="1" :disabled="trading" :style="{padding: isMobel ? '10px' : '50px'}">
                            <el-row class="balance">
                                <el-col :span="24">
                                    <div>
                                        <!-- <span>平台余额：{{ Math.trunc(Number(localBalance) + Number(walletBalance)) }} {{ transactionCurrency }}</span> -->
                                        <div>
                                            {{ $t('game:walletBalance') }}：
                                            <span @click.stop="WalletBalanceAll()" style="color:#409EFF;text-decoration: underline;cursor:pointer;">{{ keepDecimalNotRounding(Number(purseBalance), decimalLen) }} {{ getCurrencyName(transactionSpareCurrency) }}</span>
                                        </div>
                                        <div>{{ $t('game:platformBalance') }}：{{ keepDecimalNotRounding(platformBalance, decimalLen) }} {{ getCurrencyName(transactionSpareCurrency) }}</div>
                                        <!-- <br /> -->
                                        <!-- <span>GS Balance：{{localBalance}}</span> --> 
                                        <!-- <span v-else>GS Balance：<el-skeleton-item variant="text" style="width: 5%;" /></span> -->
                                    </div>
                                </el-col>
                                <!-- <el-col :span="24">
                                    <div>
                                        <div>
                                            <span v-if="!isStatus && !isWithdraw">CS Balance：{{walletBalance}}</span>
                                            <span v-else>
                                                CS Balance：<span v-loading="true"></span>
                                                <span style="font-size:10px;color:#909399;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The transfer speed on the chain is slow, please be patient for 5 minutes. .</span>
                                            </span>
                                        </div>
                                    </div>
                                </el-col> -->
                            </el-row>
                            <el-row>
                                <!-- 存入 -->
                                <el-col :span="24">
                                    <el-form :model="depositForm" ref="depositForm" :rules="depositFormRules">
                                        <el-form-item prop="amount">
                                            <el-input 
                                                type="number" 
                                                :label="transactionSpareCurrency + ':'" 
                                                v-model="depositForm.amount" 
                                                :placeholder="$t('game:PleaseAmount2')"
                                                @input="onFunDepositFormInput" 
                                            >
                                                <template slot="prepend">
                                                    <div class="select-currency-prepend">
                                                        <img :src="require('@/assets/'+transactionSpareCurrency.toLowerCase()+'.png')" alt="" width="18">
                                                        <span class="name">
                                                            <span>{{ getCurrencyName(transactionSpareCurrency) }}</span>
                                                            <!-- {{ transactionSpareCurrency }} -->
                                                        </span>
                                                    </div>
                                                </template>
                                                <template slot="append" v-if="currencyChainList">
                                                    <div class="select-currency-append" @click="selectNetworkShow = true">
                                                        <img :src="require('@/assets/Tronlink.svg')" alt="" width="30" v-if="chainName === 'TronGrid'">
                                                        <img :src="require('@/assets/'+chainName+'.png')" alt="" width="30" v-else>
                                                        <!-- <img :src="require('@/assets/'+chainName+'.png')" alt="" width="30" > -->
                                                        <span class="name">{{ chainName }} mainnet</span>
                                                        <i class="el-icon-caret-bottom" style="font-size:20px;"></i>
                                                    </div>
                                                    <!-- <div v-if="chainName === 'ARB'" class="select-currency-append" @click="selectNetworkShow = true">
                                                        <img src="@/assets/ARB.png" alt="" width="30">
                                                        <span class="name">Arbitrum mainnet</span>
                                                        <i class="el-icon-caret-bottom" style="font-size:20px;"></i>
                                                    </div> -->
                                                </template>
                                            </el-input>
                                        </el-form-item>
                                        <!-- <el-row class="button-amount">
                                            <el-col :span="8">
                                                <el-button type="primary" plain @click="buttonAmount(100)">100</el-button>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-button type="primary" plain @click="buttonAmount(200)">200</el-button>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-button type="primary" plain @click="buttonAmount(500)">500</el-button>
                                            </el-col>
                                        </el-row>
                                        <el-row class="button-amount">
                                            <el-col :span="8">
                                                <el-button type="primary" plain @click="buttonAmount(1000)">1000</el-button>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-button type="primary" plain @click="buttonAmount(2000)">2000</el-button>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-button type="primary" plain @click="buttonAmount(50000)">50000</el-button>
                                            </el-col>
                                        </el-row> -->
                                        <div class="submit-name">
                                            <el-button type="primary" :loading="trading" :disabled="trading" @click="startApprove" v-if="!approve">{{ $t('public:Approve') }}</el-button>
                                            <el-button type="primary" :loading="trading" :disabled="trading || isStatus || isWithdraw" @click="submitForm('depositForm')" v-else>{{ $t('game:Deposit2')}}</el-button>
                                            <!-- <el-button @click="resetForm('depositForm')">Cancel</el-button> -->
                                        </div>
                                    </el-form>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('game:DepositHistory')" name="2" :disabled="trading" :style="{padding: isMobel ? '10px' : ''}">
                            <el-table :data="dataHistoryList" style="width: 100%;" v-loading="loading" height="500">
                                <el-table-column prop="address" label="User" align="center" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ addressStr(scope.row.address) }}</span>
                                    </template>
                                </el-table-column>
                                <!-- 数量 -->
                                <el-table-column prop="" :label="$t('game:Amount') + '('+transactionSpareCurrency+')'" align="center">
                                    <template slot-scope="scope">
                                        <span>{{ keepDecimalNotRounding(Number(scope.row.amount), 12, true)}}</span>
                                    </template>
                                </el-table-column>
                                <!-- 时间 -->
                                <el-table-column prop="" :label="$t('game:Time')" align="center" width="180">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.time }}</span>
                                    </template>
                                </el-table-column>
                                <!-- 公链 -->
                                <el-table-column prop="" :label="$t('game:chain')" align="center">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.chain }}</span>
                                    </template>
                                </el-table-column>
                                <!-- 币种 -->
                                <el-table-column prop="" :label="$t('game:currency')" align="center">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.currency }}</span>
                                    </template>
                                </el-table-column>
                                <!-- 状态 -->
                                <el-table-column prop="" :label="$t('game:State')" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.status == 1">{{ $t('game:processing') }}</span>
                                        <span v-else-if="scope.row.status == 2">{{ $t('game:completed') }}</span>
                                        <span v-else style="color:red;">{{ 'Error' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="type" label="scan" width="100" align="center">
                                    <template slot-scope="scope">
                                    <a :href="getBrowserUrl(scope.row.chain) + scope.row.hash" target="_blank" rel="noopener noreferrer">
                                        <img src="@/assets/bsc-show.png" alt="" width="30">
                                    </a>
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
                        </el-tab-pane>
                    </el-tabs>
                </div>

                <!-- 出金 -->
                <div v-else>
                    <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true">
                        <el-tab-pane :label="$t('game:Withdraw')" name="1" :disabled="trading" :style="{padding: isMobel ? '10px' : '50px'}">
                            <el-row class="balance">
                                <el-col :span="24">
                                    <div>
                                        <span>
                                            {{ $t('game:withdrawableBalance') }}：
                                            <span @click="withdrawableBalanceAll()" style="color:#409EFF;text-decoration: underline;cursor:pointer;">
                                                <!-- {{ keepDecimalNotRounding(platformBalance, decimalLen) }} {{ getCurrencyName(transactionSpareCurrency) }} -->
                                                <!-- {{ keepDecimalNotRounding(Number(localBalance) + Number(walletBalance) + Number(trialBalance), decimalLen) }} {{ getCurrencyName(transactionSpareCurrency) }} -->
                                                {{ keepDecimalNotRounding(Number(trialBalance), decimalLen) }} {{ getCurrencyName(transactionSpareCurrency) }}
                                            </span>
                                            &nbsp;&nbsp;
                                            ({{ $t('game:validBetAmount') }}：
                                            <span>
                                                {{ this.userMaxBetSpeedNum }})
                                            </span>
                                        </span>
                                        <br />
                                        <span>
                                            {{ $t('game:platformBalance') }}：
                                            <span @click="PlatformBalanceAll()">
                                                {{ keepDecimalNotRounding(platformBalance, decimalLen) }} {{ getCurrencyName(transactionSpareCurrency) }}
                                            </span>
                                        </span>
                                        <br />
                                        <span>
                                            {{ $t('game:walletBalance') }}：
                                            <span>{{ keepDecimalNotRounding(Number(purseBalance), decimalLen) }} {{ getCurrencyName(transactionSpareCurrency) }}</span>
                                        </span>
                                        <!-- <span>GS Balance：{{localBalance}}</span> -->
                                    </div>
                                </el-col>
                                <!-- <el-col :span="24">
                                    <div>
                                        <span v-if="!isStatus && !isWithdraw">CS Balance：{{walletBalance}}</span>
                                        <span v-else>
                                            CS Balance：<span :loading="true"></span>
                                            <span style="font-size:10px;color:#909399;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The transfer speed on the chain is slow, please be patient for 5 minutes. .</span>
                                        </span>
                                    </div>
                                </el-col> -->
                            </el-row>
                            <el-row>
                                <el-col :span="24">
                                    <el-form  :model="withdrawForm" ref="withdrawForm" :rules="withdrawFormRules">
                                        <el-form-item prop="amount">
                                            <el-input 
                                                :label="transactionSpareCurrency + ':'" 
                                                type="number" 
                                                v-model="withdrawForm.amount" 
                                                :placeholder="$t('game:PleaseAmount2')" 
                                                min="10" 
                                                @input="onWithdrawFunInput" 
                                            >
                                                <template slot="prepend">
                                                    <div class="select-currency-prepend">
                                                        <img :src="require('@/assets/'+transactionSpareCurrency.toLowerCase()+'.png')" alt="" width="18">
                                                        <span class="name">
                                                            <!-- <span v-if="transactionSpareCurrency === 'BTCB' && chainName === 'BSC'">BTCB</span>
                                                            <span v-else-if="transactionSpareCurrency === 'BTCB' && chainName === 'ARB'">WBTC</span> -->
                                                            <span>{{ getCurrencyName(transactionSpareCurrency) }}</span>
                                                        </span>
                                                    </div>
                                                </template>
                                                <template slot="append" v-if="currencyChainList">
                                                    <div class="select-currency-append" @click="selectNetworkShow = true">
                                                        <img :src="require('@/assets/Tronlink.svg')" alt="" width="30" v-if="chainName === 'TronGrid'">
                                                        <img :src="require('@/assets/'+chainName+'.png')" alt="" width="30" v-else>
                                                        <!-- <img :src="require('@/assets/'+chainName+'.png')" alt="" width="30" > -->
                                                        <span class="name">{{ chainName }} mainnet</span>
                                                        <i class="el-icon-caret-bottom" style="font-size:20px;"></i>
                                                    </div>
                                                    <!-- <div v-if="chainName === 'ARB'" class="select-currency-append" @click="selectNetworkShow = true">
                                                        <img src="@/assets/ARB.png" alt="" width="30">
                                                        <span class="name">Arbitrum mainnet</span>
                                                        <i class="el-icon-caret-bottom" style="font-size:20px;"></i>
                                                    </div> -->
                                                </template>
                                            </el-input>
                                        </el-form-item>
                                        <el-row>
                                            <el-col :span="24" align="right" style="margin-top: -20px;">
                                                <span >{{ $t('swap:minWithdrawNum') }}：{{ minWithdrawNum }} {{ transactionSpareCurrency }}</span>
                                            </el-col>
                                        </el-row>
                                        <!-- <el-row class="button-amount">
                                            <el-col :span="8">
                                                <el-button type="primary" plain @click="buttonAmount(100)">100</el-button>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-button type="primary" plain @click="buttonAmount(200)">200</el-button>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-button type="primary" plain @click="buttonAmount(500)">500</el-button>
                                            </el-col>
                                        </el-row>
                                        <el-row class="button-amount">
                                            <el-col :span="8">
                                                <el-button type="primary" plain @click="buttonAmount(1000)">1000</el-button>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-button type="primary" plain @click="buttonAmount(2000)">2000</el-button>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-button type="primary" plain @click="buttonAmount(50000)">50000</el-button>
                                            </el-col>
                                        </el-row> -->
                                        <div class="submit-name">
                                            <el-button type="primary" :loading="trading" :disabled="trading" @click="startApprove" v-if="!approve">{{ $t('public:Approve') }}</el-button>
                                            <el-button type="primary" :loading="trading" :disabled="trading || isStatus || isGame || isWithdraw" @click="submitForm('withdrawForm')" v-else>{{ $t('game:Withdraw')}}</el-button>
                                            <!-- <el-button @click="resetForm('withdrawForm')">Cancel</el-button> -->
                                        </div>
                                    </el-form>
                                </el-col>
                            </el-row>
                            <br>
                            <el-row>
                                <el-col :span="24">
                                    <div class="withdraw-coins">
                                        <!-- <p>{{ $t('game:faq-text-013-title') }}</p> -->
                                        <p>{{ $t('game:faq-text-013-content') }}</p>
                                    </div>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane :label="$t('game:WithdrawHistory')" name="2" :disabled="trading" :style="{padding: isMobel ? '10px' : '50px'}">
                            <el-table :data="dataHistoryList" style="width: 100%;" v-loading="loading" height="500">
                                <el-table-column prop="address" label="User" align="center" :show-overflow-tooltip="true">
                                    <template slot-scope="scope">
                                        <span>{{ addressStr(scope.row.address) }}</span>
                                    </template>
                                </el-table-column>
                                <!-- 数量 -->
                                <el-table-column prop="" :label="$t('game:Amount') + '('+transactionSpareCurrency+')'" align="center">
                                    <template slot-scope="scope">
                                        <span>{{ keepDecimalNotRounding(Number(scope.row.amount), 12, true)}}</span>
                                    </template>
                                </el-table-column>
                                <!-- 时间 -->
                                <el-table-column prop="" :label="$t('game:Time')" align="center" width="180">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.time }}</span>
                                    </template>
                                </el-table-column>
                                <!-- 币种 -->
                                <el-table-column prop="" :label="$t('game:currency')" align="center">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.currency }}</span>
                                    </template>
                                </el-table-column>
                                <!-- 公链 -->
                                <el-table-column prop="" :label="$t('game:chain')" align="center">
                                    <template slot-scope="scope">
                                        <span>{{ scope.row.chain }}</span>
                                    </template>
                                </el-table-column>
                                <!-- 状态 -->
                                <el-table-column prop="" :label="$t('game:State')" align="center">
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.status == 1">{{ $t('game:processing') }}</span>
                                        <span v-else>{{ $t('game:completed') }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="type" label="scan" width="100" align="center">
                                    <template slot-scope="scope">
                                    <a :href="getBrowserUrl(scope.row.chain) + scope.row.hash" target="_blank" rel="noopener noreferrer">
                                        <img src="@/assets/bsc-show.png" alt="" width="30">
                                    </a>
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
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-col>
        </el-row>
        <!-- <el-overlay :show="trading">
            <div class="wrapper">
                <el-loading type="spinner" color="#1989fa" />
            </div>
        </el-overlay> -->

        <!-- 选择网络 -->
        <el-dialog title="选择网络" :visible.sync="selectNetworkShow" :show-close="false" :width="isMobel ? '90%' : '50%'">
            <div class="networlk-list">
                <el-collapse v-model="collapseName" accordion v-for="(item, index) in currencyChainList" :key="index">
                    <el-collapse-item :name="index">
                        <template slot="title">
                            <img :src="require('@/assets/'+'metamask'+'.svg')" alt="" width="50" v-if="index === 'MetaMask'">
                            <img :src="require('@/assets/'+'Tronlink'+'.svg')" alt="" width="50" v-if="index === 'TronLink'">
                            <span style="margin-left:10px;">{{ index }}</span>
                        </template>
                        <div v-for="(items, indexs) in item" :key="indexs">
                            <el-button :class="chainName === items.chain ? 'active' : ''" @click="selectNetworkClick(items.chain)">
                                <div class="item">
                                    <img :src="require('@/assets/'+items.chain+'.png')" alt="" width="30" v-if="index === 'MetaMask'">
                                    <img :src="require('@/assets/Tronlink.svg')" alt="" width="30" v-if="index === 'TronLink'">
                                    <!-- <img src="@/assets/Tronlink.svg" alt="" width="30"> -->
                                    <span class="name">{{ items.chain }}</span>
                                </div>
                            </el-button>
                        </div>
                    </el-collapse-item>
                    <!-- <el-collapse-item name="1" v-if="isMetaMaskWallet">
                        <template slot="title">
                            <img src="@/assets/metamask.svg" alt="" width="50">
                            <span style="margin-left:10px;">Metamask</span>
                        </template>
                        <el-button :class="chainName === 'BSC' ? 'active' : ''" @click="selectNetworkClick('BSC')">
                            <div class="item">
                                <img src="@/assets/BSC.png" alt="" width="30">
                                <span class="name">BNB CHAIN mainnet</span>
                            </div>
                        </el-button>
                        <el-button :class="chainName === 'ARB' ? 'active' : ''" @click="selectNetworkClick('ARB')">
                            <div class="item">
                                <img src="@/assets/ARB.png" alt="" width="30">
                                <span class="name">Arbitrum mainnet</span>
                            </div>
                        </el-button>
                    </el-collapse-item>
                    <el-collapse-item name="2" v-if="isTronlinkWallet">
                        <template slot="title">
                            <img src="@/assets/Tronlink.svg" alt="" width="50">
                            <span style="margin-left:10px;">Tron</span>
                        </template>
                        <el-button :class="chainName === 'TronGrid' ? 'active' : ''" @click="selectNetworkClick('TronGrid')">
                            <div class="item">
                                <img src="@/assets/Tronlink.svg" alt="" width="30">
                                <span class="name">Tronlink</span>
                            </div>
                        </el-button>
                    </el-collapse-item> -->
                </el-collapse>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { get, post } from "@/common/axios.js";
import { mapState } from "vuex";
import { approve, gamesBuyTokenTogToken, gamesGTokenToBuyToken, gameETHTogToken, tronWebTriggerSmartContract } from "@/wallet/trade";
import {getBalance,isApproved, getDepWithUserInfo, saveNotifyStatus, getGameFillingWithdrawStatus, setDepWithdrawStatus, getFillingIncreasingId, getCurrencyPrice, setDepositWithdraw} from "@/wallet/serve";
import { keepDecimalNotRounding } from "@/utils/tools";
import { networkSetup, getChainNameId, getChainId } from '@/wallet/connect/metaMask'
import { connect } from '@/wallet/connect/tronWeb'
import TOKEN from '@/wallet/token.js'
import { getCurrentScope } from 'vue';
import Page from "@/components/Page.vue";
export default {
  name: "Index",
  data() {
    return {
        depositWithdrawType: 1, //1：充值 2：提取
        activeName: "1",
        localBalance: 0, //本地余额
        walletBalance: 0, //清算余额
        trialBalance: 0, //体验金余额
        isStatus: false, //是否可以充提 0：可以充提 1：不可以充提
        isGame: false, //是否打赏中 true： 打赏中 false：不在打赏中
        isGameInfoNum: 0, //正在打赏中 提示次数
        isWithdraw: false, //是否充提进行中
        approve: true,
        trading: false,
        buttonAmountNum: 0, //按钮选择额度值
        purseBalance: 0, //币种 钱包余额
        depositForm: {
            amount: '',
        },
        depositFormRules: {
            amount: [
                { required: true, validator: (rule, value, callback) => {
                    if (!value) {
                        return callback(new Error(this.$t('game:PleaseRechargeAmount')));
                    }
                    let num = this.purseBalance;
                    if(Number(value) > num) {
                        return callback(new Error(this.$t('swap:InsufficientBalance')));
                    } else {
                        callback();
                    }
                }, trigger: 'blur' },
            ]
        },
        withdrawForm: {
            amount: '',
        },
        withdrawFormRules: {
            amount: [
                { required: true, validator: (rule, value, callback) => {
                    if (!value) {
                        return callback(new Error(this.$t('game:PleaseRechargeAmount')));
                    }
                    // let num = this.maxWithdrawableBalance();
                    // let num = this.platformBalance;
                    let num = Number(this.localBalance) + Number(this.walletBalance) + Number(this.trialBalance);
                    if(Number(value) > num) {
                        return callback(new Error(this.$t('swap:InsufficientBalance')));
                    } else if(Number(value) < this.minWithdrawNum) { 
                         return callback(new Error(this.$t('swap:withdrawalsNumberThan', {num: this.minWithdrawNum, currency: this.transactionSpareCurrency})));
                    } else {
                        callback();
                    }
                }, trigger: 'blur' },
            ]
        },
        balanceTimeInterval: null,
        refreshTime: 3000, //数据刷新间隔时间
        selectNetworkShow: false,
        isChainNameTrue: false, //网络是否连接成功
        currencyChainList: [],
        dataHistoryList: [],
        currPage: 1, //当前页
        pageSize: 100, //每页显示条数
        total: 1, //总条数
        loading: false,
        minWithdrawNum: 0, //最小提取数量
        userMaxProfitNum: 0, //用户下注最大利润
        collapseName: ['1'],
        transactionCurrencyConfig: {},
        userMaxBetSpeedNum: 0,
    };
  },
  activated() { //页面进来
    this.refreshData();
    this.getUserInfo();
  },
  beforeRouteLeave(to, from, next){ //页面离开
      if (this.balanceTimeInterval) {
        clearInterval(this.balanceTimeInterval);
          this.balanceTimeInterval = null;
      }
      next();
  },
  created() {
    let type = this.$route.params.type;
    if(type) {
        this.depositWithdrawType = type;
    } else {
        this.$router.push({path:'/NumRangeSpeed'})
    }
    // setTimeout(async() => {
    //    await this.getIsApprove();      
    // }, 300)
  },
  watch: {
        walletBalance: {
            immediate: true,
            async handler(val) {
                if (val) {
                    this.$store.commit('refreshPlatformBalance');
                }
            },
        },
        isConnected: {
            immediate: true,
            async handler(val){
                if(val) {
                    // await this.getIsApprove();
                    // await this.getUserInfo();
                    // await this.refreshData();
                }
            }
        },
        transactionCurrencyToken: {
            immediate: true,
            async handler(val){
                if(val) {
                    if(val) {
                        await this.getIsApprove();
                        await this.getUserInfo();
                        await this.refreshData();
                    }
                }
            }
        },
        transactionCurrency: {
            immediate: true,
            async handler(val){
                if(val) {
                    await this.currencySupportChain();
                    // await this.calcMinWithdrawNum();
                    // await this.getUserBetMaxProfit();
                    // await this.getTokensConfig();
                }
            }
        },
        chainName: {
            immediate: true,
            async handler(val){
                console.log(val);
                if(val) {
                    if(val !== 'ARB' && val !== 'BSC' && val !== 'TronGrid') {
                        this.selectNetworkShow = true;
                    }
                }
            }
        },
        changeData: {
            immediate: true,
            async handler(val){
                console.log(val);
                if(val.address && val.apiUrl && val.transactionCurrency) {
                    await this.getUserBetMaxProfit();
                    await this.getBetSpeedAmount();
                    await this.getTokensConfig();
                    await this.getUserInfo();
                }
            }
        }
  },
  computed: {
      ...mapState({
        isConnected:state=>state.base.isConnected,
        chainName:state=>state.base.chainName,
        address:state=>state.base.address,
        gamesFillingAddress:state=>state.base.gamesFillingAddress,
        apiUrl:state=>state.base.apiUrl,
        userId:state=>state.base.userId,
        isMobel:state=>state.comps.isMobel,
        versionName:state=>state.base.versionName,
        transactionCurrency:state=>state.base.transactionCurrency,
        transactionSpareCurrency:state=>state.base.transactionSpareCurrency,
        transactionCurrencyToken:state=>state.base.transactionCurrencyToken,
        minBetNum:state=>state.base.minBetNum,
        platformBalance:state=>state.base.platformBalance,
        decimalLen:state=>state.base.decimalLen,
        decimalPrecision:state=>state.base.decimalPrecision,
        domainHostAddress:state=>state.base.domainHostAddress,
        walletName:state=>state.base.walletName,
    }),
    changeData() {
      const {apiUrl,address, transactionCurrency} = this
      return {
        apiUrl, address, transactionCurrency
      };
    }
  },
  components: {
    "wbc-page": Page, //加载分页组件
  },      
  methods: {
    async selectNetworkClick(command) { //切换链 下拉事件
        console.log(command);
        let netWorkRes;
        if(command === 'TronGrid') {
            netWorkRes = await connect();
        } else {
            let chainId = await getChainNameId(command);
            let netWorkStep = await networkSetup(chainId, command);
            netWorkRes = await this.$connect();
            console.log(netWorkStep, netWorkRes);
        }
        // return false;
        // localStorage.setItem('chainName', command);
        // console.log(chainId, netWorkRes);
        // if(netWorkRes) {
            this.chain_name = command;
            localStorage.setItem('chainName', command);
            this.selectNetworkShow = false;
            setTimeout(function() {
                // 在此处编写需要延迟执行的代码
                location.reload(); //网络切换成功 刷新页面
            }, 300);
            return true;
        // }
    },
    async currencySupportChain() { //获取当前币种支持几种链
        get(this.apiUrl + "/Api/Bet/currencySupportChain", {
            transactionCurrency: this.transactionCurrency
        }, async (json) => {
            if (json.code == 10000) {
                let chainList = json.data;
                this.currencyChainList = chainList;
                console.log(chainList);
                console.log(this.chainName);
                let isMatchingNetwork = false;
                for (let wallet in chainList) {
                    for (let index = 0; index < chainList[wallet].length; index++) {
                        const element = chainList[wallet][index];
                        if(this.chainName == element.chain) {
                            isMatchingNetwork = true;
                        }
                    }
                    
                };
                if(!isMatchingNetwork) {
                    this.selectNetworkShow = true;
                }
            } else {
                console.log("get Data error");
            }
            return false;
        })
    },
    async getUserBetMaxProfit() { //获取用户下注最大利润
        get(this.apiUrl + "/Api/Bet/getUserBetMaxProfit", {
            address: this.address,
            currency: this.transactionCurrency
        }, async (json) => {
            console.log(json);
            if (json.code == 10000) {
                this.userMaxProfitNum = json.data;
            }
        })
    },
    async getBetSpeedAmount() { //获取用户最大下注额
        get(this.apiUrl + "/Api/Bet/getBetSpeedAmount", {
            address: this.address,
            currency: this.transactionCurrency,
            chain: this.versionName
        }, async (json) => {
            console.log(json);
            if (json.code == 10000) {
                this.userMaxBetSpeedNum = json.data;
            }
        })
    },
    async getTokensConfig() { //获取币种配置数据
        get(this.apiUrl + "/Api/Tokensconfig/getTokensConfig", {
            currency: this.transactionCurrency
        }, async (json) => {
            console.log(json);
            if (json.code == 10000) {
                this.transactionCurrencyConfig = json.data;
                if(json.data) {
                    this.minWithdrawNum = keepDecimalNotRounding(json.data.withdrawal_amount, 2);
                } else {
                    await this.calcMinWithdrawNum();
                }
            }
        })
    },
    async calcMinWithdrawNum() { //计算最小提取数量
        let price = await getCurrencyPrice();
        if(price) {
            this.minWithdrawNum =  Math.floor(100 / price);
            // this.minWithdrawNum = 0.01;
        }
        // console.log(this.minWithdrawNum);
    },
    async onFunDepositFormInput(value) {
        console.log(value);
        if(isNaN(value)) { 
            value = parseFloat(value) 
        } 
        if(value.indexOf('.') > 0) {
            this.depositForm.amount = value.slice(0,value.indexOf('.')+ (this.decimalPrecision + 1))
        }
    },
    async onWithdrawFunInput(value) {
        console.log(value);
        if(isNaN(value)) { 
            value = parseFloat(value) 
        } 
        if(value.indexOf('.') > 0) {
            this.withdrawForm.amount = value.slice(0,value.indexOf('.')+ (this.decimalPrecision + 1))
        }
    },
    getCurrencyName(currency) {
        if(currency === 'BTCB' && this.chainName === 'BSC') {
            return 'BTCB';
        } else if(currency === 'BTCB' && this.chainName === 'ARB') {
            return 'WBTC';
        } else {
            return currency;
        }
    },
    async WalletBalanceAll() { //点击钱包余额
        this.depositForm.amount = keepDecimalNotRounding(this.purseBalance, this.decimalPrecision, true);
    },
    async PlatformBalanceAll() { //点击平台余额
        // this.withdrawForm.amount = keepDecimalNotRounding(Number(this.platformBalance), this.decimalPrecision, true);
        this.withdrawForm.amount = keepDecimalNotRounding(Number(this.localBalance) + Number(this.walletBalance) + Number(this.trialBalance), this.decimalPrecision, true);
    },
    async withdrawableBalanceAll() { //点击平台余额
        // this.withdrawForm.amount = keepDecimalNotRounding(Number(this.platformBalance), this.decimalPrecision, true);
        this.withdrawForm.amount = keepDecimalNotRounding(Number(this.trialBalance), this.decimalLen, true);
    },
    checkDepositAmount(value) { //充值输入框验证
        console.log(value);
        if (!value) {
            return false;
        }
        let num = this.purseBalance;
        if(Number(value) > num) {
            return false;
        } else {
            return true;
        }
    },
    checkWithdrawalAmount(value) { //提取输入验证
        console.log(value);
        if (!value) {
            return false;
        }
        let num = this.maxWithdrawableBalance();
        if(Number(value) > num) {
            return false
        } else {
            return true
        }
    },
    pageSwitchChange(evt, hidden) { //浏览器页面 切换事件
        //hidden为false的时候，表示从别的页面切换回当前页面
        //hidden为true的时候，表示从当前页面切换到别的页面
        if(hidden === false) { //页面切换进来
            this.refreshData();
            this.getUserInfo();
        } else { //页面切换离开
            if (this.balanceTimeInterval) {
                clearInterval(this.balanceTimeInterval);
                this.balanceTimeInterval = null;
            }
        }
    },
    async refreshData() {
        // this.walletBalance = await getGameFillingBalance(); //获取余额
        // let walletBalance = await getDepWithUserInfo(this.transactionCurrencyToken); //获取余额
        // console.log(walletBalance);
        this.timeInterval = setInterval(async() => {
            await this.getPurseBalance();
            // console.log(this.walletBalance);
        }, this.refreshTime)
    },
    async getCurrentDecimals() { //获取币种 decimals 
        let decimals = 18;
        if((this.chainName === 'ARB' && this.transactionCurrency === 'BTCB') || this.transactionCurrency === 'DOGE') {
            decimals = 8;
        }
        if(this.transactionCurrency === 'LUNC') {
            decimals = 6;
        }
        return decimals;
    },
    async getPurseBalance() { //获取钱包余额
        const decimals = await this.getCurrentDecimals();
        this.purseBalance = await getBalance(this.transactionCurrencyToken, decimals); //获取H2O余额
        // console.log(this.purseBalance);
        return this.purseBalance;
    },
    maxWithdrawableBalance() {
        let num = Number(this.walletBalance) + Number(this.localBalance);
        return num;
    },
    async handleClick(tab) {
        console.log(tab);
        if(tab.name == 2) { //提取的话 检测是否在打赏中 提示信息
            await this.getHistoryListData();
        }
        this.depositForm.amount = '';
        this.withdrawForm.amount = '';
    },
    async getIsApprove() { //获取余额 查看是否授权
        if(this.depositWithdrawType == 1) {
            let balance = await this.getPurseBalance();
            let decimals = await this.getCurrentDecimals();
            console.log(this.transactionCurrency + " balance", balance, decimals);
            this.tokenBalance = balance;
            if(this.walletName === 'MetaMask') {
                isApproved(this.transactionCurrencyToken, decimals, balance, this.gamesFillingAddress).then((bool) => {
                  console.log("isApprove", bool);
                  this.approve = bool ? true : false;
                });
            } else {
                this.approve = true;
            }
        } else {
            this.approve = true;
        }
    },
    startApprove() { //批准
        const loading = this.$loading({
          lock: true,
          text: 'transaction in progress',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
      this.trading = true;
      approve(this.transactionCurrencyToken, this.gamesFillingAddress).then((hash) => {
        // console.log(result);
        loading.close();
        if(hash) {
          this.approve = true;
          this.trading = false;
        }
      }).finally(() => {
        loading.close();
        this.trading = false;
      });
    },
    async submitForm(formName) {//1. 提交调用合约
        // console.log(this.$refs[formName]);
        // console.log(this.transactionCurrencyConfig);
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            const loading = this.$loading({
                lock: true,
                text: 'transaction in progress',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.trading = true;
            let amount = 0;
            let contractName = '';
            let orderId = '';
            //检测是否有正在执行中的交易
            await this.getIsInTradeProgress();
            // console.log(isInProgress);
            if(this.isStatus == 1 || this.isWithdraw) {
                this.trading = false;
                return false;
            }
            if(this.depositWithdrawType == 1) {//充值
                amount = this.depositForm.amount;
                if((this.chainName === 'ARB' && this.transactionCurrency === 'ETH') || this.transactionCurrency === 'BNB') {
                    contractName = gameETHTogToken;
                } else {
                    contractName = gamesBuyTokenTogToken;
                }
            } else { //提取
                // await this.getIsInTheGame(); //检测是否在打赏中 提示信息
                if(this.isGame) {
                    this.trading = false;
                    return false;
                }
                amount = this.withdrawForm.amount;
                contractName = gamesGTokenToBuyToken;
                orderId = await getFillingIncreasingId();
                if(!orderId || orderId <= 0) {
                    this.$notify({ type: 'danger', message: this.$t('game:orderIdFaield') }); // 获取订单id失败
                }
            }
            // let balance = await getGameFillingBalance();
            // let balance = await this.getGameFillingBalanceFun(this.activeName, amount);
            // console.log(balance);
            // saveNotifyStatus(1);
            // return false;
            //请求合约 充值或者提取
            // let hash = '0x837d2bae18716363a133662bdf8e935d294a1eec6efb147b2537ba0885cf4e87';
            // if(this.activeName == 1) {//充值的话 二次检测是否充值成功
            //     await this.setDepositWithdraw(amount, hash);
            //     await this.getGameFillingBalanceFun(this.activeName, amount, hash);
            // } else { //提取的话 不二次检测是否充值成功 异步机器人扣除 这里直接写入数据库记录
            //     await this.setDepositWithdraw(amount, hash);
            //     this.trading = false;
            //     this.depositForm.amount = '';
            //     this.withdrawForm.amount = '';
            //     // this.resetForm('depositForm');
            //     // this.resetForm('withdrawForm');
            // }
            const fillingRecordParams = { //充提记录参数
                amount: Number(amount),
                address: this.address,
                userId: this.userId,
                type: Number(this.depositWithdrawType),
                local_balance: this.localBalance,
                wallet_balance: this.walletBalance,
                hash: '',
                currency: this.transactionCurrency,
                currency_token: this.transactionCurrencyToken,
                token: this.gamesFillingAddress,
                chain: this.chainName,
                orderId: orderId,
                source: 1, //渠道： 1：Dice
            };
            const decimals = await this.getCurrentDecimals();
            if(this.walletName === 'MetaMask') {
                contractName(amount, this.transactionCurrencyToken, decimals, fillingRecordParams, orderId, this.transactionCurrencyConfig.hand_fee).then(async (hash) => {
                    loading.close();
                    if(hash) {
                        if(this.depositWithdrawType == 1) {//充值的话 二次检测是否充值成功
                            // await this.setDepositWithdraw(amount, hash);
                            saveNotifyStatus(0, true);
                            this.getUserInfo(true);
                            this.$store.commit('refreshPlatformBalance');
                            this.resetForm('depositForm');
                            this.resetForm('withdrawForm');
                            // await this.getGameFillingBalanceFun(this.activeName, hash);
                        } else { //提取的话 不二次检测是否充值成功 异步机器人扣除 这里直接写入数据库记录
                            // await this.setDepositWithdraw(amount, hash);
                            // this.trading = false;
                            saveNotifyStatus(0, false); //提取的话 这里不通知GS获取余额
                            this.getUserInfo(true);
                            this.resetForm('depositForm');
                            this.resetForm('withdrawForm');
                        }
                    }
                }).finally(() => {
                    loading.close();
                    // saveNotifyStatus(0);
                    this.trading = false;
                });
            } else if(this.walletName === 'TronLink') {
                if(this.depositWithdrawType == 1) {//充值
                    tronWebTriggerSmartContract(amount, this.transactionCurrencyToken, this.gamesFillingAddress, fillingRecordParams, this.transactionCurrencyConfig.hand_fee).then(async (hash) => {
                        loading.close();
                        console.log(hash);
                        if(hash) {
                            saveNotifyStatus(0, true);
                            this.getUserInfo(true);
                            this.$store.commit('refreshPlatformBalance');
                            this.resetForm('depositForm');
                            this.resetForm('withdrawForm');
                        }
                    }).finally(() => {
                        loading.close();
                        this.trading = false;
                    });
                } else {
                    let withdrawRes = await setDepositWithdraw(fillingRecordParams);
                    loading.close();
                    this.trading = false;
                    if(withdrawRes) {
                        this.$notify({
                            title: 'success',
                            message: this.$t('game:request-sent-loading'),
                            type: 'success'
                        });
                        saveNotifyStatus(0, false); //提取的话 这里不通知GS获取余额
                        this.getUserInfo(true);
                        this.resetForm('depositForm');
                        this.resetForm('withdrawForm');
                    }
                }
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    async getGameFillingBalanceFun(deWithId, hash) { //2. 获取合约中充提绝对余额 检测是否充提成功
        // let repeat = 5;
        // let actualBalance = 0;
        // if(type == 1) {
        //     actualBalance = Number(this.localBalance) + Number(this.walletBalance) + Number(amount)
        // } else {
        //     actualBalance = Number(this.localBalance) + Number(this.walletBalance) - Number(amount)
        // }
        let depositTimer = setInterval(async () => {
            if(this.walletName === 'MetaMask') {
                let receipt = await web3.eth.getTransactionReceipt(hash);
                // let balance = await getGameFillingBalance();
                // console.log(actualBalance, balance);
                // if(repeat <= 0 || actualBalance == balance) {
                if(receipt && receipt.status) {
                    await setDepWithdrawStatus(deWithId, 2, true); //修改充值状态为已完成 并通知GS获取余额
                    // this.trading = false;
                    // saveNotifyStatus(0, true);
                    this.trading = false;
                    this.isWithdraw = false;
                    this.isStatus = false;
                    // this.resetForm('depositForm');
                    // this.resetForm('withdrawForm');
                    this.$store.commit('refreshPlatformBalance');
                    clearInterval(depositTimer);
                }
            } else if(this.walletName === 'TronLink') {
                let receipt = await tronLink.tronWeb.trx.getTransaction(hash);
                // let receipt = await tronLink.tronWeb.trx.getTransaction("56a46904b1657af8863b6205afe63ceacca9fe01c97a57c786cb7d1703f0e644");
                console.log(receipt);
                if(receipt && receipt.ret) {
                    await this.getPurseBalance();
                    if(receipt.ret[0]['contractRet'] === 'SUCCESS') {
                        await setDepWithdrawStatus(deWithId, 2, true); //修改充值状态为已完成 并通知GS获取余额
                        this.trading = false;
                        this.isWithdraw = false;
                        this.isStatus = false;
                        this.$store.commit('refreshPlatformBalance');
                        clearInterval(depositTimer);
                    } else if(receipt.ret[0]['contractRet'] === 'FAILED') {
                        await setDepWithdrawStatus(deWithId, 3, true); //修改充值状态为失败
                        this.trading = false;
                        this.isWithdraw = false;
                        this.isStatus = false;
                        this.$store.commit('refreshPlatformBalance');
                        clearInterval(depositTimer);
                    }
                }
            }
        }, 3000);
    },
    timeWithdrawStatus(withdrawId) { //如果充提进行中 监听充提状态是否执行完成以通知GS更新余额
        let withdrawTimer = setInterval(async () => {
            if(withdrawId) {
                let withdrawStatus = await getGameFillingWithdrawStatus(withdrawId);
                // console.log(withdrawStatus);
                if(withdrawStatus) {
                    // await this.getUserInfo(true); //更新用户信息
                    clearInterval(withdrawTimer);
                    await saveNotifyStatus(0, true); //通知GS更新余额
                    this.$store.commit('refreshPlatformBalance');
                    setTimeout(async () => {
                        this.walletBalance = await getDepWithUserInfo(this.transactionCurrencyToken); //重新获取一次余额
                        this.isWithdraw = false;
                        this.isStatus = false;
                    }, 300) //停2秒
                }
            }
        }, 5000);
    },
    resetForm(formName) {
        this.$refs[formName].resetFields();
        this.trading = false;
    },
    allBlanceFun() { //全部余额
        if(this.localBalance > 0 || this.walletBalance > 0) {
            this.withdrawForm.amount = Number(this.localBalance) + Number(this.walletBalance);
            return true;
        }
        return false;
    },
    allWalletBlanceFun() { //全部钱包余额
        if(this.purseBalance > 0) {
            this.depositForm.amount = Math.trunc(this.purseBalance);
            return true;
        }
        return false;
    },
    async getUserInfo(isHint=false) { //获取用户信息
        get(this.apiUrl + "/Api/Depositwithdrawal/getFillingRecordUserInfo", {
            address: this.address,
            currency: this.transactionCurrency,
            chain: this.chainName
        }, async json => {
            console.log(json);
            // console.log(this.transactionCurrency, this.transactionCurrencyToken);
            if (json.code == 10000) {
                let transactionCurrency = this.transactionCurrency.toLowerCase();
                this.localBalance = keepDecimalNotRounding(json.data.local_balance, 10, true);
                this.walletBalance = keepDecimalNotRounding(json.data.wallet_balance, 10, true);
                // console.log(this.transactionCurrencyConfig.multiple);
                console.log(this.localBalance, this.walletBalance, this.userMaxBetSpeedNum, json.data.trial_balance);
                await this.getPurseBalance();
                // this.trialBalance = keepDecimalNotRounding(json.data.trial_balance, 10, true);
                // this.userMaxProfitNum
                if(this.platformBalance && this.platformBalance > 0) {
                    let maxWithNum =  this.userMaxBetSpeedNum / this.transactionCurrencyConfig.multiple; //提取倍数乘体验金数量
                    console.log(maxWithNum);
                    if(maxWithNum < this.platformBalance) {
                        this.trialBalance = keepDecimalNotRounding(maxWithNum, 10, true);
                    } else {
                        this.trialBalance = keepDecimalNotRounding(this.platformBalance, 10, true);
                    }
                }
                // if(json.data.trial_balance && json.data.trial_balance > 0) {
                    // console.log(this.trialBalance);
                    // console.log(maxWithNum);
                    // let maxWithNum = this.transactionCurrencyConfig.multiple * json.data.trial_balance; //提取倍数乘体验金数量
                    // if(this.userMaxProfitNum >= maxWithNum) { // 下注超过体验金的n倍 可以提取
                    //     this.trialBalance = keepDecimalNotRounding(json.data.trial_balance, 10, true);
                    // }
                // }
                // if(this.isChainNameTrue) {
                //     this.walletBalance = await getDepWithUserInfo(this.transactionCurrencyToken); //获取合约余额
                //     console.log('链上余额：', this.walletBalance);
                // }
                this.isStatus = json.data.dw_status == 1 ? true : false;
                this.isWithdraw = json.data.isDeWith; //是否充提中
                console.log('是否充提中：', this.isStatus, this.isWithdraw);
                if(json.data.dw_status == 1 || json.data.isDeWith) { //有交易正在执行中 不能进行充提操作
                    if(!isHint) {
                        this.$notify({
                            showClose: true,
                            message: this.$t('game:transactionProgress'), //交易进行中，无法进行存取款操作。
                            type: 'warning'
                        });
                    }
                    if(json.data.isDeWith > 0) { //如果有提取 进行中的任务 监听任务是否完成
                        if(json.data.isDeWithType == 1) {
                            this.getGameFillingBalanceFun(json.data.isDeWithStatusId, json.data.isDeWithHash);
                        } else {
                            this.timeWithdrawStatus(json.data.isDeWithStatusId);
                        }
                    }
                }
                if(this.isChainNameTrue) {
                    let decimals = 18;
                    if(this.chainName === 'ARB' && this.transactionCurrency === 'BTCB') {
                        decimals = 8;
                    }
                    await this.getPurseBalance(); //获取币种钱包余额
                }
            } else {
                console.log("get Data error");
            }
        })
    },
    async getIsInTheGame() { //获取是否打赏中 调用GS第三方接口获取 暂时不使用
        get(this.apiUrl + "/Api/Depositwithdrawal/getIsGameOrNot", {
            params: {
              address: this.address
            }
        }, async (json) => {
            // console.log(json);
            if (json.code == 10000) {
                this.isGame = json.data;
                if(json.data) {
                    this.isGameInfoNum ++;
                    if(this.isGameInfoNum <= 3) {
                        this.$notify({
                            showClose: true,
                            message: 'The game is in progress and the operation cannot be retrieved', //正在打赏中
                            type: 'warning'
                        });
                    }
                    return false;
                } else {
                    this.isGameInfoNum = 0;
                    return true;
                }
            } else {
                console.log("get Data error");
            }
            return false;
        })
    },
    async getIsInTradeProgress() { //实时 获取是否有交易正在进行中
        get(this.apiUrl + "/Api/Depositwithdrawal/getIsInTradeProgress", {
            address: this.address,
            userId: this.userId,
        }, async (json) => {
            console.log(json);
            if (json.code == 10000) {
                this.isStatus = json.data.status;
                this.isWithdraw = json.data.isWithdraw;
                if(json.data.status == 1 || json.data.isWithdraw) { //有交易正在执行中 不能进行充提操作
                    this.$notify({
                        showClose: true,
                        message: this.$t('game:transactionProgress'), //交易进行中，无法进行存取款操作。
                        type: 'warning'
                    });
                    return false;
                } else {
                    return true;
                }
            } else {
                console.log("get Data error");
            }
            return false;
        });
    },
    buttonAmount(value) { //选中按钮选择数量
        if(value) {
            if(this.depositWithdrawType == 1) {//充值
                this.depositForm.amount = value;
            } else {
                this.withdrawForm.amount = value;
            }
        }
    },
    onClickSave() { //编辑资料
        this.$router.go(-1);
    },
    async getHistoryListData(ServerWhere) { //获取充提记录
        if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
            ServerWhere = {
                address: this.address,
                page: this.currPage,
                limit: this.pageSize,
                // chain: this.chainName,
                type: this.depositWithdrawType,
                currency: this.transactionCurrency
            };
        }
        axios.get(this.apiUrl + "/Api/Depositwithdrawal/getDepositWithdrawRecord", {
            params: ServerWhere
        }).then((json) => {
            console.log(json);
            // console.log(this.address);
            if (json.code == 10000) {
                if (json.data.lists.length > 0) {
                    this.dataHistoryList = json.data.lists;
                    this.total = json.data.count;
                }
                // if(this.$refs.seamlessScroll) {
                //     this.$refs.seamlessScroll.reset()
                // }
            } else {
                this.$message.error("error");
            }
            this.loading = false;
        }).catch((error) => {
            this.loading = false;
            this.$message.error(error);
        });
    },
    addressStr(address){
        return address.substring(0, 4) + "***" + address.substring(address.length - 3)
    },
    getBrowserUrl(chain) { //获取浏览器url
        return TOKEN[chain].browserUrl;
    },
    limitPaging(limit) {
        //赋值当前条数
        this.pageSize = limit;
        this.getHistoryListData(); //刷新列表
    },
    skipPaging(page) {
        //赋值当前页数
        this.currPage = page;
        this.getHistoryListData(); //刷新列表
    },
  },
};
</script>
<style>
    .el-loading-mask {
        border-radius: 0 !important; 
    }
</style>
<style lang="scss" scoped>
.container {
    /deep/ {
        height: 80vh;
        div {
            min-height: 0;
            background-color: transparent;
        }
        input[type=number] {
            -moz-appearance:textfield;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        // height: 100vh;
        .main {
            // padding: 10px;
            border: 2px solid #454848;
            .el-tabs__nav {
                border: 0;
            }
            .el-tabs__content {
                margin-top: -15px;
            }
            .el-tabs__item {
                color: #fff !important;
                border: 0;
                height: 50px;
                line-height: 50px;
                font-size: 10px;
            }
            .el-tabs__item.is-active {  
                color: #1890ff;  
                background-color: #e09320;
                // border-top-left-radius: 20px;
                // border-top-right-radius: 20px;
            } 
            .el-tabs__nav-scroll{
                // width:30%;
                margin:0 auto
            }
            // border-radius: 20px !important;
            // background-color: #fff !important;
            // width: 80%;
            // height: 80vh;
            // padding: 20px;
            text-align: center;
            margin: 0 auto;
            // margin-top: 35px;
            .el-form {
                margin-top: 15px;
            }
            .el-form-item {
                // height: 50px;
            }
            .el-tabs__content {
                // padding: 50px;
            }
            .el-tabs__item {
                height: 60px;
                line-height: 60px;
                font-size: 16px;
                font-weight: 800;
                // color: #fff;
                // @include mainFont($color-mainFont-light);
            }
            .el-tabs__item.is-active {
                color: #409EFF;
            }
            .el-loading-spinner {
                margin-top: -11px;
                .circular {
                    width: 20px;
                    height: 20px;
                }
            }
            .el-form-item__label {
                color: #fff;
                // @include mainFont($color-mainFont-light);
            }
            .el-input {
                // background-color: #333257;
                // color: #fff;
                // border: 1px solid #333257;
                // padding: 0 10px;
                font-size: 16px;
                .el-input__label {
                    width: 50px;
                    margin-right: 0;
                    // text-align: right;
                }
            }
            .el-input__inner {
                border: 0;
                color: #fff;
                display: flex;
                width: 100%;
                height: 60px;
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
            .balance {
                text-align: left;
                height: 30px;
                line-height: 30px;
                // color: #fff;
                // @include mainFont($color-mainFont-light);
            }
            .el-button {
                border-radius: 30px;
                width: 100px;
                border: 0;
            }
            .button-amount {
                margin-top: 30px;
                line-height: 30px;
                .el-button--primary.is-plain {
                    background: #3ab293;
                    color: #fff;
                }
                .el-button {
                    border-radius: 5px;
                }
                .el-button::after {
                    background-color: #409EFF !important;
                }
                .el-button:focus,.el-button:hover {
                    background-color: #409EFF !important;
                    color: #fff;
                }
            }
            .submit-name {
                margin-top: 30px;
                .el-button--primary {
                    margin-top: 20px;
                    width: 200px;
                    // display: grid;
                    padding: 1.5rem;
                    color: rgb(255, 255, 255);
                    font-size: 1rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    border: none;
                    border-radius: 0.8rem;
                    background-color: #141a1f;
                    background-repeat: no-repeat;
                    transition: opacity 0.2s linear 0s;
                }
                .el-button--primary.is-disabled {
                    background: #c8c9cc63;
                    color: #fff;
                }
                .el-button--primary.is-disabled:hover {
                    background: #c8c9cc63;
                    color: #fff;
                }
                .el-button--primary:hover {
                    background: #21313b;
                    color: #fff;
                }
                .el-loading-mask {
                    border-radius: 5px;
                    background-color: rgba(0,0,0,0.8);
                    border: 0;
                }
            }
            .el-input-group__append {
                white-space: unset;
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
        }
        .wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
        .el-dialog {
            // width: 50%;
            min-height: 350px;
            background-color: rgb(33, 36, 41);
            .el-dialog__body {
                padding: 20px 0;
            }
            .el-dialog__title {
                color: #fff;
            }
        }
        .networlk-list {
            // height: 300px;
            width: 100%;
            overflow: auto;
            .el-collapse {
              border-bottom: 0;  
            }
            .el-button {
                color: #fff;
                background-color: rgb(33, 38, 62);
                cursor: pointer;
                display: flex;
                width: 100% !important;
                border-radius: 0;
                padding: 20px;
                border-color: transparent transparent rgb(95, 95, 95);
                border-width: 0.0625rem;
                border-style: solid;
                .item {
                    width: 100%;
                    display: flex;
                    -webkit-box-pack: justify;
                    justify-content: space-between;
                    -webkit-box-align: center;
                    align-items: center;
                    margin-left: 15px;
                    img {
                        border-radius: 50px
                    }
                    .name {
                        // margin-left: 10px;
                        font-size: 10px;
                    }
                }
            }
            // .el-button::after {
            //     background-color: rgb(33, 36, 41) !important;
            // }
            .el-button:focus,.el-button:hover {
                background-color: rgb(54, 61, 95) !important;
                color: #fff;
            }
            .el-button+.el-button {
                margin-left: 0 !important;
            }
            .el-collapse-item__wrap {
                border-bottom: 0;
            }
            // .el-button.active {
            //     background-color: rgb(54, 61, 95);
            // }
            .el-collapse-item__header {
                color: #fff;
                padding: 20px 20px;
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
        .select-currency-prepend {
            cursor: pointer;
            // width: 130px;
            display: flex;
            -webkit-box-pack: justify;
            justify-content: space-between;
            -webkit-box-align: center;
            align-items: center;
            img {
                border-radius: 50px;
                margin-right: 5px;
            }
        }
        .select-currency-append {
            cursor: pointer;
            width: 130px;
            display: flex;
            -webkit-box-pack: justify;
            justify-content: space-between;
            -webkit-box-align: center;
            align-items: center;
            img {
                border-radius: 50px
            }
            .name {
                // margin-left: 10px;
            }
        }
        .withdraw-coins {
            background-color: #141a1f;
            padding: 10px;
            border-radius: 10px;
            text-align: left;
        }
    }
}
</style>
