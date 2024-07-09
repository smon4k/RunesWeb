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
                            <div class="number">Total Supply:12,304,407 (58.59%)</div>
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
                                <div class="number">Total Supply:12,304,407 (58.59%)</div>
                            </div>
                        </div>
                    </div>
                    <div class="desc">CFXs is not just a Rune. It is a new paradigm of decentralized BTC consensus, integrating the advantages of both UTXO and account models.</div>
                </el-col>
              </el-row>

              <div class="datastatistics">
                <el-row :gutter="screenWidth > adaptiveSize ? 24 : 10">
                    <el-col :xs="8" :sm="4" :md="3">
                        <div class="content">
                            <div class="name">Floor</div>
                            <div class="price">$0.40</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="3">
                        <div class="content">
                            <div class="name">Floor</div>
                            <div class="price">$0.40</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="3">
                        <div class="content">
                            <div class="name">Floor</div>
                            <div class="price">$0.40</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="3">
                        <div class="content">
                            <div class="name">Floor</div>
                            <div class="price">$0.40</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="3">
                        <div class="content">
                            <div class="name">Floor</div>
                            <div class="price">$0.40</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="3">
                        <div class="content">
                            <div class="name">Floor</div>
                            <div class="price">$0.40</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="2">
                        <div class="content">
                            <div class="name">Floor</div>
                            <div class="price">$0.40</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="2">
                        <div class="content">
                            <div class="name">Floor</div>
                            <div class="price">$0.40</div>
                        </div>
                    </el-col>
                    <el-col :xs="8" :sm="4" :md="2">
                        <div class="content">
                            <div class="name">Floor</div>
                            <div class="price">$0.40</div>
                        </div>
                    </el-col>
                </el-row>
              </div>

              <data class="list">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-form :inline="true" :model="formSearch">
                        <el-form-item label="">
                            <el-select v-model="formSearch.searchName" placeholder="请选择">
                                <el-option label="Price low to high" value="1">
                                    <img :src="require('@/assets/svg/price-low-high.svg')" alt="" width="20">
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
                            <el-input v-model="formSearch.address" placeholder="ID or owner address"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button class="search-button" type="primary" @click="onSubmit">Apply</el-button>
                        </el-form-item>
                    </el-form>
                    <el-tab-pane label="General" name="general">
                        <div class="card">
                            <el-row :gutter="screenWidth > adaptiveSize ? 24 : 10">
                                <el-col :xs="12" :sm="6" :md="4">
                                    <div class="content">
                                        <div class="top">
                                            <div class="currency">
                                                <img :src="require('@/assets/svg/rune.svg')" alt="" width="20">
                                                <div class="currency-name">CFXs</div>
                                            </div>
                                            <div class="quantity">
                                                <div class="count-num">100</div>
                                                <div class="price-currency"><font color="#ad8d65">$0.065</font> / CFXs</div>
                                            </div>
                                            <div class="time">
                                                <img :src="require('@/assets/svg/time.svg')" alt="" width="12">
                                                10-16 10:06
                                            </div>
                                        </div>
                                        <div class="bottom">
                                            <div class="ids-num">
                                                <div class="ids">#1235897445</div>
                                                <div class="num">
                                                    <img :src="require('@/assets/svg/usdt.svg')" alt="" width="16">
                                                    <div class="">25.500</div>
                                                </div>
                                            </div>
                                            <div class="address-but">
                                                <div class="address">0xd5...A845</div>
                                                <div class="buy-now"><el-button @click="buyNowClick()">Buy Now</el-button></div>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                                <el-col :xs="12" :sm="6" :md="4">
                                    <div class="content">
                                        <div class="top">
                                            <div class="currency">
                                                <img :src="require('@/assets/svg/rune.svg')" alt="" width="20">
                                                <div class="currency-name">CFXs</div>
                                            </div>
                                            <div class="quantity">
                                                <div class="count-num">100</div>
                                                <div class="price-currency"><font color="#ad8d65">$0.065</font> / CFXs</div>
                                            </div>
                                            <div class="time">
                                                <img :src="require('@/assets/svg/time.svg')" alt="" width="12">
                                                10-16 10:06
                                            </div>
                                        </div>
                                        <div class="bottom">
                                            <div class="ids-num">
                                                <div class="ids">#1235897445</div>
                                                <div class="num">
                                                    <img :src="require('@/assets/svg/usdt.svg')" alt="" width="16">
                                                    <div class="">25.500</div>
                                                </div>
                                            </div>
                                            <div class="address-but">
                                                <div class="address">0xd5...A845</div>
                                                <div class="buy-now"><el-button @click="buyNowClick()">Buy Now</el-button></div>
                                            </div>
                                        </div>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="Images" name="image">配置管理</el-tab-pane>
                    <el-tab-pane label="Audio" name="audio">角色管理</el-tab-pane>
                    <el-tab-pane label="Text" name="text">定时任务补偿</el-tab-pane>
                    <el-tab-pane label="Inscription" name="inscription">定时任务补偿</el-tab-pane>
                    <el-tab-pane label="Name" name="name">定时任务补偿</el-tab-pane>
                  </el-tabs>
              </data>
              
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
export default {
    name: '',
    data() {
        return {
            screenWidth: document.body.clientWidth,
            activeName: '1',
            loading: false,
            approve: false,
            formSearch: {
                searchName: '',
                minPrice: '',
                maxPrice: '',
                address: '',
            }
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
                    // await this.getIsApprove();
                }
            }
        },
    },
    components: {

    },
    methods: {
        handleClick(row) {
            console.log(row);
        },
        onSubmit() {
            console.log('submit!');
        },
        buyNowClick() {
            console.log('buyNowClick!');
        },
        refreshData() { //定时刷新数据
            this.timeInterval = setInterval(async () => {
            }, this.refreshTime)
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
            }
            .card {
                .content {
                    display: block;
                    background-color: #181818;
                    border: 2px solid #202020;
                    border-radius: 8px;
                    // height: 276px;
                    margin-bottom: 24px;
                    .top {
                        padding: 16px;
                        .currency {
                            display: flex;
                            align-items: center;
                            .currency-name {
                                color: #ad8d65;
                                font-size: 16px;
                                margin-left: 8px;
                            }
                        }
                        .quantity {
                            display: block;
                            justify-content: center;
                            margin-top: 16px;
                            margin-bottom: 16px;
                            text-align: center;
                            .count-num {
                                font-size: 24px;
                                font-weight: 500;
                                color: #fff;
                            }
                            .price-currency {
                                font-size: 14px;
                                margin-top: 4px;
                            }
                        }
                        .time {
                            display: flex;
                            width: max-content;
                            align-items: center;
                            border: 0 solid #e5e7eb;
                            color: #aaa;
                            background-color: #202020;
                            gap: 5px;
                            font-size: 12px;
                            padding: 0 5px;
                            border-radius: 3px;
                        }
                    }
                    .bottom {
                        display: flex;
                        // height: 77px;
                        padding: 16px;
                        background-color: #282828;
                        justify-content: space-between;
                        flex-direction: column;
                        border-bottom-left-radius: 8px; 
                        border-bottom-right-radius: 8px; 
                        font-size: 12px;
                        .ids-num {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            .ids {
                                color: #aaa;
                            }
                            .num {
                                display: flex;
                                gap: 3px;
                                align-items: center;
                            }
                        }
                        .address-but {
                            display: flex;
                            margin-top: 15px;
                            justify-content: space-between;
                            align-items: center;
                            .address {
                                color: #aaa;
                            }
                            .el-button {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                border-color: #ad8d65;
                                background-color: transparent;
                                height: 30px;
                                width: 80px;
                                color: #ad8d65;
                            }
                        }
                    }
                }
            }
        }
    }
    @media (max-width: 960px) {
        /deep/ {
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
            .card {
                .content {
                    margin-bottom: 10px !important;
                }
            }
        }
    }
}

</style>
