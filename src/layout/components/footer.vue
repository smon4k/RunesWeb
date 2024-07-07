<template>
    <div class="container">
        <div class="footer-main">
            <el-row>
                <el-col :span="8" align="left">
                    <el-link icon="el-icon-d-arrow-right" @click="hrefTwitterClick()">FAQ</el-link>
                </el-col>
                <el-col :span="8" align="center">
                    <font style="vertical-align: inherit;">{{ $t('game:Copyright') }} © 2020 - 2023 Luck365 Company, LLC。</font>
                </el-col>
                <el-col :span="8" align="right">
                    <a href="https://t.me/luck365win" title="Telegram" target="_blank"> 
                        <img src="@/assets/telegram.png" alt="" height="40">
                    </a>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
export default {
    name: '',
    data() {
        return {
            active: 2
        }
    },
    computed: {
        ...mapState({
            address:state=>state.base.address,
            isConnected:state=>state.base.isConnected,
            isMobel:state=>state.comps.isMobel,
            mainTheme:state=>state.comps.mainTheme,
            apiUrl:state=>state.base.apiUrl,
        }),

    },
    created() {

    },
    watch: {

    },
    components: {

    },
    methods: {
        hrefTwitterClick() {
            this.$router.push({path:'/faq'});
        }
    },
    mounted() {

    },
}
</script>
<style lang="scss" scoped>
    .container {
        /deep/ {
            .footer-main {
                // padding-bottom: 40px;
                background-color: #21313b;
                color: #d3d3d3;
                padding: 10px;
                // position: absolute;
                position: fixed;
                bottom: 0;
                width: 100%;
                .el-row {
                    width: 90%;
                    margin: 0 auto;
                    // padding-top: 20px;
                    display: flex;
                    align-items: center;
                    .el-link.el-link--default {
                        color: #d3d3d3;
                    }
                    .el-link::after {
                        border-color: #d3d3d3;
                    }
                }
            }
        }
    }
</style>
