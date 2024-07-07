<!-- 猜数字 极速版 -->
<template>
    <div class="container">
        <div class="game">
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
                <el-col :span="screenWidth < 1200 ? 24 : 9" align="left">
                    <div class="bet-amount">
                        <div>
                            <el-radio v-model="tabType" label="1" border @input="radioClickFun" :disabled="startLoading">
                                <span class="icon-log">
                                    <img src="@/assets/gamepad.png" alt="" width="18" height="18">
                                    <span>{{ $t('game:manualBet') }}</span>
                                </span>
                            </el-radio>
                            <el-radio v-model="tabType" label="2" border @input="radioClickFun" :disabled="startLoading">
                                <span class="icon-log">
                                    <img src="@/assets/android.png" alt="" width="18" height="18">
                                    <span>{{ $t('game:autoBet') }}</span>
                                </span>
                            </el-radio>
                            <el-radio v-model="tabType" label="3" border @input="radioClickFun" :disabled="startLoading">
                                <span class="icon-log">
                                    <img src="@/assets/balance-scale.png" alt="" width="18" height="18">
                                    <span>{{ $t('game:provablyFair') }}</span>
                                </span>
                            </el-radio>
                        </div>
                    </div>
                    <el-row :gutter="20" class="content-box" :style="{width: screenWidth > 1200 ? '' : screenWidth < 600 ? '100%' : '60%'}" v-if="tabType == 1 || tabType == 2">
                        <el-col :span="screenWidth < 600 ? 24 : 24" align="left">
                            <!-- <el-button class="roll-button dealer" @click="likeDealer()">我要做庄家</el-button> -->
                            <!-- <div class="title" style="text-align:center;">范围</div> -->
                            <div class="slider">
                                <el-slider
                                    :key="componentKey"
                                    v-model="scope"
                                    range
                                    show-stops
                                    :step="1"
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
                                    <template slot="append">x</template>
                                </el-input>
                            </div>
                        </el-col>
                        <el-col :span="screenWidth < 600 ? 24 : 12" align="left">
                            <!-- 赌注 -->
                            <div class="marginTop">
                                <div class="title">{{ $t('game:Bet') }}</div>
                                <div class="title" style="float:right;">{{ $t('swap:Balance') }}: {{ platformBalance }} {{ transactionSpareCurrency }}</div>
                                <el-button-group>
                                    <el-button type="primary" @click="minBet()">MIN</el-button>
                                    <el-button type="primary" @click="removeBet()">1/2</el-button>
                                    <el-button type="primary" @click="takeBet()">x2</el-button>
                                    <el-button type="primary" @click="maxBet()">MAX</el-button>
                                </el-button-group>
                                <el-input placeholder="" v-model="bet" class="operate" @input="calcOperateFun" :readonly="startLoading">
                                    <template slot="append">{{ transactionSpareCurrency }}</template>
                                </el-input>
                            </div>
                            <!-- 利润 -->
                            <div class="marginTop" v-if="tabType == 1">
                                <div class="title">{{ $t('game:Profit') }}</div>
                                <el-input placeholder="" v-model="profit" class="operate" :readonly="true">
                                    <template slot="append">{{ transactionSpareCurrency }}</template>
                                </el-input>
                            </div>
                        </el-col>
                        
                        <!-- 自动模式设置 -->
                        <div v-if="tabType == 2">
                            <el-col :span="screenWidth < 600 ? 24 : 12" align="left">
                                <div class="marginTop">
                                    <div class="title">{{ $t('game:onWinning') }}:</div>
                                    <el-radio-group v-model="winningBet" size="small">

                                        <el-radio label="1" border class="return-base-radio">&nbsp;</el-radio>
                                        <el-input value="Return to base" placeholder="Return to base" class="operate return-base-input" :readonly="true"></el-input>
                                        
                                        <el-radio label="2" border class="increase-bet-radio">{{ $t('game:increaseBet') }}</el-radio>
                                        <el-input placeholder="" type="number" v-model="win_add_bet" max="98" class="operate increase-bet-input" @input="calcChangeFun">
                                            <template slot="append">%</template>
                                        </el-input>

                                        <el-radio label="3" border class="increase-bet-radio">{{ $t('game:decreaseBet') }}</el-radio>
                                        <el-input placeholder="" type="number" v-model="win_minus_bet" max="98" class="operate increase-bet-input" @input="calcChangeFun">
                                            <template slot="append">%</template>
                                        </el-input>
                                    </el-radio-group>
                                </div>
                            </el-col>
                            <el-col :span="screenWidth < 600 ? 24 : 12" align="left">
                                <div class="marginTop">
                                    <div class="title">{{ $t('game:onLoss') }}</div>
                                    <el-radio-group v-model="lossBet" size="small">

                                        <el-radio label="1" border class="return-base-radio">&nbsp;</el-radio>
                                        <el-input value="Return to base" placeholder="Return to base" type="" class="operate return-base-input" :readonly="true"></el-input>
                                        
                                        <el-radio label="2" border class="increase-bet-radio">{{ $t('game:increaseBet') }}</el-radio>
                                        <el-input placeholder="" type="number" v-model="loss_add_bet" max="98" class="operate increase-bet-input" @input="calcChangeFun">
                                            <template slot="append">%</template>
                                        </el-input>

                                        <el-radio label="3" border class="increase-bet-radio">{{ $t('game:decreaseBet') }}</el-radio>
                                        <el-input placeholder="" type="number" v-model="loss_minus_bet" max="98" class="operate increase-bet-input" @input="calcChangeFun">
                                            <template slot="append">%</template>
                                        </el-input>
                                    </el-radio-group>
                                </div>
                            </el-col>
                            <!-- <el-col :span="screenWidth < 600 ? 24 : 12" align="left">
                                <div class="marginTop">
                                    <div class="title">{{ '赢得:' }}</div>
                                    <el-radio-group v-model="winValue" size="small">

                                        <el-radio label="1" border class="increase-bet-radio">数字大于</el-radio>
                                        <el-input placeholder="" type="number" v-model="number_greater" class="operate increase-bet-input"></el-input>
                                        
                                        <el-radio label="2" border class="increase-bet-radio">数字小于</el-radio>
                                        <el-input placeholder="" type="number" v-model="number_less" class="operate increase-bet-input" @input="calcChangeFun"></el-input>

                                        <el-radio label="3" border class="return-base-radio">&nbsp;</el-radio>
                                        <el-input value="获胜时切换" placeholder="" type="" class="operate return-base-input" :readonly="true"></el-input>
                                        <el-radio label="4" border class="return-base-radio">&nbsp;</el-radio>
                                        <el-input value="亏损时切换" placeholder="" type="" class="operate return-base-input" :readonly="true"></el-input>
                                        <el-radio label="5" border class="return-base-radio">&nbsp;</el-radio>
                                        <el-input value="每次下注后切换" placeholder="" type="" class="operate return-base-input" :readonly="true"></el-input>
                                    </el-radio-group>
                                </div>
                            </el-col> -->
                            <el-col :span="screenWidth < 600 ? 24 : 24" align="left">
                                <div class="marginTop">
                                    <div class="title">{{ $t('game:limits') }}</div>
                                    <!-- <el-input placeholder="1000000" type="number" v-model="rolls_number" class="operate limit-input">
                                        <template slot="prepend">卷数</template>
                                    </el-input> -->
                                    <!-- <el-input placeholder="1" type="number" :max="100000" :min="5000" v-model="roll_every" class="operate limit-input" @blur="calcRollEveryFun">
                                        <template slot="prepend">滚动间隔时间</template>
                                        <template slot="append">毫秒（分钟）</template>
                                    </el-input> -->
                                    <!-- <el-input placeholder="0" type="number" v-model="balance_higher" class="operate limit-input">
                                        <template slot="prepend">如果余额高于</template>
                                        <template slot="append">{{ transactionSpareCurrency }}</template>
                                    </el-input> -->
                                    <el-input placeholder="0" type="number" v-model="balance_lower" class="operate limit-input">
                                        <template slot="prepend">{{ $t('game:stopBalanceLow') }}</template>
                                        <template slot="append">{{ transactionSpareCurrency }}</template>
                                    </el-input>
                                    <el-input placeholder="0" type="number" v-model="maximum_bet" class="operate limit-input">
                                        <template slot="prepend">{{ $t('game:maxBetSize') }}</template>
                                        <template slot="append">{{ transactionSpareCurrency }}</template>
                                    </el-input>
                                    <el-input placeholder="0" type="number" v-model="minimum_bet" class="operate limit-input">
                                        <template slot="prepend">{{ $t('game:minBetSize') }}</template>
                                        <template slot="append">{{ transactionSpareCurrency }}</template>
                                    </el-input>
                                </div>
                            </el-col>
                        </div>

                        <el-col :span="screenWidth < 600 ? 24 : 24" align="center">
                            <div v-if="tabType == 1">
                                 <!-- <el-button class="bet-roll-button" v-if="!approve" :loading="loading" :disabled="loading" @click="startApprove()">{{ $t('swap:Approve') }}</el-button> -->
                                 <el-button class="bet-roll-button" :loading="loading" :disabled="loading" @click="startPlaceBet()">{{ $t('game:Roll') }}</el-button>
                             </div>
                            <div v-else-if="tabType == 2">
                                <!-- <el-button class="bet-roll-button" v-if="!approve" :loading="loading" :disabled="loading" @click="startApprove()">{{ $t('swap:Approve') }}</el-button> -->
                                <el-button class="bet-roll-button" :loading="loading" :disabled="loading || startLoading" @click="startAutoBet(1)">{{ $t('game:start') }}</el-button>
                                <el-button class="bet-roll-button" :loading="loading" :disabled="!startLoading" @click="stopAutoBet()">{{ $t('game:stop') }}</el-button>
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
                            <span>{{ $t('game:MaxProfit') }} {{ maxProfit }} {{ transactionSpareCurrency }}</span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="content-box-fair" :style="{width: screenWidth > 1200 ? '' : screenWidth < 600 ? '100%' : '70%'}" v-else>
                        <ProvablyFair />
                    </el-row>
                </el-col>
                <el-col :span="screenWidth < 1200 ? 24 : 15" align="center">
                    <List :game_type="1" @childUpdatePlatformBalance="childUpdatePlatformBalance" />
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
import { getBalance, isApproved, getDiceBalanceOf, getUserDealerBalance, getUserPlatformBalance } from "@/wallet/serve";
import List from './list.vue'
import ProvablyFair from './provablyFair.vue'
export default {
    name: '',
    data() {
        return {
            screenWidth: document.body.clientWidth,
            chance: 50, //机会
            minChanceNum: 10,
            baseBet: 0, //Base 赌注
            bet: 0, //赌注
            payout: '', //支出
            profit: '', //利润
            loading: false,
            startLoading: false, //开始自动任务loading
            approve: true,
            alertShow: false,
            dealResult: '', // 开牌结果
            dealResultStatue: '',
            tabType: '1',
            scope: [0, 49],
            leftHead: true, //滑块 左头
            rightHead: false, //滑块 右头
            // marks: {
            //     0: '0',
            //     1: '1',
            //     2: '2',
            //     3: '3',
            //     4: '4',
            //     5: '5',
            //     6: '6',
            //     7: '7',
            //     8: '8',
            //     9: '9',
            // },
            marks: {
                0: '0',
                10: '10',
                20: '20',
                30: '30',
                40: '40',
                50: '50',
                60: '60',
                70: '70',
                80: '80',
                90: '90',
                99: '99',
            },
            maxSliderNum: 99, //范围 最大值
            componentKey: '',
            dealerTotalBalance: 0, //庄家总余额
            dataStatisticsData: {},
            winningBet: '1', //获胜时-单选框组
            lossBet: '1', //关于损失-单选框组
            winValue: '', //赢得-单选框组
            win_add_bet: 100, //赢 增加赌注
            loss_add_bet: 100, //输 增加赌注
            win_minus_bet: 100, //输 减少赌注
            loss_minus_bet: 100, //输 减少赌注
            number_greater: '', //数字大于
            number_less: '', //数字小于
            rolls_number: '1000000', //卷数
            roll_every: 1000, //滚动间隔时间
            balance_higher: '', //如果余额高于
            balance_lower: 0.1, //如果余额低于
            maximum_bet: 0, //最大下注大小
            minimum_bet: 0, //最小下注大小
            timeInterval: null,
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
            versionName:state=>state.base.versionName,
            transactionCurrency:state=>state.base.transactionCurrency,
            transactionSpareCurrency:state=>state.base.transactionSpareCurrency,
            transactionCurrencyToken:state=>state.base.transactionCurrencyToken,
            minBetNum:state=>state.base.minBetNum,
            platformBalance:state=>state.base.platformBalance,
            decimalLen:state=>state.base.decimalLen,
            decimalPrecision:state=>state.base.decimalPrecision,
        }),
        maxProfit() { //最大利润计算
            if(this.dealerTotalBalance) {
                return keepDecimalNotRounding(this.dealerTotalBalance * 0.01 * (1 - (this.chance / 100)), this.decimalLen, true);
            } else {
                return 0;
            }
        },
        changeData() {
            const {platformBalance, dealerTotalBalance} = this
            return {
                platformBalance, dealerTotalBalance
            };
        }
    },
    created() {
        try {
            // this.minimum_bet = this.minBetNum;
            // this.bet = this.minBetNum;
            setTimeout(async() => {
                
            }, 300)
            // this.dataStatisticsBet();
        } catch (err) {}
    },
    beforeDestroy() { //页面关闭执行
        clearInterval(this.timeInterval);
        this.timeInterval = null;
    },
    destroyed() {
        clearInterval(this.timeInterval);
        this.timeInterval = null;
    },
    watch: {
        isConnected: {
            immediate: true,
            async handler(val){
                if(val) {
                    await this.getLusdBalance(); //获取余额
                    await this.getAutoBetConfigData();
                }
            }
        },
        address: {
            immediate: true,
            async handler(val){
                if(val) {
                    await this.getLusdBalance(); //获取余额
                }
            }
        },
        changeData: {
            immediate: true,
            async handler(val){
                // console.log(val);
                if(val.platformBalance && val.dealerTotalBalance) {
                    await this.getMaxBet();
                    const bet = await this.getMinBet();
                    if(this.bet <= 0) {
                        this.bet = keepDecimalNotRounding(bet, this.decimalPrecision, true);
                    }
                    await this.calcPayoutProfit();
                    await this.getAutoBetConfigData();
                }
            }
        },
    },
    components:{
        List,
        ProvablyFair    
    },
    methods: {
        radioClickFun(label) { //手动 自动模式切换

        },
        async startPlaceBet() { //开始下注
            this.loading = true;
            let range = '0.0' + this.scope[0] + this.scope[1];
            let amount = Number(this.bet) + Number(range);
            let verify = await this.placeBetVerify();
            if(!verify) {
                return false;
            }
            await this.setRollDiceData(1); //下注执行
            this.loading = false;
        },
        async placeBetVerify() { //下注前验证
            return new Promise(async (resolve, reject) => {
                if(this.platformBalance < this.minBetNum) {
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
                        this.$router.push({path:'/depositWithdrawal/1'});
                    }).catch(() => {  
                        this.loading = false;       
                    });
                    resolve(false);
                    return;
                }
                if(this.bet <= 0) {
                    this.$message.warning(this.$t('public:BettingAmount')); //投注额必须大于0
                    this.loading = false;
                    this.autoBetMessageBox(this.$t('public:BettingAmount'));
                    resolve(false);
                    return;
                }
                let maxBetAmount = this.maxProfit; //下注最大数量
                // console.log(this.minimum_bet);                
                if(maxBetAmount < this.minimum_bet) { //如果下注最大利润小于最小下单数量的话 停止下单
                    this.$message.warning(this.$t('game:jackpotNotOpen')); //奖池不满足条件，暂不开放
                    this.autoBetMessageBox(this.$t('game:jackpotNotOpen'));
                    this.loading = false;
                    resolve(false);
                    return;
                }
                if(Number(this.profit) > maxBetAmount) {
                    this.$message.warning(this.$t('public:BetsCannotExceed', {num: keepDecimalNotRounding(maxBetAmount, this.decimalLen, true), currency: this.transactionSpareCurrency})); //投注不能超过{{ num }} LUSD
                    this.autoBetMessageBox(this.$t('public:BetsCannotExceed', {num: keepDecimalNotRounding(maxBetAmount, this.decimalLen, true), currency: this.transactionSpareCurrency}));
                    this.loading = false;
                    resolve(false);
                    return;
                }
                let minBetNum = await this.getMinBet();
                console.log(minBetNum);
                if(Number(this.bet) < Number(minBetNum)) { //如果下注额大于最小于注大小的话 停止任务
                    console.log('下注额小于最小下注大小的话 停止任务');
                    this.$message({
                        message: this.$t('game:betSmall', {num: minBetNum, currency: this.transactionSpareCurrency}), // 自动下注已停止执行,
                        type: 'warning'
                    });
                    this.autoBetMessageBox(this.$t('game:betSmall', {num: minBetNum, currency: this.transactionSpareCurrency}));
                    this.loading = false;
                    resolve(false);
                    return;
                }
                if(this.tabType == 2) {
                    console.log(this.bet, this.maximum_bet);
                    if(Number(this.bet) > Number(this.maximum_bet)) { //如果下注额大于最大下注大小的话 停止任务
                        console.log('下注额大于最大下注大小的话 停止任务');
                        this.$message({
                            message: this.$t('game:autoBetStopInfo-02'), // 自动下注已停止执行
                            type: 'warning'
                        });
                        this.autoBetMessageBox(this.$t('game:autoBetStopInfo-02'));
                        this.loading = false;
                        resolve(false);
                        return;
                    }
                    if(Number(this.platformBalance) < Number(this.balance_lower)) {
                        console.log('余额低于'+this.balance_lower+' 停止任务');
                        this.$message({
                            message: this.$t('game:autoBetMessageBox'), // 自动下注已停止执行,
                            type: 'warning'
                        });
                        this.autoBetMessageBox(this.$t('game:autoBetStopInfo-03', {num: this.balance_lower, currency: this.transactionSpareCurrency}));
                        this.loading = false;
                        resolve(false);
                        return;
                    }
                }
                resolve(true);
                return;
            })
        },
        async autoBetMessageBox(text) { //自动任务已停止 显示谭昆明提示
            // console.log(this.startLoading);
            if(this.startLoading) {
                this.$confirm(text, '', {
                    confirmButtonText: this.$t('public:sure'), //确定
                    showCancelButton: false,
                    showClose: false,
                    closeOnClickModal: false,
                    closeOnPressEscape: false,
                    closeOnHashChange: false,
                    customClass: this.isMobel ? 'message-box-h5' : 'message-box',
                    type: 'warning'
                }).then(async () => {
                    await this.calcPayoutProfit();
                    await this.getLusdBalance(); //获取余额
                }).catch(() => {  
                    this.loading = false;       
                });
            }
            this.stopAutoBet();
        },
        async setRollDiceData() { //手动执行 - 记录下注记录
            return new Promise((resolve, reject) => {
                post(this.apiUrl + '/Api/Bet/setAutoRollDiceData', {
                    address: this.address,
                    chance: this.chance,
                    bet: this.bet,
                    payout: this.payout,
                    profit: this.profit,
                    user_choice: this.scope[0] + "-" + this.scope[1],
                    type: 1,
                    chain: 'speed',
                    currency: this.transactionCurrency,
                    is_auto: 0
                }, async (json) => {
                    console.log(json);
                    if (json && json.code == 10000) {
                        // this.dealResult = keepDecimalNotRounding(json.data.data, 2);
                        this.dealResult = json.data.data;
                        this.dealResultStatue = json.data.lost == 1 ? 'success' : 'error';
                        this.alertShow = true;
                        setTimeout(() => {
                            this.alertShow = false;
                        }, 10000)
                        await this.getLusdBalance(); //获取余额
                        resolve(json.data.lost);
                        console.log(this.$t('public:RecordBetsSuccess')); //记录投注记录成功
                    } else {
                        resolve(false);
                        this.$message.error(json.msg);
                    }
                    return;
                });
            })
        },
        async startAutoBet(is_first=false) { //开始自动机器人
            if(is_first) { //如果第一次执行的话 记录初始下注值
                this.startLoading = true;
                this.baseBet = keepDecimalNotRounding(this.bet, 10, true);
            }
            let verify = await this.placeBetVerify();
            if(!verify) {
                return false;
            } else {
                if(is_first) {
                    await this.saveAutoBetConfigData(); //更新记录自动下注配置数据
                    this.$message({
                        message: this.$t('game:autoBetStarted'), // 自动下注已开始执行
                        type: 'success'
                    });
                }
            }
            post(this.apiUrl + '/Api/Bet/setAutoRollDicePushCache', {
                    address: this.address,
                    chance: this.chance,
                    bet: this.bet,
                    payout: this.payout,
                    profit: this.profit,
                    user_choice: this.scope[0] + "-" + this.scope[1],
                    type: 1,
                    chain: 'speed',
                    currency: this.transactionCurrency,
                    is_auto: 1
                }, async (json) => {
                    console.log(json);
                    if (json && json.code == 10000) {
                        let lost = json.data.lost;
                        if(lost == 1) { //赢了
                            console.log('赢了', this.baseBet, this.win_add_bet, this.win_minus_bet);
                            if(this.winningBet == 1) { //回到最初状态值
                                this.bet = this.baseBet;
                                if(this.bet < this.minimum_bet) { //如果下注额大于最小于注大小的话 停止任务
                                    console.log('下注额小于最小下注大小的话 停止任务');
                                    this.$message({
                                        message: this.$t('game:autoBetStoped'), // 自动下注已停止执行,
                                        type: 'warning'
                                    });
                                    // this.stopAutoBet();
                                    this.autoBetMessageBox(this.$t('game:autoBetStopInfo-01'));
                                    return false;
                                }
                            }
                            if(this.winningBet == 2) { //增加赌注
                                this.bet = keepDecimalNotRounding(Number(this.bet) + Number(this.bet) * (Number(this.win_add_bet) / 100), 10);
                                if(Number(this.bet) > Number(this.maximum_bet)) { //如果下注额大于最大下注大小的话 停止任务
                                    console.log('下注额大于最大下注大小的话 停止任务');
                                    this.$message({
                                        message: this.$t('game:autoBetStoped'), // 自动下注已停止执行
                                        type: 'warning'
                                    });
                                    // this.stopAutoBet();
                                    this.autoBetMessageBox(this.$t('game:autoBetStopInfo-02'));
                                    return false;
                                }
                                if(Number(this.platformBalance) < Number(this.balance_lower)) {
                                    console.log('余额低于'+this.balance_lower+' 停止任务');
                                    this.$message({
                                        message: this.$t('game:autoBetStoped'), // 自动下注已停止执行,
                                        type: 'warning'
                                    });
                                    // this.stopAutoBet();
                                    this.autoBetMessageBox(this.$t('game:autoBetStopInfo-03', {num: this.balance_lower, currency: this.transactionSpareCurrency}));
                                    return false;
                                }
                            }
                            if(this.winningBet == 3) { //减少赌注
                                this.bet = keepDecimalNotRounding(Number(this.bet) - Number(this.bet) * (Number(this.win_minus_bet) / 100), 10);
                                if(this.bet <= this.minimum_bet) { //如果下注额大于最小于注大小的话 停止任务
                                    console.log('下注额小于最大下注大小的话 停止任务');
                                    this.$message({
                                        message: this.$t('game:autoBetStoped'), // 自动下注已停止执行,
                                        type: 'warning'
                                    });
                                    // this.stopAutoBet();
                                    this.autoBetMessageBox(this.$t('game:autoBetStopInfo-04'));
                                    return false;
                                }
                                if(Number(this.platformBalance) < Number(this.balance_lower)) {
                                    console.log('余额低于'+this.balance_lower+' 停止任务');
                                    this.$message({
                                        message: this.$t('game:autoBetStoped'), // 自动下注已停止执行,
                                        type: 'warning'
                                    });
                                    // this.stopAutoBet();
                                    this.autoBetMessageBox(this.$t('game:autoBetStopInfo-03', {num: this.balance_lower, currency: this.transactionSpareCurrency}));
                                    return false;
                                }
                            }
                        } else { //输了
                            console.log('输了', this.baseBet, this.loss_add_bet, this.loss_minus_bet);
                            if(this.lossBet == 1) { //回到最初状态值
                                this.bet = this.baseBet;
                                if(Number(this.bet) < Number(this.minimum_bet)) { //如果下注额小于最小下注大小的话 停止任务
                                    console.log('下注额小于最小下注大小的话 停止任务');
                                    this.$message({
                                        message: this.$t('game:autoBetStoped'), // 自动下注已停止执行,
                                        type: 'warning'
                                    });
                                    // this.stopAutoBet();
                                    this.autoBetMessageBox(this.$t('game:autoBetStopInfo-01'));
                                    return false;
                                }
                            }
                            if(this.lossBet == 2) { //增加赌注
                                this.bet = keepDecimalNotRounding(Number(this.bet) + Number(this.bet) * (Number(this.loss_add_bet) / 100), 10);
                                if(Number(this.bet) >= Number(this.maximum_bet)) { //如果下注额大于最大下注大小的话 停止任务
                                    console.log('下注额大于最大下注大小的话 停止任务');
                                    this.$message({
                                        message: this.$t('game:autoBetStoped'), // 自动下注已停止执行,
                                        type: 'warning'
                                    });
                                    // this.stopAutoBet();
                                    this.autoBetMessageBox(this.$t('game:autoBetStopInfo-02'));
                                    return false;
                                }
                                if(Number(this.platformBalance) < Number(this.balance_lower)) {
                                    console.log('余额低于'+this.balance_lower+' 停止任务');
                                    this.$message({
                                        message: this.$t('game:autoBetStoped'), // 自动下注已停止执行,
                                        type: 'warning'
                                    });
                                    // this.stopAutoBet();
                                    this.autoBetMessageBox(this.$t('game:autoBetStopInfo-03', {num: this.balance_lower, currency: this.transactionSpareCurrency}));
                                    return false;
                                }
                            }
                            if(this.lossBet == 3) { //减少赌注
                                this.bet = keepDecimalNotRounding(Number(this.bet) - Number(this.bet) * (Number(this.loss_minus_bet) / 100), 10);
                                if(this.bet <= this.minimum_bet) { //如果下注额小于最大下注大小的话 停止任务
                                    console.log('下注额小于最大下注大小的话 停止任务');
                                    this.$message({
                                        message: this.$t('game:autoBetStoped'), // 自动下注已停止执行,
                                        type: 'warning'
                                    });
                                    this.autoBetMessageBox(this.$t('game:autoBetStopInfo-04'));
                                    // this.stopAutoBet();
                                    return false;
                                }
                                if(Number(this.platformBalance) < Number(this.balance_lower)) {
                                    console.log('余额低于'+this.balance_lower+' 停止任务');
                                    this.$message({
                                        message: this.$t('game:autoBetStoped'), // 自动下注已停止执行,
                                        type: 'warning'
                                    });
                                    // this.stopAutoBet();
                                    this.autoBetMessageBox(this.$t('game:autoBetStopInfo-03', {num: this.balance_lower, currency: this.transactionSpareCurrency}));
                                    return false;
                                }
                            }
                        }
                        await this.calcPayoutProfit();
                        await this.getLusdBalance(); //获取余额
                        if(this.startLoading) {
                            this.timeInterval = setTimeout( async () => {
                                await this.startAutoBet();
                                console.log("开始下一次执行");
                            }, 2000)
                        }
                        console.log(this.$t('public:RecordBetsSuccess')); //记录投注记录成功
                    } else {
                        this.$message.error(json.msg);
                    }
                    return;
                });
        },
        async setAutoRollDiceData(is_manual=false) { //自动执行 - 记录下注记录 - 作废
            return new Promise((resolve, reject) => {
                post(this.apiUrl + '/Api/Bet/setAutoRollDiceData', {
                    address: this.address,
                    chance: this.chance,
                    bet: this.bet,
                    payout: this.payout,
                    profit: this.profit,
                    user_choice: this.scope[0] + "-" + this.scope[1],
                    type: 1,
                    chain: 'speed',
                    currency: this.transactionCurrency,
                    is_auto: is_manual ? 0 : 1
                }, async (json) => {
                    console.log(json);
                    if (json && json.code == 10000) {
                        if(is_manual) {
                            this.dealResult = keepDecimalNotRounding(json.data.data, 2);
                            this.dealResultStatue = json.data.lost == 1 ? 'success' : 'error';
                            this.alertShow = true;
                            setTimeout(() => {
                                this.alertShow = false;
                            }, is_manual ? 10000 : this.roll_every / 2)
                        }
                        this.getLusdBalance(); //获取余额
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
        stopAutoBet() { //停止自动任务
            clearInterval(this.timeInterval);
            this.timeInterval = null;
            this.startLoading = false;
            // this.$message({
            //     message: this.$t('game:autoBetStoped'), // 自动下注已停止执行,
            //     type: 'warning'
            // });
        },
        calcRollEveryFun(event) { //滚动间隔时间
            console.log(event);
            let value = event.target.value;
            if(value < 1000) {
                this.roll_every = 1000; //最小1秒
            }
            if(value > 10000) {
                this.roll_every = 10000; //最大10秒
            }
        },
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
            if(value > 0) {
                // console.log(value, this.decimalPrecision);
                this.bet = value.toString().slice(0,value.toString().indexOf('.')+ (this.decimalPrecision + 1))
                // this.bet = keepDecimalNotRounding(value, this.decimalPrecision);
                if(value >= this.platformBalance) {
                    this.bet = this.platformBalance;
                }

                this.profit = await this.calcProfit(); //利润

                let maxBetNum = await this.getMaxBet(); //获取最大的赌注
                if(value > maxBetNum) {
                    this.bet = keepDecimalNotRounding(maxBetNum, this.decimalPrecision, true);
                    this.profit = await this.calcProfit(); //利润
                }
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
            // let odds = 2 * (1 - 0.01) * (100 / 2); 
            // let odds = odds = 9950 / 100;
            // let profit = Number(this.bet) * (odds / (Number(this.scope[1]) + 1 - Number(this.scope[0])) - 1);
            let payout = await this.calcPayout();
            let profit = (payout - 1) * this.bet;
            if(profit < 0) {
                profit = 0;
            }
            // console.log("利润：", profit);
            return keepDecimalNotRounding(profit, 16, true);
        },
        async calcPayout() { //赔率 计算
            // let odds = 9950 / 100;
            let odds = 2 * (1 - 0.02) * (100 / 2);
            // let odds = 2 * (1 - 0.01) * (10 / 2);
            // let payout = Number(this.bet) + Number(this.profit); //本金 = 支出 + 利润
            let payout = 0;
            if(this.scope[1] <= 0) {
                payout = odds + 1;
            } else {
                payout = odds / (Number(this.scope[1]) - Number(this.scope[0]) + 1);
            }
            // console.log("赔率:", payout);
            return keepDecimalNotRounding(payout, 4);
        },
        async sliderInput(val) { //范围滑块事件
            // if(val[0] == 0 && val[1] <= 99) {
            //     this.leftHead = true;
            // } else {
            //     this.leftHead = false;
            // }
            // if(val[1] == 99 && val[0] > 0) {
            //     this.rightHead = true;
            // } else {
            //     this.rightHead = false;
            // }
            // console.log(this.scope, this.leftHead, this.rightHead );
            // if(this.leftHead && val[0] == 0 && val[1] > 97) {
            //     val[1] = 97;
            //     // this.rightHead = false;
            // } 
            // if(this.rightHead && val[0] < 2 && val[1] == 99) {
            //     val[0] = 2;
            //     // this.rightHead = false;
            // }
            this.chance = val[1] - val[0] + 1;
            if(this.chance >= 98) {
                if(this.leftHead && this.scope[0] == 0 && this.scope[1] >= 96) {
                    this.scope[1] = 96;
                    this.chance = 98;
                    this.rightHead = false;
                    this.leftHead = true;
                } else if(this.leftHead && this.scope[0] == 1 && this.scope[1] >= 97) {
                    this.scope[1] = 97;
                    this.chance = 98;
                    this.rightHead = false;
                    this.leftHead = true;
                } else if(this.leftHead && this.scope[0] == 2 && this.scope[1] >= 98) {
                    this.scope[1] = 98;
                    this.chance = 98;
                    this.rightHead = false;
                    this.leftHead = true;
                } else {
                    this.rightHead = true;
                    this.leftHead = false;
                }
                if(this.rightHead && this.scope[1] == 99 && this.scope[0] < 2) {
                    this.scope[0] = 2;
                    this.chance = 98;
                    this.rightHead = true;
                    this.leftHead = false;
                } else {
                    this.rightHead = false;
                    this.leftHead = true;
                }
            }
            // this.chance = (val[1] - val[0] + 1) * 10;
            this.calcPayoutProfit();
        },
        addChange() { //机会加 10
            if(this.chance < 1) {
                this.chance = this.minChanceNum;
            } else {
                this.chance =  Number(this.chance) + this.minChanceNum;
            }
            
            //计算滑块范围值
            if(this.scope[1] < 99) {
                this.scope[1] = Number(this.scope[1]) + 10;
                this.componentKey += 10;
            } else if(this.scope[0] > 1){
                this.scope[0] = Number(this.scope[0]) - 10;
                this.componentKey += 10;
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
                this.scope[1] = Number(this.scope[1]) - 10;
                this.componentKey += 1;
            } else if(this.scope[0] > 1){
                this.scope[0] = Number(this.scope[0]) + 10;
                this.componentKey += 1;
            }
            this.calcChangeFun(this.chance);
        },
        maxChange() { //机会 MAX
            this.chance = 100;
            this.scope[0] = 0;
            this.scope[1] = 100;
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
        calcBetExceed(num) { //计算赌注额度是否超过最大利润和余额
            if(num > this.platformBalance) {
                return this.platformBalance;
            }
            let maxBetAmount = this.maxProfit; //下注最大数量
            if(num > maxBetAmount) {
                return maxBetAmount;
            }
            if(num < this.minBetNum) {
                return this.minBetNum;
            }
            return num;
        },
        async minBet() { //赌注 min
            // let bet = this.minBetNum;
            // this.bet = this.calcBetExceed(bet);
            this.bet = await this.getMinBet();
            this.calcOperateFun(this.bet);
        },
        removeBet() { //赌注 除 2
            let bet = this.bet / 2;
            this.bet = this.calcBetExceed(bet);
            this.calcOperateFun(this.bet);
        },
        takeBet() { //赌注 乘 2
            let bet = this.bet * 2;
            this.bet = this.calcBetExceed(bet);
            this.calcOperateFun(this.bet);
        },
        async maxBet() { //赌注 MAX
            // let bet = this.platformBalance;
            this.bet = await this.getMaxBet();
            this.calcOperateFun(this.bet);
        },
        async getMaxBet() { //计算最大下注额度
            // if(this.maximum_bet == 0) {
                let maxProfitAmount = this.maxProfit; //下注最大数量
                let payout = await this.calcPayout();
                let maxBetNum = maxProfitAmount / (payout - 1);
                if(maxBetNum > this.platformBalance) {
                    maxBetNum = this.platformBalance;
                }
                console.log(payout, this.platformBalance, maxProfitAmount, maxBetNum);
                // this.maximum_bet = keepDecimalNotRounding(maxBetNum, this.decimalPrecision, true);
                return maxBetNum;
            // } else {
            //     return this.maximum_bet;
            // }
        },
        async getMinBet() { //计算最小下注额度
            // if(this.minimum_bet == 0) {
                // let maxBetNum = await this.getMaxBet();
                let payout = await this.calcPayout();
                let maxBetNum = this.maxProfit / (payout - 1);
                let minBetNum = keepDecimalNotRounding(maxBetNum * 0.00003333333, this.decimalPrecision, true);
                // console.log(payout, maxBetNum, minBetNum);
                // this.minimum_bet = minBetNum;
                return minBetNum;
            // } else {
            //     return this.minimum_bet;
            // }
        },
        // async getIsApprove() { //获取余额 查看是否授权
        //     let balance = await this.getLusdBalance(); //获取余额
        //     isApproved(this.transactionCurrencyToken, 18, this.platformBalance, this.numberAddress).then((bool) => {
        //         console.log("isApprove", bool);
        //         this.approve = bool ? true : false;
        //     });
        // },
        async getLusdBalance() {  //获取余额
            // let balance = await getBalance(this.transactionCurrencyToken, 18);
            // let balance = await getUserPlatformBalance();
            // console.log(balance);
            // this.platformBalance = balance;
            this.$store.commit('refreshPlatformBalance');
            // this.maximum_bet = this.maximum_bet <= 0 ? this.platformBalance : this.maximum_bet;
            this.balance_higher = this.platformBalance; //如果余额高于余额 = this.platformBalance;
            let dealerBalance = await getUserDealerBalance(1, 2); //更新庄家总余额
            console.log(dealerBalance);
            this.dealerTotalBalance = dealerBalance.total_balance; //获取庄家总余额
        },
        async childUpdatePlatformBalance() { //接受List组件 更新余额
            await this.getLusdBalance();
        },
        startApprove() { //批准交易币
            const loading = this.$loading({
                lock: true,
                text: 'transaction in progress',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.trading = true;
            approve(this.transactionCurrencyToken, this.numberAddress).then((hash) => {
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
        async saveAutoBetConfigData() { //自动下注 更新修改配置数据
            //存储自动下注记录
            const autoBetConfig = localStorage.getItem('autoBetConfigArrCacheKey');
            const autoBetConfigArrRes = {
                winningBet: this.winningBet,
                lossBet: this.lossBet,
                win_add_bet: this.win_add_bet,
                win_minus_bet: this.win_minus_bet,
                loss_add_bet: this.loss_add_bet,
                loss_minus_bet: this.loss_minus_bet,
                balance_lower: this.balance_lower,
                maximum_bet: this.maximum_bet,
                minimum_bet: this.minimum_bet,
            }
            let autoBetConfigArr = [];
            if(autoBetConfig && autoBetConfig !== undefined) {
                autoBetConfigArr = JSON.parse(autoBetConfig);
            } else {
                autoBetConfigArr = [];
            }
            autoBetConfigArr[1] = autoBetConfigArrRes;
            const autoBetConfigArrJson = JSON.stringify(autoBetConfigArr);
            localStorage.setItem('autoBetConfigArrCacheKey', autoBetConfigArrJson);
        },
        async getAutoBetConfigData() { //获取自动投注配置数据
            const autoBetConfig = localStorage.getItem('autoBetConfigArrCacheKey');
            if(autoBetConfig && autoBetConfig !== undefined) {
                let autoBetConfigArr = JSON.parse(autoBetConfig);
                console.log('自动下注配置', autoBetConfigArr);
                if(autoBetConfigArr[1]) {
                    this.winningBet = autoBetConfigArr[1].winningBet;
                    this.lossBet = autoBetConfigArr[1].lossBet;
                    this.win_add_bet = autoBetConfigArr[1].win_add_bet;
                    this.win_minus_bet = autoBetConfigArr[1].win_minus_bet;
                    this.loss_add_bet = autoBetConfigArr[1].loss_add_bet;
                    this.loss_minus_bet = autoBetConfigArr[1].loss_minus_bet;
                    this.balance_lower = autoBetConfigArr[1].balance_lower;
                    let maximum_bet = Number(autoBetConfigArr[1].maximum_bet);
                    let minimum_bet = Number(autoBetConfigArr[1].minimum_bet);
                    let calc_max_bet = await this.getMaxBet();
                    let calc_min_bet = await this.getMinBet();
                    if(maximum_bet > calc_max_bet) {
                        // console.log(calc_max_bet);
                        this.maximum_bet = keepDecimalNotRounding(calc_max_bet, this.decimalPrecision + 2, true);
                    } else {
                        this.maximum_bet = maximum_bet;
                    }
                    if(minimum_bet > calc_min_bet) {
                        this.minimum_bet = keepDecimalNotRounding(calc_min_bet, this.decimalPrecision + 2, true);
                    } else {
                        this.minimum_bet = minimum_bet;
                    }
                }
            }
        },
    },
}
</script>
<style lang="scss" scoped>
    .container {
        /deep/ {
            // height: 90vh;
            .game {
                width: 95%;
                margin: 0 auto;
                border: 0;
                background-color: transparent;
                padding-top: 10px;
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
                .content-box-fair {
                    margin: 0 auto;
                    margin-left: auto !important;
                    margin-right: auto !important;
                    margin-bottom: 30px;
                    font-size: 10px;
                    // border: 2px solid #454848;
                    padding-top: 20px;     
                }
                .title {
                    margin-bottom: 10px;
                }
                 .bet-amount {
                    // margin-top: 5px;
                    margin-bottom: 10px;
                    .icon-log {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        img {
                            margin-right: 3px;
                        }
                    }
                    .el-radio {
                        margin-right: 0;
                    }
                    .el-card__body {
                        padding-bottom: 80px;
                    }
                    .el-radio.is-bordered {
                        padding: 12px 15px 0 15px;
                        background-color: #141a1f;
                        border: 0;
                        color: #fff;
                        // height: 30px;
                    }
                    .el-radio__label {
                        padding-left: 0;
                        font-size: 10px;
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
                        width: 44%;
                        height: 30px;
                        .el-input__inner {
                            height: 30px;
                        }
                    }
                    .increase-bet-radio {
                        width: 55%;
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
