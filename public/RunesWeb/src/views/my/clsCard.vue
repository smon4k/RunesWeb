<template>
    <div>
        <div class="card">
            <el-row :gutter="screenWidth > adaptiveSize ? 24 : 10">
                <el-col :xs="12" :sm="12" :md="6" v-for="(item, index) in dataList" :key="index">
                    <div class="content">
                        <div class="top">
                            <div class="currency">
                                <img :src="require('@/assets/svg/cfxs.svg')" alt="" width="60">
                            </div>
                            <div class="quantity">
                                <div class="count-num">CLS:{{ item.chainid }}</div>
                            </div>
                        </div>
                        <div class="bottom">
                            <el-button @click.stop="handleResolveAddressClick(item)">Resolve Address</el-button>
                            <el-button @click.stop="handleSetNameClick(item)">Set Name</el-button>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="no-more">
            <span v-if="isNoMoreData">No More</span>
            <div v-else class="load-more">
                <div v-if="!isLoading" @click="onLoadMoreDataClick">Load more</div>
                <div v-if="isLoading" class="loading-icon">
                    <div class="loading-container">
                        <div class="loading-spinner"></div>
                    </div>
                    <span>加载中</span>
                </div>
            </div>
        </div>
    </div>

</template>
<script>
import { mapGetters, mapState } from "vuex";
export default {
    props: ['dataList', 'resolveAddressClick', 'setNameClick', 'isNoMoreData', 'onLoadMoreData'],
    data() {
        return {
            screenWidth: document.body.clientWidth,
            isLoading: false,
        }
    },
    computed: {
        ...mapState({
            address:state=>state.base.address,
            isConnected:state=>state.base.isConnected,
            isMobel:state=>state.comps.isMobel,
            mainTheme:state=>state.comps.mainTheme,
            apiUrl:state=>state.base.apiUrl,
            adaptiveSize: state => state.comps.adaptiveSize,
        }),

    },
    created() {
        
    },
    watch: {
        dataList: {
            immediate: true,
            async handler(val) {
                if(val) {
                    this.isLoading = false;
                }
            }
        },
    },
    components: {

    },
    methods: {
        handleResolveAddressClick(row) {
            this.$emit('resolveAddressClick', row);
        },
        handleSetNameClick(row) {
            this.$emit('setNameClick', row);
        },
        onLoadMoreDataClick() { //加载更多数据
            this.isLoading = true;
            this.$emit('onLoadMoreData');
        }
    },
    mounted() {
        window.onresize = () => {
            this.screenWidth = document.body.clientWidth;
        }
    },
}
</script>
<style lang="scss" scoped>
    .card {
        .content {
            display: block;
            background-color: #181818;
            border: 2px solid #202020;
            border-radius: 8px;
            // height: 276px;
            margin-bottom: 24px;
            margin-top: 32px;
            cursor: pointer;
            .top {
                padding: 16px;
                .currency {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .quantity {
                    display: block;
                    justify-content: center;
                    margin-top: 16px;
                    margin-bottom: 16px;
                    text-align: center;
                    .count-num {
                        font-size: 16px;
                        font-weight: 500;
                        color: #fff;
                    }
                }
            }
            .bottom {
                display: flex;
                // height: 77px;
                padding-bottom: 16px;
                // background-color: #282828;
                justify-content: center;
                border-bottom-left-radius: 8px; 
                border-bottom-right-radius: 8px; 
                font-size: 12px;
                .el-button {
                    display: block;
                    line-height: 0;
                    align-items: center;
                    justify-content: center;
                    border-color: #ad8d65;
                    background-color: transparent;
                    height: 30px;
                    color: #ad8d65;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding-left: 10px;
                    padding-right: 10px;
                }
            }
        }
        .highlight-border {
            border-color: #ad8d65 !important;
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
    @media (max-width: 960px) {
        .card {
            .content {
                margin-bottom: 10px !important;
            }
        }
    }
</style>
