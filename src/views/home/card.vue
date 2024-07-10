<template>
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
                            <div class="count-num">{{ item.number }}</div>
                            <div class="price-currency"><font color="#ad8d65">$0.065</font> / CFXs</div>
                        </div>
                        <div class="time">
                            <img :src="require('@/assets/svg/time.svg')" alt="" width="12">
                            {{ item.date }}
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="ids-num">
                            <div class="ids">#{{ item.id }}</div>
                            <div class="num">
                                <img :src="require('@/assets/svg/usdt.svg')" alt="" width="16">
                                <div class="">25.500</div>
                            </div>
                        </div>
                        <div class="address-but">
                            <div class="address">0xd5...A845</div>
                            <div class="buy-now"><el-button @click="handleClick(item)">Buy Now</el-button></div>
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
export default {
    props: ['dataList', 'buyNowClick', 'highlightedIndices', 'toggleHighlight'],
    data() {
        return {
            screenWidth: document.body.clientWidth,
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
    @media (max-width: 960px) {
        .card {
            .content {
                margin-bottom: 10px !important;
            }
        }
    }
</style>
