<template>
    <div>
        <div class="card">
            <el-row :gutter="screenWidth > adaptiveSize ? 24 : 10">
                <el-col :xs="12" :sm="6" :md="4" v-for="(item, index) in dataList" :key="index">
                    <div class="content" :class="{ 'highlight-border': isSelected(index) }" ref="card" @click="toggleHighlightEvent(index)">
                        <div class="top">
                            <div class="currency">
                                <img :src="require('@/assets/svg/rune.svg')" alt="" width="20">
                                <div class="currency-name">CFXs</div>
                            </div>
                            <div class="quantity">
                                <div class="count-num">{{ item.quantity }}</div>
                                <div class="price-currency"><font color="#ad8d65">{{ item.unitprice }}</font> / CFXs</div>
                            </div>
                            <div class="time">
                                <img :src="require('@/assets/svg/time.svg')" alt="" width="12">
                                {{ formattedTime(item.locktime) }}
                            </div>
                        </div>
                        <div class="bottom">
                            <div class="ids-num">
                                <div class="ids">#{{ item.id }}</div>
                                <div class="num">
                                    <img :src="require('@/assets/svg/usdt.svg')" alt="" width="16">
                                    <div class="">{{ item.amount }}</div>
                                </div>
                            </div>
                            <div class="address-but">
                                <div class="address">{{ addressStr(item.chainto) }}</div>
                                <div class="buy-now"><el-button @click="handleClick(item)">Buy Now</el-button></div>
                            </div>
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
    props: ['dataList', 'buyNowClick', 'highlightedIndices', 'toggleHighlight', 'isNoMoreData', 'onLoadMoreData'],
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
                // console.log(val);
            }
        },
    },
    components: {

    },
    methods: {
        handleClick(row) {
            this.$emit('buyNowClick', row);
        },
        isSelected(index) {
            if(this.highlightedIndices) {
                return this.highlightedIndices.includes(index);
            }
        },
        toggleHighlightEvent(index) {
            this.$emit('toggleHighlight', index)
        },
        onLoadMoreDataClick() { //加载更多数据
            this.isLoading = true;
            this.$emit('onLoadMoreData');
            this.isLoading = false;
        },
        addressStr(address) {
            if (address && address !== undefined && address !== '') {
                return address.substring(0, 4) + "***" + address.substring(address.length - 3)
            } 
        },
        formattedTime(time) {
            const date = new Date(time);
            // 获取月、日、小时和分钟，并确保它们是两位数格式
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            // 返回格式化的日期时间字符串
            return `${month}-${day} ${hours}:${minutes}`;
        },
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
            cursor: pointer;
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
