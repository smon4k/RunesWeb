<template>
    <div class="container">
        <div class="content">
            <div class="tab-nav">
                <el-tabs v-model="activeName" @tab-click="tabOrderClick">
                    <el-tab-pane label="My CFXs" name="1">
                        <div class="new-world" v-if="screenWidth > adaptiveSize">
                            <div class="flag"><img :src="require('@/assets/svg/flag.svg')" alt="" width="24"></div>
                            <div class="text">
                                <div class="world-text">
                                    TO THE NEW WORLD !
                                    <el-button>CHECK ON eSPACE</el-button>
                                </div>
                                <div class="world-desc">
                                    Please claim the CFXs from the 
                                    <a href="http://" target="_blank" rel="noopener noreferrer">test contract</a>to the 
                                    <a href="http://" target="_blank" rel="noopener noreferrer">new contract</a>
                                    (only supported eSpace). If your CFXs are in Core Space,
                                    <a href="http://" target="_blank" rel="noopener noreferrer">click here</a>.
                                </div>
                            </div>
                        </div>
                        <div class="new-world-mobile" v-else>
                            <div class="flag">
                                <img :src="require('@/assets/svg/flag.svg')" alt="" width="24">
                                <div class="world-text">TO THE NEW WORLD !</div>
                            </div>
                            <div>
                                <div class="text">
                                    <div class="world-desc">
                                        Please claim the CFXs from the 
                                        <a href="http://" target="_blank" rel="noopener noreferrer">test contract</a>to the 
                                        <a href="http://" target="_blank" rel="noopener noreferrer">new contract</a>
                                        (only supported eSpace). If your CFXs are in Core Space,
                                        <a href="http://" target="_blank" rel="noopener noreferrer">click here</a>.
                                    </div>
                                </div>
                            </div>
                            <div class="check-button">
                                <el-button>CHECK ON eSPACE</el-button>
                            </div>
                        </div>
                        <div class="list">
                            <el-tabs v-model="regmarket" @tab-click="regmarketClick">
                                <el-form :inline="true" :model="formSearch" :class="{ 'mobile-form': screenWidth <= adaptiveSize }">
                                    <el-form-item label="">
                                        <el-select v-model="formSearch.searchName" placeholder="All">
                                            <el-option label="All" value="0">
                                                <span style="margin-left: 5px;">ALL</span>
                                            </el-option>
                                            <el-option label="Only meraged" value="1">
                                                <img :src="require('@/assets/svg/rune-select.svg')" alt="" width="20">
                                                <span style="margin-left: 5px;">Only meraged</span>
                                            </el-option>
                                            <el-option label="Only fragments" value="2">
                                                <img :src="require('@/assets/svg/fragments.svg')" alt="" width="20">
                                                <span style="margin-left: 5px;">Only fragments</span>
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="">
                                        <el-input v-model="formSearch.address" placeholder="Select By ID"></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button class="search-button" type="primary" @click="onSubmit">Apply</el-button>
                                    </el-form-item>
                                </el-form>
                                <div class="count-number">
                                    <span class="text-secondary">
                                        <span>Slots: {{ dataList.length }}</span>
                                        <span>Balance: {{ dataList.length }}</span>
                                    </span>
                                    <span class="refresh" @click="refreshDataClick">
                                        <img :src="require('@/assets/svg/refresh.svg')" alt="" width="48">
                                    </span>
                                </div>
                                <el-tab-pane label="General" name="0">
                                    <Card :dataList="dataList" @sellNowClick="sellNowClick" :highlightedIndices="highlightedIndices" @toggleHighlight="toggleHighlight" :isNoMoreData="isNoMoreData" @onLoadMoreData="onLoadMoreData" @onSplitItem="onSplitItem" :loading="loading"></Card>
                                </el-tab-pane>
                                <el-tab-pane label="Images" name="1">
                                    <Card :dataList="dataList" @sellNowClick="sellNowClick" :highlightedIndices="highlightedIndices" @toggleHighlight="toggleHighlight" :isNoMoreData="isNoMoreData" @onLoadMoreData="onLoadMoreData" @onSplitItem="onSplitItem" :loading="loading"></Card>
                                </el-tab-pane>
                                <el-tab-pane label="Audio" name="2">
                                    <Card :dataList="dataList" @sellNowClick="sellNowClick" :highlightedIndices="highlightedIndices" @toggleHighlight="toggleHighlight" :isNoMoreData="isNoMoreData" @onLoadMoreData="onLoadMoreData" @onSplitItem="onSplitItem" :loading="loading"></Card>
                                </el-tab-pane>
                                <el-tab-pane label="Text" name="3">
                                    <Card :dataList="dataList" @sellNowClick="sellNowClick" :highlightedIndices="highlightedIndices" @toggleHighlight="toggleHighlight" :isNoMoreData="isNoMoreData" @onLoadMoreData="onLoadMoreData" @onSplitItem="onSplitItem" :loading="loading"></Card>
                                </el-tab-pane>
                                <el-tab-pane label="Inscription" name="4">
                                    <Card :dataList="dataList" @sellNowClick="sellNowClick" :highlightedIndices="highlightedIndices" @toggleHighlight="toggleHighlight" :isNoMoreData="isNoMoreData" @onLoadMoreData="onLoadMoreData" @onSplitItem="onSplitItem" :loading="loading"></Card>
                                </el-tab-pane>
                                <el-tab-pane label="Name" name="5">
                                    <Card :dataList="dataList" @sellNowClick="sellNowClick" :highlightedIndices="highlightedIndices" @toggleHighlight="toggleHighlight" :isNoMoreData="isNoMoreData" @onLoadMoreData="onLoadMoreData" @onSplitItem="onSplitItem" :loading="loading"></Card>
                                </el-tab-pane>
                              </el-tabs>
                          </div>
                    </el-tab-pane>
                    <el-tab-pane label="Orders" name="2">
                        <div class="count-number">
                            <span class="text-secondary">
                                <span>Listing: {{ dataListOrder.length }}</span>
                            </span>
                            <span class="refresh" @click="refreshOrderDataClick">
                                <img :src="require('@/assets/svg/refresh.svg')" alt="" width="48">
                            </span>
                        </div>
                        <OrdersCardBox :dataList="dataListOrder" @cancelListingClick="cancelListingClick" :isNoMoreData="isNoMoreDataOrder" @onLoadMoreOrderData="onLoadMoreOrderData" :loading="loadingOrder"/>
                    </el-tab-pane>
                    <el-tab-pane label="CLS" name="3">
                        <div class="idenser">The CFXs Identification Service</div>
                        <div class="cls-list">
                            <ClsCardBox :dataList="dataList" @resolveAddressClick="resolveAddressClick" @setNameClick="setNameClick" />
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <div class="select-card" :class="{ 'select-card-mobile': screenWidth <= adaptiveSize }" v-if="activeName == 1" >
                <div class="select-content" v-if="screenWidth > adaptiveSize">
                    <div class="left">
                        <div class="item-num">{{ highlightedIndices.length }} item</div>
                        <div class="select-all">
                            <el-checkbox v-model="selectAllChecked" @change="selectAllChange">Select All</el-checkbox>
                        </div>
                        <div class="clear" @click="clearSelectAll()">Clear</div>
                    </div>
                    <div class="right">
                        <div class="sweep-button">
                            <el-button :class="{ 'merge-border': highlightedIndices.length > 0 }" type="primary" @click="onMessageItems" :disabled="highlightedIndices.length <= 0">
                                <img :src="require('@/assets/svg/rune-select.svg')" alt="" width="20">
                                MERGE
                            </el-button>
                            <el-button :class="{ 'merge-border': highlightedIndices.length > 0 }" type="primary" @click="onTransferItems" :disabled="highlightedIndices.length <= 0">
                                <img :src="require('@/assets/svg/transfer.svg')" alt="" width="20">
                                TRANSFER
                            </el-button>
                            <el-button :class="{ 'batch-listing': highlightedIndices.length > 0 }" type="primary" @click="onBatchListingFun" :disabled="highlightedIndices.length <= 0">BATCH LISTING</el-button>
                        </div>
                    </div>
                </div>
                <div class="select-content mobile" v-else>
                    <div class="left">
                        <div class="select-all">
                            <el-checkbox v-model="checked" @change="selectAllChange">Select All</el-checkbox>
                        </div>
                        <div class="item-num">{{ highlightedIndices.length }} item</div>
                    </div>
                    <div class="right">
                        <div class="sweep-button">
                            <el-button :class="{ 'merge-border': highlightedIndices.length > 0 }" type="primary" @click="onMessageItems" :disabled="highlightedIndices.length <= 0">
                                <img :src="require('@/assets/svg/rune-select.svg')" alt="" width="20">
                                MERGE
                            </el-button>
                            <el-button :class="{ 'merge-border': highlightedIndices.length > 0 }" type="primary" @click="onTransferItems" :disabled="highlightedIndices.length <= 0">
                                <img :src="require('@/assets/svg/transfer.svg')" alt="" width="20">
                                TRANSFER
                            </el-button>
                        </div>
                        <div class="sweep-button">
                            <el-button :class="{ 'batch-listing': highlightedIndices.length > 0 }" type="primary" @click="onBatchListingFun" :disabled="highlightedIndices.length <= 0">BATCH LISTING</el-button>
                        </div>
                    </div>
                </div>
              </div>

              <el-dialog
                title="Merge Items"
                :visible.sync="messageItemsDialogShow"
                :width="screenWidth > adaptiveSize ? '35%' : '90%'"
                :before-close="() => {
                    messageItemsDialogShow = false
                }"
                class="merge-items"
                top="30vh">
                <div class="dialog-content">
                    <div class="you-wall-pay">
                        <span class="title">You will merge</span>
                        <span class="value">{{ calcTotalNumber.totalSlots }} Slots</span>
                    </div>
                    <div class="for">
                        <span class="title">The amount of new CFXs will be</span>
                        <span class="value">{{ calcTotalNumber.totalCfxs }} CFXs</span>
                    </div>
                    <div class="button-dialog">
                        <span class="text">The merged CFXs will generate a new CFXs ID. The amount of new CFXs according to the total amount of merged CFXs.</span>
                        <el-button type="primary" :disabled="trading" :loading="trading" @click="processTransactionContract">CONFIRM MERGE</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog
                title="Merge Items"
                :visible.sync="cancelListingDialogShow"
                :width="screenWidth > adaptiveSize ? '35%' : '90%'"
                :before-close="() => {
                    cancelListingDialogShow = false
                }"
                class="merge-items"
                top="30vh">
                <div class="dialog-content">
                    <div class="you-wall-pay">
                        <span class="title">You will cancel</span>
                        <span class="value">1 listings</span>
                    </div>
                    <div class="button-dialog">
                        <el-button type="primary" :disabled="trading" :loading="trading" @click="ownerUnlockingScriptContract">CONFIRM CANCEL</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog
                title="Split"
                :visible.sync="splitDialogShow"
                :width="screenWidth > adaptiveSize ? '45%' : '90%'"
                :before-close="() => {
                    splitDialogShow = false
                }"
                class="split-items"
                top="30vh">
                <div class="dialog-content">
                    <div class="cfxid-number">
                        <span class="title"># 123456789</span>
                        <span class="value">1 CFXs</span>
                    </div>
                    <div class="split-number">
                        <el-input placeholder="Must be an integer > 1 or < 1000" v-model="splitNumbers[index]" v-for="(item, index) in splitNumbers" :key="index">
                            <template slot="prepend"><img :src="require('@/assets/svg/minus.svg')" alt="" width="24" @click="minusNumbers"></template>
                            <template slot="append"><img :src="require('@/assets/svg/plus.svg')" alt="" width="24" @click="plusNumbers"></template>
                        </el-input>
                    </div>
                    <div class="cfxid-number">
                        <span class="title">Count</span>
                        <span class="value">1</span>
                    </div>
                    <div class="desc">Up to 24 customized items. The amount of new CFXs shards is the the customized amount.</div>
                    <div class="total-message">
                        <img :src="require('@/assets/svg/total.svg')" alt="" width="20" @click="minusNumbers">
                        Total cannot exceed the amount of the CFXs.
                    </div>
                    <div class="button-dialog">
                        <el-button type="primary" :disabled="trading" :loading="trading" @click="ownerUnlockingScriptContract">CONFIRM CANCEL</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog
                title="Transfer Items"
                :visible.sync="transferItemsDialogShow"
                :width="screenWidth > adaptiveSize ? '35%' : '90%'"
                :before-close="() => {
                    transferItemsDialogShow = false;
                }"
                class="transfer-items"
                top="30vh">
                <div class="dialog-content">
                    <div class="set-address">
                        Set a address
                    </div>
                    <div class="input-address">
                        <el-input v-model="transferAddressValue" placeholder="Destination address e.g 0x1234...1234"></el-input>
                    </div>
                    <div class="button-dialog">
                        <el-button :class="{ 'merge-border': transferAddressValue }" type="primary" :disabled="!transferAddressValue || trading" :loading="trading" @click="transferContract">TRANSFER {{ highlightedIndices.length }} CFXs</el-button>
                    </div>
                </div>
            </el-dialog>
            
            <el-dialog
                title="Quick List"
                :visible.sync="quickListDialogShow"
                :width="screenWidth > adaptiveSize ? '30%' : '90%'"
                :before-close="quickListDialogClose"
                class="buy-now-dialog"
                top="10vh">
                <div class="dialog-content">
                    <div class="items-count">
                        <span>List {{ selectDataList.length }} Items</span>
                        <span><el-checkbox v-model="samePriceChecked">Same price</el-checkbox></span>
                    </div>
                    <div class="set-unit-price">
                        <div class="title">Set unit price</div>

                        <div v-for="(item, index) in selectDataList" :key="index">
                            <div class="input-price">
                                <div class="top-text">
                                    <span>#{{ item.chainid }}</span>
                                    <span>{{ item.amount }}</span>
                                </div>
                                <div class="input-number">
                                    <el-input v-model="sellPriceValue[item.chainid]" placeholder="0.00">
                                        <div slot="suffix"> <img :src="require('@/assets/usdt.png')" alt="" width="18"> USDT</div>
                                    </el-input>
                                </div>
                                <div class="total-price">
                                    <span>Total Price</span>
                                    <span>{{ new Intl.NumberFormat('en-US').format(sellPriceValue[item.chainid]) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="duration">
                        <div class="title">Duration</div>
                        <el-date-picker
                            v-model="duration"
                            :clearable="false"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions"
                            @change="pickerChange">
                        </el-date-picker>
                    </div>
                    <div class="locked">
                        <span>Locked</span>
                        <span>{{ hoursDifference }} h</span>
                    </div>
                    <div class="sale-price">
                        <span>Sale price</span>
                        <span class="number">{{ totalSellPrice }} USDT</span>
                    </div>
                    <div class="market-fee">
                        <span>Market fee</span>
                        <span>0.3%</span>
                    </div>
                    <div class="total-potear">
                        <span>Total potentail earnings</span>
                        <span class="number">{{ totalSellPrice }} USDT</span>
                    </div>
                    <div class="button-dialog">
                        <el-button type="primary" :disabled="trading" :loading="trading" @click="lockingSellContract" >COMPLETE LISTING</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog
                title="Resolve address"
                :visible.sync="resolveAddressDialogShow"
                :width="screenWidth > adaptiveSize ? '35%' : '90%'"
                :before-close="() => {
                    resolveAddressDialogShow = false;
                }"
                class="resolve-address"
                top="30vh">
                <div class="dialog-content">
                    <div class="address">Address</div>
                    <div class="input-number">
                        <el-input v-model="resolveAddressValue" placeholder="Destination address e.g 0x1234...1234"></el-input>
                        <div class="my-address">
                            <el-button type="primary" @click="setResolveAddress">My Address<img :src="require('@/assets/svg/arraw-left.svg')" alt="" width="16"></el-button>
                        </div>
                    </div>
                    <div class="button-dialog">
                        <el-button type="primary" :class="{ 'merge-border': resolveAddressValue }" :disabled="!resolveAddressValue">CONFIRM</el-button>
                    </div>
                </div>
            </el-dialog>

            <el-dialog
                title="Set the CIS name for your address"
                :visible.sync="setClsNameDialogShow"
                :width="screenWidth > adaptiveSize ? '35%' : '90%'"
                :before-close="() => {
                    setClsNameDialogShow = false;
                }"
                class="merge-items"
                top="30vh">
                <div class="dialog-content">
                    <div class="you-wall-pay">
                        <span class="title">Name</span>
                        <span class="value">{{ '8614321' }}</span>
                    </div>
                    <div class="you-wall-pay">
                        <span class="title">Address</span>
                        <span class="value">{{ addressStr(address) }}</span>
                    </div>
                    <div class="button-dialog">
                        <span class="text" style="font-size: 12px;">The CIS name is your reverse record responsible for resolving your wallet address to your CIS name, effectively helping DApps or other supported services display your CIS name based on your wallet address.</span>
                        <el-button type="primary">CONFIRM CANCEL</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { get, post } from "@/common/axios.js";
import { mapGetters, mapState } from "vuex";
import { toWei, keepDecimalNotRounding } from "@/utils/tools";
import { getBalance, isApproved } from "@/wallet/serve";
import { approve, lockingScriptbatch, ownerUnlockingScript, processTransaction, transfer } from "@/wallet/trade";
import Address from '@/wallet/address.json'
import CardBox from './myCard.vue';
import ClsCardBox from './clsCard.vue';
import OrdersCardBox from './orderCard.vue';
export default {
    name: '',
    data() {
        return {
            screenWidth: document.body.clientWidth,
            activeName: '1',
            regmarket: '0',
            approve: false,
            highlightedIndices: [],
            selectDataList: [],
            sellPriceValue: this.highlightedIndices && this.highlightedIndices.length ? new Array(this.highlightedIndices.length).fill('') : [],
            formSearch: {
                searchName: '',
                minPrice: '',
                maxPrice: '',
                address: '',
            },
            dataList: [],
            trading: false,
            loading: false,
            timeInterval: null,
            refreshTime: 10000, //数据刷新间隔时间
            currPage: 1, //当前页
            pageSize: 18, //每页显示条数
            total: 100, //总条数
            isNoMoreData: false,
            PageSearchWhere: [], //分页搜索数组
            
            dataListOrder: [],
            loadingOrder: false,
            currPageOrder: 1, //当前页
            pageSizeOrder: 18, //每页显示条数
            totalOrder: 100, //总条数
            isNoMoreDataOrder: false,
            PageSearchWhereOrder: [], //分页搜索数组

            messageItemsDialogShow: false,
            transferItemsDialogShow: false,
            buyNowData: {
                youWillPay: 0,
                slots: 0,
                cfxs: 0,
            },
            quickListDialogShow: false,
            quickListData: {
                youWillPay: 0,
                slots: 0,
                cfxs: 0,
            },
            cancelListingDialogShow: false,
            resolveAddressDialogShow: false,
            setClsNameDialogShow: false,
            transferAddressValue: '',
            samePriceChecked: false,
            splitDialogShow: false,
            duration: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
            hoursDifference: '24',
            selectAllChecked: false,
            resolveAddressValue: '',
            pickerOptions: {
                disabledDate(time) {
                    return time < new Date();
                },
            },
            checked: false,
            splitNumbers: ['', ''],
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
            apiUrl: state => state.base.apiUrl,
            adaptiveSize: state => state.comps.adaptiveSize,        
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
            let totalSlots = this.highlightedIndices.length;  
            let totalCfxs = 0;  
            let cfxsIds = [];
            this.dataList.forEach((item, index) => {
                if (this.highlightedIndices.includes(index)) {
                    totalCfxs += Number(item.amount);
                    cfxsIds.push(item.chainid);
                }
            });
            return { totalSlots, totalCfxs, cfxsIds };
        },
        totalSellPrice() {
            let total = this.sellPriceValue.reduce((sum, price) => {
                return sum + Number(price);
            }, 0);

            // 然后使用 Intl.NumberFormat 格式化最终的累加结果
            return new Intl.NumberFormat('en-US').format(total);
        }
    },
    created() {
        try {
            // this.getMyMarketplaceData();
        } catch (err) { }
    },
    watch: {
        isConnected: {
            immediate: true,
            async handler(val) {
                if (val) {
                }
            }
        },
        changeData: {
            immediate: true,
            async handler(val) {
                if (val.address) {
                    await this.getMyMarketplaceData();
                }
            }
        },
    },
    components: {
        "Card": CardBox,
        "ClsCardBox": ClsCardBox,
        "OrdersCardBox": OrdersCardBox,
    },
    methods: {
        pickerChange(date) {
            const givenDate = new Date(date);
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            givenDate.setHours(0, 0, 0, 0);
            const timeDifference = givenDate - now;
            const hoursDifference = timeDifference / (1000 * 60 * 60);
            this.hoursDifference = hoursDifference;
        },
        getMyMarketplaceData(ServerWhere) {
            if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
                ServerWhere = {
                    limit: this.pageSize,
                    page: this.currPage,
                    owner: this.address,
                    regmarket: this.regmarket,
                };
            }
            this.loading = true;
            get(this.apiUrl + "/Api/Market/getMyMarketplaceData", ServerWhere, async json => {
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
        getSellOrdersData(ServerWhere) {
            if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
                ServerWhere = {
                    limit: this.pageSizeOrder,
                    page: this.currPageOrder,
                    owner: this.address,
                };
            }
            this.loadingOrder = true;
            get(this.apiUrl + "/Api/Market/getSellOrdersData", ServerWhere, async json => {
                if (json.code == 10000) {
                    let list = (json.data && json.data.lists) || [];
                    // console.log(list);
                    if (Array.isArray(list) && Array.isArray(this.dataListOrder)) {
                        this.dataListOrder = this.dataListOrder.concat(list);
                        if(list.length < this.pageSizeOrder) {
                            this.isNoMoreDataOrder = true;
                        }
                    }
                    this.loadingOrder = false;
                    this.totalOrder = json.data.count;
                    this.$forceUpdate();
                } else {
                    this.$message.error("加载数据失败");
                }
            });
        },
        tabOrderClick() {
            this.currPageOrder = 1;
            this.dataListOrder = [];
            this.getSellOrdersData();
        },
        refreshDataClick() {
            this.isNoMoreData = false;
            this.currPage = 1;
            this.dataList = [];
            this.loading = true;
            setTimeout(() => {
                this.getMyMarketplaceData();
            }, 1000);
        },
        refreshOrderDataClick() {
            this.isNoMoreDataOrder = false;
            this.currPageOrder = 1;
            this.dataListOrder = [];
            this.loadingOrder = true;
            setTimeout(() => {
                this.getSellOrdersData();
            }, 1000);
        },
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
        onSubmit() {
            console.log('submit!');
        },
        onMessageItems() {
            this.messageItemsDialogShow = true;
        },
        onSplitItem() {
            this.splitDialogShow = true;
        },
        onTransferItems() {
            this.transferAddressValue = "";
            this.transferItemsDialogShow = true;
        },
        sellNowClick(row) { //单个出售
            console.log(row);
            this.selectDataList = [];
            this.sellPriceValue = [];
            this.selectDataList.push(row);
            this.quickListDialogShow = true;
        },
        onBatchListingFun() {//批量出售
            this.selectDataList = [];
            this.sellPriceValue = [];
            if(this.highlightedIndices.length) {
                this.dataList.forEach((item, index) => {
                    if (this.highlightedIndices.includes(index)) {
                        this.selectDataList.push(item);
                    }
                });
            }
            this.quickListDialogShow = true;
        },
        onLoadMoreData() {
            this.currPage += 1;
            this.getMyMarketplaceData();
        },
        onLoadMoreOrderData() {
            this.currPageOrder += 1;
            this.getSellOrdersData();
        },
        quickListDialogClose() {
            this.quickListDialogShow = false;
        },
        cancelListingClick(item) { //取消名单事件
            this.cancelSaleId = item.chainid;
            this.cancelListingDialogShow = true;
        },
        resolveAddressClick() {
            this.resolveAddressDialogShow = true;
        },
        setResolveAddress() {
            this.resolveAddressValue = this.address;
        },
        setNameClick() {
            this.setClsNameDialogShow = true;
        },
        regmarketClick(tab, event) {
            this.currPage = 1;
            this.dataList = [];
            this.getMyMarketplaceData();
        },
        minusNumbers() {
            if (this.splitNumbers.length > 2) {
                this.splitNumbers.pop();
            }
        },
        plusNumbers() {
            this.splitNumbers.push('');
        },
        async lockingSellContract() { //出售
            this.trading = true;
            const indexArray = this.sellPriceValue.map((value, index) => index);
            const valueArray = this.sellPriceValue.map((value, index) => toWei(value, 18));
            
            const cfxsIds = indexArray.filter((value, index) => {
                return value !== null && value !== "" && value !== undefined;
            });
            const usdIds = new Array(cfxsIds.length).fill("0");

            const prices = valueArray.filter((value, index) => {
                return value !== null && value !== "" && value !== undefined;
            });
            lockingScriptbatch(cfxsIds, prices, usdIds, this.hoursDifference).then((hash) => {
                if (hash) {
                    this.trading = false;
                }
            }).finally(() => {
                this.trading = false;
            });
        },
        async ownerUnlockingScriptContract() { //取消出售
            this.trading = true;
            ownerUnlockingScript(this.cancelSaleId).then((hash) => {
                if (hash) {
                    this.trading = false;
                }
            }).finally(() => {
                this.trading = false;
            });
        },
        async processTransactionContract() { //合并交易
            const data = this.calcTotalNumber;
            const cfxsIds = data.cfxsIds;
            const outputs = [[
                this.address,
                data.totalCfxs,
                ""
            ]];
            this.trading = true;
            processTransaction(cfxsIds, outputs).then((hash) => {
                if (hash) {
                    this.trading = false;
                }
            }).finally(() => {
                this.trading = false;
            });
        },
        async splitProcessTransactionContract() { //拆分交易
            const data = this.calcTotalNumber;
            const cfxsIds = data.cfxsIds;
            const outputs = [[
                this.address,
                data.totalCfxs,
                ""
            ]];
            this.trading = true;
            processTransaction(cfxsIds, outputs).then((hash) => {
                if (hash) {
                    this.trading = false;
                }
            }).finally(() => {
                this.trading = false;
            });
        },
        async transferContract() { //转增交易
            const data = this.calcTotalNumber;
            const cfxsIds = data.cfxsIds;
            this.trading = true;
            transfer(cfxsIds, this.transferAddressValue).then((hash) => {
                if (hash) {
                    this.trading = false;
                }
            }).finally(() => {
                this.trading = false;
            });
        },
        async getIsApprove() { //获取余额 查看是否授权
            let balance = await getBalance(Address.BUSDT, 18); //获取余额
            console.log("DUSD balance", balance);
            this.dusdBalance = keepDecimalNotRounding(balance, 8, true);
            isApproved(Address.BUSDT, 18, balance, this.gamesFillingAddress).then((bool) => {
                console.log("isApprove", bool);
                this.approve = bool ? true : false;
            });
        },
        addressStr(address) {
            // console.log(this.address);
            if (!address || address == undefined || address == '') {
                return "Connect Wallet";
            } else {
                return this.address.substring(0, 4) + "***" + address.substring(address.length - 3)
            }
        },
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
.el-select-dropdown__item {
    display: flex;
    align-items: center;
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
            .count-number {
                display: flex;
                align-items: center;
                margin-top: 16px;
                box-sizing: border-box;
                border: 0 solid #e5e7eb;
                height: 48px;
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
            .tab-nav {
                padding-top: 24px;
                .el-tabs__item {
                    font-size: 18px;
                    color: #aaa;
                    font-weight: 500;
                }
                .el-tabs__item.is-active {
                    color: #ad8d65;
                }
                .el-tabs__active-bar {
                    background-color: #ad8d65;
                }
                .el-tabs__nav-wrap::after {
                    background-color: #282828;
                }
                .el-tabs__nav-scroll {
                    border-width: 2px;
                    border-color: transparent;
                }
                .el-select {
                    width: 300px;
                }
                .el-input__inner {
                    color: #aaa;
                    border-color: #525252;
                    background-color: transparent;
                }
                .search-button {
                    background-color: #ad8d65;
                    border: 0;
                    color: rgb(12, 12, 12);
                }
                .new-world {
                    padding: 24px;
                    border: 1px solid hsla(33,31%,54%,.3);
                    border-radius: 8px;
                    align-items: flex-start;
                    display: flex;
                    margin-top: 20px;
                    margin-bottom: 32px;
                    // align-items: center;
                    .flag {
                        margin-right: 12px;
                        padding-top: 5px;
                    }
                    .text {
                        .world-text {
                            font-size: 24px;
                            margin-right: 24px;
                            font-weight: 700;
                            color: #ad8d65;
                            .el-button {
                                line-height: 0;
                                height: 30px;
                                border-color: transparent;
                                background-color: #ad8d65;
                                padding: 12px 10px;
                                color: #000000;
                            }
                        }
                        .world-desc {
                            padding-top: 10px;
                            font-size: 16px;
                            color: #aaa;
                        }
                        a {
                            color: #ad8d65;
                            padding-left: 5px;
                            padding-right: 5px;
                        }
                    }
                }
                .new-world-mobile {
                    padding: 12px;
                    border: 1px solid hsla(33,31%,54%,.3);
                    border-radius: 8px;
                    align-items: flex-start;
                    margin-top: 20px;
                    margin-bottom: 32px;
                    .flag {
                        display: flex;
                        gap: 20px;
                        align-items: center;
                        color: #ad8d65;
                    }
                    .world-desc {
                        padding-top: 10px;
                        font-size: 16px;
                        color: #aaa;
                    }
                    a {
                        color: #ad8d65;
                        padding-left: 5px;
                        padding-right: 5px;
                    }
                    .check-button {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        margin-top: 16px;
                        .el-button {
                            width: 100%;
                            line-height: 0;
                            height: 30px;
                            border-color: transparent;
                            background-color: #ad8d65;
                            padding: 12px 10px;
                            color: #000000;
                        }
                    }
                }
                .list {
                    .el-tabs__nav {
                    }
                    .el-tabs__item {
                        color: #aaa;
                        font-weight: 500;
                        height: 36px;
                        line-height: 36px;
                        font-size: 16px;
                        padding: 0 10px;
                        margin-left: 10px;
                        margin-right: 10px
                    }
                    .el-tabs__active-bar {
                        display: none;
                    }
                    .el-tabs__item.is-active {
                        color: #ad8d65;
                        background-color: #282828;
                        border-radius: 6px;
                    }
                    .el-tabs__nav-wrap::after {
                        height: 0;
                    }
                    .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
                        padding-left: 10px;
                        margin-left: 0;
                    }
                    .el-select {
                        width: 300px;
                    }
                    .el-input__inner {
                        width: 300px;
                        color: #aaa;
                        border-color: #525252;
                        background-color: transparent;
                    }
                    .search-button {
                        background-color: #ad8d65;
                        border: 0;
                        color: rgb(12, 12, 12);
                    }
                    .mobile-form {
                        display: flex;
                        width: 100%;
                        gap: 5px;
                        align-items: center;
                        justify-content: center;
                        .el-select {
                            width: 100px;
                            // margin-right: 10px;
                            .el-input__inner {
                                width: 100px;
                            }
                        }
                        .el-form-item {
                            margin-right: 0;
                            margin-bottom: 0;
                        }
                        .el-input__inner {
                            max-width: 150px;
                            min-width: 100px;
                        }
                    }
                }
                .idenser {
                    color: #fff;
                    font-size: 16px;
                    margin-top: 24px;
                }
                .cls-list {

                }
            }

            .select-card {
                position: fixed;
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
                            display: flex;
                            .el-button {
                                display: flex;
                                align-items: center;
                                gap: 5px;
                                background: hsla(0, 0%, 50%, .2);
                                color: #aaa;
                                border: 1px solid transparent;
                                height: 48px;
                                span {
                                    display: contents;
                                }
                            }
                            .el-button--primary.is-disabled:hover {
                                background: hsla(0, 0%, 50%, .2);
                                color: #aaa;
                            }
                            .merge-border {
                                border: 1px solid #ad8d65;
                                color: #ad8d65
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
                    display: block;
                    font-size: 12px;
                    padding-top: 24px;
                    padding-bottom: 24px;
                    .el-checkbox {
                        color: #aaa;
                        font-size: 14px;
                        margin-right: 16px;
                    }
                    .left {
                        display: flex;
                        justify-content: left;
                    }
                    .right {
                        display: block;
                        .sweep-button {
                            width: 100%;
                            margin-top: 16px;
                        }
                        .el-button {
                            width: 100%;
                            justify-content: center;
                        }
                    }
                }
            }
            .select-card-mobile {
                height: 176px;
            }

            .merge-items {
                .el-dialog {
                    background-color: #202020;
                    .el-dialog__header {
                        .el-dialog__title {
                            color: #fff;
                        }
                    }
                    .dialog-content {
                        display: flex;
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
                        }
                    }
                }
            }
            .split-items {
                .el-dialog {
                    background-color: #202020;
                    .el-dialog__header {
                        .el-dialog__title {
                            color: #fff;
                        }
                    }
                    .dialog-content {
                        display: flex;
                        flex-direction: column;
                        .cfxid-number {
                            display: flex;
                            justify-content: space-between;
                            color: rgb(255, 255, 255/1)
                        }
                        .desc {
                            color: #aaa;
                            font-size: 14px;
                            margin-top: 10px;
                        }
                        .total-message {
                            display: flex;
                            margin-top: 12px;
                            align-items: center;
                            border-radius: 4px;
                            padding: 12px;
                            background-color: hwb(33 40% 32% / 0.3);
                            color: #ad8d65;
                            gap: 10px;
                        }
                        .split-number {
                            display: flex;
                            margin-top: 5px;
                            background-color: #282828;
                            overflow-y: auto;
                            border-radius: 8px;
                            padding: 20px;
                            margin-bottom: 24px;
                            max-height: 300px;
                            flex-direction: column;
                            gap: 16px;
                            .el-input__inner {
                                background-color: transparent;
                                color: #fff;
                                border-color: #525252;
                                height: 48px;
                            }
                            .el-input-group__prepend {
                                background-color: transparent;
                                border-color: #525252;
                                cursor: pointer;
                            }
                            .el-input-group__append {
                                background-color: transparent;
                                border-color: #525252;
                                cursor: pointer;
                            }
                        }
                        .button-dialog {
                            color: #aaa;
                            font-size: 14px;
                            // padding-top: 12px;
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
                        }
                    }
                }
            }
            .transfer-items {
                .el-dialog {
                    background-color: #202020;
                    .el-dialog__header {
                        .el-dialog__title {
                            color: #fff;
                        }
                    }
                    .dialog-content {
                        display: flex;
                        padding: 0 16px;
                        flex-direction: column;
                        gap: 8px;
                        .set-address {
                            justify-content: space-between;
                            display: flex;
                            color: #aaa;
                        }
                        .input-address {
                            .el-input:hover {
                                border: 0;
                            }
                            .el-input__inner:hover {
                                border: 1px solid #ad8d65;
                            }
                            .el-input__inner {
                                background-color: transparent;
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
                            .el-button--primary.is-disabled {
                                background: hsla(0, 0%, 50%, .2);
                                color: #aaa;
                            }
                            .el-button--primary.is-disabled:hover {
                                background: hsla(0, 0%, 50%, .2);
                                color: #aaa;
                            }
                            .merge-border {
                                border: 1px solid #ad8d65;
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
            }

            .buy-now-dialog {
                .el-dialog {
                    background-color: #202020;
                    .el-dialog__header {
                        .el-dialog__title {
                            color: #fff;
                        }
                    }
                    .el-dialog__body {
                        padding-top: 10px;
                    }
                    .dialog-content {
                        display: flex;
                        flex-direction: column;
                        .items-count {
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                            color: #aaa;
                            .el-checkbox {
                                color: #aaa;
                            }
                            .el-checkbox__label {
                                font-size: 12px;
                                padding-left: 3px;
                            }
                            .el-checkbox__inner {
                                background-color: transparent;
                            }
                            .el-checkbox__input.is-checked+.el-checkbox__label {
                                color: #aaa;
                            }
                            .el-checkbox__input.is-checked .el-checkbox__inner {
                                background-color: #ad8d65;
                                border-color: #ad8d65;
                            }
                        }
                        .button-dialog {
                            color: #aaa;
                            font-size: 14px;
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
                        }
                    }
                    .set-unit-price {
                        display: flex;
                        padding: 20px;
                        background-color: #282828;
                        border-radius: 8px;
                        overflow-y: auto;
                        gap: 10px;
                        flex-direction: column;
                        max-height: 300px;
                        margin-top: 5px;
                        margin-bottom: 24px;
                        color: #aaa;
                        .input-price {
                            display: flex;
                            flex-direction: column;
                            gap: 8px;
                            .top-text {
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                margin-top: 10px;
                            }
                            .input-number {
                                display: flex;
                                width: 100%;
                                position: relative;
                                .el-input {
                                    .el-input__inner {
                                        background-color: transparent;
                                        border-color: #525252;
                                        color: #fff;
                                    }
                                    .el-input__inner:hover {
                                        border: 1px solid#ad8d65;
                                    }
                                    .el-input__suffix {
                                        display: flex;
                                        align-items: center;
                                        margin-right: 5px;
                                        div {
                                            display: flex;
                                            align-items: center;
                                            font-size: 12px;
                                            gap: 5px;
                                        }
                                    }
                                }
                            }
                            .total-price {
                                display: flex;
                                justify-content: space-between;
                            }
                        }
                    }
                    .duration {
                        display: flex;
                        gap: 8px;
                        margin-top: 5px;
                        flex-direction: column;
                        .el-date-editor.el-input, .el-date-editor.el-input__inner {
                            width: auto;
                        }
                        .el-input__inner {
                            background-color: transparent;
                            border-color: #525252;
                            color: #fff;
                        }
                        .el-input__inner::placeholder {
                            color: #aaa;
                        }
                    }
                    .locked, .sale-price, .market-fee, .total-potear {
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-top: 10px;
                        color: #aaa;
                        .number {
                            color: #fff;
                        }
                    }
                }
            }

            .resolve-address {
                .el-dialog {
                    background-color: #202020;
                    .el-dialog__header {
                        .el-dialog__title {
                            color: #fff;
                        }
                    }
                    .el-dialog__body {
                        padding-top: 10px;
                    }
                    .dialog-content {
                        display: flex;
                        flex-direction: column;
                        .address {
                            display: flex;
                            color: #aaa;
                        }
                        .input-number {
                            display: flex;
                            width: 100%;
                            position: relative;
                            justify-content: space-between;
                            gap: 10px;
                            .el-input {
                                .el-input__inner {
                                    height: 48px;
                                    background-color: transparent;
                                    border-color: #525252;
                                    color: #fff;
                                }
                                .el-input__inner:hover {
                                    border: 1px solid#ad8d65;
                                }
                                .el-input__suffix {
                                    display: flex;
                                    align-items: center;
                                    margin-right: 5px;
                                    div {
                                        display: flex;
                                        align-items: center;
                                        font-size: 12px;
                                        gap: 5px;
                                    }
                                }
                            }
                        }
                        .my-address {
                            display: flex;
                            align-items: center;
                            .el-input__inner:hover {
                                border: 1px solid#ad8d65;
                            }
                            .el-button {
                                background-color: transparent;
                                height: 48px;
                                border: 1px solid#ad8d65;
                                span {
                                    display: flex;
                                    align-items: center;
                                    gap: 5px;
                                }
                            }
                            .el-button:hover {
                                background-color: #ad8d65;
                                color: #282828;
                            }
                        }
                        .button-dialog {
                            color: #aaa;
                            font-size: 14px;
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
                            .el-button--primary.is-disabled {
                                background: hsla(0, 0%, 50%, .2);
                                color: #aaa;
                            }
                            .el-button--primary.is-disabled:hover {
                                background: hsla(0, 0%, 50%, .2);
                                color: #aaa;
                            }
                            .merge-border {
                                border: 1px solid #ad8d65;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
