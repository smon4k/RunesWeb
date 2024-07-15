<template>
    <div class="nav-container">
        <div class="container">
            <div class="headerNav-container">
                <div class="sider-inner">
                    <!-- v-if="screenWidth < 1280" -->
                    <div class="menu" @click="menuDrawerShow = true" v-if="screenWidth <= 600">
                        <img src="@/assets/menu.png" alt="" />
                    </div>
                    <div class="logo" v-show="screenWidth > 600">
                        <router-link to="/" class="logo-link">
                            <img src="@/assets/log.png" alt="" v-if="mainTheme === 'light'" />
                            <img src="@/assets/log.png" alt="" v-else />
                        </router-link>
                    </div>
                    <div class="title" v-show="screenWidth > 600"> CFXS WORLD </div>
                    <!-- PC端导航 -->
                    <div v-if="screenWidth > 600">
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
                <!-- 安全审计 -->
                <!-- <div class="security-audit" v-if="$route.path !== '/deposit'" @click="SecurityAudit()">
                    <img src="@/assets/certik_light.svg" alt="" v-if="mainTheme==='light'">
                    <img src="@/assets/certik.svg" alt="" v-else>
                </div> -->
                <!-- {{ language }} -->
                <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                
                <div class="language" v-show="screenWidth > 600" v-if="false">
                    <!-- <el-button v-if="language === 'en'" @click="clickLanguageDropdown('zh')">中文</el-button>
                      <el-button v-else @click="clickLanguageDropdown('en')">英文</el-button> -->
                    <el-dropdown trigger="click" @command="clickLanguageDropdown">
                        <span class="el-dropdown-link">
                            <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                            <img src="@/assets/cn.png" alt="" v-if="language === 'CN'" width="18">
                            <img src="@/assets/tc.png" alt="" v-if="language === 'TC'" width="18">
                            <img src="@/assets/en-02.png" alt="" v-if="language === 'EN'" width="18">
                            <span class="name">{{ language }}</span>
                        </span>
                        <el-dropdown-menu slot="dropdown" :append-to-body="false" popper-class="popper-select"
                            class="popper-select">
                            <el-dropdown-item command="CN">
                                <img src="@/assets/cn.png" alt="" width="22">
                                <span>CN</span>
                            </el-dropdown-item>
                            <el-dropdown-item command="TC">
                                <img src="@/assets/tc.png" alt="" width="22">
                                <span>TC</span>
                            </el-dropdown-item>
                            <el-dropdown-item command="EN">
                                <img src="@/assets/en-02.png" alt="" width="22">
                                <span>EN</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="exchange-balance" v-show="screenWidth > 600" v-if="false">
                    <span class="balance" v-if="versionName == 'chain'">{{ $t('public:Balance') }}: {{ lusdBalance }}{{
                        transactionSpareCurrency }}</span>
                    <span class="balance" v-else>{{ $t('public:Balance') }}: {{ keepDecimalNotRounding(platformBalance,
                        this.decimalLen,
                        true) }}{{ transactionSpareCurrency }}</span>
                    <el-dropdown trigger="click" @command="dropdownMenuClick">
                        <!-- 账户 -->
                        <span class="el-dropdown-link">
                            <i class="el-icon-user-solid"></i>&nbsp;
                            {{ $t('game:Account') }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <!-- 公链版 出入金 -->
                        <el-dropdown-menu slot="dropdown" :append-to-body="false" popper-class="popper-select"
                            class="popper-select" v-if="versionName === 'chain'">
                            <el-dropdown-item command="deposit">
                                <img src="@/assets/deposit.png" alt="" width="20">
                                {{ $t('game:Deposit') }}
                            </el-dropdown-item>
                            <el-dropdown-item command="withdraw">
                                <img src="@/assets/withdraw.png" alt="" width="20">
                                {{ $t('game:Withdraw') }}
                            </el-dropdown-item>
                            <el-dropdown-item command="financial">
                                <img src="@/assets/financing.png" alt="" width="20">
                                {{ $t('game:Financial') }}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                        <!-- 极速版 出入金 -->
                        <el-dropdown-menu slot="dropdown" :append-to-body="false" popper-class="popper-select"
                            class="popper-select" v-else>
                            <el-dropdown-item command="speed-deposit">
                                <img src="@/assets/deposit.png" alt="" width="20">
                                {{ $t('game:Deposit') }}
                            </el-dropdown-item>
                            <el-dropdown-item command="speed-withdraw">
                                <img src="@/assets/withdraw.png" alt="" width="20">
                                {{ $t('game:Withdraw') }}
                            </el-dropdown-item>
                            <!-- <el-dropdown-item command="financial">
                                <img src="@/assets/financing.png" alt="" width="20">
                                {{ $t('game:Financial') }}
                            </el-dropdown-item> -->
                            <!-- <el-dropdown-item command="withdraw">{{ $t('game:Withdraw') }}</el-dropdown-item> -->
                        </el-dropdown-menu>
                    </el-dropdown>
                    <!-- <span class="el-dropdown" style="cursor: pointer;" v-if="versionName === 'speed'" @click="depositWithdraw()">充提</span> -->
                </div>

                <!-- 版本 -->
                <!-- <div class="exchange-balance" v-show="screenWidth > 600">
                    <span class="el-dropdown" style="cursor: pointer;" v-if="versionName == 'chain'" @click="switchVersion('speed')">{{ $t('game:quickVersion') }}</span>
                    <span class="el-dropdown" style="cursor: pointer;" v-if="versionName == 'speed'" @click="switchVersion('chain')">{{ $t('game:chainVersion') }}</span>
                </div> -->
                <!-- 切换链 -->
                <div class="connectWallet" v-if="screenWidth > 600 && isConnected">
                    <img src="@/assets/log.png" alt="" />
                    <span>sSpace</span>
                </div>
                <div class="exchange-chain" v-show="screenWidth > 600" v-if="versionName === 'chain'">
                    <el-dropdown trigger="click" @command="dropdownChainMenuClick">
                        <span class="el-dropdown-link">
                            <img :src="require(`@/assets/` + chain_name + `.png`)" alt="" width="22">
                            {{ chain_name }}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown" :append-to-body="false" popper-class="popper-select"
                            class="popper-select">
                            <el-dropdown-item command="HECO">
                                <img src="@/assets/HECO.png" alt="" width="18">
                                <span class="chain-name">{{ 'HECO' }}</span>
                            </el-dropdown-item>
                            <el-dropdown-item command="ARB">
                                <img src="@/assets/ARB.png" alt="" width="18">
                                <span class="chain-name">{{ 'ARB' }}</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                        <!-- 极速版 选择链 -->
                        <!-- <el-dropdown-menu slot="dropdown" :append-to-body="false" popper-class="popper-select" class="popper-select" v-else>
                            <el-dropdown-item command="ARB">
                                <img src="@/assets/ARB.png" alt="" width="18">
                                <span class="chain-name">{{ 'ARB' }}</span>
                            </el-dropdown-item>
                            <el-dropdown-item command="BSC">
                                <img src="@/assets/BSC.png" alt="" width="18">
                                <span class="chain-name">{{ 'BSC' }}</span>
                            </el-dropdown-item>
                        </el-dropdown-menu> -->
                    </el-dropdown>
                </div>
                <!-- <div class="main-theme" @click="changeTheme">
                    <img src="@/assets/theme.png" alt="" v-if="activeTheme==='light'">
                    <img src="@/assets/daily_icon.png" alt="" v-else>
                </div> -->
                <!-- <div class="switchLang">
                    <div @click="changeLang('zh')" :class="{'activeCN':activeLang === 'zh'}">中文</div>
                    <div @click="changeLang('en')" :class="{'activeEN':activeLang === 'en'}">EN</div>
                    <span class="bar"></span>
                </div> -->
                <div class="connectWallet pending" v-if="isConnected && pendingOrderAmount">
                    <span>Trading</span>
                    <img src="@/assets/shuaxin.png" alt="">
                </div>
                <div class="connectWallet" @click="connectWalletShowFun" v-else>
                    {{ isConnected ? addressStr : $t('public:ConnectWallet') }}
                </div>
            </div>

            <!-- <el-divider></el-divider> -->


            <!-- 移动端导航 -->
            <el-drawer title="我是标题" :visible.sync="menuDrawerShow" :with-header="false" direction="ltr" size="300px">
                <div class="sider-inner">
                    <!-- <div class="logo">
                        <router-link to="/" class="logo-link">
                            <img
                                src="@/assets/log.jpeg"
                                alt=""
                                v-if="mainTheme === 'light'"
                            />
                            <img src="@/assets/log.jpeg" alt="" v-else />
                        </router-link>
                    </div> -->
                    <!-- <div class="title"> CFXS WORLD </div> -->
                     <div style="display: block;position: absolute;left: -12px;" @click="menuDrawerShow = false">
                         <svg xmlns="http://www.w3.org/2000/svg" @click="walletDialogShow = false" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="#fff" stroke-linecap="round" stroke-width="1.4" d="M4.929 4.929 19.071 19.07M19.071 4.929 4.929 19.07"></path></svg>                    
                     </div>
                    <div class="language" style="margin-left: 20px" v-if="false">
                        <el-dropdown trigger="click" @command="clickLanguageDropdown">
                            <span class="el-dropdown-link">
                                <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
                                <img src="@/assets/cn.png" alt="" v-if="language === 'CN'" width="18">
                                <img src="@/assets/tc.png" alt="" v-if="language === 'TC'" width="18">
                                <img src="@/assets/en-02.png" alt="" v-if="language === 'EN'" width="18">
                                <span class="name">{{ language }}</span>
                            </span>
                            <el-dropdown-menu slot="dropdown" :append-to-body="false" popper-class="popper-select"
                                class="popper-select">
                                <el-dropdown-item command="CN">
                                    <img src="@/assets/zh.png" alt="" width="18">
                                    <span>CN</span>
                                </el-dropdown-item>
                                <el-dropdown-item command="TC">
                                    <img src="@/assets/zh.png" alt="" width="18">
                                    <span>TC</span>
                                </el-dropdown-item>
                                <el-dropdown-item command="EN">
                                    <img src="@/assets/en-02.png" alt="" width="18">
                                    <span>EN</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="exchange-balance" v-if="false">
                        <el-dropdown trigger="click" @command="changeCoinMenuClick" class="mb-xchange-balance">
                            <!-- 选择币种 -->
                            <span class="el-dropdown-link">
                                <img :src="require('@/assets/' + transactionCurrency.toLowerCase() + '.png')" alt=""
                                    width="18">
                                {{ transactionSpareCurrency }}
                                <i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown" :append-to-body="false" popper-class="popper-select"
                                class="popper-select">
                                <el-dropdown-item v-for="(item, index) in currencyTokenList" :key="index"
                                    :command="item.name">
                                    <img :src="require('@/assets/' + item.logo + '.png')" alt="" width="18">
                                    <span v-if="item.name === 'GLS'">{{ 'LUCK' }}</span>
                                    <span v-else>{{ item.name }}</span>
                                </el-dropdown-item>
                                <!-- <el-dropdown-item command="LUSD">
                                    <img src="@/assets/usdt.png" alt="" width="18">
                                    <span>{{ 'LUSD' }}</span>
                                </el-dropdown-item> -->
                            </el-dropdown-menu>
                        </el-dropdown>
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
                <div class="menu-bottom" v-if="false">
                    <div class="exchange-balance">
                        <span class="balance" v-if="versionName == 'chain'">{{ $t('public:Balance') }}: {{ lusdBalance
                            }}</span>
                        <span class="balance" v-else>{{ $t('public:Balance') }}: {{
                        keepDecimalNotRounding(platformBalance,
                            this.decimalLen, true) }}</span>
                        <el-dropdown trigger="click" @command="dropdownMenuClick" placement="top">
                            <!-- 账户 -->
                            <span class="el-dropdown-link">
                                <i class="el-icon-user-solid"></i>&nbsp;
                                {{ $t('game:Account') }}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <!-- 公链版 出入金 -->
                            <el-dropdown-menu slot="dropdown" popper-class="popper-select" class="popper-select"
                                v-if="versionName === 'chain'">
                                <el-dropdown-item command="deposit">
                                    <img src="@/assets/deposit.png" alt="" width="20">
                                    {{ $t('game:Deposit') }}
                                </el-dropdown-item>
                                <el-dropdown-item command="withdraw">
                                    <img src="@/assets/withdraw.png" alt="" width="20">
                                    {{ $t('game:Withdraw') }}
                                </el-dropdown-item>
                                <el-dropdown-item command="financial">
                                    <img src="@/assets/financing.png" alt="" width="20">
                                    {{ $t('game:Financial') }}
                                </el-dropdown-item>
                            </el-dropdown-menu>
                            <!-- 极速版 出入金 -->
                            <el-dropdown-menu slot="dropdown" popper-class="popper-select" class="popper-select" v-else>
                                <el-dropdown-item command="speed-deposit">
                                    <img src="@/assets/deposit.png" alt="" width="20">
                                    {{ $t('game:Deposit') }}
                                </el-dropdown-item>
                                <el-dropdown-item command="speed-withdraw">
                                    <img src="@/assets/withdraw.png" alt="" width="20">
                                    {{ $t('game:Withdraw') }}
                                </el-dropdown-item>
                                <!-- <el-dropdown-item command="financial">
                                    <img src="@/assets/financing.png" alt="" width="20">
                                    {{ $t('game:Financial') }}
                                </el-dropdown-item> -->
                                <!-- <el-dropdown-item command="withdraw">{{ $t('game:Withdraw') }}</el-dropdown-item> -->
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <!-- 版本 -->
                    <!-- <div class="exchange-balance">
                        <span class="el-dropdown" style="cursor: pointer;" v-if="versionName == 'chain'" @click="switchVersion('speed')">{{ $t('game:quickVersion') }}</span>
                        <span class="el-dropdown" style="cursor: pointer;" v-if="versionName == 'speed'" @click="switchVersion('chain')">{{ $t('game:chainVersion') }}</span>
                    </div> -->
                    <!-- 公链版 切换链 -->
                    <div class="exchange-chain" v-if="versionName === 'chain'">
                        <el-dropdown trigger="click" @command="dropdownChainMenuClick" placement="top">
                            <span class="el-dropdown-link">
                                <img :src="require(`@/assets/` + chain_name + `.png`)" alt="" width="18">
                                {{ chain_name }}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown" popper-class="popper-select" class="popper-select">
                                <el-dropdown-item command="HECO">
                                    <img src="@/assets/HECO.png" alt="" width="18">
                                    <span class="chain-name">{{ 'HECO' }}</span>
                                </el-dropdown-item>
                                <el-dropdown-item command="ARB">
                                    <img src="@/assets/ARB.png" alt="" width="18">
                                    <span class="chain-name">{{ 'ARB' }}</span>
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </el-drawer>
        </div>

        <el-dialog title="连接钱包" :visible.sync="walletDialogShow" :width="isMobel ? '80%' : '50%'" center
            class="wallet-dialog">
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
import axios from 'axios'
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
            versionName: state => state.base.versionName,
            transactionCurrency: state => state.base.transactionCurrency,
            transactionSpareCurrency: state => state.base.transactionSpareCurrency,
            platformBalance: state => state.base.platformBalance,
            decimalLen: state => state.base.decimalLen,
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
                    name: this.$t('nav:Market'),
                    path: "/home",
                    children: [],
                    isHref: false,
                },
                // 兑换
                {
                    name: this.$t('nav:Wormhole'),
                    path: "/exchange/deposit",
                    children: [],
                    isHref: false,
                },
                // 我的
                {
                    name: this.$t('nav:My'),
                    path:"/my",
                    children: [],
                    isHref: false,
                },
                // 发布
                {
                    name: this.$t('nav:Inscribe'),
                    path: "/inscribe",
                    children: [],
                    isHref: false,
                },
                //文档
                {
                    name: this.$t('nav:Documents'),
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
                    console.log(val);
                    this.walletDialogShow = false;
                    await this.getLusdBalance();
                }
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
        async switchVersion(val) { //切换版本
            if (val === 'chain') { //公链版
                if (this.chainName !== 'HECO') {
                    let switchRes = await this.dropdownChainMenuClick('HECO', false);
                    console.log(switchRes);
                    if (switchRes) {
                        this.$store.commit('setVersion', val);
                        localStorage.setItem('versionName', val);
                        this.$router.push({ path: '/NumRange' });
                        setTimeout(async () => {
                            location.reload(); //网络切换成功 刷新页面
                        }, 300)

                    }
                } else {
                    this.$store.commit('setVersion', val);
                    localStorage.setItem('versionName', val);
                    this.$router.push({ path: '/NumRange' });
                    setTimeout(async () => {
                        location.reload(); //网络切换成功 刷新页面
                    }, 300)
                }
            } else {
                localStorage.setItem('versionName', val)
                this.$router.push({ path: '/NumRangeSpeed' });
                setTimeout(async () => {
                    location.reload(); //网络切换成功 刷新页面
                }, 300)
                // if(this.chainName !== 'ARB') {
                //     let switchRes = await this.dropdownChainMenuClick('ARB', false);
                //     console.log(switchRes);
                //     if(switchRes) {
                //         this.$store.commit('setVersion', val);
                //         localStorage.setItem('versionName', val)
                //         this.$router.push({path:'/NumRangeSpeed'});
                //         setTimeout(async () => {
                //             location.reload(); //网络切换成功 刷新页面
                //         }, 300)
                //     }
                // }
            }
            this.$forceUpdate();
        },
        async dropdownMenuClick(command) { //兑换 下拉框事件
            console.log(command);
            let location = this.$route.params.assets;
            if (command === 'deposit') {
                if (location !== 'deposit') {
                    this.$router.push({ path: '/exchange/deposit' })
                }
            } else if (command === 'withdraw') {
                if (location !== 'withdraw') {
                    this.$router.push({ path: '/exchange/withdraw' })
                }
            } else if (command === 'financial') {
                // console.log(this.$route.name, command);
                if (this.versionName === 'chain') {
                    if (this.$route.name !== 'PoolsList') {
                        this.$router.push({ path: '/PoolsList' })
                    }
                } else {
                    if (this.$route.name !== 'PoolsListSpeed') {
                        this.$router.push({ path: '/PoolsListSpeed' })
                    }
                }
            } else if (command === 'speed-deposit') { //极速版入金
                if (this.$route.path !== '/depositWithdrawal/1') {
                    console.log(this.$route.name, command);
                    this.$router.push({
                        path: '/depositWithdrawal/1',
                        query: {
                            // type: 1,
                        }
                    }, () => { })
                }
            } else if (command === 'speed-withdraw') { //极速版出金
                if (this.$route.push !== '/depositWithdrawal/2') {
                    console.log(this.$route, command);
                    this.$router.push({
                        path: '/depositWithdrawal/2',
                        query: {
                            // type: 2,
                        }
                    }, () => { })
                }
            }
        },
        async dropdownChainMenuClick(command, isRefresh = true) { //切换链 下拉事件
            // console.log(command);
            // localStorage.setItem('chainName', command);
            let chainId = await getChainNameId(command);
            let netWorkRes = await networkSetup(chainId, command);
            console.log(chainId, netWorkRes);
            if (netWorkRes) {
                this.chain_name = command;
                localStorage.setItem('chainName', command);
                if (isRefresh) {
                    location.reload(); //网络切换成功 刷新页面
                }
                return true;
            }
            return false;
        },
        async getLusdBalance() {  //获取余额
            let balance = 0;
            if (this.versionName === 'chain') {
                balance = await getBalance(TOKEN[this.chainName].LUSD, 18);
                console.log("LUSD balance", balance);
            }
            // else {
            //     balance = await getUserPlatformBalance();
            //     console.log("平台 balance", balance);
            // }
            this.lusdBalance = keepDecimalNotRounding(balance, 2, true);
        },
        handleSelect(index, path) { //菜单激活时事件
            // console.log(index, path);
            this.menuDrawerShow = false;
        },
        connectWalletShowFun() {
            if (this.address && this.address !== undefined && this.address !== '') {
                this.$disconnect();
            } else {
                this.walletDialogShow = true;
            }
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
        SecurityAudit() {
            window.open("https://www.certik.com/projects/h2ofinance")
        },
        clickLanguageDropdown(command) {
            if (command) {
                this.language = command;
                // 获取当前语言
                let curLng = this.$i18n.i18next.language
                // 切换语言
                this.$i18n.i18next.changeLanguage(command);
            }
            // console.log(item);
        },
        changeCoinMenuClick(command) { //选择币种
            console.log(command);
            if (command) {
                localStorage.setItem('transactionCurrency', command);
                // localStorage.setItem(this.chain_name + '_transactionCurrency', command);
                setTimeout(async () => {
                    location.reload(); //网络切换成功 刷新页面
                }, 300);
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
        async getCurrencyTokenList() { //获取币种列表
            this.currencyTokenList = await getCurrencyTokenList();
        }
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
        position: absolute;
        left: 30px;
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
            height: 30px;
            box-sizing: border-box;

            .logo-link {
                display: block;
                height: 100%;
                text-align: center;

                img {
                    height: 30px;
                    margin-left: -24px;
                    border-radius: 50%;
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