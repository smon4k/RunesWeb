<template>
    <div class="container">
        <div class="content">
            <!-- 盒子样式  -->
            <div class="boxin">
                <div class="titlename">
                    <span>Inscribe CFXs</span>
                </div>
                <!-- 上传文件 -->
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="File" name="1">
                        <el-upload
                        class="upload-demo"
                        drag
                        action="https://jsonplaceholder.typicode.com/posts/"
                        multiple>
                        <div class="el-upload__text">Drag and drop your file here, or click to select file</div>
                        <div class="el-upload__tip" >.jpg, .png, .gif, .mp4, .mp3 + more!. Limit 10MB</div>
                        </el-upload>
                       <!-- 单选框 -->
                        <el-checkbox v-model="checked">Publish On IPFs</el-checkbox>
                    </el-tab-pane>
                    <el-tab-pane label="Text" name="2">
                        <el-input type="textarea" placeholder="Enter text here" v-model="textname"></el-input>
                    </el-tab-pane>
                </el-tabs>
                <!-- 公共样式按钮 -->
                <div class="publicbutton">
                    <span class="buttoninscrible">Select CFXs to inscribe</span>
                    <el-button size="mini" @click="handleClick(item)">Select</el-button>
                </div>
                <div class="disbutton">
                    <el-button disabled>CONNECT WALLET</el-button>
                </div>
            </div>
            <!-- 底部tab -->
            <div class="bottomtab">
                <el-tabs v-model="activeName2" @tab-click="handleClick">
                    <el-tab-pane label="Records" name="1">
                        <div class="tabtext">You need to register after submitting an inscription of your CFXs or the content can not be displayed on the market.</div>
                        <el-button type="text">Load more</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="Submitting" name="2"></el-tab-pane>
                </el-tabs>
            </div>

            
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
            activeName: '1',//tab默认初始加载选中
            activeName2: '1',//tab默认初始加载选中
            loading: false,
            approve: false,
            textname: '',
            checked: true,//单选框默认选中
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
    // 事件
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
        open() {
        this.$alert('<strong>这是 <i>HTML</i> 片段</strong>', 'HTML ', {
          dangerouslyUseHTMLString: true,



          center: true
        });
      }
    },
}
</script>
<style lang="scss" scoped>
.container {
    /deep/ {
        .content {
            padding-top: 70px;
            width: 100%;
            .boxin {
                display: block;
                margin: 0 auto;
                margin-bottom: 40px;
                padding: 16px;
                max-width: 500px;
                min-height: 400px;
                background-color: #202020;
                border-radius: 4px;
                .titlename {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    font-size: 16px;
                }
                .el-tabs__nav-wrap::after {
                    display: none;
                }
                .el-tabs__item {
                    color: #aaa;
                    font-size: 12px;
                    height: 28px;
                    line-height: 28px;
                }
                .el-tabs__item.is-active {
                    color: #ad8d65;
                    background-color: #282828;
                    border-radius: 6px;
                }
                .el-tabs__active-bar {
                    display: none;
                    
                }
                .el-tabs--top .el-tabs__item.is-top:last-child {
                    padding-right:20px;
                }
                .el-tabs--top .el-tabs__item.is-top:nth-child(2) {
                    padding-left: 20px;
                }
                .el-textarea__inner {
                    background-color:transparent !important;
                    border: 0.5px dashed #ad8d65;
                    border-radius: 8px;
                    height: 100px;
                }
                .el-textarea__inner::placeholder {
                    color: #6b7280;
                    padding: 10px;
                }
                .upload-demo {
                    align-items: center;
                    .el-upload {
                        width: 100% !important;
                    }
                    .el-upload-dragger:hover {
                        border:0.5px dashed #ad8d65 !important;
                    }
                    .el-upload-dragger {
                        width:100%;
                        text-align: left;
                        padding-left: 16px;
                        background-color:transparent;
                        height: 100px;
                        border: 0.5px dashed #d9d9d9;
                        .el-upload__text {
                            margin-top:10px ;
                            text-align: left;
                            color: #aaa;
                            font-size: 14px;
                            font-weight: 600;
                        }
                        .el-upload__tip {
                            color: #aaa;
                            font-size: 12px;
                        }
                    }

                }
                // 公共按钮样式
                .publicbutton {
                    margin-top: 10px;
                    height: 30px;
                    line-height: 30px;
                    // 左右浮动
                    justify-content: space-between;
                    display: flex;
                    .buttoninscrible {
                        font-size: 16px;
                        color: #aaa;
                    }
                    .el-button {
                        color: #ad8d65;
                        background: transparent;
                        border-color: #ad8d65;
                        span :hover {
                            background: #ad8d65;
                            padding: 10px 8px;
                        }
                    }
                
                }
                //禁用按钮样式
                .disbutton {
                    padding-top: 42px;
                    width: 100%;
                    height: 48px;
                    .el-button {
                        width: 100%;          background: hsla(0,0%,50%,.2);
                        color: #aaa;
                        border-color: transparent;
                        line-height: 20px;
                    }
                }

            }
            //最底部tab
            .bottomtab {
                display: block;
                margin: 0 auto;
                max-width: 532px;
                padding: 0 16px;
                .el-tabs__nav-wrap::after {
                    display: none;
                }
                .el-tabs__item {
                    color: #aaa;//默认灰色
                    font-size: 18px;
                    font-weight: 700;
                    height: 28px;
                    line-height: 28px;
                }
                //默认选中
                .el-tabs__item.is-active {
                    color: #fff;
                    border-radius: 6px;
                }
                .el-tabs__active-bar {
                    display: none;
                    
                }
                .tabtext {
                    font-size: 16px;
                    color: #aaa;
                }
                //加载文字按钮
                .el-button--text {
                    color: #ad8d65;
                    font-size: 16px;
                    width: 100%;
                    margin-top: 32px;
                    
                }
                .el-button {
                    font-weight: 350;
                    height: 60px;
                    line-height: 60px;
                }
            }
        }
        // 手机端最大宽小于768px宽度始终保持屏幕85%宽
        @media (max-width: 768px) {
            .boxin{
                width:85% !important;
            }
        }
        .el-checkbox {
            margin-top: 20px;
            color: #aaa;
            .el-checkbox__inner {
                background-color: #ad8d65;
                border:1px solid #ad8d65;
            }
            .el-checkbox__label {
                font-size: 12px;
                font-weight: none;
                padding-left: 6px;
                color: #aaa;
            }

        }
    }
}
</style>
