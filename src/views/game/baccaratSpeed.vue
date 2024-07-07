<!-- 百家乐 -->
<template>
    <div class="container">
        <div class="game">
            <!-- <div class="bet-amount">
                <div> 
                    <el-radio v-model="tabType" label="1" border @input="radioClickFun" :disabled="startLoading">{{ $t('game:manualBet') }}</el-radio>
                    <el-radio v-model="tabType" label="2" border @input="radioClickFun" :disabled="startLoading">{{ $t('game:autoBet') }}</el-radio>
                </div>
            </div> -->
            <el-row :gutter="20">
                <el-col :span="screenWidth < 1200 ? 24 : 10" align="center">
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
                        </div>
                    </div>
                    <div class="marginTop" :style="{width: screenWidth > 1200 ? '' : screenWidth < 600 ? '90%' : '60%'}">
                        <div class="title">{{ $t('game:Balance') }}: {{ platformBalance }} {{ transactionCurrency }}</div>
                        <!-- <el-button class="dealer" size="mini" @click="likeDealer()">我要做庄家</el-button> -->
                        <el-button-group>
                            <el-button type="primary" @click="minBet()">MIN</el-button>
                            <el-button type="primary" @click="removeBet()">-1</el-button>
                            <el-button type="primary" @click="takeBet()">+1</el-button>
                            <el-button type="primary" @click="maxBet()">MAX</el-button>
                        </el-button-group>
                        <!-- 赌注 -->
                        <el-input placeholder="" :min="10" v-model="size" class="operate" @input="calcBetFun"></el-input>

                        <div v-show="tabType == 1">
                            <!-- 赔率 -->
                            <el-col :span="screenWidth < 600 ? 24 : 12" class="odds">
                                <div class="title">{{ $t('game:Payout') }}</div>
                                <el-input placeholder="" v-model="payout" class="operate" :readonly="true">
                                    <template slot="append">x</template>
                                </el-input>
                            </el-col>
                            <el-col :span="screenWidth < 600 ? 24 : 12" class="profit">
                                <div class="title">{{ $t('game:Profit') }}</div>
                                <el-input placeholder="" v-model="profit" class="operate" :readonly="true">
                                    <template slot="append">{{ transactionCurrency }}</template>
                                </el-input>
                            </el-col>
                        </div>
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
                            <el-radio v-model="betting" label="闲" border @input="bettingInput">
                                <span>{{ $t('game:Player') }}</span>
                                <!-- <span>1:1</span> -->
                            </el-radio>
                            <el-radio v-model="betting" label="和" border @input="bettingInput">{{ $t('game:Tie') }}</el-radio>
                            <el-radio v-model="betting" label="庄" border @input="bettingInput">{{ $t('game:Banker') }}</el-radio>
                        </div>

                        <!-- 自动模式设置 -->
                        <div v-if="tabType == 2">
                            <el-col :span="screenWidth < 600 ? 24 : 12" align="left">
                                <div class="auto-mode">
                                    <div class="title">{{ $t('game:onWinning') }}:</div>
                                    <el-radio-group v-model="winningBet" size="small">

                                        <el-radio label="1" border class="return-base-radio">&nbsp;</el-radio>
                                        <el-input value="Return to base" placeholder="Return to base" class="operate return-base-input" :readonly="true"></el-input>
                                        
                                        <el-radio label="2" border class="increase-bet-radio">{{ $t('game:increaseBet') }}</el-radio>
                                        <el-input placeholder="" type="number" v-model="win_add_bet" max="98" class="operate increase-bet-input">
                                            <template slot="append">%</template>
                                        </el-input>

                                        <el-radio label="3" border class="increase-bet-radio">{{ $t('game:decreaseBet') }}</el-radio>
                                        <el-input placeholder="" type="number" v-model="win_minus_bet" max="98" class="operate increase-bet-input">
                                            <template slot="append">%</template>
                                        </el-input>
                                    </el-radio-group>
                                </div>
                            </el-col>
                            <el-col :span="screenWidth < 600 ? 24 : 12" align="left">
                                <div class="auto-mode">
                                    <div class="title">{{ $t('game:onLoss') }}</div>
                                    <el-radio-group v-model="lossBet" size="small">

                                        <el-radio label="1" border class="return-base-radio">&nbsp;</el-radio>
                                        <el-input value="Return to base" placeholder="Return to base" type="" class="operate return-base-input" :readonly="true"></el-input>
                                        
                                        <el-radio label="2" border class="increase-bet-radio">{{ $t('game:increaseBet') }}</el-radio>
                                        <el-input placeholder="" type="number" v-model="loss_add_bet" max="98" class="operate increase-bet-input">
                                            <template slot="append">%</template>
                                        </el-input>

                                        <el-radio label="3" border class="increase-bet-radio">{{ $t('game:decreaseBet') }}</el-radio>
                                        <el-input placeholder="" type="number" v-model="loss_minus_bet" max="98" class="operate increase-bet-input">
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
                                <div class="auto-mode">
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
                                        <template slot="append">{{ transactionCurrency }}</template>
                                    </el-input> -->
                                    <el-input placeholder="0" type="number" v-model="balance_lower" class="operate limit-input">
                                        <template slot="prepend">{{ $t('game:stopBalanceLow') }}</template>
                                        <template slot="append">{{ transactionCurrency }}</template>
                                    </el-input>
                                    <el-input placeholder="0" type="number" v-model="maximum_bet" class="operate limit-input">
                                        <template slot="prepend">{{ $t('game:maxBetSize') }}</template>
                                        <template slot="append">{{ transactionCurrency }}</template>
                                    </el-input>
                                    <el-input placeholder="0" type="number" v-model="minimum_bet" class="operate limit-input">
                                        <template slot="prepend">{{ $t('game:minBetSize') }}</template>
                                        <template slot="append">{{ transactionCurrency }}</template>
                                    </el-input>
                                </div>
                            </el-col>
                        </div>

                        <!-- 手动下注按钮 -->
                        <div v-if="tabType == 1">
                            <el-button class="start-bet" v-if="!approve" :loading="loading" :disabled="loading" @click="startApprove()">{{ $t('swap:Approve') }}</el-button>
                            <el-button class="start-bet" v-else :loading="loading" :disabled="loading" type="primary" @click="startPlaceBet">{{ $t('game:Roll') }}</el-button>
                        </div>
                        <!-- 自动模式 -->
                        <div v-else>
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
                        <div style="font-size:10px;position: relative;bottom: 5px;margin-right: -7px;float: right;">
                            <span>{{ $t('game:MaxProfit') }} {{ maxProfit }} {{ transactionCurrency }}</span>
                        </div>
                    </div>
                </el-col>
                <el-col :span="screenWidth < 1200 ? 24 : 14" align="center">
                    <List :game_type="4" @childUpdatePlatformBalance="childUpdatePlatformBalance" />
                </el-col>
                <!-- <el-col :span="screenWidth < 600 ? 24 : 10" align="center">
                    <div class="rule" :style="{width: screenWidth < 600 ? '100%' : '100%', marginTop: screenWidth < 600 ? '30px' : '30px'}">
                        <div class="title">玩法规则</div>
                        <div class="box">
                            <span>
                                普通百家乐玩法介绍：（1到8倍赔率）<br>
                                A.使用OKT兑换好LUSD <br>
                                B.向游戏地址投注LUSD，向游戏地址投注资金（尾数为0.001代表下注单、尾数为其他代表下注双） <br>
                                C.投注数额等于转账数额 <br>
                                D.如押注100LUSD,则转账100LUSD <br>
                                E.转账低于 10LUSD (限红)视为无效投注，不进行发牌返奖， <br>
                                F.转账不满足限额时，退还本金（不扣手续费） <br>
                                G.获取您投注转账后，满足限额要求会获得协议发牌，发牌转账Deal的区块事件日志里[topic0]为∶0x12693cbe14f5a2c78464fbeea779611c56f39525834aa514cdaa6def62c2aba8的第一行HEX哈希我们称为【区块哈希】，作为判定依据 <br>
                                H.哈希末尾五位为牌面例: ( *****2aba8 )，2aba8为牌面 <br>
                                I.牌面中如果存在字母，则字母代表数字: 0 <br>
                                J.庄家开奖号码是:千位数和万位数相加[例: 2aba8,庄家开奖号为:2+a=2+0=2，结果为2点] <br>
                                K.闲家开奖号码是 :个位数、十位数相加[例: 2aba8,闲家开奖号为:a+8=0+8=8，结果为8点] <br>
                                L.根据结果分胜负，赔率为赢家赔2倍，比如2点赢赔率为下注额的2倍，8点赢赔率也为下注额的2倍，平局获胜赔率为下注额8倍 <br>
                                M. 1平局，庄闲都不退本金，其他平局退回庄闲下注额本金, <br>
                                N.平局退回不扣手续费，盈亏转账税为百分之一。  <br>
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
import { getBalance, isApproved, getDiceBalanceOf, getUserDealerBalance, getUserPlatformBalance } from "@/wallet/serve";
import List from './list.vue'
export default {
    name: '',
    data() {
        return {
            screenWidth: document.body.clientWidth,
            size: 0, //赌注
            chance: 50,
            baseBet: 0, //Base 赌注
            payout: 0, //赔率
            profit: 0, //利润
            betting: '闲', //投注
            loading: false,
            approve: true,
            alertShow: false,
            dealResult: '', // 开牌结果
            dealResultStatue: '',
            dealerTotalBalance: 0, //庄家总余额
            dataStatisticsData: {},
            tabType: '1',
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
            maximum_bet: 100, //最大下注大小
            minimum_bet: 0.1, //最小下注大小
            timeInterval: null,
            startLoading: false, //开始自动任务loading
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
            gamesFillingAddress:state=>state.base.baccaratAddress,
            versionName:state=>state.base.versionName,
            transactionCurrency:state=>state.base.transactionCurrency,
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
        },
    },
    created() {
        try {
            setTimeout(async() => {
                // await this.getLusdBalance(); //获取余额
                // await this.getAutoBetConfigData();
                // await this.getMaxBet();
                // const minBet = await this.getMinBet();
                // this.size = keepDecimalNotRounding(minBet, this.decimalPrecision, true);
                // await this.calcProfitPayout();
            }, 300)
        } catch (err) {}
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
        platformBalance: {
            immediate: true,
            async handler(val){
                if(val) {
                    // this.maximum_bet = val;
                    // this.refreshData();
                }
            }
        },
        changeData: {
            immediate: true,
            async handler(val){
                if(val.platformBalance && val.dealerTotalBalance) {
                    await this.getMaxBet();
                    const minBet = await this.getMinBet();
                    if(this.size <= 0) {
                        this.size = keepDecimalNotRounding(minBet, this.decimalPrecision, true);
                    }
                    await this.calcProfitPayout();
                }
            }
        },
    },
    components:{
        List
    },
    methods: {
        radioClickFun(label) { //手动 自动模式切换
        },
        async getLusdBalance() {  //获取余额
            this.$store.commit('refreshPlatformBalance');
            let dealerBalance = await getUserDealerBalance(4, 2);
            this.dealerTotalBalance = dealerBalance.total_balance; //获取庄家总余额
        },
        async childUpdatePlatformBalance() { //接受List组件 更新余额
            await this.getLusdBalance();
        },
        startApprove() { //批准LUSD
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
        addressStr(address){
            // console.log(this.address);
            if(!address || address == undefined || address == '') {
                return "Connect Wallet";
            } else {
                return this.address.substring(0, 4) + "***" + address.substring(address.length - 3)
            }
        },
        async startPlaceBet() { //手动 开始下注
            this.loading = true;
            let verify = await this.placeBetVerify();
            if(!verify) {
                return false;
            }
            await this.setRollDiceData(); //下注执行
            this.loading = false;
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
                let change = 50;
                if(this.betting === '庄') {
                    change = 45;
                } else if(this.betting === '闲') {
                    change = 45;
                } else if(this.betting === '和') {
                    change = 10;
                }
                post(this.apiUrl + '/Api/Bet/setAutoRollDiceData', {
                    address: this.address,
                    chance: change,
                    bet: this.size,
                    payout: this.payout,
                    profit: this.profit,
                    user_choice: this.betting,
                    type: 4,
                    chain: 'speed',
                    currency: this.transactionCurrency,
                    is_auto: 0
                }, async (json) => {
                    console.log(json);
                    if (json && json.code == 10000) {
                        this.dealResult = keepDecimalNotRounding(json.data.data, 2);
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
                this.baseBet = keepDecimalNotRounding(this.size, 10, true);
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
            let change = 50;
            if(this.betting === '庄') {
                change = 45;
            } else if(this.betting === '闲') {
                change = 45;
            } else if(this.betting === '和') {
                change = 10;
            }
            post(this.apiUrl + '/Api/Bet/setAutoRollDicePushCache', {
                address: this.address,
                chance: change,
                bet: this.size,
                payout: this.payout,
                profit: this.profit,
                user_choice: this.betting,
                type: 4,
                chain: 'speed',
                currency: this.transactionCurrency,
                is_auto: 0
            }, async (json) => {
                console.log(json);
                if (json && json.code == 10000) {
                    let lost = json.data.lost;
                    if(lost == 1) { //赢了
                        console.log('赢了');
                        if(this.winningBet == 1) { //回到最初状态值
                            this.size = this.baseBet;
                            if(this.size < this.minimum_bet) { //如果下注额小于最小下注大小的话 停止任务
                                console.log('下注额小于最小下注大小的话 停止任务');
                                this.$message({
                                    message: this.$t('game:autoBetStoped'), // 自动下注已停止执行,
                                    type: 'warning'
                                });
                                this.autoBetMessageBox(this.$t('game:autoBetStopInfo-01'));
                                return false;
                            }
                        }
                        if(this.winningBet == 2) { //增加赌注
                            this.size = keepDecimalNotRounding(Number(this.size) + Number(this.size) * (Number(this.win_add_bet) / 100), 10);
                            if(this.size > this.maximum_bet) { //如果下注额大于最大下注大小的话 停止任务
                                console.log('下注额大于最大下注大小的话 停止任务');
                                this.$message({
                                    message: this.$t('game:autoBetStoped'), // 自动下注已停止执行
                                    type: 'warning'
                                });
                                this.autoBetMessageBox(this.$t('game:autoBetStopInfo-02'));
                                return false;
                            }
                            if(this.platformBalance < this.balance_lower) {
                                console.log('余额低于'+this.balance_lower+' 停止任务');
                                this.$message({
                                    message: this.$t('game:autoBetStoped'), // 自动下注已停止执行
                                    type: 'warning'
                                });
                                this.autoBetMessageBox(this.$t('game:autoBetStopInfo-03', {num: this.balance_lower, currency: this.transactionCurrency}));
                                return false;
                            }
                        }
                        if(this.winningBet == 3) { //减少赌注
                            this.size = keepDecimalNotRounding(Number(this.size) - Number(this.size) * (Number(this.win_minus_bet) / 100), 10);
                            if(this.size <= this.minimum_bet) { //如果下注额大于最小于注大小的话 停止任务
                                console.log('下注额小于最大下注大小的话 停止任务');
                                this.$message({
                                    message: this.$t('game:autoBetStoped'), // 自动下注已停止执行
                                    type: 'warning'
                                });
                                this.autoBetMessageBox(this.$t('game:autoBetStopInfo-04'));
                                return false;
                            }
                            if(this.platformBalance < this.balance_lower) {
                                console.log('余额低于'+this.balance_lower+' 停止任务');
                                this.$message({
                                    message: this.$t('game:autoBetStoped'), // 自动下注已停止执行
                                    type: 'warning'
                                });
                                this.autoBetMessageBox(this.$t('game:autoBetStopInfo-03', {num: this.balance_lower, currency: this.transactionCurrency}));
                                return false;
                            }
                        }
                    } else { //输了
                        console.log('输了');
                        if(this.lossBet == 1) { //回到最初状态值
                            this.size = this.baseBet;
                            if(this.size < this.minimum_bet) { //如果下注额小于最小下注大小的话 停止任务
                                console.log('下注额小于最小下注大小的话 停止任务');
                                this.$message({
                                    message: this.$t('game:autoBetStoped'), // 自动下注已停止执行,
                                    type: 'warning'
                                });
                                this.autoBetMessageBox(this.$t('game:autoBetStopInfo-01'));
                                return false;
                            }
                        }
                        if(this.lossBet == 2) { //增加赌注
                            this.size = keepDecimalNotRounding(Number(this.size) + Number(this.size) * (Number(this.loss_add_bet) / 100), 10);
                            if(this.size >= this.maximum_bet) { //如果下注额大于最大下注大小的话 停止任务
                                console.log('下注额大于最大下注大小的话 停止任务');
                                this.$message({
                                    message: this.$t('game:autoBetStoped'), // 自动下注已停止执行
                                    type: 'warning'
                                });
                                this.autoBetMessageBox(this.$t('game:autoBetStopInfo-02'));
                                return false;
                            }
                            if(this.platformBalance < this.balance_lower) {
                                console.log('余额低于'+this.balance_lower+' 停止任务');
                                this.$message({
                                    message: this.$t('game:autoBetStoped'), // 自动下注已停止执行
                                    type: 'warning'
                                });
                                this.autoBetMessageBox(this.$t('game:autoBetStopInfo-03', {num: this.balance_lower, currency: this.transactionCurrency}));
                                return false;
                            }
                        }
                        if(this.lossBet == 3) { //减少赌注
                            this.size = keepDecimalNotRounding(Number(this.size) - Number(this.size) * (Number(this.loss_minus_bet) / 100), 10);
                            if(this.size <= this.minimum_bet) { //如果下注额小于最大下注大小的话 停止任务
                                console.log('下注额小于最大下注大小的话 停止任务');
                                this.$message({
                                    message: this.$t('game:autoBetStoped'), // 自动下注已停止执行
                                    type: 'warning'
                                });
                                this.autoBetMessageBox(this.$t('game:autoBetStopInfo-04'));
                                return false;
                            }
                            if(this.platformBalance < this.balance_lower) {
                                console.log('余额低于'+this.balance_lower+' 停止任务');
                                this.$message({
                                    message: this.$t('game:autoBetStoped'), // 自动下注已停止执行
                                    type: 'warning'
                                });
                                this.autoBetMessageBox(this.$t('game:autoBetStopInfo-03', {num: this.balance_lower, currency: this.transactionCurrency}));
                                return false;
                            }
                        }
                    }
                    await this.calcProfitPayout();
                    await this.getLusdBalance(); //获取余额
                    if(this.startLoading) {
                        this.timeInterval = setTimeout( async () => {
                            await this.startAutoBet();
                            console.log("开始下一次执行");
                        }, 300)
                    }
                } else {
                    this.$message.error(json.msg);
                }
                return;
            })
            
        },
        stopAutoBet() { //停止自动任务
            clearInterval(this.timeInterval);
            this.timeInterval = null;
            this.startLoading = false;
            this.$message({
                message: this.$t('game:autoBetStoped'), // 自动下注已停止执行
                type: 'warning'
            });
        },
        async placeBetVerify() { //下注前验证
            return new Promise((resolve, reject) => {
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
                if(this.size <= 0) {
                    this.$message.warning(this.$t('public:BettingAmount')); //投注额必须大于0
                    this.loading = false;
                    this.autoBetMessageBox(this.$t('public:BettingAmount'));
                    resolve(false);
                }
                let maxBetAmount = this.maxProfit; //下注最大数量
                if(maxBetAmount < this.minimum_bet) { //如果下注最大利润小于最小下单数量的话 停止下单
                    this.$message.warning(this.$t('game:jackpotNotOpen')); //投注不能超过{{ num }} LUSD
                    this.loading = false;
                    this.autoBetMessageBox(this.$t('game:jackpotNotOpen'));
                    resolve(false);
                    return;
                }
                if(Number(this.profit) > maxBetAmount) {
                    this.$message.warning(this.$t('public:BetsCannotExceed', {num: keepDecimalNotRounding(maxBetAmount, this.decimalLen, true), currency: this.transactionCurrency})); //投注不能超过{{ num }} LUSD
                    this.loading = false;
                    this.autoBetMessageBox(this.$t('public:BetsCannotExceed'));
                    resolve(false);
                    return;
                }
                if(this.size < this.minimum_bet) { //如果下注额大于最小于注大小的话 停止任务
                    console.log('下注额小于最小下注大小的话 停止任务');
                    this.$message({
                        message: this.$t('game:betSmall', {num: this.minimum_bet, currency: this.transactionCurrency}), // 自动下注已停止执行,
                        type: 'warning'
                    });
                    this.loading = false;
                    this.autoBetMessageBox(this.$t('game:betSmall', {num: this.minimum_bet, currency: this.transactionCurrency}));
                    resolve(false);
                    return;
                }
                if(this.tabType == 2) {
                    if(this.size > this.maximum_bet) { //如果下注额大于最大下注大小的话 停止任务
                        console.log('下注额大于最大下注大小的话 停止任务');
                        this.$message({
                            message: this.$t('game:autoBetStoped'), // 自动下注已停止执行
                            type: 'warning'
                        });
                        this.loading = false;
                        this.autoBetMessageBox(this.$t('game:autoBetStoped'));
                        resolve(false);
                        return;
                    }
                    if(this.platformBalance < this.balance_lower) {
                        console.log('余额低于'+this.balance_lower+' 停止任务');
                        this.$message({
                            message: this.$t('game:autoBetStoped'), // 自动下注已停止执行,
                            type: 'warning'
                        });
                        this.loading = false;
                        this.autoBetMessageBox(this.$t('game:autoBetStoped'));
                        resolve(false);
                        return;
                    }
                }
                resolve(true);
                return;
            })
        },
        async calcBetFun(value) {
            this.size = value.toString().replace(/^(0+)|[^\d]+/g,'');
            if(value > 0) {
                await this.calcProfitPayout();
            }
        },
        async calcProfitPayout() { //利润赔率计算
            let payout = await this.calcPayout();
            //赔率 计算  赔率：9801/1000/5
            this.payout = keepDecimalNotRounding(payout, 4);
            //利润计算 利润：下注额 *（赔率 - 1）
            let profit = Number(this.size) * (payout - 1);
            if(profit < 0) {
                profit = 0;
            }
            this.profit = keepDecimalNotRounding(profit, 16, true);
            
        },
        async calcPayout() { //利润
            let payout = 0;
            if(this.betting === '和') {
                payout = 9;
            } else {
                payout = 2 * (1 - 0.01);
                // payout = 9801 / 1000 / 5;
            }
            return payout;
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
        async bettingInput(name) { //庄 闲 和按钮事件
            console.log(name);
            await this.calcProfitPayout();
        },
        async minBet() { //赌注 min
            // let size = this.minBetNum;
            // this.size = this.calcBetExceed(size);
            const minBetNum = await this.getMinBet();
            this.size = keepDecimalNotRounding(minBetNum, this.decimalPrecision, true);
            this.calcProfitPayout();
        },
        removeBet() { //赌注 减 1
            let size = Number(this.size) - 1;
            this.size = this.calcBetExceed(size);
            this.calcProfitPayout();
        },
        takeBet() { //赌注 加 1
            let size = Number(this.size) + 1;
            this.size = this.calcBetExceed(size);
            this.calcProfitPayout();
        },
        async maxBet() { //赌注 MAX
            // let size = this.platformBalance;
            // this.size = this.calcBetExceed(size);
            const maxBetNum = await this.getMaxBet();
            this.size = keepDecimalNotRounding(maxBetNum, this.decimalPrecision, true);
            this.calcProfitPayout();
        },
        async getMaxBet() { //计算最大下注额度
            let maxProfitAmount = this.maxProfit; //下注最大数量
            let payout = await this.calcPayout();
            let maxBetNum = maxProfitAmount / (payout - 1);
            if(maxBetNum > this.platformBalance) {
                maxBetNum = this.platformBalance;
            }
            this.maximum_bet = keepDecimalNotRounding(maxBetNum, this.decimalPrecision, true);
            return maxBetNum;
        },
        async getMinBet() { //计算最小下注额度
            let maxBetNum = await this.getMaxBet();
            let minBetNum = keepDecimalNotRounding(maxBetNum * 0.00003333333, this.decimalPrecision, true);
            this.minimum_bet = minBetNum;
            return minBetNum;
        },
        likeDealer() { //跳转庄家页面
            this.$router.push({
                path:'/banker',
                query: {
                    game_type: 4,
                }
            })
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
            autoBetConfigArr[4] = autoBetConfigArrRes;
            const autoBetConfigArrJson = JSON.stringify(autoBetConfigArr);
            localStorage.setItem('autoBetConfigArrCacheKey', autoBetConfigArrJson);
        },
        async getAutoBetConfigData() { //获取自动投注配置数据
            const autoBetConfig = localStorage.getItem('autoBetConfigArrCacheKey');
            if(autoBetConfig && autoBetConfig !== undefined) {
                let autoBetConfigArr = JSON.parse(autoBetConfig);
                console.log('自动下注配置', autoBetConfigArr);
                if(autoBetConfigArr[4]) {
                    this.winningBet = autoBetConfigArr[4].winningBet;
                    this.lossBet = autoBetConfigArr[4].lossBet;
                    this.win_add_bet = autoBetConfigArr[4].win_add_bet;
                    this.win_minus_bet = autoBetConfigArr[4].win_minus_bet;
                    this.loss_add_bet = autoBetConfigArr[4].loss_add_bet;
                    this.loss_minus_bet = autoBetConfigArr[4].loss_minus_bet;
                    this.balance_lower = autoBetConfigArr[4].balance_lower;
                    this.maximum_bet = autoBetConfigArr[4].maximum_bet;
                    this.minimum_bet = autoBetConfigArr[4].minimum_bet;
                }
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
                padding-top: 10px;
                .content-box {
                    font-size: 10px;
                    // width: 80%;
                    margin: 0 auto;
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
                        }
                        .el-input-group__append {
                            border: 0;
                            color: #fff;
                            background-color: #141a1f;
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

                .auto-mode {  
                    margin-top: 10px;
                    .title {
                        font-size: 12px;
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
                    .el-radio__input { // 隐藏单选框小圆点
                        display: contents !important;
                    }
                    .el-radio__input.is-checked+.el-radio__label {
                        color: #fff;
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
                    // margin-top: 5px;
                    text-align: left;
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
                        // padding: 7px 10px 0 0;
                        // padding: 14px 35px 0 25px;
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
