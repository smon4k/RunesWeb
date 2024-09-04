<template>
    <div class="nav-container">
        <div class="container">
            <div class="headerNav-container">
                <div class="sider-inner">
                    <!-- v-if="screenWidth < 1280" -->
                    <div class="logo" v-if="screenWidth > adaptiveSize">
                        <router-link to="/" class="logo-link">
                            <img src="@/assets/svg/logo-cfxs.svg" alt="" />
                        </router-link>
                    </div>
                    <div class="menu" @click="menuDrawerShow = true" v-else>
                        <img src="@/assets/menu.png" alt="" />
                    </div>
                    <!-- <div class="title" v-show="screenWidth > adaptiveSize"> CFXS WORLD </div> -->
                    <!-- PC端导航 -->
                    <div v-if="screenWidth > adaptiveSize">
                        <el-menu class="el-menu-demo" v-if="navList.length" :default-active="$route.path"
                            mode="horizontal" @select="handleSelect" :router="true" menu-trigger="click"
                            @open="menuSelectOpen" :collapse-transition="false" :default-openeds="defaultOpenedsArray"
                            :unique-opened="true">
                            <template v-for="(item, index) in navList">
                                <el-menu-item :index="item.path" v-if="!item.children.length" :key="index">{{ item.name
                                    }}</el-menu-item>
                                <el-submenu v-else :index="item.path == '#' ? item.path + item.id : item.path" :key="item.id">
                                    <template slot="title">{{ item.name }}</template>
                                    <div v-for="(childe, keye) in item.children" :key="keye">
                                        <el-menu-item :index="childe.path">{{ childe.name }}</el-menu-item>
                                    </div>
                                </el-submenu>
                            </template>
                        </el-menu>
                    </div>
                </div>

                <div class="mobile-log" v-if="screenWidth <= adaptiveSize">
                    <div class="logo">
                        <router-link to="/" class="logo-link">
                            <img :src="require('@/assets/svg/cfxs-world.svg')" alt="" width="124">
                        </router-link>
                    </div>
                    <!-- <div class="title"> CFXS WORLD </div> -->
                </div>
                
                <div class="connent">
                    <div class="connectWallet" v-if="screenWidth > adaptiveSize && isConnected">
                        <img :src="require('@/assets/svg/espace.svg')" alt="" width="24">
                        <span>sSpace</span>
                    </div>
                    <el-popover
                        v-if="isConnected"
                        placement="bottom"
                        title=""
                        width="350"
                        trigger="click"
                        popper-class="wallet-popover"
                        @show="walletPopoverShow"
                        v-model="walletPopoverIsShow">
                        <div class="wallet-info">
                            <div class="userinfo">
                                <div class="left">
                                    <img :src="require('@/assets/svg/user.svg')" alt="" width="46">
                                    <div>{{ addressStr }}</div>
                                    <img :src="require('@/assets/svg/copy.svg')" alt="" width="14" @click="copyAddress">
                                </div>
                                <div class="right">
                                    <img :src="require('@/assets/svg/outlogin.svg')" alt="" width="24" @click="outContentAddress">
                                </div>
                            </div>
                            <div class="button-market">
                                <el-button type="primary" @click="hrefMarketRouter">CFXs MARKET</el-button>
                                <el-button type="primary" @click="buyCoinHref">BUY COIN</el-button>
                            </div>
                            <div class="tab-list">
                                <el-tabs v-model="typeName" @tab-click="tabClickSelect">
                                    <el-tab-pane label="CFXs" name="0">
                                        <div class="data-list">
                                            <div class="item" v-for="(item, index) in dataList" :key="index">
                                                <div class="left">
                                                    <img :src="require('@/assets/svg/cfxs-black.svg')" alt="" width="40">
                                                    <span>#{{ item.chainid }}</span>
                                                </div>
                                                <div class="right">{{ item.amount }}</div>
                                            </div>
                                        </div>
                                        <div class="no-more">
                                            <span v-if="isNoMoreData">No More</span>
                                            <div v-else class="load-more">
                                                <div v-if="!loading" @click="onLoadMoreDataClick">Load more</div>
                                                <div v-if="loading" class="loading-icon">
                                                    <div class="loading-container">
                                                        <div class="loading-spinner"></div>
                                                    </div>
                                                    <span>加载中</span>
                                                </div>
                                            </div>
                                        </div>
                                    </el-tab-pane>
                                    <el-tab-pane label="NFT" name="1">
                                        <div class="data-list">
                                            <div class="item" v-for="(item, index) in dataList" :key="index">
                                                <div class="left">
                                                    <img :src="require('@/assets/svg/cfxs-red.svg')" alt="" width="40">
                                                    <span>#{{ item.tokenid }}</span>
                                                </div>
                                                <div class="right">value: {{ item.amount }}</div>
                                            </div>
                                        </div>
                                        <div class="no-more">
                                            <span v-if="isNoMoreData">No More</span>
                                            <div v-else class="load-more">
                                                <div v-if="!loading" @click="onLoadMoreDataClick">Load more</div>
                                                <div v-if="loading" class="loading-icon">
                                                    <div class="loading-container">
                                                        <div class="loading-spinner"></div>
                                                    </div>
                                                    <span>加载中</span>
                                                </div>
                                            </div>
                                        </div>
                                    </el-tab-pane>
                                    <el-tab-pane label="Coin" name="2">
                                        <div class="data-list">
                                            <div class="item">
                                                <div class="left">
                                                    <img :src="require('@/assets/svg/cfxs-white.svg')" alt="" width="40">
                                                </div>
                                                <div class="right">{{ CoinBalance }}</div>
                                            </div>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                        </div>
                        <div slot="reference" class="connectWallet">
                            <img :src="require('@/assets/svg/online.svg')" alt="" width="12">
                            {{ addressStr }}
                        </div>
                    </el-popover>
                    <div class="connect-wallect-btn" v-else>
                        <el-button type="primary" @click="connectWalletShowFun" v-if="screenWidth > adaptiveSize"><img :src="require('@/assets/svg/wallet.svg')" alt="" width="20">CONNECT WALLET</el-button>
                        <div @click="connectWalletShowFun" v-else><img :src="require('@/assets/svg/wallet-yello.svg')" alt="" width="20"></div>
                    </div>
                </div>
            </div>


            <!-- 移动端导航 -->
            <el-drawer title="我是标题" :visible.sync="menuDrawerShow" :with-header="false" direction="ltr" size="300px">
                <div class="sider-inner">
                     <div style="display: block;position: absolute;top: -6px;" @click="menuDrawerShow = false">
                         <svg xmlns="http://www.w3.org/2000/svg" @click="walletDialogShow = false" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="#fff" stroke-linecap="round" stroke-width="1.4" d="M4.929 4.929 19.071 19.07M19.071 4.929 4.929 19.07"></path></svg>                    
                     </div>
                </div>
                <br><br>
                <el-menu v-if="navList.length" :default-active="$route.path" class="el-menu-vertical-demo"
                    :router="true" @select="handleSelect" @open="menuSelectOpen" :collapse-transition="false"
                    :default-openeds="defaultOpenedsArray">
                    <template v-for="(item, index) in navList">
                        <el-menu-item :index="item.path" v-if="!item.children.length" :key="index">{{ item.name
                            }}</el-menu-item>
                        <el-submenu v-else :index="item.path == '#' ? item.path + item.id : item.path" :key="item.id">
                            <template slot="title">{{ item.name }}</template>
                            <div v-for="(childe, keye) in item.children" :key="keye">
                                <el-menu-item :index="childe.path">{{ childe.name }}</el-menu-item>
                            </div>
                        </el-submenu>
                    </template>
                </el-menu>
            </el-drawer>
        </div>

        <el-dialog title="连接钱包" :visible.sync="walletDialogShow" :width="isMobel ? '80%' : '50%'" center class="wallet-dialog">
            <el-row :gutter="8">
                <el-col :span="isMobel ? 24 : 12" align="center">
                    <div class="item" @click="connectWallet(1)">
                        <img src="@/assets/metamask.svg" alt="" width="100">
                        <div class="text">MetaMask</div>
                    </div>
                </el-col>
                <el-col :span="isMobel ? 24 : 12" align="center">
                    <div class="item" @click="connectWallet(2)">
                        <img src="@/assets/Tronlink.svg" alt="" width="100">
                        <div class="text">Tronlink</div>
                    </div>
                </el-col>
                <el-col :span="isMobel ? 24 : 12" align="center">
                    <div class="item" @click="connectWallet(3)">
                        <img src="@/assets/WalletConnect.png" alt="" width="100">
                        <div class="text">WalletConnect</div>
                    </div>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>
<script>
import { get } from "@/common/axios.js";
import Address from '@/wallet/address.json'
import { networkSetup, getChainNameId } from '@/wallet/connect/metaMask'
import { connect } from '@/wallet/connect/tronWeb'
import { walletConnect, disconnectWallet } from '@/wallet/connect/walletConnect'
import { mapGetters, mapState } from "vuex";
import { getBalance, getUserPlatformBalance, getCurrencyTokenList } from "@/wallet/serve";
import { keepDecimalNotRounding } from "@/utils/tools";
import TOKEN from '@/wallet/token.js'
export default {
    name: 'headerNav',
    data() {
        return {
            activeLang: 'EN',
            activeTheme: 'dark',
            activeMintNav: 'All',
            activeLiquidation: '',
            language: 'CN',
            nftRewardList: [],
            window: window,
            screenWidth: document.body.clientWidth,
            timer: null,
            activeIndex: '1',
            menuDrawerShow: false,
            defaultOpenedsArray: [],
            isHashpowerMenu: false,
            lusdBalance: 0.00,
            chain_name: 'HECO',
            currencyTokenList: [],
            walletDialogShow: false,
            typeName: '0',
            isNoMoreData: false, 
            loading: false,
            currPage: 1, //当前页
            pageSize: 18, //每页显示条数
            total: 100, //总条数
            dataList: [],
            CoinBalance: 0,
            walletPopoverIsShow: false,
        }
    },
    components: {

    },
    mounted() {
        window.onresize = () => {
            this.screenWidth = document.body.clientWidth;
        }
    },
    computed: {
        ...mapState({
            address: state => state.base.address,
            chainName: state => state.base.chainName,
            isConnected: state => state.base.isConnected,
            mainTheme: state => state.comps.mainTheme,
            apiUrl: state => state.base.apiUrl,
            isAdmin: state => state.base.isAdmin,
            isMobel: state => state.comps.isMobel,
            adaptiveSize: state => state.comps.adaptiveSize,
        }),
        ...mapGetters(['pendingOrderAmount']),
        addressStr() {
            // console.log(this.address);
            if (!this.address || this.address == undefined || this.address == '') {
                return "Connect Wallet";
            } else {
                return this.address.substring(0, 4) + "***" + this.address.substring(this.address.length - 3)
            }
        },
        isTotalMintPath() {
            return this.$route.path === '/totalMinting'
        },
        isLiquidation() {
            // return this.$route.path.indexOf('Liquidation') !== -1
            return this.$route.path.indexOf('position') !== -1
        },
        currentPath() {
            return this.$route.path
        },
        navList() { //导航菜单
            let arr = [
                // 市场
                {
                    name: 'Market',
                    path: "/home",
                    children: [],
                    isHref: false,
                },
                // 兑换
                {
                    name: 'Wormhole',
                    path: "/exchange/deposit",
                    children: [],
                    isHref: false,
                },
                // 我的
                {
                    name: 'My',
                    path:"/my",
                    children: [],
                    isHref: false,
                },
                // 发布
                {
                    name: 'Inscribe',
                    path: "/inscribe",
                    children: [],
                    isHref: false,
                },
                //文档
                {
                    name: 'Documents',
                    path: "/documents",
                    children: [],
                    isHref: false,
                },
            ];
            // if(!this.isAdmin) {
            //     arr.splice(arr.length - 2, 2);
            // }
            return arr;
        }
    },
    created() {
        try {
            document.documentElement.setAttribute("data-theme", 'dark')
            let theme = "light";
            // theme  = localStorage.getItem('theme')
            if (theme === 'light' || theme === 'dark') {
                this.activeTheme = theme
            } else {
                theme = "dark";
                this.activeTheme = "dark"
            }
            localStorage.setItem('theme', this.activeTheme)
            document.documentElement.setAttribute("data-theme", theme)

            let language = "";
            // localStorage.setItem('i18nextLng', language);
            language = localStorage.getItem('i18nextLng');
            if (language && language !== undefined) {
                this.language = language;
            }
            let chain_name = "";
            chain_name = localStorage.getItem('chainName');
            if (chain_name && chain_name !== undefined) {
                this.chain_name = chain_name;
            }
            //  this.getCurrencyTokenList();
        } catch (err) { }
        // if(this.currentPath.indexOf('Liquidation')){
        //     let subNav = this.currentPath.replace('/Liquidation/' , '')
        //     console.log('subNav' , subNav);
        //     if(subNav === 'all' || subNav === 'my'){
        //         this.activeLiquidation = subNav
        //     }
        // }
    },
    watch: {
        address: {
            immediate: true,
            async handler(val) {
                if (val) {
                    this.walletDialogShow = false;
                    await this.getCoinBalance();
                }
            }
        },
        isConnected: {
            immediate: true,
            async handler(val) {
                console.log(val);
            }
        },
        currentPath: {
            immediate: true,
            handler(val, old) {
                // console.log(val, old);
                // this.changeMintNav('All');
            }
        },
        $route: (val) => {
            console.log(val);
            // if(this.$route.path === '/hashpower/list') {
            //     this.isHashpowerMenu = true;
            // }
        }
    },
    methods: {
        walletPopoverShow() {
          this.typeName = "0";
          this.resettingList();
          this.getCfxsList();
        },
        resettingList() {
            this.dataList = [];
            this.isNoMoreData = false;
            this.currPage = 1;
        },
        onLoadMoreDataClick() {
            this.pageSize = 1;
            if(this.typeName === 'CFXs') {
                this.getCfxsList();
            }
        },
        tabClickSelect(tab) {
            this.resettingList();
            if(tab.index == "0") {
                this.getCfxsList();
            }
            if(tab.index == "1") {
                this.getMyNftData();
            }
            if(tab.index == "2") {
                this.getCoinBalance();
            }
        },
        getCfxsList(ServerWhere) { //获取CFXs列表
            if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
                ServerWhere = {
                    limit: this.pageSize,
                    page: this.currPage,
                    owner: this.address,
                };
            }
            this.loading = true;
            get(this.apiUrl + "/Api/Market/getMyMarketplaceData", ServerWhere, async json => {
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
        getMyNftData(ServerWhere) {
            if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
                ServerWhere = {
                    limit: this.pageSize,
                    page: this.currPage,
                    owner: this.address,
                };
            }
            this.loading = true;
            this.isNoMoreData = false;
            get(this.apiUrl + "/Api/Market/getMyNftData", ServerWhere, async json => {
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
        async getCoinBalance() {  //获取Coin余额
            const balance = await getBalance(Address.CFXsERC20TokenAddress, 18); //获取余额
            this.CoinBalance = balance;
        },
        hrefMarketRouter() {
            this.$router.push({ path: '/home' })
        },
        buyCoinHref() {
            window.open('https://app.swappi.io/#/swap', '_blank');
        },
        async copyAddress() {
            await navigator.clipboard.writeText(this.address);
        },
        handleSelect(index, path) { //菜单激活时事件
            // console.log(index, path);
            this.menuDrawerShow = false;
        },
        connectWalletShowFun() {
            this.walletDialogShow = true;
        },
        outContentAddress() {
            this.$disconnect();
            this.walletPopoverIsShow = false;
        },
        async connectWallet(index) {
            // return false;
            if (index == 1) {
                if (window.ethereum && window.ethereum.isMetaMask) {
                    if (this.address && this.address !== undefined && this.address !== '') {
                        this.$disconnect();
                    } else {
                        // console.log(222);
                        this.$connect();
                        // setTimeout(async () => {
                        //     location.reload(); //网络切换成功 刷新页面
                        // }, 300)
                    }
                } else {
                    this.$message({
                        message: 'You do not have metamask installed', // 自动下注已停止执行,
                        type: 'warning'
                    });
                }
            } else if (index == 2) {
                if (window.tronLink) {
                    if (this.address && this.address !== undefined && this.address !== '') {
                        this.$disconnect();
                    } else {
                        await connect();
                        // setTimeout(async () => {
                        //     location.reload(); //网络切换成功 刷新页面
                        // }, 300)
                    }
                } else {
                    this.$message({
                        message: 'You do not have TronLink installed', // 自动下注已停止执行,
                        type: 'warning'
                    });
                }
            } else if (index == 3) {
                if (this.address && this.address !== undefined && this.address !== '') {
                    await disconnectWallet();
                } else {
                    await walletConnect();
                    // setTimeout(async () => {
                    //     location.reload(); //网络切换成功 刷新页面
                    // }, 300)
                }
            }
            // console.log(this.isConnected);
            // if(this.isConnected) return 
            // await connectTronWebWallet();
        },
        changeLang(lang) {
            this.activeLang = lang
        },
        toAirdrop() {
            this.$router.push({ path: '/airdrop' })
        },
        changeTheme() {
            this.activeTheme = this.activeTheme === 'light' ? 'dark' : 'light'
            this.$store.commit('setMainTheme', this.activeTheme)
            localStorage.setItem('theme', this.activeTheme)
            document.documentElement.setAttribute("data-theme", this.activeTheme)
        },
        changeMintNav(val) {
            this.activeMintNav = val
            this.$store.commit('setMintTopNavCurrent', val)
        },
        changeLiquidationNav(val) {
            // console.log(val);
            if (this.activeLiquidation === val) return

            this.activeLiquidation = val
            if (val && val !== '') {
                this.$router.push({ path: '/position/' + val })
            } else {
                this.$router.push({ path: '/position' })
            }
        },
        substring(str) {
            var str1 = str.replace(str.substring(8, str.length - 4), "****");
            return str1;
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        },
        menuSelectOpen(index, indexPath) {
            let formPath = this.$route.path;
            console.log(index, formPath, indexPath, this.isHashpowerMenu);
            if (indexPath[0] && indexPath[0] !== '') {
                this.$router.push({ path: indexPath[0] })
            }
            // if(index !== formPath) {
            //     this.defaultOpenedsArray = [];
            // }
            // if((index === '/hashpower/list' && formPath !== '/hashpower/list') || (index === '/power/list' && formPath !== '/power/list')) {
            //     this.$router.push({path: indexPath[0]})
            //     this.isHashpowerMenu = true;
            //     this.menuDrawerShow = false;
            // }
        },
        depositWithdraw() { //充提
            if (this.$route.path !== "/depositWithdrawal") {
                this.$router.push({ path: '/depositWithdrawal' })
            }
        },
    }
}
</script>
<style lang="scss">
.el-menu--horizontal {
    .el-menu {
        background-color: #181818 !important;

        .el-menu-item {
            background-color: #181818;
            color: #fff;
        }

        .el-menu-item:hover {
            color: #fff;
        }

        .el-menu-item.is-active {
            color: #ad8d65;
        }
    }
}

.el-dropdown {
    color: #409EFF;
    font-size: 10px;
    // margin-right: 10px;
    padding: 3px 10px 3px 10px;
    // border: 2px solid #454848;
    border-radius: 50px;
    // height: 30px;
}

.el-dropdown-link {
    cursor: pointer;
    display: flex;
    justify-content: space-around;
    align-items: center;

    img {
        margin-right: 5px;
    }
}

// .popper-select {
//     position: absolute !important;
//     top: 23px !important;
//     left: 0 !important;
//     background-color: #1b1c23;
//     border: 0;
// }
.popper__arrow {
    left: 45px !important;
}

.el-dropdown-menu {
    background-color: #1b1c23;
    border: 0;
}

.el-dropdown-menu__item {
    font-size: 10px;
    padding: 0 10px;
    line-height: 35px;
    color: #fff;
    font-weight: bold;
    display: flex;
    // justify-content: space-around;
    align-items: center;

    img {
        margin-right: 10px;
    }
}

.el-dropdown-menu__item:hover {
    @include sideBarBgc($color-bgc-sideBar-dark);
}

.el-popper[x-placement^=top] {
    .popper__arrow::after {
        border-top-color: #1b1c23;
    }

    .popper__arrow {
        border-top-color: transparent;
    }
}
.wallet-popover {
    background: #202020;
    flex-direction: column;
    display: flex;
    border: 0 solid #e5e7eb;
    box-sizing: border-box;
    color: #aaa;
    padding: 32px 24px;
    .wallet-info {
        display: block;
        .userinfo {
            display: flex;
            justify-content: space-between;
            .left {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 10px;
                img {
                    cursor: pointer;
                }
            }
            .right {
                display: flex;
                align-items: center;
                img {
                    cursor: pointer;
                }
            }
        }
        .button-market {
            display: grid;
            margin-top: 24px;
            margin-bottom: 24px;
            gap: 12px;
            .el-button {
                gap: 12px;
                background-color: #ad8d65;
                border: 0;
                color: rgb(12, 12, 12);
                width: 100%;
                height: 48px;
            }
            .el-button+.el-button {
                margin-left: 0;
            }
        }
        .tab-list {
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
            .el-tabs__content {
                height: 300px;
                overflow-y: auto;
            }
            .data-list {
                display: grid;
                grid-template-columns: repeat(1, 1fr);
                gap: 16px;
                padding-top: 20px;
                .item {
                    display: flex;
                    justify-content: space-between;
                    gap: 16px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #fff;
                    .left {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    .right {
                        display: flex;
                        align-items: center;
                    }
                }
            }
            .no-more {
                width: 100%;
                height: 60px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 20px;
                font-size: 14px;
                .load-more {
                    color: #ad8d65;
                    cursor: pointer;
                    .loading-icon {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        gap: 5px;
                    }
                    /* 定义动画名称为 spinner */
                    @keyframes spinner {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }
        
                    /* 应用动画到加载圈的类 */
                    .loading-spinner {
                        border: 3px solid #282828; /* 灰色边框 */
                        border-top: 3px solid #ad8d65; /* 蓝色顶部边框 */
                        border-radius: 50%; /* 圆形 */
                        width: 10px;
                        height: 10px;
                        animation: spinner 1s linear infinite; /* 应用动画 */
                    }
        
                    /* 可选：添加一些样式来隐藏加载圈的溢出 */
                    .loading-container {
                        display: inline-block;
                        position: relative;
                        overflow: hidden;
                    }
                }
            }
        }
    }
}

@media (max-width: 960px) {
    .wallet-popover {
        width: 100%!important;
        left: 0!important;
    } 
}
</style>
<style lang="scss" scoped>
/deep/ {
    .el-drawer {
        background-color: #181818;
    }

    .el-drawer__body {
        padding: 20px !important;
    }

    .sider-inner {
        display: flex;
        position: relative;
        // left: 30px;
        align-items: center;

        // top: 15px;
        // height: 100%;
        // min-height: 436px;
        .menu {
            img {
                width: 30px;
                cursor: pointer;
            }

            box-sizing: border-box;
            margin-right: 10px;
            margin-top: 5px;
        }

        .title {
            // display: flex;
            align-items: center;
            justify-content: space-around;
            flex-direction: column;
            font-weight: 900;
            color: #ad8d65;
            font-size: 20px;
        }

        .logo {
            margin-left: 20px;
            margin-right: 10px;
            height: 40px;
            box-sizing: border-box;

            .logo-link {
                display: block;
                height: 100%;
                text-align: center;

                img {
                    height: 40px;
                }

                span {
                    display: inline-block;
                    font-size: 16px;
                    @include mainFont($color-mainFont-light);
                    // color: #1C1C1B;
                    padding-top: 4px;
                    margin-left: -14px;
                }
            }
        }
    }

    .connent {
        display: flex;
        gap: 20px;
        .connect-wallect-btn {
            display: grid;
            gap: 12px;
            .el-button {
                gap: 12px;
                background-color: #ad8d65;
                border: 0;
                color: rgb(12, 12, 12);
                width: 100%;
                span {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
            }
            .el-button+.el-button {
                margin-left: 0;
            }
        }
    }

    .mobile-log {
        display: flex;
        align-items: center;
        gap: 5px;
        color: #ad8d65;
        font-weight: 600;
        font-size: 16px;
    }

    .el-menu {
        margin-left: 50px;
        background-color: transparent;
        border: 0;

        .el-menu-item {
            font-size: 15px;
            color: #fff;
            padding: 0 20px;
        }

        .el-menu-item:hover {
            background-color: #141a1f;
            color: #ad8d65;

        }

        .el-menu-item.is-active {
            background-color: transparent;
            color: #ad8d65;
            border-bottom: 0;
        }

        .el-submenu {
            .el-submenu__title i {
                color: #fff;
            }

            .el-submenu__title {
                color: #fff;
                border-bottom: 0;
            }

            .el-submenu__title:hover {
                background-color: transparent;
                color: #fff;
            }
        }

        // margin-top: 10px;
    }

    // .el-menu-item {
    //     font-size: 18px;
    //     .is-active {
    //         border-bottom: 4px solid #409EFF;
    //     }
    // }
    .el-menu-vertical-demo {
        width: 250px;
        margin-top: 16px !important;
        margin-left: 0 !important;
        .el-menu-item {
            background-color: #282828 !important;
            font-family: inherit;
            font-weight: 400;
            // font-size: 16px;
            padding-left: 30px;
            margin-bottom: 20px;
            color: #fff;
        }



        .el-menu-item:hover {
            background-color: rgb(27, 28, 35) !important;

        }

        .el-submenu {
            .el-submenu__title {
                font-size: 16px;
                font-weight: 400;
            }

            .el-submenu__title:hover {
                background-color: transparent !important;
            }
        }
    }

    .el-divider--horizontal {
        margin: 5px 0;
    }

    .totalMintNav {
        margin-right: auto;
        padding-left: 60px;
        display: flex;

        .item {
            min-width: 120px;
            margin-right: 8px;
            height: 63px;
            line-height: 63px;
            text-align: center;
            border-bottom: 2px solid transparent;
            box-sizing: border-box;
            cursor: pointer;
        }

        .active {
            color: #0096FF;
            font-weight: bold;
            border-color: #0096FF;
        }
    }

    .security-audit {
        cursor: pointer;
        height: 36px;
        // border: 1px solid #1C1C1B;
        // border-style: solid;
        // border-width: 1px;
        @include infoBoxBorder($infoBoxBorder-light);
        // border-radius: 8px;
        width: 150px;
        margin-right: 24px;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 115px;
            height: 29px;
        }
    }

    .language {
        display: flex;
        align-items: center;
        justify-content: center;
        // width: 40px;
        margin-right: 15px;

        button {
            height: 30px;
            line-height: 1px;
        }

        .el-dropdown {
            font-size: 10px;
            margin-right: 10px;
            padding: 3px 10px 3px 10px;
            border: 2px solid #454848;
            border-radius: 50px;
            // height: 30px;
        }

        .el-dropdown-link {
            cursor: pointer;
            display: flex;
            justify-content: space-around;
            align-items: center;
            color: #409EFF;

            .name {
                margin-left: 10px;
                font-weight: bold;
            }
        }

        .el-icon-arrow-down {
            font-size: 12px;
        }

        .popper-select {
            position: absolute !important;
            top: 23px !important;
            left: 0 !important;
            background-color: #1b1c23;
            border: 0;
        }

        .el-dropdown-menu__item {
            padding: 0 15px;
            color: #fff;
            font-weight: bold;
            display: flex;
            justify-content: space-around;
            align-items: center;

            img {
                margin-right: 5px;
            }
        }

        .el-dropdown-menu__item:hover {
            @include sideBarBgc($color-bgc-sideBar-dark);
        }

        img {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .popper__arrow {
            left: 45px !important;
        }

        .el-popper[x-placement^=bottom] {
            .popper__arrow::after {
                border-bottom-color: #1b1c23;
            }

            .popper__arrow {
                border-bottom-color: transparent;
            }
        }
    }

    .exchange-balance {
        .balance {
            margin-right: 10px;
        }

        .el-dropdown {
            color: #409EFF;
            font-size: 10px;
            margin-right: 10px;
            padding: 3px 10px 3px 10px;
            // border: 2px solid #454848;
            border-radius: 50px;
            // height: 30px;
        }

        .el-dropdown-link {
            cursor: pointer;
            display: flex;
            justify-content: space-around;
            align-items: center;

            img {
                margin-right: 5px;
            }
        }

        .popper-select {
            position: absolute !important;
            top: 23px !important;
            left: 0 !important;
            background-color: #1b1c23;
            border: 0;
        }

        img {
            width: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #fff;
            border-radius: 50%;
        }

        .popper__arrow {
            left: 45px !important;
        }

        .el-dropdown-menu__item {
            min-width: 65px;
            max-width: 80px;
            padding: 4px 20px;
            color: #fff;
            font-weight: bold;
            font-size: 13px;
            line-height: 20px !important;
        }

        .el-dropdown-menu__item:hover {
            @include sideBarBgc($color-bgc-sideBar-dark);
        }

        .el-popper[x-placement^=bottom] {
            .popper__arrow::after {
                border-bottom-color: #1b1c23;
            }

            .popper__arrow {
                border-bottom-color: transparent;
            }
        }
    }

    .exchange-chain {
        background-color: #454848;
        border-radius: 50px;
        height: 35px;
        line-height: 35px;
        padding: 0 15px;
        margin-right: 10px;

        .chain-name {
            width: 40px;
            text-align: center;
        }

        .el-dropdown {
            color: #409EFF;
            font-size: 10px;
            padding: 0;
            margin-right: 0;
        }

        .popper-select {
            position: absolute !important;
            top: 30px !important;
            left: -10px !important;
            background-color: #1b1c23;
            border: 0;
            width: 100px;
        }

        img {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .popper__arrow {
            left: 45px !important;
        }

        .el-dropdown-link {
            cursor: pointer;
            display: flex;
            justify-content: space-around;
            align-items: center;

            img {
                margin-right: 5px;
            }
        }

        .el-dropdown-menu__item {
            font-size: 10px;
            padding: 0 15px;
            color: #fff;
            font-weight: bold;
            display: flex;
            justify-content: space-around;
            align-items: center;

            img {
                margin-right: 5px;
            }
        }

        .el-dropdown-menu__item:hover {
            @include sideBarBgc($color-bgc-sideBar-dark);
        }

        .el-popper[x-placement^=bottom] {
            .popper__arrow::after {
                border-bottom-color: #1b1c23;
            }

            .popper__arrow {
                border-bottom-color: transparent;
            }
        }
    }

    .carousel {
        /deep/ {
            margin-right: auto;
            width: 80%;
            height: 50px;

            // margin-bottom: 15px;
            // display: contents;
            >div {
                background-color: #333;
                border-radius: 38px;
                padding-left: 20px;
                box-sizing: border-box;

                .tit {
                    font-size: 16px;
                    font-weight: 600;
                    line-height: 16px;
                    margin: 17px 0 12px 0;
                    @include mainFont($color-mainFont-light);

                    img {
                        height: 18px;
                        vertical-align: middle;
                        margin-right: 8px;
                        position: relative;
                        top: -2px;
                    }
                }

                .num {
                    font-size: 34px;
                    margin: 0;
                    font-weight: 600;
                    color: #31c77f;
                    // background-image:-webkit-linear-gradient(bottom,red,#fd8403,yellow); 
                    // background: linear-gradient(90deg, #0096ff, #0024ff);
                }
            }

            .el-carousel__indicators--vertical {
                display: none !important;
            }

            .el-carousel__item h3 {
                // @include mainFont($color-mainFont-light);
                color: #31c77f;
                font-size: 14px;
                opacity: 0.75;
                line-height: 50px;
                margin: 0;
            }
        }
    }

    .menu-bottom {
        position: absolute;
        bottom: 20px;
        left: 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
    }

    .wallet-dialog {
        .el-dialog {
            border-radius: 20px !important;

            .item {
                cursor: pointer;
                margin-bottom: 8px;

                img {
                    width: 100px;
                    height: 100px;
                }

                border: 1px solid rgba(195, 195, 195, 0.14);
                border-radius: 12px;
                padding: 24px 16px;

                .text {
                    font-weight: 800;
                    font-size: 18px;
                }
            }

            .item:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
        }
    }
}
</style>