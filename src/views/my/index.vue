<template>
    <div class="container">
        <div class="content">
            <div class="tab-nav">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="My CFXs" name="1">
                        <div class="new-world">
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
                        <div class="list">
                            <el-tabs v-model="activeName2">
                                <el-form :inline="true" :model="formSearch">
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
                                <el-tab-pane label="General" name="general">
                                    <Card :dataList="dataList" @buyNowClick="buyNowClick" :highlightedIndices="highlightedIndices" @toggleHighlight="toggleHighlight"></Card>
                                </el-tab-pane>
                                <el-tab-pane label="Images" name="image">
                                    <Card :dataList="dataList" @buyNowClick="buyNowClick"></Card>
                                </el-tab-pane>
                                <el-tab-pane label="Audio" name="audio">
                                    <Card :dataList="dataList" @buyNowClick="buyNowClick"></Card>
                                </el-tab-pane>
                                <el-tab-pane label="Text" name="text">
                                    <Card :dataList="dataList" @buyNowClick="buyNowClick"></Card>
                                </el-tab-pane>
                                <el-tab-pane label="Inscription" name="inscription">
                                    <Card :dataList="dataList" @buyNowClick="buyNowClick"></Card>
                                </el-tab-pane>
                                <el-tab-pane label="Name" name="name">
                                    <Card :dataList="dataList" @buyNowClick="buyNowClick"></Card>
                                </el-tab-pane>
                              </el-tabs>
                          </div>
                    </el-tab-pane>
                    <el-tab-pane label="Orders" name="2">Orders</el-tab-pane>
                    <el-tab-pane label="CLS" name="3">CLS</el-tab-pane>
                </el-tabs>
            </div>
        </div>
    </div>
</template>
<script>
import { get, post } from "@/common/axios.js";
import { mapGetters, mapState } from "vuex";
import { keepDecimalNotRounding } from "@/utils/tools";
import { approve } from "@/wallet/trade";
import { getBalance, isApproved } from "@/wallet/serve";
import Address from '@/wallet/address.json'
import CardBox from './card.vue';
export default {
    name: '',
    data() {
        return {
            screenWidth: document.body.clientWidth,
            activeName: '1',
            activeName2: 'general',
            loading: false,
            approve: false,
            formSearch: {
                searchName: '',
                minPrice: '',
                maxPrice: '',
                address: '',
            },
            dataList: [{
                id: '123456',
                date: '2016-05-02',
                price: '0.001',
                number: '100',
                address: 'cfxtest:aanwh44dw05dt1pbac1703fpf0me61nkvas5r6v6hy',
            }, {
                id: '123456',
                date: '2016-05-02',
                price: '0.001',
                number: '100',
                address: 'cfxtest:aanwh44dw05dt1pbac1703fpf0me61nkvas5r6v6hy',
            }, {
                id: '123456',
                date: '2016-05-02',
                price: '0.001',
                number: '100',
                address: 'cfxtest:aanwh44dw05dt1pbac1703fpf0me61nkvas5r6v6hy',
            }],
            highlightedIndices: [],
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
            gamesFillingAddress: state => state.base.gamesFillingAddress,
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
        } catch (err) { }
    },
    watch: {
        isConnected: {
            immediate: true,
            async handler(val) {
                if (val) {
                    this.refreshData();
                }
            }
        },
        changeData: {
            immediate: true,
            async handler(val) {
                if (val.address) {
                    await this.getIsApprove();
                }
            }
        },
    },
    components: {
        "Card": CardBox,
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
        onSubmit() {
            console.log('submit!');
        },
        buyNowClick(row) {
            console.log(row);
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
        startApprove() { //批准LUSD
            const loading = this.$loading({
                lock: true,
                text: 'transaction in progress',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            this.trading = true;
            approve(Address.BTCB, this.gamesFillingAddress).then((hash) => {
                // console.log(result);
                loading.close();
                if (hash) {
                    this.approve = true;
                    this.trading = false;
                }
            }).finally(() => {
                loading.close();
                this.trading = false;
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
                }
            }
        }
    }
}
</style>
