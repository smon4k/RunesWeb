<template>
    <div class="container">
        <div class="content">
            <el-row class="illustrate">
                <el-col :span="24" v-if="screenWidth > adaptiveSize">
                    <img :src="require('@/assets/svg/logo.svg')" alt="" width="148">
                    <div class="illustrate-right">
                        <div class="title">
                            <div class="name">CFXs</div>
                            <div class="log">
                                <a target="_blank" href="https://twitter.com/conflux_cfxs"><img :src="require('@/assets/svg/twitter.svg')" alt="" width="32"></a>
                                <a target="_blank" href="https://t.me/ConfluxWeb3China"><img :src="require('@/assets/svg/telegram.svg')" alt="" width="32"></a>
                            </div>
                        </div>
                        <div class="desc">CFXs is not just a Rune. It is a new paradigm of decentralized BTC consensus, integrating the advantages of both UTXO and account models.</div>
                        <div class="total-supply">
                            <div class="progress">
                                <el-progress :percentage="50" :show-text="false" color="#ad8d65"></el-progress>
                            </div>
                            <div class="number">Total Supply:<span style="color: #fff;">12,304,407 (58.59%)</span></div>
                        </div>
                    </div>
                </el-col>
                <el-col :span="24" v-else style="display: block;">
                    <div style="display: flex;">
                        <img :src="require('@/assets/svg/logo.svg')" alt="" width="80.27">
                        <div class="illustrate-right">
                            <div class="title">
                                <div class="name">CFXs</div>
                                <div class="log">
                                    <a target="_blank" href="https://twitter.com/conflux_cfxs"><img :src="require('@/assets/svg/twitter.svg')" alt="" width="32"></a>
                                    <a target="_blank" href="https://t.me/ConfluxWeb3China"><img :src="require('@/assets/svg/telegram.svg')" alt="" width="32"></a>
                                </div>
                            </div>
                            <div class="total-supply">
                                <div class="progress">
                                    <el-progress :percentage="50" :show-text="false" color="#ad8d65"></el-progress>
                                </div>
                                <div class="number">Total Supply:<span style="color: #fff;">12,304,407 (58.59%)</span></div>
                            </div>
                        </div>
                    </div>
                    <div class="desc" style="font-size: 12px;">CFXs is not just a Rune. It is a new paradigm of decentralized BTC consensus, integrating the advantages of both UTXO and account models.</div>
                </el-col>
              </el-row>

              <div class="datastatistics">
                <el-row :gutter="screenWidth > adaptiveSize ? 24 : 10">
                    <el-col :xs="8" :sm="4" :md="3">
                        <div class="content">
                            <div class="name">Floor</div>
                            <div class="price">${{ statisticsData.floor }}</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="3">
                        <div class="content">
                            <div class="name">Unit Price</div>
                            <div class="price">${{ statisticsData.unit_price }}</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="3">
                        <div class="content">
                            <div class="name">24h Volume</div>
                            <div class="price">${{ toFixed(statisticsData['24h_volume'], 4) }}</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="3">
                        <div class="content">
                            <div class="name">24h Sales</div>
                            <div class="price">{{ statisticsData['24h_sales'] }}</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="3">
                        <div class="content">
                            <div class="name">Total Volume</div>
                            <div class="price">{{ toFixed(statisticsData.total_volume, 4) }}</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="3">
                        <div class="content">
                            <div class="name">Total Sales</div>
                            <div class="price">{{ statisticsData.total_sales }}</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="2">
                        <div class="content">
                            <div class="name">Owners</div>
                            <div class="price">{{ statisticsData.owners }}</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="2">
                        <div class="content">
                            <div class="name">Listed</div>
                            <div class="price">{{ statisticsData.listed }}</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="2">
                        <div class="content">
                            <div class="name">Market Cap</div>
                            <div class="price">{{ statisticsData.market_cap }}</div>
                        </div>
                    </el-col>
                </el-row>
              </div>

              <div class="list">
                <el-tabs v-model="regmarket" @tab-click="handleClickData">
                    <el-form :inline="true" :model="formSearch" :class="{ 'justify-content-between': screenWidth <= adaptiveSize }">
                        <span v-if="screenWidth > adaptiveSize">
                            <el-select class="select-currency" v-model="buyCurrency" placeholder="Select Currenty" style="width: 180px;" @change="buyCurrencyChange">
                                <div slot="prefix" class="currency-img">
                                    <img v-if="buyCurrency === '1'" :src="require('@/assets/svg/cfxs-black.svg')" alt="" width="20">
                                    <img v-if="buyCurrency === '2'" :src="require('@/assets/usdt.png')" alt="" width="20">
                                </div>
                                <el-option label="CFX" value="1">
                                    <img :src="require('@/assets/svg/cfxs-black.svg')" alt="" width="18">
                                    <span style="margin-left: 5px;">CFX</span>
                                </el-option>
                                <el-option label="USDT" value="2">
                                    <img :src="require('@/assets/usdt.png')" alt="" width="18">
                                    <span style="margin-left: 5px;">USDT</span>
                                </el-option>
                            </el-select>
                            <el-form-item label="">
                                <el-select v-model="formSearch.searchName" placeholder="Please select">
                                    <el-option label="Price low to high" value="1">
                                        <img :src="require('@/assets/svg/price-high-low.svg')" alt="" width="20">
                                        <span style="margin-left: 5px;">Price low to high</span>
                                    </el-option>
                                    <el-option label="Price high to low" value="2">
                                        <img :src="require('@/assets/svg/price-high-low.svg')" alt="" width="20">
                                        <span style="margin-left: 5px;">Price high to low</span>
                                    </el-option>
                                    <el-option label="Recently listed" value="3">
                                        <img :src="require('@/assets/svg/price-high-low.svg')" alt="" width="20">
                                        <span style="margin-left: 5px;">Recently listed</span>
                                    </el-option>
                                    <el-option label="Ending soon" value="4">
                                        <img :src="require('@/assets/svg/price-high-low.svg')" alt="" width="20">
                                        <span style="margin-left: 5px;">Ending soon</span>
                                    </el-option>
                                    <el-option label="Only merged" value="5">
                                        <img :src="require('@/assets/svg/price-high-low.svg')" alt="" width="20">
                                        <span style="margin-left: 5px;">Only merged</span>
                                    </el-option>
                                    <el-option label="Only fragments" value="6">
                                        <img :src="require('@/assets/svg/price-high-low.svg')" alt="" width="20">
                                        <span style="margin-left: 5px;">Only fragments</span>
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="">
                                <el-input v-model="formSearch.minPrice" type="number" placeholder="Min Price"></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <el-input v-model="formSearch.maxPrice" type="number" placeholder="Max Price"></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <el-input v-model="formSearch.idAddress" placeholder="ID or owner address"></el-input>
                            </el-form-item>
                        </span>
                        <span v-else>
                            <el-select class="select-currency" v-model="buyCurrency" placeholder="Select Currenty" style="width: 180px;" @change="buyCurrencyChange">
                                <div slot="prefix" class="currency-img">
                                    <img v-if="buyCurrency === '1'" :src="require('@/assets/svg/cfxs-black.svg')" alt="" width="20">
                                    <img v-if="buyCurrency === '2'" :src="require('@/assets/usdt.png')" alt="" width="20">
                                </div>
                                <el-option label="CFX" value="1">
                                    <img :src="require('@/assets/svg/cfxs-black.svg')" alt="" width="18">
                                    <span style="margin-left: 5px;">CFX</span>
                                </el-option>
                                <el-option label="USDT" value="2">
                                    <img :src="require('@/assets/usdt.png')" alt="" width="18">
                                    <span style="margin-left: 5px;">USDT</span>
                                </el-option>
                            </el-select>
                        </span>
                        <span v-if="screenWidth <= adaptiveSize" @click="searchDialogClick"><img :src="require('@/assets/svg/search.svg')" alt="" width="42"></span>
                        <el-form-item v-if="screenWidth > adaptiveSize">
                            <el-button class="search-button" type="primary" @click="onApplySearch">Apply</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="count-number">
                        <div class="listings">
                            <span><img :src="require('@/assets/svg/listings.svg')" alt="" width="24"></span>
                            <span>Listings</span>
                        </div>
                        <div class="text-numcer">
                            <span class="text-secondary">
                                <span>Result: {{ dataList.length }}</span>
                            </span>
                            <span class="refresh" @click="refreshDataClick">
                                <img :src="require('@/assets/svg/refresh.svg')" alt="" width="48">
                            </span>
                        </div>
                    </div>
                    <el-tab-pane label="General" name="0">
                        <Card :dataList="dataList" @buyNowClick="buyNowClick" :highlightedIndices="highlightedIndices" :isNoMoreData="isNoMoreData" @toggleHighlight="toggleHighlight" @onLoadMoreData="onLoadMoreData" :loading="loading"></Card>
                    </el-tab-pane>
                    <el-tab-pane label="Images" name="1">
                        <Card :dataList="dataList" @buyNowClick="buyNowClick" :highlightedIndices="highlightedIndices" :isNoMoreData="isNoMoreData" @toggleHighlight="toggleHighlight" @onLoadMoreData="onLoadMoreData" :loading="loading"></Card>
                    </el-tab-pane>
                    <el-tab-pane label="Audio" name="2">
                        <Card :dataList="dataList" @buyNowClick="buyNowClick" :highlightedIndices="highlightedIndices" :isNoMoreData="isNoMoreData" @toggleHighlight="toggleHighlight" @onLoadMoreData="onLoadMoreData" :loading="loading"></Card>
                    </el-tab-pane>
                    <el-tab-pane label="Text" name="3">
                        <Card :dataList="dataList" @buyNowClick="buyNowClick" :highlightedIndices="highlightedIndices" :isNoMoreData="isNoMoreData" @toggleHighlight="toggleHighlight" @onLoadMoreData="onLoadMoreData" :loading="loading"></Card>
                    </el-tab-pane>
                    <el-tab-pane label="Inscription" name="4">
                        <Card :dataList="dataList" @buyNowClick="buyNowClick" :highlightedIndices="highlightedIndices" :isNoMoreData="isNoMoreData" @toggleHighlight="toggleHighlight" @onLoadMoreData="onLoadMoreData" :loading="loading"></Card>
                    </el-tab-pane>
                    <el-tab-pane label="Name" name="5">
                        <Card :dataList="dataList" @buyNowClick="buyNowClick" :highlightedIndices="highlightedIndices" :isNoMoreData="isNoMoreData" @toggleHighlight="toggleHighlight" @onLoadMoreData="onLoadMoreData" :loading="loading"></Card>
                    </el-tab-pane>
                  </el-tabs>
              </div>
              
              <div class="select-card">
                <div class="select-content" v-if="screenWidth > adaptiveSize">
                    <div class="left">
                        <div class="item-num">{{ highlightedIndices.length }} item</div>
                        <div class="select-all">
                            <el-checkbox v-model="checked" @change="selectAllChange">Select All</el-checkbox>
                        </div>
                        <div class="clear" @click="clearSelectAll()">Clear</div>
                    </div>
                    <div class="right">
                        <div class="total">Total: <font color="#ad8d65">{{ toFixed(calcTotalNumber.totalUSDT, 4) }} {{ calcCurrencyName }}</font></div>
                        <div class="sweep-button">
                            <el-button :class="{ 'batch-listing': highlightedIndices.length > 0 }" class="search-button" type="primary" @click="sweepClick" :disabled="highlightedIndices.length <= 0">SWEEP</el-button>
                        </div>
                    </div>
                </div>
                <div class="select-content mobile" v-else>
                    <div class="left">
                        <div class="select-all">
                            <el-checkbox v-model="checked" @change="selectAllChange">Select All</el-checkbox>
                            <div class="item-num">{{ calcTotalNumber.totalSlots }} item</div>
                        </div>
                        <div class="total">Total: <font color="#ad8d65">{{ toFixed(calcTotalNumber.totalUSDT, 4) }} {{ calcCurrencyName }}</font></div>
                    </div>
                    <div class="right">
                        <div class="sweep-button">
                            <el-button :class="{ 'batch-listing': highlightedIndices.length > 0 }" class="search-button" type="primary" @click="sweepClick" :disabled="highlightedIndices.length <= 0">SWEEP</el-button>
                        </div>
                    </div>
                </div>
              </div>

            <el-dialog
                :title="!approve ? 'Approve Purchase' : 'Purchase'"
                :visible.sync="buyNowDialogShow"
                :width="screenWidth > adaptiveSize ? '35%' : '90%'"
                :before-close="buyNowDialogClose"
                class="buy-now-dialog"
                top="30vh">
                <div class="dialog-content">
                    <div class="you-wall-pay">
                        <span class="title">You will pay</span>
                        <span class="value">{{ buyNowData.youWillPay }} {{ calcCurrencyName }}</span>
                    </div>
                    <div class="for">
                        <span class="title">For</span>
                        <span class="value">{{ buyNowData.slots }} <span class="title">Slots</span> {{ buyNowData.cfxs }} <span class="title">CFXs</span></span>
                    </div>
                    <div class="button-dialog">
                        <span class="text" v-if="!approve">You will be asked to approve this purchase from your wallet.</span>
                        <el-button type="primary" @click="startApprove" v-if="!approve && buyCurrency === '2'" :loading="trading">APPROVE</el-button>
                        <el-button type="primary" v-else :loading="trading" @click="buyNowContract">Buy</el-button>
                        <span class="balance" v-if="buyCurrency === '1'">Balance: {{ toFixed(cfxBalance || 0, 4) }} {{ calcCurrencyName }}</span>
                        <span class="balance" v-if="buyCurrency === '2'">Balance: {{ toFixed(usdtBalance || 0, 4) }} {{ calcCurrencyName }}</span>
                    </div>
                </div>
            </el-dialog>

            <el-dialog
                title="Fiter"
                :visible.sync="searchDialogShow"
                width="90%"
                :before-close="searchDialogClose"
                class="fiter-dialog"
                top="20vh">
                <div class="dialog-content">
                    <el-form :inline="true" :model="formSearch" :class="{ 'justify-content-between': screenWidth <= adaptiveSize }">
                        <el-form-item label="">
                            <el-input v-model="formSearch.idAddress" placeholder="ID or owner address"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-select v-model="formSearch.searchName" placeholder="Please select">
                                <el-option label="Price low to high" value="1">
                                    <span style="margin-left: 5px;">Price low to high</span>
                                </el-option>
                                <el-option label="Price high to low" value="2">
                                    <img :src="require('@/assets/svg/price-high-low.svg')" alt="" width="20">
                                    <span style="margin-left: 5px;">Price high to low</span>
                                </el-option>
                                <el-option label="Recently listed" value="3">
                                    <img :src="require('@/assets/svg/price-high-low.svg')" alt="" width="20">
                                    <span style="margin-left: 5px;">Recently listed</span>
                                </el-option>
                                <el-option label="Ending soon" value="4">
                                    <img :src="require('@/assets/svg/price-high-low.svg')" alt="" width="20">
                                    <span style="margin-left: 5px;">Ending soon</span>
                                </el-option>
                                <el-option label="Only merged" value="5">
                                    <img :src="require('@/assets/svg/price-high-low.svg')" alt="" width="20">
                                    <span style="margin-left: 5px;">Only merged</span>
                                </el-option>
                                <el-option label="Only fragments" value="6">
                                    <img :src="require('@/assets/svg/price-high-low.svg')" alt="" width="20">
                                    <span style="margin-left: 5px;">Only fragments</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input v-model="formSearch.minPrice" type="number" placeholder="Min Price"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input v-model="formSearch.maxPrice" type="number" placeholder="Max Price"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="button-dialog">
                    <el-button class="cancel-button" type="primary" @click="searchDialogShow = false">Cancel</el-button>
                    <el-button class="apply-button" type="primary" @click="onApplyFiter">Apply</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { get, post } from "@/common/axios.js";
import { mapGetters, mapState } from "vuex";
import { toWei, fromWei, keepDecimalNotRounding } from '@/utils/tools'
import { approve, unlockingScriptbatch } from "@/wallet/trade";
import { getBalance, isApproved } from "@/wallet/serve";
import Address from '@/wallet/address.json'
import CardBox from './card.vue';
export default {
    name: '',
    data() {
        return {
            screenWidth: document.body.clientWidth,
            usdtBalance: 0,
            cfxBalance: 0,
            regmarket: '0',
            trading: false,
            loading: false,
            approve: false,
            formSearch: {
                searchName: '',
                minPrice: '',
                maxPrice: '',
                idAddress: '',
            },
            timeInterval: null,
            refreshTime: 10000, //数据刷新间隔时间
            currPage: 1, //当前页
            pageSize: 18, //每页显示条数
            total: 100, //总条数
            isNoMoreData: false,
            PageSearchWhere: [], //分页搜索数组
            dataList: [],
            checked: false,
            highlightedIndices: [],
            buyNowDialogShow: false,
            buyNowData: {
                youWillPay: 0,
                slots: 0,
                cfxs: 0,
            },
            searchDialogShow: false,
            statisticsData: {},
            buyCurrency: '1',
        }
    },
    mounted() {
        window.onresize = () => {
            this.screenWidth = document.body.clientWidth;
        }
    },
    computed: {
        ...mapState({
            address: state => state.base.address,
            isConnected: state => state.base.isConnected,
            isMobel: state => state.comps.isMobel,
            mainTheme: state => state.comps.mainTheme,
            adaptiveSize: state => state.comps.adaptiveSize,
            apiUrl: state => state.base.apiUrl,
            gamesFillingAddress: state => state.base.gamesFillingAddress,
        }),
        changeData() {
            const { address } = this
            return {
                address
            };
        },
        calcTotalNumber() {
            if (!this.dataList || !this.dataList.length) {
                return { totalUSDT: 0, totalSlots: 0, totalCfxs };
            } 
            let totalUSDT = 0;  
            let totalSlots = this.highlightedIndices.length;  
            let totalCfxs = 0;  
            let cfxsIds = [];
            let amounts = [];
            let isOneseAddress = false;
            this.dataList.forEach((item, index) => {
                if (this.highlightedIndices.includes(index)) {
                    totalUSDT += Number(item.amount);
                    totalCfxs += Number(item.quantity);
                    cfxsIds.push(item.chainid);
                    amounts.push(toWei(item.unitprice, 18));
                    if(item.chainto.toLowerCase() === this.address.toLowerCase()) {
                        isOneseAddress = true;
                    }
                }
            });
            return { totalUSDT, totalSlots, totalCfxs, cfxsIds, amounts, isOneseAddress };
        },
        calcCurrencyName() {
            if(this.buyCurrency === '1') {
                return 'CFX';
            } else {
                return 'USDT';
            }
        }
    },
    created() {
        try {
            this.getMarketplaceList();
            this.getStatisticsData();
        } catch (err) { }
    },
    watch: {
        isConnected: {
            immediate: true,
            async handler(val) {
                if (val) {
                    this.cfxBalance = await getBalance(Address.CFX, 18); //获取余额
                    this.usdtBalance = await getBalance(Address.USDT, 18); //获取余额
                }
            }
        },
        changeData: {
            immediate: true,
            async handler(val) {
                if (val.address) {
                }
            }
        },
    },
    components: {
        "Card": CardBox,
    },
    activated() { //页面进来
    },
    methods: {
        toggleHighlight(index) {
            const currentIndex = this.highlightedIndices.indexOf(index);
            if (currentIndex > -1) {
                // 如果索引已高亮，移除它
                this.highlightedIndices.splice(currentIndex, 1);
            } else {
                // 否则，添加这个索引到高亮数组
                this.highlightedIndices.push(index);
            }
        },
        selectAllChange(row) {
            console.log(row);
            if (!row) {
                // 如果所有项已高亮，点击全选按钮将取消所有高亮
                this.highlightedIndices = [];
            } else {
                // 否则，添加所有项的索引到 highlightedIndices
                this.highlightedIndices = this.dataList.map((_, index) => index);
            }
        },
        clearSelectAll() {
            this.highlightedIndices = [];
            this.checked = false;
        },
        handleClickData(row) {
            this.currPage = 1;
            this.dataList = [];
            this.getMarketplaceList();
        },
        onApplySearch() {
            let SearchWhere = {
                limit: this.pageSize,
                page: this.currPage,
                regmarket: this.regmarket,
                currency: this.buyCurrency === '1' ? 'CFX' : 'USDT',
            };
            this.dataList = [];
            if(this.formSearch.searchName == 1) {
                SearchWhere.price_sort = "asc";
            }
            if(this.formSearch.searchName == 2) {
                SearchWhere.price_sort = "desc";
            }
            if(this.formSearch.searchName == 3) {
                SearchWhere.time_sort = "desc";
            }
            if(this.formSearch.searchName == 4) {
                SearchWhere.locktime_sort = "desc";
            }
            if(this.formSearch.searchName == 5) {
                SearchWhere.merged = "1";
            }
            if(this.formSearch.searchName == 6) {
                SearchWhere.merged = "2";
            }
            if(this.formSearch.minPrice && this.formSearch.minPrice !== '') {
                SearchWhere.unit_price_start = this.formSearch.minPrice;
            }
            if(this.formSearch.maxPrice && this.formSearch.maxPrice !== '') {
                SearchWhere.unit_price_end = this.formSearch.maxPrice;
            }
            if(this.formSearch.idAddress && this.formSearch.idAddress !== '') {
                SearchWhere.id_address = this.formSearch.idAddress;
            }
            this.isNoMoreData = false;
            this.getMarketplaceList(SearchWhere);
        },
        sweepClick() { //批量购买
            const sweepData = this.calcTotalNumber;
            this.buyNowData = {
                youWillPay: sweepData.totalUSDT,
                slots: sweepData.totalSlots,
                cfxs: sweepData.totalCfxs,
                cfxsIds: sweepData.cfxsIds,
                amounts: sweepData.amounts,
            };
            this.approve = false;
            this.buyNowDialogShow = true;
        },
        buyNowClick(row) { //单个购买
            this.buyNowData = {
                youWillPay: row.amount,
                slots: 1,
                cfxs: row.quantity,
                cfxsIds: [
                    row.chainid
                ],
                amounts: [
                    toWei(row.unitprice, 18)
                ],
            };
            this.approve = false;
            this.buyNowDialogShow = true;
        },
        buyNowDialogClose() {
            this.buyNowDialogShow = false;
        },
        refreshDataClick() {
            this.isNoMoreData = false;
            this.currPage = 1;
            this.dataList = [];
            this.loading = true;
            setTimeout(() => {
                this.getMarketplaceList();
            }, 1000);
        },
        refreshData() { //定时刷新数据
            this.timeInterval = setInterval(async () => {
            }, this.refreshTime)
        },
        searchDialogClick() {
            this.searchDialogShow = true;
        },
        searchDialogClose() {
            this.searchDialogShow = false;
        },
        onApplyFiter() { //搜索

        },
        onLoadMoreData() {
            this.currPage += 1;
            this.getMarketplaceList();
        },
        getStatisticsData() { //获取产品日收益列表
            get(this.apiUrl + "/Api/Market/getStatisticsData", {}, async json => {
                console.log(json);
                if (json.code == 10000) {
                    this.statisticsData = json.data;
                } else {
                    this.$message.error("加载数据失败");
                }
            });
        },
        buyCurrencyChange(value) {
            if(value) {
                this.isNoMoreData = false;
                this.currPage = 1;
                this.dataList = [];
                this.getMarketplaceList();
            }
        },
        getMarketplaceList(ServerWhere) { //获取产品日收益列表
            if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
                ServerWhere = {
                    limit: this.pageSize,
                    page: this.currPage,
                    regmarket: this.regmarket,
                    currency: this.buyCurrency === '1' ? 'CFX' : 'USDT',
                };
            }
            this.loading = true;
            get(this.apiUrl + "/Api/Market/getMarketplaceList", ServerWhere, async json => {
                console.log(json);
                if (json.code == 10000) {
                    let list = (json.data && json.data.lists) || [];
                    // console.log(list);
                    if (Array.isArray(list) && Array.isArray(this.dataList)) {
                        this.dataList = this.dataList.concat(list);
                        if(list.length < this.pageSize) {
                            this.isNoMoreData = true;
                        }
                    }
                    this.loading = false;
                    this.total = json.data.count;
                    this.$forceUpdate();
                } else {
                    this.$message.error("加载数据失败");
                }
            });
        },
        startApprove() {
            // const loading = this.$loading({
            //     lock: true,
            //     text: 'transaction in progress',
            //     spinner: 'el-icon-loading',
            //     background: 'rgba(0, 0, 0, 0.7)'
            // });
            this.trading = true;
            approve(Address.USDT, Address.CFXsContractAddress, this.buyNowData.youWillPay, 18).then((hash) => {
                // console.log(result);
                // loading.close();
                if (hash) {
                    this.approve = true;
                    this.trading = false;
                }
            }).finally(() => {
                // loading.close();
                this.trading = false;
            });
        },
        buyNowContract() {
            const sweepData = this.calcTotalNumber;
            if(sweepData.isOneseAddress) {
                this.$message({
                    message: 'Cannot buy what you sell for yourself',
                    type: 'warning'
                });
                return false;
            }
            this.trading = true;
            let usdIds = new Array(this.buyNowData.cfxsIds.length).fill(this.buyCurrency === '1' ? "1" : "0");
            // let totalAmount = this.buyNowData.amounts.reduce((accumulator, current) => {
            //     return accumulator + Number(fromWei(Number(current), 18));
            // }, 0); // 0 是累加器的初始值
            unlockingScriptbatch(this.buyNowData.cfxsIds, this.buyNowData.amounts, usdIds, this.buyNowData.youWillPay, this.buyCurrency).then(async (hash) => {
                if (hash) {
                    this.approve = true;
                    this.trading = false;
                    this.buyNowDialogShow = false;
                    setTimeout(() => {
                        this.refreshDataClick();
                    }, 1000);
                }
            }).finally(() => {
                this.trading = false;
            });
        }
    },
}
</script>
<style>
.popper__arrow {
    display: none !important;
}
.el-select-dropdown {
    background-color:#202020;  
    color: #aaa;               
}
.el-select-dropdown__item.hover {
    align-items: center;
    display: flex;
}
.el-select-dropdown__item.selected {
    color: #aaa;
    font-weight: 400;
}
.el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color:#ad8d65;  
    color: rgb(0 0 0/1);
    font-weight: 400;
}
</style>
<style lang="scss" scoped>
.container {
    padding-left: 16px;
    padding-right: 16px;
    /deep/ {
        .content {
            .illustrate {
                width: 100%;
                display: flex;
                padding-top: 24px;
                .el-col-24 {
                    display: flex;
                }
                .illustrate-right {
                    display: block;
                    margin-left: 32px;
                    .title {
                        display: flex;
                        height: 60px;
                        align-items: center;
                        .name {
                            font-size: 40px;
                            font-weight: 700;
                            margin-right: 24px;
                        }
                        .log {
                            display: flex;
                            gap: 12px;
                        }
                    }
                    .desc {
                        margin-top: 8px;
                        font-size: 16px;
                        margin-bottom: 20px;
                        color: #aaa;
                    }
                    .total-supply {
                        height: 10px;
                        max-width: 400px;
                        .el-progress-bar__outer {
                            background-color: #202020 !important;
                            height: 8px !important;
                        }
                        .number {
                            margin-top: 8px;
                            color: #aaa;
                            font-size: 12px;
                        }
                    }
                }
            }

            .datastatistics {
                // justify-content: space-around;
                margin-top: 24px;
                .el-col-24 {
                    text-align: center !important;
                }
                .content {
                    padding: 8px;
                    background-color: transparent;
                    border-radius: 4px;
                    margin-bottom: 10px;
                    min-width: 100px;
                    .name {
                        text-align: left;
                        color: #aaa;
                        font-size: 16px;
                        margin-bottom: 8px;
                    }
                    .price {
                        text-align: left;
                        font-size: 20px;
                        font-weight: 700;
                    }
                }
            }
            .list {
                .justify-content-between {
                    display: flex;
                    justify-content: space-between;
                }
                .el-tabs__item {
                    color: #aaa;
                    font-weight: 600;
                }
                .el-tabs__item.is-active {
                    color: #ad8d65;
                }
                .el-tabs__nav-wrap::after {
                    height: 0;
                }
                .el-select {
                    width: 300px;
                }
                .el-input__prefix {
                    display: flex;
                    align-items: center;
                }
                .el-input__inner {
                    color: #aaa;
                    border-color: #525252;
                    background-color: transparent;
                    display: flex;
                    align-items: center;
                }
                .search-button {
                    background-color: #ad8d65;
                    border: 0;
                    color: rgb(12, 12, 12);
                }
            }
            .count-number {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 6px;
                height: 48px;
                .listings {
                    display: flex;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 16px;
                    color: #ad8d65;
                    gap: 5px;
                }
                .text-numcer {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    .text-secondary {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #aaa;
                        gap: 12px;
                        flex-shrink: 0;
                        font-size: 16px;
                    }
                    .refresh {
                        margin-left: 16px;
                        cursor: pointer;
                    }
                }
            }
            .select-card {
                position: fixed;
                align-items: center;
                right: 0;
                left: 0;
                bottom: 0;
                height: 78px;
                background-color: hsla(0, 0%, 9%, .9);
                border-color: #202020;
                border-width: 1px;
                color: #aaa;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding-left: 24px;
                padding-right: 24px;
                .select-content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    width: 100%;
                    max-width: 1368px;
                    .left {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .item-num {
                            width: 80px;
                        }
                        .select-all {
                            display: flex;
                            margin-right: 32px;
                            .el-checkbox__inner {
                                background-color: transparent;
                                border-color: #ad8d65;
                                border-width: 1px;
                                cursor: pointer;
                                width: 18px;
                                height: 19px;
                                border-radius: 0;
                            }
                            .el-checkbox__inner::after {
                                width: 6px;
                                height: 11px;
                            }
                            .el-checkbox__input.is-checked+.el-checkbox__label {
                                color: #ad8d65;
                            }
                        }
                        .clear {
                            cursor: pointer;
                            color: #ad8d65;
                        }
                    }
                    .right {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        .total {
                            font-size: 20px;
                            margin-right: 32px;
                            color: #fff;
                        }
                        .sweep-button {
                            .el-button {
                                background: hsla(0, 0%, 50%, .2);
                                color: #aaa;
                                border: 1px solid transparent;
                                height: 48px;
                            }
                            .el-button--primary.is-disabled:hover {
                                background: hsla(0, 0%, 50%, .2);
                                color: #aaa;
                            }
                            .batch-listing {
                                background: #ad8d65;
                                color: rgb(0, 0, 0/1);
                            }
                            .el-button:hover {
                                background: #ad8d65;
                                color: rgb(0, 0, 0/1);
                            }
                        }
                    }
                }
                .mobile {
                    font-size: 12px;
                    .el-checkbox {
                        color: #aaa;
                        font-size: 14px;
                        margin-right: 16px;
                    }
                    .left {
                        display: block;
                    }
                }
            }
            .buy-now-dialog {
                .el-dialog {
                    background-color: #202020;
                    .el-dialog__header {
                        .el-dialog__title {
                            color: #fff;
                        }
                    }
                    .dialog-content {
                        display: flex;
                        padding: 16px;
                        flex-direction: column;
                        .you-wall-pay, .for {
                            color: #fff;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            margin-bottom: 12px;
                            font-size: 16px;
                            .title {
                                color: #aaa;
                            }
                            .value {
                                color: #fff;
                            }
                        }
                        .button-dialog {
                            color: #aaa;
                            font-size: 14px;
                            padding-top: 12px;
                            border-top: 1px solid #282828;
                            border-width: 1px;
                            margin-top: 32px;
                            .text {
                                display: block;
                                margin-bottom: 24px;
                            }
                            .el-button {
                                height: 48px;
                                width: 100%;
                                background-color: #ad8d65;
                                border: 0;
                                color: rgb(0, 0, 0/1);
                            }
                            .el-button.is-loading {
                                background-color: hsla(0, 0%, 50%, .2);
                            }
                            .balance {
                                display: block;
                                margin-top: 12px;
                                font-size: 16px;
                            }
                        }
                    }
                }
            }
            .fiter-dialog {
                .el-dialog {
                    background-color: #202020;
                    .el-dialog__header {
                        .el-dialog__title {
                            color: #fff;
                        }
                    }
                    .dialog-content {
                        display: flex;
                        padding: 16px;
                        flex-direction: column;
                        .el-form-item {
                            width: 100%;
                            .el-input__inner {
                                color: #aaa;
                                border-color: #525252;
                                background-color: transparent;
                            }
                        }
                        .el-select {
                            width: 100%;
                        }
                        .el-form-item__content {
                            width: 100%;
                        }
                    }
                    .button-dialog {
                        display: flex;
                        justify-content: center;
                        gap: 10px;
                        color: #aaa;
                        font-size: 14px;
                        border-top: 1px solid #282828;
                        border-width: 1px;
                        .text {
                            display: block;
                            margin-bottom: 24px;
                        }
                        .el-button {
                            width: 50%;
                            height: 48px;
                            background-color: #ad8d65;
                            border: 0;
                            color: rgb(0, 0, 0/1);
                        }
                        .cancel-button {
                            background-color: transparent;
                            border: 1px solid #ad8d65;
                            color: #ad8d65;
                        }
                    }
                }
            }
        }
    }
    @media (max-width: 960px) {
        /deep/ {
            .list {
                margin-bottom: 100px;
            }
            .illustrate {
                .illustrate-right {
                    .title {
                        height: auto !important;
                        .name {
                            font-size: 24px !important;
                        }
                    }
                    .total-supply {
                        max-width: 100% !important;
                    }
                }
                .desc {
                    margin-top: 10px;
                    color: #aaa;
                }
            }
            
            .datastatistics {
                .content {
                    background-color: #181818 !important;
                    .price {
                        font-size: 16px !important;
                    }
                }
            }
        }
    }
}

</style>
