<template>
    <div class="container">
        <el-row :gutter="20">
      <el-col :span="24" align="center">
        <div class="token-application">{{ $t('nav:Tokenomics') }}</div>
      </el-col>
      <el-col :span="24" align="center">
        <div class="marginTop" :style="{ width: isMobel ? '90%' : '60%' }">
            <p>{{ $t('game:cryptogame-text-01') }}</p>
            <p>{{ $t('game:cryptogame-text-02') }}</p>
            <p>{{ $t('game:cryptogame-text-03') }}</p>
            <p>{{ $t('game:cryptogame-text-04') }}</p>
            <p>{{ $t('game:cryptogame-text-05') }}</p>
            <p>{{ $t('game:cryptogame-text-06') }}</p>
            <p>{{ $t('game:cryptogame-text-07') }}</p> <br>
            <p>{{ $t('game:cryptogame-text-08') }}</p>
            <p v-html="$t('game:cryptogame-text-09')"></p>
        </div>
      </el-col>
    </el-row>
    </div>
</template>
<script>
import { get, post } from "@/common/axios.js";
import { mapGetters, mapState } from "vuex";
export default {
    name: '',
    data() {
        return {
            fairnessInfoObj: {},
            riskValue: false,
            btnLoading: false,
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
    mounted() {

    },
    created() {
        // this.getFairnessSeedAddress();
    },
    watch: {

    },
    components: {

    },
    methods: {

    },
}
</script>
<style lang="scss" scoped>
    .container {
        /deep/ {
            .token-application {
                color: rgb(255, 255, 255);
                line-height: 1.5;
                margin-top: 2rem;
                margin-bottom: 2rem;
                font-size: 26px;
                font-weight: 900;
            }
            .marginTop {
                // width: 100%;
                // margin-top: 50px;
                font-size: 13px;
                text-align: left;
                margin-bottom: 30px;
                border: 2px solid #454848;
                padding: 20px;
                border-radius: 10px;
                // background-color: rgb(0, 59, 89);
                .common-top-nav {
                    img {
                        height: 25px;
                        vertical-align: middle;
                        margin-right: 8px;
                    }
                    .tit {
                        display: inline-block;
                        vertical-align: middle;
                        font-weight: 700;
                        font-size: 16px;
                        margin-top: 3px;
                    }
                }
                .rules {
                    margin-top: 10px;
                    padding: 10px;
                    background-color: #21313b;
                    border-radius: 8px;
                    p{
                        // text-indent: 10px; 
                        margin: 3px;
                        position: relative;
                    }
                }
            }
        }
    }
</style>
