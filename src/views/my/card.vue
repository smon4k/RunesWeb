<template>
    <div class="card">
        <el-row :gutter="screenWidth > adaptiveSize ? 24 : 10">
            <el-col :xs="12" :sm="6" :md="4" v-for="(item, index) in dataList" :key="index">
                <div class="content" :class="{ 'highlight-border': isSelected(index) }" ref="card" @click="toggleHighlightEvent(index)">
                    <div class="top">
                        <div class="currency">
                            <div class="left">
                                <img :src="require('@/assets/svg/rune-my.svg')" alt="" width="20">
                                <div class="currency-name">CFXs</div>
                            </div>
                            <div class="right">
                                <div class="ids">#{{ item.id }}</div>
                            </div>
                        </div>
                        <div class="quantity">
                            <div class="count-num">{{ item.number }}</div>
                        </div>
                    </div>
                    <div class="bottom">
                        <el-button @click="handleClick(item)">Buy Now</el-button>
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
                    justify-content: space-between;
                    .left {
                        display: flex;
                        gap: 8px;
                    }
                    .ids {
                        font-size: 16px;
                        color: #aaa;
                    }
                    .currency-name {
                        color: #ad8d65;
                        font-size: 16px;
                        // margin-left: 8px;
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
                }
            }
            .bottom {
                display: flex;
                // height: 77px;
                padding-bottom: 16px;
                // background-color: #282828;
                justify-content: space-between;
                flex-direction: column;
                border-bottom-left-radius: 8px; 
                border-bottom-right-radius: 8px; 
                font-size: 12px;
                .el-button {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-color: #ad8d65;
                    background-color: transparent;
                    height: 30px;
                    width: 100%;
                    color: #ad8d65;
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
