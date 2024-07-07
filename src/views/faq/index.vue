<template>
    <div class="container">
        <el-row :gutter="20">
      <el-col :span="24" align="center">
        <div class="token-application">{{ $t('nav:FAQ') }}</div>
      </el-col>
      <el-col :span="24" align="center">
        <div class="marginTop" :style="{ width: isMobel ? '90%' : '60%' }">
            <el-collapse accordion>
                <!-- 我们是谁？ -->
                <el-collapse-item :title="$t('game:faq-text-001-title')">
                    <div>{{ $t('game:faq-text-001-content') }}</div>
                </el-collapse-item>
                <!-- 什么是加密货币？ -->
                <el-collapse-item :title="$t('game:faq-text-002-title')">
                    <div>{{ $t('game:faq-text-002-content') }}</div>
                </el-collapse-item>
                <!-- 我可以通过推广 Luck365 获得报酬吗？ -->
                <el-collapse-item :title="$t('game:faq-text-010-title')">
                    <div>{{ $t('game:faq-text-010-content') }}</div>
                </el-collapse-item>
                <!-- 我如何邀请玩家参与Luck365？ -->
                <el-collapse-item :title="$t('game:faq-text-011-title')">
                    <div>{{ $t('game:faq-text-011-content') }}</div>
                </el-collapse-item>
                <!-- 我的账户安全吗？ -->
                <el-collapse-item :title="$t('game:faq-text-003-title')">
                    <div>{{ $t('game:faq-text-003-content') }}</div>
                </el-collapse-item>
                <!-- 我可以一存款就玩吗？ -->
                <el-collapse-item :title="$t('game:faq-text-004-title')">
                    <div>{{ $t('game:faq-text-004-content') }}</div>
                </el-collapse-item>
                <!-- 最低存款/取款额是多少？ -->
                <el-collapse-item :title="$t('game:faq-text-005-title')">
                    <div v-html="$t('game:faq-text-005-content')"></div>
                </el-collapse-item>
                <!-- Luck365 使用公平算法吗？ -->
                <el-collapse-item :title="$t('game:faq-text-006-title')">
                    <div>{{ $t('game:faq-text-006-content') }}</div>
                </el-collapse-item>
                <!-- 我可以拥有多个帐户吗？ -->
                <el-collapse-item :title="$t('game:faq-text-007-title')">
                    <div>{{ $t('game:faq-text-007-content') }}</div>
                </el-collapse-item>
                <!-- 我可以要求退款吗？ -->
                <el-collapse-item :title="$t('game:faq-text-008-title')">
                    <div>{{ $t('game:faq-text-008-content') }}</div>
                </el-collapse-item>
                <!-- 如果重新加载页面会发生什么？ -->
                <el-collapse-item :title="$t('game:faq-text-009-title')">
                    <div>{{ $t('game:faq-text-009-content') }}</div>
                </el-collapse-item>
                <!-- 猜数字范围游戏如何玩？ -->
                <el-collapse-item :title="$t('game:faq-text-012-title')">
                    <div v-html="$t('game:faq-text-012-content')"></div>
                </el-collapse-item>
                <!-- 我申请提币之后的到账时间一般是多长？ -->
                <el-collapse-item :title="$t('game:faq-text-013-title')">
                    <div v-html="$t('game:faq-text-013-content')"></div>
                </el-collapse-item>
            </el-collapse>
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
                .el-collapse {
                    border: 0;
                    .el-collapse-item {
                        margin-bottom: 15px;
                    }
                    .el-collapse-item__header {
                        background-color: #21313b;
                        border-radius: 4px;
                        color: #409EFF;
                        border-bottom: 0;
                        font-size: 14px;
                        padding: 10px;
                        height: 20px;
                        // margin-bottom: 20px;
                    }
                    .el-collapse-item__arrow {
                        display: none;
                    }
                    .el-collapse-item__wrap {
                        background-color: transparent;
                        border-bottom: 0;
                        .el-collapse-item__content {
                            padding: 0 10px 10px 10px;
                            background-color: #21313b;
                            color: #fff;
                        }
                    }
                }
            }
        }
    }
</style>
