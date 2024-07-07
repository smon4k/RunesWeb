 <!-- 猜单双 -->
<template>
    <div class="container">
        <div class="game">
            <el-row :gutter="20">
                <el-col :span="screenWidth < 1200 ? 24 : 8" align="center">
                    <div class="marginTop" :style="{width: screenWidth > 1200 ? '' : screenWidth < 600 ? '90%' : '50%'}">
                        <div class="title">{{ $t('game:Balance') }}: {{ lusdBalance }} LUSD</div>
                        <!-- <el-button class="dealer" size="mini" @click="likeDealer()">我要做庄家</el-button> -->
                        <el-button-group>
                            <el-button type="primary" @click="minBet()">MIN</el-button>
                            <el-button type="primary" @click="removeBet()">-1</el-button>
                            <el-button type="primary" @click="takeBet()">+1</el-button>
                            <el-button type="primary" @click="maxBet()">MAX</el-button>
                        </el-button-group>
                        <el-input placeholder="" :min="10" v-model="size" class="operate" @input="calcBetFun"></el-input>
                        <el-col :span="screenWidth < 600 ? 24 : 12" class="odds">
                            <div class="title">{{ $t('game:Payout') }}</div>
                            <el-input placeholder="" v-model="payout" class="operate" :readonly="true">
                                <template slot="append">x</template>
                            </el-input>
                        </el-col>
                        <el-col :span="screenWidth < 600 ? 24 : 12" class="profit">
                            <div class="title">{{ $t('game:Profit') }}</div>
                            <el-input placeholder="" v-model="profit" class="operate" :readonly="true">
                                <template slot="append">LUSD</template>
                            </el-input>
                        </el-col>
                        <!-- <div class="bet-amount">
                            <div v-if="screenWidth < 600">
                                <el-radio-group v-model="size">
                                    <el-radio-button label="10"></el-radio-button>
                                    <el-radio-button label="50"></el-radio-button>
                                    <el-radio-button label="100"></el-radio-button>
                                    <el-radio-button label="500"></el-radio-button>
                                    <el-radio-button label="1000"></el-radio-button>
                                </el-radio-group>
                            </div>
                            <div v-else>
                                <el-radio v-model="size" label="10" border>10</el-radio>
                                <el-radio v-model="size" label="50" border>50</el-radio>
                                <el-radio v-model="size" label="100" border>100</el-radio>
                                <el-radio v-model="size" label="500" border>500</el-radio>
                                <el-radio v-model="size" label="1000" border>1000</el-radio>
                            </div>
                        </div> -->
                        <div class="size">
                            <el-radio v-model="betting" label="单" border>{{ $t('game:One') }}</el-radio>
                            <el-radio v-model="betting" label="双" border>{{ $t('game:Pair') }}</el-radio>
                        </div>
                        <el-button class="start-bet" v-if="!approve" :loading="loading" :disabled="loading" @click="startApprove()">{{ $t('swap:Approve') }}</el-button>
                        <el-button class="start-bet" v-else :loading="loading" :disabled="loading" type="primary" @click="startPlaceBet">{{ $t('game:Roll') }}</el-button>
                        <br><br>
                        <el-alert
                            v-show="alertShow"
                            class="alert"
                            :title="$t('game:DrawResult') + ' ' +  dealResult"
                            :type="dealResultStatue"
                            description=""
                            show-icon
                            :center="false"
                            effect="dark"
                            :style="{width: screenWidth < 600 ? '200px' : '200px'}">
                        </el-alert>
                        <div style="font-size:10px;position: relative;bottom: 5px;margin-right: -7px;float: right;">
                            <span>{{ $t('game:MaxProfit') }} {{ dealerTotalBalance ? keepDecimalNotRounding(Number(dealerTotalBalance) * 0.01, 2) : 0 }} LUSD</span>
                        </div>
                    </div>
                </el-col>
                <el-col :span="screenWidth < 1200 ? 24 : 16" align="center">
                    <List :game_type="3" />
                </el-col>
                <!-- <el-col :span="screenWidth < 600 ? 24 : 10" align="center">
                    <div class="rule" :style="{width: screenWidth < 600 ? '100%' : '100%', marginTop: screenWidth < 600 ? '30px' : '30px'}">
                        <div class="title">玩法规则</div>
                        <div class="box">
                            <span>
                                普通单双玩法介绍：（2倍赔率）<br>
                                A.使用OKT兑换好LUSD <br>
                                B.向游戏地址投注LUSD，向游戏地址投注资金（尾数为0.001代表下注单、尾数为其他代表下注双） <br>
                                C.投注数额等于转账数额 <br>
                                D.如押注100LUSD,则转账100LUSD <br>
                                E.转账低于 10LUSD (限红)视为无效投注，不进行发牌返奖， <br>
                                F.转账不满足限额时，退还本金（不扣手续费） <br>
                                G.获取您投注转账后，满足限额要求会获得协议发牌，发牌转账Deal的区块事件日志里[topic0]为∶0x12693cbe14f5a2c78464fbeea779611c56f39525834aa514cdaa6def62c2aba8的第一行HEX哈希我们称为【区块哈希】，作为判定依据 <br>
                                H.哈希末尾五位最后一位数字为牌面，例: ( *2ab8a )，最后一位数字为8，8为牌面，结果为双，13579判定结果为单，24680判定结果为双， <br>
                                I.牌面中如果存在字母，则字母忽略 <br>
                                J.根据下注结果与实际开牌结果，分胜负，赔率为赢家赔2倍 <br>
                                K. 当哈希值末尾五位都为字母，判定为平局，单双都不退本金 <br>
                                L.盈亏转账税为百分之一。 <br>
                            </span>
                        </div>
                    </div>
                </el-col> -->
            </el-row>
        </div>
    </div>
</template>
<script>
import { get, post } from "@/common/axios.js";
import { mapGetters, mapState } from "vuex";
import { keepDecimalNotRounding, topicsHashString } from "@/utils/tools";
import { approve, bettingTransfer } from "@/wallet/trade";
import { getBalance, isApproved, getDiceBalanceOf } from "@/wallet/serve";
import TOKEN from '@/wallet/token.js'
import List from './list.vue'
export default {
    name: '',
    data() {
        return {
            screenWidth: document.body.clientWidth,
            size: 1, //赌注
            payout: 0, //赔率
            profit: 0, //利润
            betting: '单', //投注
            loading: false,
            approve: true,
            lusdBalance: 0,
            alertShow: false,
            dealResult: '', // 开牌结果
            dealResultStatue: '',
            dealerTotalBalance: 0, //庄家总余额
            dataStatisticsData: {},
        }
    },
    mounted() {
        window.onresize = () => {
            this.screenWidth = document.body.clientWidth;
        }
    },
    computed: {
        ...mapState({
            address:state=>state.base.address,
            chainName:state=>state.base.chainName,
            isConnected:state=>state.base.isConnected,
            isMobel:state=>state.comps.isMobel,
            mainTheme:state=>state.comps.mainTheme,
            apiUrl:state=>state.base.apiUrl,
            gamesFillingAddress:state=>state.base.singDoubleAddress,
        }),
        changeData() {
            const { address } = this
            return {
                address
            };
        },
    },
    created() {
        try {
        } catch (err) {}
    },
    watch: {
        changeData: {
            immediate: true,
            async handler(val){
                if(val.address) {
                    await this.getLusdBalance(); //获取余额
                    // await this.getIsApprove();
                    this.dealerTotalBalance = await getDiceBalanceOf(this.gamesFillingAddress); //获取庄家总余额
                    console.log('庄家总余额：', this.dealerTotalBalance);
                    await this.calcProfitPayout();
                    // await this.dataStatisticsBet();
                }
            }
        },
    },
    components:{
        List
    },
    methods: {
        async getIsApprove() { //获取余额 查看是否授权
            let balance = await this.getLusdBalance(); //获取余额
            console.log("LUSD balance", balance);
            isApproved(TOKEN[this.chainName].LUSD, 18, balance, this.gamesFillingAddress).then((bool) => {
                console.log("isApprove", bool);
                this.approve = bool ? true : false;
            });
        },
        async getLusdBalance() {  //获取余额
            let balance = await getBalance(TOKEN[this.chainName].LUSD, 18);
            console.log("LUSD balance", balance);
            this.lusdBalance = keepDecimalNotRounding(balance, 2, true);
            return balance;
        },
        startApprove() { //批准LUSD
            const loading = this.$loading({
                lock: true,
                text: 'transaction in progress',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.trading = true;
            approve(TOKEN[this.chainName].LUSD, this.gamesFillingAddress).then((hash) => {
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
        addressStr(address){
            // console.log(this.address);
            if(!address || address == undefined || address == '') {
                return "Connect Wallet";
            } else {
                return this.address.substring(0, 4) + "***" + address.substring(address.length - 3)
            }
        },
        startPlaceBet() { //开始下注
            this.loading = true;
            let amount = 0;
            if(this.lusdBalance < 1) {
                // 余额不足，是否充值
                this.$confirm(this.$t('public:BalanceRecharge'), '', {
                    confirmButtonText: this.$t('public:toRecharge'), //去充值
                    cancelButtonText: this.$t('public:cancel'), //取消
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    closeOnHashChange: false,
                    customClass: this.isMobel ? 'message-box-h5' : 'message-box',
                    type: 'warning'
                }).then(() => {
                    this.$router.push({path:'/exchange/deposit'})
                }).catch(() => { 
                    this.loading = false;         
                });
                return false;
            }
            if(this.size <= 0) {
                this.$message.warning(this.$t('public:BettingAmount')); //投注额必须大于0
                this.loading = false;
                return false;
            }
            if(!this.betting || this.betting  == '') {
                this.$message.warning(this.$t('public:PleaseSelectBet')); //请选择投注
                this.loading = false;
                return false;
            }
            let maxBetAmount = Number(this.dealerTotalBalance) * 0.01; //下注最大数量
            if(Number(this.profit) > maxBetAmount) {
                this.$message.warning(this.$t('public:BetsCannotExceed', {num: keepDecimalNotRounding(maxBetAmount, 2)})); //投注不能超过{{ num }} LUSD
                this.loading = false;
                return false;
            }
            if(this.betting === '单') {
                amount = Number(this.size) + 0.01;
            } else {
                amount = Number(this.size);
            }
            bettingTransfer(TOKEN[this.chainName].LUSD, this.gamesFillingAddress, amount).then(async (result) => {
                console.log(result);
                this.loading = false;
                if(result) {
                    let hash = result.transactionHash;
                    let index = result.logs.findIndex(item=>item.address.toLowerCase() === this.gamesFillingAddress.toLowerCase());
                    if(index !== -1) {
                        let topicsHash = result.logs[index].topics[1];
                        let cardNum = web3.utils.hexToNumber(result.logs[index].topics[2]);//牌号
                        let result_value = topicsHashString(topicsHash, 5, 1);
                        let lost = 0;
                        if(result_value >= 0 && result_value < 10) {
                            if(result_value % 2 == 0) { // 开牌结果 双数
                                lost = this.betting === '双' ? 1 : 0;
                            } else { // 开牌结果 单
                                lost = this.betting === '单' ? 1 : 0;
                            }
                            this.dealResult = result_value;
                            this.dealResultStatue = lost == 1 ? 'success' : 'error';
                            this.alertShow = true;
                            setTimeout(() => {
                                this.alertShow = false;
                            }, 60000)
                        } else {
                            this.dealResult = 'LOSE';
                            this.dealResultStatue = 'error';
                            this.alertShow = true;
                            setTimeout(() => {
                                this.alertShow = false;
                            }, 60000)
                        }
                        await this.getLusdBalance();
                        await this.setRollDiceData(result_value, lost, hash, topicsHash, cardNum);
                    }
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        async setRollDiceData(result_value, lost, hash, topicsHash, cardNum) { //记录下注记录
            post(this.apiUrl + '/Api/Bet/setRollDiceData', {
                hash: hash,
                topicsHash: topicsHash,
                address: this.address,
                chance: '50',
                bet: this.size,
                payout: this.payout,
                profit: lost ? this.profit : this.size,
                lost: lost,
                result_value: result_value,
                user_choice: this.betting,
                type: 3,
                chain: this.chainName,
                cardNum: cardNum,
                table_addr: this.gamesFillingAddress
            }, (json) => {
                console.log(json);
                if (json && json.code == 10000) {
                    console.log('记录投注记录成功');
                } else {
                    this.$message.error(json.msg);
                }
                return;
            });
        },
        async calcBetFun(value) {
            this.size = value.toString().replace(/^(0+)|[^\d]+/g,'');
            if(value > 0) {
                await this.calcProfitPayout();
            }
        },
        async calcProfitPayout() { 
            //利润计算 利润：下注额*（9801/1000/5-1）
            let profit = Number(this.size) * (9801 / 1000 / 5 - 1);
            if(profit < 0) {
                profit = 0;
            }
            this.profit = keepDecimalNotRounding(profit, 8);
            
            //赔率 计算  赔率： 9801/1000/5
            let payout = 9801 / 1000 / 5;
            this.payout = keepDecimalNotRounding(payout, 4);
        },
        minBet() { //赌注 min
            if(this.lusdBalance > 1) {
                this.size = 1;
            } else {
                this.size = 0;
            }
            this.calcProfitPayout();
        },
        removeBet() { //赌注 减 1
            this.size = Number(this.size) - 1;
            if(this.size < 1) {
                this.size = 1;
            }
            this.calcProfitPayout();
        },
        takeBet() { //赌注 加 1
            this.size = Number(this.size) + 1;
            this.calcProfitPayout();
        },
        maxBet() { //赌注 MAX
            this.size = Math.floor(this.lusdBalance);
            let maxBetAmount = Number(this.dealerTotalBalance) * 0.01; //下注最大数量
            if(this.size > maxBetAmount) {
                this.size = Math.floor(maxBetAmount);
            }
            this.calcProfitPayout();
        },
        likeDealer() { //跳转庄家页面
            this.$router.push({
                path:'/banker',
                query: {
                    game_type: 3,
                }
            })
        },
        async dataStatisticsBet() { //数据统计
            axios.get(this.apiUrl + "/Api/Bet/dataStatisticsBet", {
                params: {
                    address: this.address,
                    game_type: 1,
                    chain: this.chainName,
                }
            }).then((json) => {
                console.log(json);
                // console.log(this.address);
                if (json.code == 10000) {
                    this.dataStatisticsData = json.data;
                } else {
                    this.$message.error("Error");
                }
            }).catch((error) => {
                this.$message.error(error);
            });
        },
    },
}
</script>
<style lang="scss" scoped>
    .container {
        /deep/ {
            .game {
                // padding: 30px 0;
                width: 95%;
                margin: 0 auto;
                border: 0;
                background-color: transparent;
                padding-top: 20px;
                .content-box {
                    // width: 80%;
                    margin: 0 auto;
                    font-size: 10px;
                    margin-left: auto !important;
                    margin-right: auto !important;
                    .el-col {
                        padding-left: 0 !important;
                    }
                }
                .title {
                    margin-bottom: 10px;
                }
                .marginTop {
                    // width: 100%;
                    margin-bottom: 30px;
                    border: 2px solid #454848;
                    padding: 20px;
                    .title {
                        float: left;
                    }
                    .el-button-group {
                        width: 100%;
                        border: 1px solid transparent;
                        button {
                            width: 25.10%;
                            padding: 20px 20px;
                            border-radius: 0;
                            border: 1px solid transparent;
                            font-size: 10px;
                        }
                        .el-button--primary {
                            background-color: #141a1f;
                            border-color: transparent;
                        }
                        .el-button--primary:hover {
                            background-color: #21313b;
                        }
                    }
                    .operate {
                        text-align: center;
                        height: 60px;
                        border: 1px solid #454848;
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
                        .function-button {
                            padding: 9px 9px;
                            height: 60px;
                            // width: 10px;
                            font-size: 10px;
                            border-color: #fff;
                            margin-left: 20px;
                            border: 2px solid #fff;
                        }
                        .red {
                            border-color: #f56c6c;
                        }
                        .green {
                            border-color: rgb(64, 199, 156);
                        }
                        input::-webkit-outer-spin-button,
                        input::-webkit-inner-spin-button {
                            -webkit-appearance: none;
                        }
                        input[type="number"]{
                            -moz-appearance: textfield;
                        }
                    }
                    .odds {
                        padding-left: 0 !important;
                        margin: 20px 0;
                    }
                    .profit {
                        padding-right: 0 !important;
                        margin: 20px 0;
                    }
                }
                .rule {
                    // width: 80%;
                    // display: flex;
                    // flex-direction: column;
                    // position: relative;
                    border-radius: 0.8rem;
                    font-size: 13px;
                    background-color: #21313b;
                    z-index: 1;
                    padding: 20px 0;
                    .title {
                        margin: 0 auto;
                        font-size: 18px;
                        font-weight: 800;
                    }
                    .box {
                        text-align: left;
                        padding: 0 10px;
                        max-height: 220px;
                        overflow: auto;
                    }
                }
                .el-radio__input { // 隐藏单选框小圆点
                    display: none !important;
                }
                .bet-amount {
                    margin-top: 10px;
                    .el-radio {
                        margin-right: 0;
                    }
                    .el-card__body {
                        padding-bottom: 80px;
                    }
                    .el-radio.is-bordered {
                        padding: 14px 35px 0 25px;
                        background-color: #141a1f;
                        border: 0;
                        color: #fff;
                    }
                    .el-radio.is-bordered.is-checked {
                        background-color: #e09320;
                        border: 0;
                        color: #fff;
                    }
                    .el-radio__input.is-checked+.el-radio__label {
                        color: #fff;
                    }
                    .el-radio-button__inner {
                        background: #21313b;
                        // border: 0;
                        color: #fff;
                    }
                    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
                        background-color: #e09320;
                        // border: 0;
                        border-color: #e09320;
                        color: #fff;
                        box-shadow: none;
                    }
                }
                .size {
                    margin-top: 20px;
                    .el-radio__label {
                        font-size: 18px;
                    }
                    .el-radio.is-bordered {
                        // padding: 14px 20px 0 10px;
                        background-color: #141a1f;
                        border: 0;
                        // border: 2px solid #fff;
                        color: #fff;
                    }
                    .el-radio.is-bordered {
                        padding: 20px 30px 35px 20px;
                    }
                    .el-radio.is-bordered.is-checked {
                        background-color: #e09320;
                        border: 0;
                        // border: 2px solid #e09320;
                        color: #fff;
                    }
                    .el-radio__input.is-checked+.el-radio__label {
                        color: #fff;
                        font-size: 18px;
                    }
                }
                .start-bet {
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
                .start-bet:hover {
                    background-color: #21313b;
                }
                .dealer {
                    float: right;
                    border: none;
                    color: rgb(255, 255, 255);
                    background-color: #21313b;
                }
            }
            .alert {
                width: 80%;
                margin: 0 auto;
                margin-bottom: 20px;
                .el-alert__icon {
                    font-size: 40px;
                    width: 50px;
                }
                .el-alert__title {
                    font-size: 18px;
                    line-height: 20px;
                }
            }
        }   
    }
</style>
