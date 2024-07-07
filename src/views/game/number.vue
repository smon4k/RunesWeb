<!-- 猜数字 -->
<template>
    <div class="container">
        <div class="game">
            <!-- <div class="bet-amount">
                <div>
                    <el-radio v-model="tabType" label="1" border @input="radioClickFun">手动投注</el-radio>
                    <el-radio v-model="tabType" label="2" border @input="radioClickFun">自动投注</el-radio>
                </div>
            </div> -->
            <!-- 手动投注 -->
            <!-- <el-row :gutter="20" class="content-box" v-if="tabType == 1">
                <el-col :span="screenWidth < 600 ? 24 : 16" align="left">
                    <div class="title" style="text-align:center;">范围</div>
                    <div class="slider">
                        <el-slider
                            v-model="scope"
                            range
                            show-stops
                            :min="1"
                            :max="9"
                            :marks="marks">
                        </el-slider>
                    </div>
                </el-col>
            </el-row> -->
            <el-row :gutter="20">
                <el-col :span="screenWidth < 1200 ? 24 : 10" align="left">
                    <el-row :gutter="20" class="content-box" :style="{width: screenWidth > 1200 ? '' : screenWidth < 600 ? '100%' : '60%'}">
                        <el-col :span="screenWidth < 600 ? 24 : 24" align="left">
                            <!-- <el-button class="roll-button dealer" @click="likeDealer()">我要做庄家</el-button> -->
                            <!-- <div class="title" style="text-align:center;">范围</div> -->
                            <div class="slider">
                                <el-slider
                                    :key="componentKey"
                                    v-model="scope"
                                    range
                                    show-stops
                                    :max="maxSliderNum"
                                    :marks="marks"
                                    @input="sliderInput"
                                    :disabled="startLoading">
                                </el-slider>
                            </div>
                        </el-col>
                        <el-col :span="screenWidth < 600 ? 24 : 12" align="left">
                            <!-- <el-button-group>
                                <el-button size="small">机会</el-button>
                                <el-button plain size="small">MIN</el-button>
                                <el-button plain size="small">-1</el-button>
                                <el-button plain size="small">+1</el-button>
                                <el-button plain size="small">MAX</el-button>
                            </el-button-group> -->

                            <!-- 机会 -->
                            <div class="marginTop">
                                <div class="title">{{ $t('game:Chance') }}</div>
                                <el-button-group>
                                    <el-button type="primary" @click="minChange()">MIN</el-button>
                                    <el-button type="primary" @click="reduceChange()">-10</el-button>
                                    <el-button type="primary" @click="addChange()">+10</el-button>
                                    <el-button type="primary" @click="maxChange()">MAX</el-button>
                                </el-button-group>
                                <el-input placeholder="" type="number" v-model="chance" max="98" class="operate chance" @input="calcChangeFun" :readonly="true">
                                    <template slot="append">%</template>
                                </el-input>
                            </div>
                            <!-- 赔率： -->
                            <div class="marginTop" v-if="tabType == 1">
                                <div class="title">{{ $t('game:Payout') }}</div>
                                <el-input placeholder="" v-model="payout" class="operate" @input="calcPayoutFun" :readonly="true">
                                    <!-- <template slot="prepend">支出</template> -->
                                    <template slot="append">x</template>
                                </el-input>
                            </div>
                        </el-col>
                        <el-col :span="screenWidth < 600 ? 24 : 12" align="left">
                            <!-- 赌注 -->
                            <div class="marginTop">
                                <div class="title">{{ $t('game:Bet') }}</div>
                                <div class="title" style="float:right;">{{ $t('swap:Balance') }}: {{ lusdBalance }} LUSD</div>
                                <el-button-group>
                                    <el-button type="primary" @click="minBet()">MIN</el-button>
                                    <el-button type="primary" @click="removeBet()">1/2</el-button>
                                    <el-button type="primary" @click="takeBet()">x2</el-button>
                                    <el-button type="primary" @click="maxBet()">MAX</el-button>
                                </el-button-group>
                                <el-input placeholder="" v-model="bet" class="operate" @input="calcOperateFun" :readonly="startLoading">
                                    <template slot="append">LUSD</template>
                                </el-input>
                            </div>
                            <!-- 利润 -->
                            <div class="marginTop">
                                <div class="title">{{ $t('game:Profit') }}</div>
                                <el-input placeholder="" v-model="profit" class="operate" :readonly="true">
                                    <!-- <template slot="prepend">利润</template> -->
                                    <template slot="append">LUSD</template>
                                </el-input>
                            </div>
                        </el-col>

                        <el-col :span="screenWidth < 600 ? 24 : 24" align="center">
                            <div>
                                <el-button class="bet-roll-button" v-if="!approve" :loading="loading" :disabled="loading" @click="startApprove()">{{ $t('swap:Approve') }}</el-button>
                                <el-button class="bet-roll-button" v-else :loading="loading" :disabled="loading" @click="startPlaceBet()">{{ $t('game:Roll') }}</el-button>
                            </div>
                            <br><br>
                            <el-alert
                                v-show="alertShow"
                                class="alert"
                                :title="$t('game:DrawResult') + ' ' + dealResult"
                                :type="dealResultStatue"
                                description=""
                                show-icon
                                :center="false"
                                effect="dark"
                                :style="{width: screenWidth < 600 ? '200px' : '200px'}">
                            </el-alert>
                            <!-- <el-button class="roll-button dealer" @click="likeDealer()">庄家</el-button> -->
                        </el-col>
                        <el-col :span="24" align="right" style="position: absolute;bottom: 5px;padding-right: 25px;">
                            <span>{{ $t('game:MaxProfit') }} {{ dealerTotalBalance ? keepDecimalNotRounding(Number(dealerTotalBalance) * 0.01, 2) : 0 }} LUSD</span>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="screenWidth < 1200 ? 24 : 14" align="center">
                    <List :game_type="1" />
                </el-col>
            </el-row>
             <!-- <el-row :gutter="20" class="content-box" v-if="tabType == 2">
                https://crypto.games/dice/ethereum#auto_bet
                赢了：
                Roll over：数字大于
                Roll under：数字小于
                Switch over/under on win：获胜时切换
                Switch over/under on loss：亏损时切换
                Switch over/under after every bet：每次下注后切换

                限制：
                Number of rolls: 卷数
                Roll every：滚动间隔时间
                Stop if balance higher than：如果余额高于
                Stop if balance lower than：如果余额低于
                Maximum bet size：最大下注大小
                Minimum bet size：最小下注大小
             </el-row> -->
        </div>
    </div>
</template>
<script>
import CryptoJS from "crypto-js";
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
            chance: 10, //机会
            minChanceNum: 10,
            bet: 1, //赌注
            payout: '', //支出
            profit: '', //利润
            loading: false,
            startLoading: false, //开始自动任务loading
            approve: true,
            lusdBalance: 0,
            alertShow: false,
            dealResult: '', // 开牌结果
            dealResultStatue: '',
            tabType: '1',
            scope: [0, 4],
            marks: {
                0: '0',
                1: '1',
                2: '2',
                3: '3',
                4: '4',
                5: '5',
                6: '6',
                7: '7',
                8: '8',
                9: '9',
            },
            maxSliderNum: 9, //范围 最大值
            componentKey: '',
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
            numberAddress:state=>state.base.numberAddress,
        }),
    },
    created() {
        try {
            this.calcPayoutProfit();
            // this.dataStatisticsBet();
        } catch (err) {}
    },
    beforeDestroy() { //页面关闭执行
    },
    watch: {
        isConnected: {
            immediate: true,
            async handler(val){
                if(val) {
                    // await this.getIsApprove();
                    await this.getLusdBalance(); //获取余额
                    this.dealerTotalBalance = await getDiceBalanceOf(this.numberAddress); //获取庄家总余额
                    // this.refreshData();

                    // var hmac = await CryptoJS.SHA512('XcaVT03oruhviUOIUilyOhsPXFjITKLnmj9xdzCBA4I1AZFFKT0mg0NvA6gBq93G985iW5OI8cgb7GWL')
                    // console.log(hmac.toString());
                    // let c2 = 'c025a';
                    // let num = parseInt(c2, 16);
                    // console.log(num);

                    // let sha256 = CryptoJS.SHA256('293d5d2ddd365f54759283a8097ab2640cbe6f8864adc2b1b31e65c14c999f04');
                    // console.log(sha256.toString());
                    // c025aa5cf569749f3cfcd0384f06b6d54d260d1c6e79251a7decef4f8ca7d7e5e189116720f3922016cb11392829c2197247b46d0a74214f3e03676c005d58d8
                }
            }
        },
    },
    components:{
        List
    },
    methods: {
        async startPlaceBet() { //开始下注
            this.loading = true;
            let range = '0.0' + this.scope[0] + this.scope[1];
            let amount = Number(this.bet) + Number(range);
            let verify = await this.placeBetVerify();
            if(!verify) {
                return false;
            }
            // let hash = "0xcb31e6ab445ce2a4a5161d50262c292adab90edfed6c9d729509bfa4f02a0793";
            // let topicsHash = "0x1b565b6639e6a5436fd9bd367d5946119821bc29db7e376b563195ebc8e933f5";
            // let result_value = topicsHashString(topicsHash, 5, 1);
            // console.log(result_value, this.scope);
            // if(result_value >= this.scope[0] && result_value <= this.scope[1]) {
            //     console.log(111);
            // } else {
            //     this.profit = this.bet;
            //     console.log(222);
            // }
            // console.log(this.profit);
            // return false;
            bettingTransfer(TOKEN[this.chainName].LUSD, this.numberAddress, amount).then(async (result) => {
                console.log(result);
                this.loading = false;
                if(result) {
                    let hash = result.transactionHash;
                    let index = result.logs.findIndex(item=>item.address.toLowerCase() === this.numberAddress.toLowerCase());
                    if(index !== -1) {
                        let profit = 0;
                        let topicsHash = result.logs[index].topics[1]; //牌面
                        let cardNum = web3.utils.hexToNumber(result.logs[index].topics[2]);//牌号
                        let result_value = topicsHashString(topicsHash, 5, 1);
                        if(!result_value || result_value == '') {
                            result_value = 0;
                        }
                        let lost = 0;
                        if(result_value >= 0) {
                            if(result_value >= this.scope[0] && result_value <= this.scope[1]) {
                                lost = 1;
                                profit = this.profit;
                            } else {
                                profit = this.bet;
                                lost = 0;
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
                                this.scope[0] = 0;
                                this.scope[1] = 4;
                                this.bet = 1;
                            }, 60000)
                        }
                        await this.getLusdBalance();
                        await this.setRollDiceData(result_value, lost, hash, topicsHash, profit, cardNum);
                    }
                }
            }).finally(() => {
                this.loading = false;
            });
        },
        async placeBetVerify() { //下注前验证
            return new Promise((resolve, reject) => {
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
                        this.$router.push({path:'/exchange/deposit'});
                    }).catch(() => {  
                        this.loading = false;       
                    });
                    resolve(false);
                }
                if(this.bet <= 0) {
                    this.$message.warning(this.$t('public:BettingAmount')); //投注额必须大于0
                    this.loading = false;
                    resolve(false);
                }
                let maxBetAmount = Number(this.dealerTotalBalance) * 0.01; //下注最大数量
                if(Number(this.profit) > maxBetAmount) {
                    this.$message.warning(this.$t('public:BetsCannotExceed', {num: keepDecimalNotRounding(maxBetAmount, 2)})); //投注不能超过{{ num }} LUSD
                    this.loading = false;
                    resolve(false);
                }
                resolve(true);
            })
        },
        async setRollDiceData(result_value, lost, hash, topicsHash, profit, cardNum) { //手动执行 - 记录下注记录
            post(this.apiUrl + '/Api/Bet/setRollDiceData', {
                hash: hash,
                topicsHash: topicsHash,
                address: this.address,
                chance: this.chance,
                bet: this.bet,
                payout: this.payout,
                profit: profit,
                lost: lost,
                result_value: result_value,
                user_choice: this.scope[0] + "-" + this.scope[1],
                type: 1,
                chain: this.chainName,
                cardNum: cardNum,
                table_addr: this.numberAddress
            }, (json) => {
                console.log(json);
                if (json && json.code == 10000) {
                    console.log(this.$t('public:RecordBetsSuccess')); //记录投注记录成功
                } else {
                    this.$message.error(json.msg);
                }
                return;
            });
        },
        async setAutoRollDiceData() { //手动执行 - 记录下注记录
            return new Promise((resolve, reject) => {
                post(this.apiUrl + '/Api/Bet/setAutoRollDiceData', {
                    address: this.address,
                    chance: this.chance,
                    bet: this.bet,
                    payout: this.payout,
                    profit: this.profit,
                    user_choice: this.scope[0] + "-" + this.scope[1],
                    type: 1,
                    chain: this.chainName,
                    table_addr: this.numberAddress
                }, (json) => {
                    console.log(json);
                    if (json && json.code == 10000) {
                        this.dealResult = json.data.data;
                        this.dealResultStatue = json.data.lost == 1 ? 'success' : 'error';
                        this.alertShow = true;
                        setTimeout(() => {
                            this.alertShow = false;
                        }, this.roll_every / 2)
                        resolve(json.data.lost);
                        console.log(this.$t('public:RecordBetsSuccess')); //记录投注记录成功
                    } else {
                        reject(false);
                        this.$message.error(json.msg);
                    }
                    return;
                });
            })
        },
        // async autoBetVerify() { //自动下注验证
        //     return new Promise((resolve, reject) => {
        //         resolve(true);
        //     })
        // },
        likeDealer() { //跳转庄家页面
            this.$router.push({
                path:'/banker',
                query: {
                    game_type: 1,
                }
            })
        },
        calcChangeFun(value) { //机会 input改变事件
            // console.log(value);
            if(value > 0) {
                if(value > 100) {
                    this.chance = 100;
                }
                this.calcPayoutProfit();
            }
        },
        async calcPayoutProfit() { //计算支出和收入
            this.profit = await this.calcProfit(); //利润
            this.payout = await this.calcPayout(); //支出
            // console.log(this.profit);
            // let odds = (100 / Number(this.chance));
            // this.payout = keepDecimalNotRounding(odds - odds / 100, 4); //支出
            // this.profit = keepDecimalNotRounding((this.payout - 1) * this.bet, 8);
        },
        async calcOperateFun(value) {  //赌注 计算收入
            if(this.tabType == 1) {
                this.bet = value.toString().replace(/^(0+)|[^\d]+/g,'');
            }
            if(value > 0) {
                if(value >= this.lusdBalance) {
                    this.bet = Math.floor(this.lusdBalance);
                }
                this.profit = await this.calcProfit(); //利润
                this.payout = await this.calcPayout(); //支出

                // this.profit = keepDecimalNotRounding((this.payout - 1) * value, 8);
            }
        },
        calcPayoutFun(value) { //支出 计算收入和机会比 不作手动修改
            if(value > 0) {
                if(value > 9) {
                    this.payout = 9;
                }
                // this.profit = keepDecimalNotRounding((this.payout - 1) * this.bet, 8);
                // let chance = Math.floor(100 / this.payout);
                // if(chance > 1) {
                //     this.chance = this.toFixed(Math.floor(100 / this.payout), 2);
                // } else {
                //     this.chance = this.toFixed(100 / this.payout, 2);
                // }
            }
        },
        async calcProfit() { //利润计算
            let odds = 9801 / 1000;
            let profit = Number(this.bet) * (odds / (Number(this.scope[1]) + 1 - Number(this.scope[0])) - 1);
            if(profit < 0) {
                profit = 0;
            }
            // console.log("利润：", profit);
            return keepDecimalNotRounding(profit, 8);
        },
        async calcPayout() { //赔率 计算
            let odds = 9801 / 1000;
            // let payout = Number(this.bet) + Number(this.profit); //本金 = 支出 + 利润
            let payout = odds / (Number(this.scope[1]) + 1 - Number(this.scope[0]));
            // console.log("支出：", payout);
            return keepDecimalNotRounding(payout, 4);
        },
        sliderInput(val) { //范围滑块事件
            // console.log(val);
            this.chance = Math.floor((val[1] - (val[0] - 1)) / 10 * 100);
            this.calcPayoutProfit();
        },
        addChange() { //机会加 10
            if(this.chance < 1) {
                this.chance = this.minChanceNum;
            } else {
                this.chance =  Number(this.chance) + this.minChanceNum;
            }
            
            //计算滑块范围值
            if(this.scope[1] < 9) {
                this.scope[1] = Number(this.scope[1]) + 1;
                this.componentKey += 1;
            } else if(this.scope[0] > 1){
                this.scope[0] = Number(this.scope[0]) - 1;
                this.componentKey += 1;
            }
            console.log(this.scope);
            this.calcChangeFun(this.chance);
        },
        reduceChange() { //机会减 10
            if(this.chance <= this.minChanceNum) {
                this.chance = this.minChanceNum;
            }
            if(this.chance <= this.minChanceNum) {
                return;
            } else {
                this.chance = Number(this.chance) - this.minChanceNum;
            }

            //计算滑块范围值
            if(this.scope[1] > 1) {
                this.scope[1] = Number(this.scope[1]) - 1;
                this.componentKey += 1;
            } else if(this.scope[0] > 1){
                this.scope[0] = Number(this.scope[0]) + 1;
                this.componentKey += 1;
            }
            this.calcChangeFun(this.chance);
        },
        maxChange() { //机会 MAX
            this.chance = 100;
            this.scope[0] = 0;
            this.scope[1] = 10;
            this.componentKey += 1;
            this.calcChangeFun(this.chance);
        },
        minChange() { //机会 MIN
            this.chance = this.minChanceNum;
            this.scope[0] = 0;
            this.scope[1] = 0;
            this.componentKey += 1;
            this.calcChangeFun(this.chance);
        },
        minBet() { //赌注 min
            this.bet = 1;
            this.calcOperateFun(this.bet);
        },
        removeBet() { //赌注 除 2
            this.bet = Math.floor(this.bet / 2);
            if(this.bet < 1) {
                this.bet = 1;
            }
            this.calcOperateFun(this.bet);
        },
        takeBet() { //赌注 乘 2
            this.bet = this.bet * 2;
            this.calcOperateFun(this.bet);
        },
        maxBet() { //赌注 MAX
            this.bet = Math.floor(this.lusdBalance);
            let maxBetAmount = Number(this.dealerTotalBalance) * 0.01; //下注最大数量
            if(this.bet > maxBetAmount) {
                this.bet = Math.floor(maxBetAmount);
            }
            this.calcOperateFun(this.bet);
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
        async getIsApprove() { //获取余额 查看是否授权
            let balance = await this.getLusdBalance(); //获取余额
            isApproved(TOKEN[this.chainName].LUSD, 18, this.lusdBalance, this.numberAddress).then((bool) => {
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
            approve(TOKEN[this.chainName].LUSD, this.numberAddress).then((hash) => {
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
    },
}
</script>
<style lang="scss" scoped>
    .container {
        /deep/ {
            .game {
                width: 95%;
                margin: 0 auto;
                border: 0;
                background-color: transparent;
                padding-top: 20px;
                .content-box {
                    // width: 80%;
                    margin: 0 auto;
                    margin-left: auto !important;
                    margin-right: auto !important;
                    margin-bottom: 30px;
                    font-size: 10px;
                    border: 2px solid #454848;
                    padding: 20px;
                    .el-col {
                        padding-left: 0 !important;
                    }
                    .slider {
                        margin-bottom: 20px;
                        .el-slider__runway {
                            height: 10px;
                            // background-color: #1b1c23;
                        }
                        .el-slider__bar {
                            height: 10px;
                            background-color: #e09320;
                        }
                        .el-slider__button {
                            border: 2px solid #e09320;
                        }
                        .el-slider__marks-text {
                            color: #fff;
                        }
                        .el-slider__stop {
                            height: 10px;
                            width: 10px;
                        }
                    }
                }
                .title {
                    margin-bottom: 10px;
                }
                 .bet-amount {
                    margin-top: 10px;
                    margin-bottom: 20px;
                    .el-radio {
                        margin-right: 0;
                    }
                    .el-card__body {
                        padding-bottom: 80px;
                    }
                    .el-radio.is-bordered {
                        // padding: 14px 35px 0 25px;
                        background-color: #141a1f;
                        border: 0;
                        color: #fff;
                    }
                    .el-radio.is-bordered.is-checked {
                        background-color: #e09320;
                        border: 0;
                        color: #fff;
                    }
                    .el-radio__input {
                        display: none;
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
                .marginTop {
                    // width: 100%;
                    margin-top: 10px;
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
                            border: 1px solid #141a1f;
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
                    .return-base-radio {
                        width: 15%;
                        margin-right: 0;
                        color: #fff;
                        border: 1px solid #454848;
                    }
                    .return-base-input {
                        width: 84%;
                        height: 30px;
                        border: 1px solid #454848;
                        // margin-bottom: 10px;
                        .el-input__inner {
                            height: 30px;
                        }
                    }
                    .increase-bet-input {
                        width: 59%;
                        height: 30px;
                        .el-input__inner {
                            height: 30px;
                        }
                    }
                    .increase-bet-radio {
                        width: 40%;
                        margin-right: 0;
                        border: 1px solid #454848;
                        color: #fff;
                    }
                    .limit-input {
                        width: 100%;
                        height: 30px;
                        .el-input__inner {
                            height: 30px;
                        }
                    }
                    .el-radio__input.is-checked+.el-radio__label {
                        color: #fff;
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
                .bet-roll-button {
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
                .bet-roll-button.is-disabled {
                    background: #c8c9cc63;
                    color: #fff;
                }
                .bet-roll-button.is-disabled:hover {
                    background: #c8c9cc63;
                    color: #fff;
                }
                .dealer {
                    color: rgb(255, 255, 255);
                    margin-top: 0;
                    width: 100px;
                    padding: 10px;
                    font-size: 13px;
                    font-weight: 600;
                    border-radius: 10px;
                    background-color: #21313b;
                }
                .bet-roll-button:hover {
                    background-color: #21313b;
                }
            }
            .alert {
                // width: 20%;
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
