<template>
    <div class="container">
        <div class="commin-title">
            <div class="title-inner">
                <span class="tit">{{ $t('pools:pledgeObtainIncome') }}</span>
                <!-- <div :class="[ 'btn' ]" @click="buyHashpower()">{{ $t('subscribe:BuyBTCS19Pro') }}</div> -->
            </div>
        </div>
        <div v-if="!isMobel">
            <el-table
                stripe
                v-loading="loading"
                :data="poolsList">
                <!-- 池子 -->
                <el-table-column
                    prop="name"
                    :label="$t('pools:pool')"
                    align="center"
                    width="">
                    <template slot-scope="scope">
                        <!-- <img src="@/assets/usdt.png" alt="" width="20" style="vertical-align: middle;margin-top:-5px;"> -->
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <!-- 年化利率 -->
                <el-table-column
                    :label="$t('pools:APR')"
                    align="center">
                    <template slot-scope="scope">
                        <span>{{ toFixed(scope.row.yearPer || 0, 2) }}%</span>
                    </template>
                </el-table-column>
                <!-- TVL 锁仓量 -->
                <el-table-column
                    :label="$t('pools:TVL')"
                    align="center"
                    width="">
                    <template slot-scope="scope">
                        <span>{{ toFixed(scope.row.total, 4) || "--" }}</span><br>
                    </template>
                </el-table-column>
                <!-- 存款 -->
                <el-table-column
                    :label="$t('pools:Deposited')"
                    align="center"
                    width="">
                    <template slot-scope="scope">
                        <span>{{ toFixed(Number(scope.row.total_invest), 4) }}</span>
                        <!-- <span>${{ toFixed(Number(scope.row.balance * scope.row.tokenPrice), 2) }}</span> -->
                    </template>
                </el-table-column>
                <!-- 奖励 -->
                <el-table-column
                    :label="$t('pools:Reward')"
                    align="center"
                    width="">
                    <template slot-scope="scope">
                        <span>{{ toFixed(Number(scope.row.total_income), 4) }} LUSD</span>
                    </template>
                </el-table-column>
                <!-- 操作 -->
                <el-table-column
                    fixed="right"
                    :label="$t('pools:Action')"
                    align="center"
                    width="200">
                    <template slot-scope="scope">
                        <div>
                            <!-- <el-button class="action-btn" size="mini" round @click="receiveBTCBReward(scope.row)" :loading="receiveLoading" :disabled="!Number(scope.row.btcbReward)">{{ $t('game:Harvest') }}</el-button> -->
                            <el-button class="action-btn" size="mini" round @click="toPoolsDetail(1, scope.row)">{{ $t('game:Deposit2') }}</el-button>
                            <el-button class="action-btn" size="mini" round @click="toPoolsDetail(2, scope.row)" >{{ $t('game:Withdraw2') }}</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-else>
            <div v-if="poolsList.length">
                <el-descriptions :colon="false" :border="false" :column="1" title="" v-for="(item, index) in poolsList" :key="index">
                    <el-descriptions-item :label="$t('pools:pool')">{{ item.name }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('pools:APR')">{{ toFixed(item.yearPer || 0, 2) }}%</el-descriptions-item>
                    <!-- <el-descriptions-item label="总份数">{{ toFixed(item.total_size || 0, 4) }}</el-descriptions-item> -->
                    <el-descriptions-item :label="$t('pools:TVL')">{{ toFixed(item.total, 4) || "--" }}</el-descriptions-item>
                    <el-descriptions-item :label="$t('pools:Deposited')">
                        <span>{{ toFixed(Number(item.balance), 4) }}</span>
                        <!-- <span>${{ toFixed(Number(item.balance * item.tokenPrice), 2) }}</span> -->
                    </el-descriptions-item>
                    <el-descriptions-item :label="$t('pools:Reward')">
                        <el-link type="primary" @click="getHashpowerDetail(item.id)">
                            {{ toFixed(item.reward || 0, 4) }} LUSD <br>
                        </el-link>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <div style="text-align:center;">
                            <!-- <el-button size="mini" type="primary" @click="receiveBTCBReward(item)" :loading="receiveLoading" :disabled="!Number(item.btcbReward)">{{ $t('game:Harvest') }}</el-button> -->
                            <el-button size="mini" type="primary" @click="toPoolsDetail(1, item)">{{ $t('game:Deposit2') }}</el-button>
                            <el-button size="mini" type="primary" @click="toPoolsDetail(2, item)">{{ $t('game:Withdraw2') }}</el-button>
                        </div>
                    </el-descriptions-item>
                </el-descriptions>
            </div>
            <div v-else>
                <el-empty :description="$t('public:nothing')"></el-empty>
            </div>
        </div>
    </div>
</template>
<script>
import Page from "@/components/Page.vue";
import { get, post } from "@/common/axios.js";
import { mapGetters, mapState } from "vuex";
import { getPoolBtcData, setStatiscData } from "@/wallet/serve";
import { keepDecimalNotRounding, fromSATBTCNum } from "@/utils/tools";
import { depositPoolsIn } from "@/wallet/trade";
export default {
    name: '',
    data() {
        return {
            activeName: '1',
            timeInterval: null,
            refreshTime: 10000, //数据刷新间隔时间
            limit: 20,
            currPage: 1, //当前页
            pageSize: 20, //每页显示条数
            total: 100, //总条数
            PageSearchWhere: [], //分页搜索数组
            loading: false,
            receiveLoading: false,
            poolsList: [],
        }
    },
    activated() { //页面进来
        this.refreshData();
    },
    mounted() {
        setTimeout(()=>{
            
        } , 300)
    },
    beforeRouteLeave(to, from, next){ //页面离开
        next();
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
            this.timeInterval = null;
        }
    },
    computed: {
        ...mapState({
            address:state=>state.base.address,
            userId:state=>state.base.userId,
            isConnected:state=>state.base.isConnected,
            isMobel:state=>state.comps.isMobel,
            mainTheme:state=>state.comps.mainTheme,
            apiUrl:state=>state.base.apiUrl,
        }),

    },
    created() {
        try {
            
        } catch (err) {}
    },
    watch: {
        isConnected: {
            immediate: true,
            handler(val) {
                if (val) {
                    // this.refreshData();
                    if(val) {
                        setTimeout(async() => {

                        }, 300);
                    }
                }
            },
        },
        userId: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.getProductList();
                }
            },
        },
    },
    components: {
        "wbc-page": Page, //加载分页组件
    },
    methods: {
        async getProductList(ServerWhere) { //获取产品列表
            if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
                ServerWhere = {
                    limit: this.pageSize,
                    page: this.currPage,
                    userId: this.userId,
                };
            }
            if(this.userId) {
                axios.get(this.apiUrl + "/Api/Product/getProductList", {
                    params: ServerWhere
                }).then((json) => {
                    this.loading = false;
                    console.log(json);
                    // console.log(this.address);
                    if (json.code == 10000) {
                        if(json.data && json.data.lists) {
                            if(this.currPage <= 1) {
                                this.poolsList = json.data.lists;
                            } else {
                                if(ServerWhere.page <= json.data.allpage) {
                                    // console.log(ServerWhere.page, json.data.allpage);
                                    this.poolsList.push(json.data.lists);
                                }
                            }
                        }
                        if(ServerWhere.page >= json.data.allpage) {
                            this.finished = true;
                        }
                        this.total = json.data.count;
                        this.currPage += 1;
                        console.log(this.poolsList);
                    } else {
                        this.$notify({ type: 'warning', message: 'Error' });
                    }
                }).catch((error) => {
                    this.$notify({ type: 'warning', message: error });
                });
            }
            this.loading = false;
        },
        refreshData() { //定时刷新数据
            this.timeInterval = setInterval(async () => {
                this.getProductList();
            }, this.refreshTime)
        },
        limitPaging(limit) {
            //赋值当前条数
            this.pageSize = limit;
            this.getProductList();
        },
        skipPaging(page) {
            //赋值当前页数
            this.currPage = page;
            this.getProductList();
        },
        toPoolsDetail(type, row) {
            row.type = type;
            this.$router.push({
                name:'PoolsDetailSpeed',
                params: row
            })
        },
        async receiveBTCBReward(item) { //收获BTCB
            console.log("item", item)
            // if (!Number(item.btcbReward)) return;
            this.$store.commit("sethashPowerPoolsListClaimLoading", {
                goblin: item.goblin,
                val: true,
            });
            this.receiveLoading = true;

            depositPoolsIn(
                item.goblin,
                item.decimals,
                0,
                item.pId
            ).then(async(hash) => {
                let setHarvest = await this.setHashpowerHarvest(item.id, item.btcbReward, item.currency, hash);
                if(setHarvest) {
                    this.$message({
                        type: 'success',
                        message: 'Success!'
                    });
                    this.$store.dispatch("getHashPowerPoolsList");
                    this.receiveLoading = false;
                }
            }).finally(() => {
                this.$store.commit("sethashPowerPoolsListClaimLoading", {
                    goblin: item.goblin,
                    val: false,
                });
                this.receiveLoading = false;
            });
        },
    },
}
</script>
<style lang="scss" scoped>
    .container {
        /deep/ {
            height: 70vh;
            width: 95%;
            margin: 0 auto;
            border: 0;
            background-color: transparent;
            padding-top: 20px;
            padding-bottom: 50px;
            .commin-title {
                margin-bottom: 10px;
                .btn {
                    display: inline-block;
                    padding: 0 17px;
                    height: 30px;
                    background: linear-gradient(90deg, #0096FF, #0024FF);
                    color: #fff;
                    border-style: solid;
                    border-width: 1px;
                    border-radius: 15px;
                    line-height: 28px;
                    vertical-align: middle;
                    margin-left: 8px;
                    cursor: pointer;
                    position: relative;
                    box-sizing: border-box;
                }
                .tit {
                    padding-right: 14px;
                    display: inline-block;
                    font-weight: 800;
                    font-size: 13px;        
                }
            }
            .el-table {
                // border-radius: 20px;
                font-size: 10px;
                background-color: transparent !important;
                // .cell {
                //     padding-left: unset;
                //     .el-button--mini.is-round {
                //         padding: 4px 15px;
                //     }
                //     button {
                //         color: #409EFF;
                //         border-color: #409EFF;
                //     }
                //     button.is-disabled {
                //         color: #C0C4CC;
                //         border-color: #EBEEF5;
                //     }
                //     .el-link {
                //         font-size: 10px;
                //     }
                // }
                tr {
                    background-color: transparent !important;
                    color: #fff;
                    font-size: 10px;
                }
                .el-table__cell {
                    background-color: transparent !important;
                }
            }
            .el-table::before {
                height: 0;
            }
            .el-table__fixed-right::before, .el-table__fixed::before {
                height: 0 !important;
            }
            .action-btn {
                color: rgb(255, 255, 255);
                font-size: 10px;
                padding: 10px 18px;
                font-weight: 600;
                text-transform: uppercase;
                border: none;
                border-radius: 20px;
                background-color: #141a1f;
            }
            .action-btn:hover {
                background-color: #21313b;
            }
            .action-btn.is-disabled {
                color: #999;
                background-color: #21313b;
            }
            .el-descriptions {
                margin-bottom: 20px;
                .el-descriptions__body {
                    background-color: transparent !important;
                    border: 2px solid #454848;
                    padding: 20px;
                    border-radius: 20px;
                    color: #fff;
                    .el-descriptions-item__container {
                        .el-descriptions-item__content {
                            display: unset;
                            text-align: right;
                            button {
                                // width: 100px;
                            }
                        }
                    }
                }
            }
            .info {
                .title {
                    font-weight: 800;
                }
            }
            .el-dialog__body {
                padding-top: 0;
                .el-table .el-table__cell {
                    padding: 10px 0;
                }
            }
        }
    }
</style>
