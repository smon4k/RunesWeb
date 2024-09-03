<template>
    <div class="container">
        <div class="content">
            <!-- 盒子样式  -->
            <div class="boxin">
                <div class="titlename">
                    <span>Inscribe CFXs</span>
                </div>
                <!-- 上传文件 -->
                <el-tabs v-model="regmarket" @tab-click="tabsFileHandleClick">
                    <!-- <el-tab-pane label="File" name="1">
                        <el-upload
                        class="upload-demo"
                        drag
                        action="https://jsonplaceholder.typicode.com/posts/"
                        multiple>
                        <div class="el-upload__text">Drag and drop your file here, or click to select file</div>
                        <div class="el-upload__tip" >.jpg, .png, .gif, .mp4, .mp3 + more!. Limit 10MB</div>
                        </el-upload>
                        <el-checkbox v-model="checked">Publish On IPFs</el-checkbox>
                    </el-tab-pane> -->
                    <el-tab-pane label="Text" name="3">
                        <el-input type="textarea" placeholder="Enter text here" v-model="data"></el-input>
                    </el-tab-pane>
                </el-tabs>
                <!-- 公共样式按钮 -->
                <div class="publicbutton">
                    <span class="buttoninscrible">Select CFXs to inscribe</span>
                    <div v-if="highlightedIndices.length > 0" class="select-id">
                        <span class="id">#{{ selectedData.chainid }}</span>
                        <img :src="require('@/assets/svg/close.svg')" alt="" width="16" @click="clearSelectedData">
                    </div>
                    <el-button size="mini" @click="showSelectDialog" v-else>Select</el-button>
                </div>
                <div class="disbutton">
                    <el-button type="primary" :loading="trading" :disabled="trading || data == '' || !selectedData.chainid" @click="submitInscribeContract">SUBMIT</el-button>
                </div>
            </div>
            <!-- 底部tab -->
            <div class="bottomtab">
                <el-tabs v-model="activeName2" @tab-click="recordsSubmitClick">
                    <el-tab-pane label="Records" name="1">
                        <div class="tabtext">You need to register after submitting an inscription of your CFXs or the content can not be displayed on the market.</div>
                        <div class="no-data">
                            <div class="center-nodata">
                                <div><img :src="require('@/assets/svg/nodata.svg')" alt="" width="121" height="100"></div>
                                <div class="no-data-text">No Data</div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="Submitting" name="2"></el-tab-pane>
                </el-tabs>
            </div>

            <el-dialog
                title="Select CFXs"
                :visible.sync="selectCfxsDialogShow"
                :width="screenWidth > adaptiveSize ? '40%' : '90%'"
                :before-close="closeSelectCfxsDialog"
                class="select-cfxs"
                top="20vh">
                <div class="dialog-content">
                    <div class="card">
                        <el-row :gutter="screenWidth > adaptiveSize ? 24 : 10">
                            <el-col :xs="12" :sm="12" :md="8" v-for="(item, index) in dataList" :key="index">
                                <div class="card-content" :class="{ 'highlight-border': isSelected(index) }" ref="card" @click.stop="toggleHighlight(index)">
                                    <div class="ids">#{{ item.chainid }}</div>
                                    <div class="count-num">{{ item.amount }}</div>
                                </div>
                            </el-col>
                        </el-row>
                    </div>
                    <div class="no-more">
                        <span v-if="isNoMoreData">No More</span>
                        <div v-else class="load-more">
                            <div v-if="!loading" @click="onLoadMoreData">Load more</div>
                            <div v-if="loading" class="loading-icon">
                                <div class="loading-container">
                                    <div class="loading-spinner"></div>
                                </div>
                                <span>加载中</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dialog-button">
                    <el-button type="primary" :class="{ 'batch-listing': highlightedIndices.length > 0 }" :disabled="highlightedIndices.length <= 0" @click="selectCfxConfirm">CONFIRM</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { get, post } from "@/common/axios.js";
import { mapGetters, mapState } from "vuex";
import { keepDecimalNotRounding } from "@/utils/tools";
import { approve, inscribe, userDataRegist } from "@/wallet/trade";
import { getBalance, isApproved, saveTransactionTask} from "@/wallet/serve";
import Address from '@/wallet/address.json'
export default {
    name: '',
    data() {
        return {
            screenWidth: document.body.clientWidth,
            regmarket: '2',//tab默认初始加载选中
            activeName2: '1',//tab默认初始加载选中
            loading: false,
            approve: false,
            data: '',
            checked: true,//单选框默认选中
            selectCfxsDialogShow: false,
            urrPage: 1, //当前页
            pageSize: 30, //每页显示条数
            total: 100, //总条数
            isNoMoreData: false,
            PageSearchWhere: [], //分页搜索数组
            dataList: [],
            highlightedIndices: [],
            isNoMoreData: false,
            isLoading: false,
            selectedData: {},
            trading: false,
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
            adaptiveSize: state => state.comps.adaptiveSize,
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
                    await this.getMyMarketplaceData();
                }
            }
        },
    },
    components: {

    },
    // 事件
    methods: {
        tabsFileHandleClick(tab, event) {
            console.log(tab, event);
        },
        recordsSubmitClick(tab, event) {
            console.log(tab, event);
        },
        showSelectDialog() {
            this.selectCfxsDialogShow = true;
        },
        closeSelectCfxsDialog() {
            this.selectCfxsDialogShow = false;
        },
        refreshData() { //定时刷新数据
            this.timeInterval = setInterval(async () => {
            }, this.refreshTime)
        },
        isSelected(index) {
            if(this.highlightedIndices) {
                return this.highlightedIndices.includes(index);
            }
        },
        toggleHighlight(index) {
            this.highlightedIndices = [];
            this.highlightedIndices.push(index);
        },
        onLoadMoreData() {
            this.currPage += 1;
            this.getMyMarketplaceData();
        },
        clearSelectedData() {
            this.selectedData = {};
            this.highlightedIndices = [];
        },
        selectCfxConfirm() {
            this.selectedData = this.dataList[this.highlightedIndices[0]];
            this.selectCfxsDialogShow = false;
        },
        getMyMarketplaceData(ServerWhere) {
            if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
                ServerWhere = {
                    limit: this.pageSize,
                    page: this.currPage,
                    owner: this.address,
                };
            }
            this.loading = true;
            get(this.apiUrl + "/Api/Market/getMyMarketplaceData", ServerWhere, async json => {
                if (json.code == 10000) {
                    let list = (json.data && json.data.lists) || [];
                    // console.log(list);
                    if (Array.isArray(list) && Array.isArray(this.dataList)) {
                        this.dataList = this.dataList.concat(list);
                        if(list.length < this.pageSize) {
                            this.isNoMoreData = true;
                        }
                    }
                    this.loading = false;
                    this.total = json.data.count;
                    this.$forceUpdate();
                } else {
                    this.$message.error("加载数据失败");
                }
            });
        },
        async submitInscribeContract() {
            this.trading = true;
            const cfxsIds = [this.selectedData.chainid];
            const dataTypes = ["3"];
            const names = [""];
            const series = "";
            inscribe(this.selectedData.chainid, this.data).then((hash) => {
                if (hash) {
                    userDataRegist(cfxsIds, dataTypes, names, series).then(async (hash2) => {
                        if(hash2) {
                            const params = {
                                "address": this.address,
                                "hash": hash,
                                "type": 7,
                                "data": {
                                    "cfxsId": this.selectedData.chainid,
                                    "sendaddr": this.address,
                                    "data": this.data,
                                    "hash": hash,
                                    "regmarket": this.regmarket
                                }
                            };
                            await saveTransactionTask(params);
                            this.trading = false;
                        }
                    }).finally(() => {
                        this.trading = false;
                    });
                }
            }).finally(() => {
                this.trading = false;
            });
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
                    padding: 16px;
                    color: #fff;
                }
                .el-textarea__inner::placeholder {
                    color: #6b7280;
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
                            //margin-top:10px ;
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
                    display: flex;
                    align-items: center;
                    margin-top: 10px;
                    height: 40px;
                    line-height: 40px;
                    // 左右浮动
                    justify-content: space-between;
                    display: flex;
                    .buttoninscrible {
                        font-size: 16px;
                        color: #aaa;
                    }
                    .select-id {
                        display: flex;
                        align-items: center;
                        gap: 20px;
                        .id {
                            color: #ad8d65;
                            font-size: 16px;
                        }
                        img {
                            cursor: pointer;
                        }
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
                        height: 48px;
                        width: 100%;
                        background-color: #ad8d65;
                        border: 0;
                        color: rgb(0, 0, 0/1);
                    }
                    .el-button--primary.is-disabled {
                        background: hsla(0, 0%, 50%, .2);
                        color: #aaa;
                    }
                    .el-button--primary.is-disabled:hover {
                        background: hsla(0, 0%, 50%, .2);
                        color: #aaa;
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
                .no-data {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 16px;
                    .center-nodata {
                        display: block;
                        text-align: center;
                        .no-data-text {
                            color: #aaa;
                            font-size: 16px;
                        }
                    }
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
            .select-cfxs {
                .el-dialog {
                    height: 566px;
                    background-color: #202020;
                    .el-dialog__header {
                        .el-dialog__title {
                            color: #fff;
                        }
                    }
                    .dialog-content {
                        display: flex;
                        // padding: 16px;
                        flex-direction: column;
                        height: 400px;
                        .card {
                            .card-content {
                                display: block;
                                background-color: #181818;
                                border: 2px solid #202020;
                                border-radius: 8px;
                                // height: 276px;
                                margin-bottom: 24px;
                                cursor: pointer;
                                padding: 16px;
                                .ids {
                                    color: #ad8d65;
                                }
                                .count-num {
                                    font-size: 16px;
                                    font-weight: 500;
                                    color: #fff;
                                }
                            }
                        }
                        .highlight-border {
                            border-color: #ad8d65 !important;
                        }
                    }
                    .dialog-button {
                        color: #aaa;
                        font-size: 14px;
                        border-top: 1px solid #282828;
                        border-width: 1px;
                        .text {
                            display: block;
                            margin-bottom: 24px;
                        }
                        .el-button {
                            width: 100%;
                            background: hsla(0, 0%, 50%, .2);
                            color: #aaa;
                            border: 1px solid transparent;
                            height: 48px;
                        }
                        .el-button--primary.is-disabled:hover {
                            background: hsla(0, 0%, 50%, .2);
                            color: #aaa;
                        }
                        .batch-listing {
                            background: #ad8d65;
                            color: rgb(0, 0, 0/1);
                        }
                    }
                }
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
