<template>
    <div class="container">
        <!-- <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>投注</el-breadcrumb-item>
        </el-breadcrumb> -->
        <div class="content">
            inscribe
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

    },
    methods: {
        handleClick(row) {
            console.log(row);
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
<style lang="scss" scoped>
.container {
    /deep/ {
        .content {}
    }
}
</style>
