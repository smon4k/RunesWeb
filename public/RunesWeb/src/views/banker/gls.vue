<template>
    <div class="container">
        <!-- <div style="text-align: center;padding:20px 0;font-size:23px;">{{ gameName }} GLS</div> -->
        <!-- <el-row :style="{width: isMobel ? '100%' : '90%'}">
            <el-col :span="isMobel ? 24 : 24" :align="isMobel ? 'center' : 'left'">
                <div style="font-size:13px;margin-top:10px;">{{ $t('game:DealerIntroduction') }}</div>
            </el-col>
        </el-row> -->
        <el-row class="dealer-box" :style="{width: isMobel ? '100%' : '90%'}"> 
            <el-col :span="isMobel ? 24 : 24" :align="isMobel ? 'center' : 'center'">
                <!-- GLS总余额 -->
                <el-col :span="isMobel ? 12 : 8" :align="isMobel ? 'center' : 'center'">
                    <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                        <span class="name">{{ $t('game:rewarded') }}：</span>
                        <span class="amount">{{ keepDecimalNotRounding(totalBalance, 4, true) }} {{ 'LUCK' }}</span>
                    </div>
                </el-col>
                <!-- 总分红 -->
                <el-col :span="isMobel ? 12 : 8" :align="isMobel ? 'center' : 'center'">
                    <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                        <span class="name">{{ $t('game:holderProfit') }}：</span>
                        <!-- <span class="amount">{{ calcAllProfit() }} {{ 'GLS' }}</span> -->
                        <span class="amount">{{ keepDecimalNotRounding(totalDividends, decimalLen, true) }} {{ transactionSpareCurrency }}</span>
                    </div>
                </el-col>
                <el-col v-show="!isMobel" :span="isMobel ? 12 : 8" :align="isMobel ? 'center' : 'center'">
                    <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                        <span class="name">&nbsp;</span>
                        <span class="amount">&nbsp;</span>
                    </div>
                </el-col>
                <!-- 我的总余额 -->
                <el-col :span="isMobel ? 12 : 8" :align="isMobel ? 'center' : 'center'">
                    <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                        <span class="name">{{ $t('game:myTotalBalance') }}：</span>
                        <span class="amount">{{ keepDecimalNotRounding(walletBalance, 4, true) }} {{ 'LUCK' }}</span>
                    </div>
                </el-col>
                <!-- 我的占比 -->
                <el-col :span="isMobel ? 12 : 8" :align="isMobel ? 'center' : 'center'">
                    <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                        <span class="name">{{ $t('game:myPercentage') }}：</span>
                        <span class="amount">{{ calcProportion() }} %</span>
                    </div>
                </el-col>
                <!-- 分红 -->
                <el-col :span="isMobel ? 12 : 8" :align="isMobel ? 'center' : 'center'">
                    <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                        <span class="name">{{ $t('game:holderProfit') }}：</span> 
                        <!-- <span class="amount">{{ calcProfit() }} {{ 'GLS' }}</span>  -->
                        <span class="amount">{{ keepDecimalNotRounding(userDividends, decimalLen, true) }} {{ transactionSpareCurrency }}</span> 
                    </div>
                </el-col>
            </el-col>
        </el-row>
        <el-tabs class="list-tabs" v-model="listTabsActive" @tab-click="handleClicks" :stretch="true"  :style="{width: isMobel ? '100%' : '100%', marginTop: isMobel ? '' : ''}">
            <!-- GLS 汇总 -->
            <el-tab-pane :label="$t('game:summary')" name="1">
                <el-table :data="summaryData" style="width: 100%;" v-loading="loading" height="500">
                    <!-- <el-table-column sortable prop="id" label="ID" width="100" align="center" fixed="left"></el-table-column> -->
                    <el-table-column prop="address" label="User" align="center" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ addressStr(scope.row.address) }}</span>
                        </template>
                    </el-table-column>
                    <!-- 奖励 GLS -->
                    <el-table-column prop="" :label="$t('game:rewarded')" align="center">
                        <template slot-scope="scope">
                            <span>{{ keepDecimalNotRounding(Number(scope.row.gls_total_balance), decimalLen, true)}} LUCK</span>
                        </template>
                    </el-table-column>
                    <!-- GLS占比 -->
                    <el-table-column prop="" :label="$t('game:percentage')" align="center">
                        <template slot-scope="scope">
                            <span>{{ keepDecimalNotRounding(Number(scope.row.proportion), decimalLen)}} %</span>
                        </template>
                    </el-table-column>
                    <!-- 盈利额 -->
                    <el-table-column prop="" :label="$t('game:rewarded')" align="center">
                        <template slot-scope="scope">
                            <span>{{ keepDecimalNotRounding(Number(scope.row.profit), decimalLen, true)}} {{ transactionSpareCurrency }}</span>
                        </template>
                    </el-table-column>
                    <!-- 收益率 -->
                    <!-- <el-table-column prop="" :label="$t('game:rate')" align="center">
                        <template slot-scope="scope">
                            <span>{{ keepDecimalNotRounding(Number(scope.row.rate * 100), 4)}}%</span>
                        </template>
                    </el-table-column> -->
                </el-table>
            </el-tab-pane>
            <!-- 所有奖励记录 -->
            <el-tab-pane :label="$t('game:allAwardRecords')" name="2">
                <el-table :data="tableData" style="width: 100%;" v-loading="loading" height="500">
                    <!-- <el-table-column sortable prop="id" label="ID" width="100" align="center" fixed="left"></el-table-column> -->
                    <el-table-column prop="address" label="User" align="center">
                        <template slot-scope="scope">
                            <span class="">{{ addressStr(scope.row.address) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="bet" :label="$t('game:Bet')" align="center">
                        <template slot-scope="scope">
                            <span>{{ keepDecimalNotRounding(Number(scope.row.bet), 16, true)}} {{ scope.row.bet_currency }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="time" :label="$t('game:Time')" align="center"></el-table-column>
                    <el-table-column prop="amount" :label="$t('game:Amount') + '('+'LUCK'+')'" align="center">
                        <template slot-scope="scope">
                        <span>{{ keepDecimalNotRounding(Number(scope.row.amount), 16, true)}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="type" :label="$t('game:Type')" align="center">
                        <template slot-scope="scope">
                        <span v-if="scope.row.type == 1">{{ $t('game:upper') }}</span>
                        <span v-else>{{ $t('game:lower') }}</span>
                        </template>
                    </el-table-column> -->
                    <!-- <el-table-column prop="type" :label="$t('game:State')" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1">{{ $t('game:processing') }}</span>
                            <span v-else>{{ $t('game:completed') }}</span>
                        </template>
                    </el-table-column> -->
                </el-table>
            </el-tab-pane>
            <!-- 我的GLS汇总 -->
            <el-tab-pane :label="$t('game:myAwardRecords')" name="3">
                <el-table :data="myTableData" style="width: 100%;" v-loading="loading" height="500">
                    <!-- <el-table-column sortable prop="id" label="ID" width="100" align="center" fixed="left"></el-table-column> -->
                    <!-- <el-table-column prop="address" label="Token" align="center" :show-overflow-tooltip="true"></el-table-column> -->
                    <el-table-column prop="time" :label="$t('game:Time')" align="center"></el-table-column>
                    <el-table-column prop="bet" :label="$t('game:Bet')" align="center">
                        <template slot-scope="scope">
                            <span>{{ keepDecimalNotRounding(Number(scope.row.bet), 16, true)}} {{ transactionSpareCurrency }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="amount" :label="$t('game:Amount')" align="center">
                        <template slot-scope="scope">
                        <span>{{ keepDecimalNotRounding(Number(scope.row.amount), 16, true)}} LUCK</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="type" :label="$t('game:Type')" align="center">
                        <template slot-scope="scope">
                        <span v-if="scope.row.type == 1">{{ $t('game:upper') }}</span>
                        <span v-else>{{ $t('game:lower') }}</span>
                        </template>
                    </el-table-column> -->
                    <!-- <el-table-column prop="type" :label="$t('game:State')" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1">{{ $t('game:processing') }}</span>
                            <span v-else>{{ $t('game:completed') }}</span>
                        </template>
                    </el-table-column> -->
                </el-table>
            </el-tab-pane>
        </el-tabs>
    
    </div>
</template>
<script>
import { get, post } from "@/common/axios.js";
import { mapState } from "vuex";
import { approve, depositPoolsIn, depositPoolsOut } from "@/wallet/trade";
import {getBalance,isApproved, getDiceDealerBalance, getDiceBalanceOf, getFillingIncreasingId, getUserDealerBalance, getUserGlsBalance, getUserBalanceInfo, getUserPlatformBalance} from "@/wallet/serve";
import { keepDecimalNotRounding } from "@/utils/tools";
import TOKEN from '@/wallet/token.js'
import Page from "@/components/Page.vue";
export default {
    props: ['game_type', 'activeName', 'childUpdateBalance'],//接受参数
    name: "Index",
    data() {
        return {
            gameName: '',
            // game_type: 0,
            screenWidth: document.body.clientWidth,
            listTabsActive: "1",
            localBalance: 0, //本地余额
            walletBalance: 0, //用户GLS余额
            totalBalance: 0, //GLS总的余额
            totalDividends: 0, //GLS 总的分红
            userDividends: 0, //GLS 用户分红
            platformBalance: 0, //平台总余额 本地余额 + 合约余额
            isStatus: false, //是否可以充提 0：可以充提 1：不可以充提
            isGame: false, //是否打赏中 true： 打赏中 false：不在打赏中
            isGameInfoNum: 0, //正在打赏中 提示次数
            isWithdraw: false, //是否充提进行中
            approve: false,
            trading: false,
            buttonAmountNum: 0, //按钮选择额度值
            transactionCurrencyBalance: 0,
            balanceTimeInterval: null,
            summaryData: [],
            tableData: [],
            allCurrPage: 1, //当前页
            allPageSize: 100, //每页显示条数
            allTotal: 1, //总条数
            myTableData: [],
            myCurrPage: 1, //当前页
            myPageSize: 100, //每页显示条数
            myTotal: 1, //总条数
            loading: true,
            shangZhuangDialog: false,
            xiaZhuangDialog: false,
            accessNum: 0, //用户充提总值
            allAccessNum: 0, //总的用户充提总值
            gamesFillingAddress: '', //台子地址
            timeBankerInterval: null,
            refreshBankerTime: 10000, //数据刷新间隔时间
        };
    },
    mounted() {
        window.onresize = () => {
            this.screenWidth = document.body.clientWidth;
        }
    },
    activated() { //页面进来
        // this.refreshData();
        // this.getUserInfo();
    },
    beforeRouteLeave(to, from, next){ //页面离开
        if (this.balanceTimeInterval) {
            clearInterval(this.balanceTimeInterval);
            this.balanceTimeInterval = null;
        }
        next();
    },
    created() {
        try {
            // console.log(this.game_type);
            // let game_type = this.$route.query.game_type;
            // this.game_type = game_type;
            if(this.game_type == 1) {
                this.gamesFillingAddress = this.numberAddress;
                this.gameName = '猜数字';
            } else if(this.game_type == 2) {
                this.gamesFillingAddress = this.sizeAddress;
                this.gameName = '猜大小';
            } else if(this.game_type == 3) {
                this.gamesFillingAddress = this.singDoubleAddress;
                this.gameName = '猜单双';
            } else if(this.game_type == 4) {
                this.gamesFillingAddress = this.baccaratAddress;
                this.gameName = '百家乐';
            }
            console.log(this.gamesFillingAddress, this.gameName);
        } catch (err) {
            console.log(err);
        }
    },
    watch: {
        isConnected: {
            immediate: true,
            async handler(val){
                if(val) {
                    // await this.getIsApprove();
                    await this.getBalanceInfo();
                    await this.getGlsBalanceProportion();
                    await this.getAccessNum();
                    // this.$store.dispatch("getUserDealerProportion", {game_type: this.game_type});
                    // if(!this.userDealerProportion.length) {
                    // }
                }
            }
        },
        userDealerProportion: {
            immediate: true,
            async handler(val){
                if(val) {
                    console.log(val);
                }
            }
        },
        activeName: {
            immediate: true,
            async handler(val){
                console.log(val);
                if(val == 6) {
                    await this.refreshData();
                } else {
                    clearInterval(this.timeBankerInterval);
                    this.timeBankerInterval = null;
                }
            },
            deep: true,
        }
    },
    computed: {
        ...mapState({
            isConnected:state=>state.base.isConnected,
            chainName:state=>state.base.chainName,
            address:state=>state.base.address,
            numberAddress:state=>state.base.numberAddress,
            sizeAddress:state=>state.base.sizeAddress,
            singDoubleAddress:state=>state.base.singDoubleAddress,
            baccaratAddress:state=>state.base.baccaratAddress,
            apiUrl:state=>state.base.apiUrl,
            userId:state=>state.base.userId,
            isMobel:state=>state.comps.isMobel,
            userDealerProportion:state=>state.base.userDealerProportion,
            versionName:state=>state.base.versionName,
            transactionCurrency:state=>state.base.transactionCurrency,
            transactionSpareCurrency:state=>state.base.transactionSpareCurrency,
            decimalLen:state=>state.base.decimalLen,
        }),
        changeData() {
            const {apiUrl,address} = this
            return {
                apiUrl, address
            };
        }
    },
    components: {
        "wbc-page": Page, //加载分页组件
    },
    beforeDestroy() { //页面关闭执行
        clearInterval(this.timeBankerInterval);
        this.timeBankerInterval = null;
    },
    methods: {
        async getGlsBalanceProportion(ServerWhere) { // 所有奖励记录
            if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
                ServerWhere = {
                    limit: 100,
                    page: 1,
                    // transactionCurrency: this.transactionCurrency,
                    transactionCurrency: 'GLS',
                };
            }
            console.log(ServerWhere);
            axios.get(this.apiUrl + "/Api/User/getGlsBalanceProportion", {
                params: ServerWhere
            }).then((json) => {
                console.log(json);
                this.loading = false;
                // console.log(this.address);
                if (json.code == 10000) {
                    this.summaryData = json.data.lists;
                    // this.allTotal = json.data.count;
                } else {
                    this.$message.error(this.$t('public:FailedLoadData')); //加载数据失败
                }   
            }).catch((error) => {
                this.$message.error(error);
            });
        },
        async getAllListData(ServerWhere) { // 所有奖励记录
            if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
                ServerWhere = {
                    limit: this.allPageSize,
                    page: this.allCurrPage,
                    type: this.game_type,
                    // chain: this.chainName,
                    version_type: 2,
                    transactionCurrency: this.transactionCurrency,
                };
            }
            console.log(ServerWhere);
            axios.get(this.apiUrl + "/Api/Bet/getAwardRecord", {
                params: ServerWhere
            }).then((json) => {
                this.loading = false;
                console.log(json);
                // console.log(this.address);
                if (json.code == 10000) {
                    this.tableData = json.data.lists;
                    this.allTotal = json.data.count;
                } else {
                    this.$message.error(this.$t('public:FailedLoadData')); //加载数据失败
                }   
            }).catch((error) => {
                this.$message.error(error);
            });
        },
        async getMyListData(ServerWhere) { // 我的奖励记录
            if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
                ServerWhere = {
                    address: this.address,
                    limit: this.myPageSize,
                    page: this.myCurrPage,
                    type: this.game_type,
                    // chain: this.chainName,
                    version_type: 2,
                    transactionCurrency: this.transactionCurrency,
                };
            }
            console.log(ServerWhere);
            axios.get(this.apiUrl + "/Api/Bet/getAwardRecord", {
                params: ServerWhere
            }).then((json) => {
                this.loading = false;
                console.log(json);
                // console.log(this.address);
                if (json.code == 10000) {
                    this.myTableData = json.data.lists;
                    this.myTotal = json.data.count;
                } else {
                    this.$message.error(this.$t('public:FailedLoadData')); //加载数据失败
                }   
            }).catch((error) => {
                this.$message.error(error);
            });
        },
        async getAccessNum() { //获取用户充提数值
            axios.get(this.apiUrl + "/Api/Bet/getAccessNum", {
                params: {
                    address: this.address
                }
            }).then((json) => {
                console.log(json);
                // console.log(this.address);
                if (json.code == 10000) {
                    this.accessNum = json.data.num;
                    this.allAccessNum = json.data.all_num;
                } else {
                    this.$message.error(this.$t('public:FailedLoadData')); //加载数据失败
                }   
            }).catch((error) => {
                this.$message.error(error);
            });
        },
        allLimitPaging(limit) { //全部 赋值当前条数
            this.allPageSize = limit;
            this.getAllListData(); //刷新列表
        },
        allSkipPaging(page) { //全部 赋值当前页数
            this.allCurrPage = page;
            this.getAllListData(); //刷新列表
        },
        myLimitPaging(limit) { //全部 赋值当前条数
            this.myPageSize = limit;
            this.getMyListData(); //刷新列表
        },
        mySkipPaging(page) { //全部 赋值当前页数
            this.myCurrPage = page;
            this.getMyListData(); //刷新列表
        },
        calcProportion() { //计算占比
            let proportion = 0.0;
            if(Number(this.walletBalance) > 0) {
                proportion = Number(this.walletBalance) / Number(this.totalBalance) * 100;
            }
            // console.log(proportion);
            return keepDecimalNotRounding(proportion, 2, true);
        },
        calcProfit() {  //计算盈利额
            let profit = 0;
            console.log(this.accessNum);
            if(Number(this.walletBalance) > 0) {
                profit = Number(this.walletBalance) - Number(this.accessNum);
            }
            return keepDecimalNotRounding(profit, 8, true);
        },
        calcAllProfit() {  //计算总的盈利额
            let profit = 0;
            if(Number(this.totalBalance) > 0) {
                profit = Number(this.totalBalance) - Number(this.allAccessNum);
            }
            console.log(this.totalBalance, this.allAccessNum);
            return keepDecimalNotRounding(profit, 8, true);
        },
        shangZhuangClick() {
            this.depositForm.amount = '';
            this.withdrawForm.amount = '';
            this.shangZhuangDialog = true;
        },
        xiaZhuangClick() {
            this.depositForm.amount = '';
            this.withdrawForm.amount = '';
            this.xiaZhuangDialog = true;
        },
        checkDepositAmount(value) { //充值输入框验证
            console.log(value);
            if (!value) {
                return false;
            }
            let num = this.transactionCurrencyBalance;
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
            // let num = this.maxWithdrawableBalance();
            if(Number(value) > this.platformBalance) {
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
                this.getBalanceInfo();
            } else { //页面切换离开
                if (this.balanceTimeInterval) {
                    clearInterval(this.balanceTimeInterval);
                    this.balanceTimeInterval = null;
                }
            }
        },
        async refreshData() {
            // this.walletBalance = await getGameFillingBalance(); //获取余额
            this.timeBankerInterval = setInterval(async() => {
                if(this.listTabsActive == 1) {
                    let dealerBalance = await getUserGlsBalance();
                    this.walletBalance = dealerBalance.user_balance;

                    // this.transactionCurrencyBalance = await getBalance(TOKEN[this.chainName][this.transactionCurrency], 18); //获取LUSD余额
                    await this.getGlsBalanceProportion();
                    await this.getBalanceInfo();
                } else if(this.listTabsActive == 2) {
                    await this.getAllListData(); //刷新列表
                } else if(this.listTabsActive == 3) {
                    await this.getMyListData();
                }
                // console.log(this.walletBalance);
            }, this.refreshBankerTime)
        },
        maxWithdrawableBalance() {
            let num = Number(this.walletBalance) + Number(this.localBalance);
            return num;
        },
        async handleClicks(tab, event) {
            console.log(tab);
            if(tab.name == 1) { 
                this.myCurrPage = 1;
                this.loading = true;
                await this.getGlsBalanceProportion();
            } else if(tab.name == 2){
                this.allCurrPage = 1;
                this.loading = true;
                await this.getAllListData();
            } else {
                this.loading = true;
                await this.getMyListData();
            }
        },
        // async getIsApprove() { //获取余额 查看是否授权
        //     let balance = await this.getLusdBalance(); //获取余额
        //     if(this.versionName == 'chain') {
        //         isApproved(TOKEN[this.chainName][this.transactionCurrency], 18, balance, this.gamesFillingAddress).then((bool) => {
        //             console.log("isApprove", bool);
        //             this.approve = bool ? true : false;
        //         });
        //     }
        // },
        // async getLusdBalance() {  //获取余额
        //     let balance = await getBalance(TOKEN[this.chainName][this.transactionCurrency], 18);
        //     console.log(this.transactionCurrency + " balance", balance);
        //     this.tokenBalance = keepDecimalNotRounding(balance, 4, true);
        //     return balance;
        // },
        startApprove() { //批准LUSD
            const loading = this.$loading({
            lock: true,
            text: 'transaction in progress',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
            });
        this.trading = true;
        approve(TOKEN[this.chainName][this.transactionCurrency], this.gamesFillingAddress).then((hash) => {
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
        allBlanceFun() { //全部余额
            if(this.localBalance > 0 || this.walletBalance > 0) {
                this.withdrawForm.amount = Number(this.localBalance) + Number(this.walletBalance);
                return true;
            }
            return false;
        },
        allWalletBlanceFun() { //全部钱包余额
            if(this.transactionCurrencyBalance > 0) {
                this.depositForm.amount = Math.trunc(this.transactionCurrencyBalance);
                return true;
            }
            return false;
        },
        async getBalanceInfo() {
            let dealerBalance = await getUserGlsBalance();
            this.walletBalance = dealerBalance.user_balance; //我的总余额
            this.totalBalance = dealerBalance.total_balance; //GLS总余额
            this.totalDividends = dealerBalance.total_dividends; //GLS总分红
            this.userDividends = dealerBalance.user_dividends; //GLS用户分红
            this.platformBalance = await getUserPlatformBalance();
            this.$emit('childUpdateBalance');
        },
        buttonAmount(value, type) { //选中按钮选择数量
            if(value) {
                if(type == 1) {//上庄
                    this.depositForm.amount = value;
                } else {
                    this.withdrawForm.amount = value;
                }
            }
        },
        onClickSave() { //编辑资料
            this.$router.go(-1);
        },
        addressStr(address){
            // console.log(address);
            let addressstrnt = address || this.address;
            return addressstrnt.substring(0, 4) + "***" + addressstrnt.substring(addressstrnt.length - 3)
            // console.log(this.address);
        },
        WalletBalanceAll() { //点击钱包余额
            console.log(222);
            this.depositForm.amount = keepDecimalNotRounding(this.transactionCurrencyBalance, 4, true);
        },
        PlatformBalanceAll() { //点击平台余额
            this.withdrawForm.amount = keepDecimalNotRounding(Number(this.localBalance) + Number(this.walletBalance), 0, true);
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
        .dealer-box {
            margin: 0 auto;
            padding: 15px 5px;
            align-items: center;
            background-color: rgb(34, 45, 52);
            border: 2px solid #454848;
            // border-radius: 10px;
            margin-top: 10px;
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
        .el-dialog {
            background: #1e272a;
            .el-dialog__header {
                text-align: center;
                .el-dialog__title {
                    color: #fff;
                }
            }
        }
        .proportion {
            width: 210px;
            text-align: left;
            font-size: 10px;
            .name {
                // position: relative;
                // display: block;
                // float: left;
                // // width: 120px;
                // text-align: right;
            }
            .amount {
                // text-align: left;
                // // width: 100px;
                // display: block;
                // float: left;
                // position: relative;
            }
        }
        .zhuang {
            // background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%), linear-gradient(230.47deg, rgb(30, 69, 137) -47%, rgb(93, 69, 179) 48.82%, rgb(130, 1, 112) 131.59%);
            // border-radius: 20px !important;
            // background-color: #fff !important;
            // width: 80%;
            // height: 100vh;
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
                background-color: #21313b;
                color: #fff;
                border: 0;
                // background-color: #333257;
                // color: #fff;
                // border: 1px solid #333257;
                padding: 10px;
                height: 50px;
                line-height: 50px;
                font-size: 16px;
            }
            .el-input-group__prepend {
                background-color: #21313b;
                color: #fff !important;
                // border: 1px solid #DCDFE6 !important;
            }
            .el-input-group__append button.el-button {
                color: #fff;
            }
            .el-input-group__append, .el-input-group__prepend {
                background-color: #21313b;
                color: #fff;
                border: 0;
                padding: 0 15px;
            }
            .balance {
                // padding: 20px;
                text-align: left;
                height: 30px;
                line-height: 30px;
                color: #fff;
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
                    background: #141a1f;
                    color: #fff;
                }
                .el-button {
                    border-radius: 5px;
                }
                .el-button::after {
                    background-color: #e09320 !important;
                }
                .el-button:focus,.el-button:hover {
                    background-color: #e09320 !important;
                    color: #fff;
                }
            }
            .submit-name {
                margin-top: 30px;
                .el-button--primary {
                    width: 200px;
                    height: 50px;
                    border-radius: 50px;
                    background-color: #141a1f;
                    border: 0;
                }
                .el-button--primary:hover {
                    background-color: #21313b;
                }
                .el-button--primary.is-disabled {
                    background: #c8c9cc;
                    color: #fff;
                }
                .el-loading-mask {
                    border-radius: 5px;
                    background-color: rgba(0,0,0,0.8);
                    border: 0;
                }
            }
        }
        .roll-button {
            // margin-bottom: 20px;
            // width: 100px;
            // display: grid;
            // padding: 15px;
            color: rgb(255, 255, 255);
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            border: none;
            border-radius: 0.8rem;
            background-color: #e09320;
            background-repeat: no-repeat;
            transition: opacity 0.2s linear 0s;
        }
        // .roll-button:hover {
        //     background-color: #21313b;
        // }
        .wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
        .list-tabs {
            // width: 80%;
            margin: 0 auto;
            .el-tabs__nav {
                // border: 0;
            }
            .el-tabs__active-bar {
                // width: 33.33% !important;
                background-color: #e09320 !important;
            }
            .el-tabs__content {
                margin-top: -15px;
            }
            .el-tabs__item {
                color: #fff !important;
                border: 0;
                height: 50px;
                line-height: 50px;
            }
            .el-tabs__item.is-active {  
                color: #e09320 !important;  
                background-color: transparent !important;
                border-bottom-color: #e09320 !important; 
            } 
            .el-tabs__nav-scroll{
                // width:30%;
                margin:0 auto
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
                .el-loading-mask {
                    border-radius: 5px;
                    background-color: rgba(0,0,0,0.8);
                    border: 0;
                }
            }
            .pages {
                margin-top: 20px;
                .el-pagination__total {
                    color: #fff;
                }
                .el-pagination__jump {
                    color: #fff;
                }
                .el-input__inner {
                    background-color: #21313b;
                    color: #fff;
                }
                .el-pagination button:disabled {
                    background-color: #21313b;
                }
                .el-pager li {
                    background: #21313b;
                }
                .el-pager li.active {
                    color: #fff;
                }
            }
        }
        // .el-select-dropdown {
        //     background-color: #21313b;
        // }
    }
}
</style>
