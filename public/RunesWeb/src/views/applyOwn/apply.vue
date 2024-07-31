<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="24" align="center">
        <div class="token-application">{{ $t('apply:ApplyYourOwn') }}</div>
      </el-col>
      <el-col :span="24" align="center">
        <el-radio-group class="radio-nav" :border="true" v-model="activeName" @input="tokenClickFun">
            <el-radio-button label="1">{{ $t('apply:TokenApplication') }}</el-radio-button>
            <el-radio-button label="2">{{ $t('apply:MyApply') }}</el-radio-button>
        </el-radio-group>
        <div v-if="activeName == 1" class="marginTop" :style="{ width: isMobel ? '90%' : '50%' }">
            <el-form
                :model="ruleForm"
                :rules="rules"
                ref="ruleForm"
                label-width="100px"
                class="ruleForm"
            >
                <el-form-item prop="currency">
                    <!-- 请输入代币名称 -->
                    <el-input :placeholder="$t('apply:PleaseEnterName')" v-model="ruleForm.currency"></el-input>
                </el-form-item>
                <el-form-item prop="currency_zh">
                    <!-- 请输入代币中文名称 -->
                    <el-input :placeholder="$t('apply:PleaseEnterChineseName')" v-model="ruleForm.currency_zh"></el-input>
                </el-form-item>
                <el-form-item prop="public_chain">
                    <!-- 请输入所属公链，只限：ETH，BNBChain，Arbitrum -->
                    <el-input :placeholder="$t('apply:PleaseEnterChain')" v-model="ruleForm.public_chain"></el-input>
                </el-form-item>
                <el-form-item prop="contract_address">
                    <!-- 请输入合约地址 -->
                    <el-input :placeholder="$t('apply:PleaseEnterContractAddress')" v-model="ruleForm.contract_address"></el-input>
                </el-form-item>
                <el-form-item prop="official_website">
                    <!-- 请输入官网地址 -->
                    <el-input :placeholder="$t('apply:PleaseEnterOweHref')" v-model="ruleForm.official_website"></el-input>
                </el-form-item>
                <el-form-item prop="white_paper_url">
                    <!-- 请输入白皮书超链 -->
                    <el-input :placeholder="$t('apply:PleaseEnterWhitePaperHref')" v-model="ruleForm.white_paper_url"></el-input>
                </el-form-item>
                <el-form-item prop="desc">
                    <!-- 请输入项目描述 -->
                    <el-input :placeholder="$t('apply:PleaseEnterDesc')" type="textarea" v-model="ruleForm.desc"></el-input>
                </el-form-item>
                <el-form-item prop="team_introduction">
                    <!-- 请输入团队介绍 -->
                    <el-input :placeholder="$t('apply:PleaseEnterTeamIntroduction')" type="textarea" v-model="ruleForm.team_introduction"></el-input>
                </el-form-item>
                <el-form-item prop="trade_txid">
                    <!-- 请输入交易打款txid -->
                    <el-input :placeholder="$t('apply:PleaseEnterBusinessTxid')" v-model="ruleForm.trade_txid"></el-input>
                    <!-- <span style="float: left; font-weight: 900">BNBChain收款地址:0x2c037110C6894D8fa70a09B3024c13D1d0687b3e</span>
                    <span style="float: left;margin-left: 10px;color: #409eff;text-decoration: underline;cursor: pointer;" v-clipboard:copy="'0x2c037110C6894D8fa70a09B3024c13D1d0687b3e'" v-clipboard:success="copySuccess">{{ $t('apply:Copy') }}</span> -->
                </el-form-item>
                <div style="text-align: left;">
                    <div>{{ $t('apply:ListingFee') }}</div>
                    <div>{{ $t('apply:doNotParticipate01') }}</div>
                    <div>{{ $t('apply:doNotParticipate02') }}</div>
                    <div>{{ $t('apply:feeMethodTxid') }}</div>
                    <div style="">
                        {{ $t('apply:BNBChainToken') }}: 0x2c037110C6894D8fa70a09B3024c13D1d0687b3e
                        <span style="margin-left: 10px;color: #409eff;text-decoration: underline;cursor: pointer;" v-clipboard:copy="'0x2c037110C6894D8fa70a09B3024c13D1d0687b3e'" v-clipboard:success="copySuccess">{{ $t('apply:Copy') }}</span>
                    </div>
                </div>
                <el-form-item>
                    <!-- 申请 -->
                    <el-button class="apply-button" type="primary" @click="submitForm('ruleForm')">{{ $t('apply:Apply') }}</el-button>
                    <!-- <el-button @click="resetForm('ruleForm')">重置</el-button> -->
                </el-form-item>
            </el-form>
        </div>
        <div v-else class="marginTop" :style="{ width: isMobel ? '90%' : '80%' }">
            <el-table :data="applyList" style="width: 100%;" v-loading="loading" height="650">
                <el-table-column prop="address" label="User" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ addressStr(scope.row.address) }}</span>
                    </template>
                </el-table-column>
                <!-- 代币名称 -->
                <el-table-column prop="" :label="$t('apply:tokenName')" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.currency }}</span>
                    </template>
                </el-table-column>
                <!-- 代币中文名 -->
                <el-table-column prop="" :label="$t('apply:tokenNameZh')" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.currency_zh }}</span>
                    </template>
                </el-table-column>
                <!-- 所属公链 -->
                <el-table-column prop="" :label="$t('apply:chain')" align="center">
                    <template slot-scope="scope">
                        <span>{{ scope.row.public_chain }}</span>
                    </template>
                </el-table-column>
                <!-- 合约地址 -->
                <!-- <el-table-column prop="" :label="$t('apply:contractAddress')" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.contract_address }}</span>
                    </template>
                </el-table-column> -->
                <!-- 官网地址 -->
                <!-- <el-table-column prop="" :label="$t('apply:oweHref')" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.official_website }}</span>
                    </template>
                </el-table-column> -->
                <!-- 白皮书超链 -->
                <!-- <el-table-column prop="" :label="$t('apply:whitePaperHref')" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.white_paper_url }}</span>
                    </template>
                </el-table-column> -->
                <!-- 交易打款txid -->
                <el-table-column prop="" :label="$t('apply:businessTxid')" align="center" :show-overflow-tooltip="true">
                    <template slot-scope="scope">
                        <span>{{ scope.row.trade_txid }}</span>
                    </template>
                </el-table-column>
                <!-- 申请时间 -->
                <el-table-column prop="" :label="$t('game:Time')" align="center" width="150">
                    <template slot-scope="scope">
                        <span>{{ scope.row.time }}</span>
                    </template>
                </el-table-column>
                <!-- 状态 -->
                <el-table-column prop="" :label="$t('game:State')" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.state == 0">{{ $t('apply:Failed') }}</span>
                        <span v-else>{{ $t('apply:Passed') }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" :label="$t('public:Action')" align="center">
                    <template slot-scope="scope">
                        <el-button @click="showTokenDetail(scope.row)" type="text" size="small">{{ $t('apply:detail') }}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="pages">
                <el-col :span="24">
                    <div style="float:right;">
                    <wbc-page
                        :total="total"
                        :pageSize="pageSize"
                        :currPage="currPage"
                        @changeLimit="limitPaging"
                        @changeSkip="skipPaging"
                    ></wbc-page>
                    </div>
                </el-col>
            </el-row>
        </div>
      </el-col>
    </el-row>

    <!-- 选择网络 -->
    <el-dialog :title="$t('apply:detail')" :visible.sync="showApplyDialog" :show-close="true" :width="isMobel ? '90%' : '50%'">
        <div class="">
            <el-descriptions title="" :column="1">
                <el-descriptions-item :label="$t('apply:tokenName')">{{ applyDetail.currency }}</el-descriptions-item>
                <el-descriptions-item :label="$t('apply:tokenNameZh')">{{ applyDetail.currency_zh }}</el-descriptions-item>
                <el-descriptions-item :label="$t('apply:chain')">{{ applyDetail.public_chain }}</el-descriptions-item>
                <el-descriptions-item :label="$t('apply:contractAddress')">{{ applyDetail.contract_address }}</el-descriptions-item>
                <el-descriptions-item :label="$t('apply:oweHref')">{{ applyDetail.official_website }}</el-descriptions-item>
                <el-descriptions-item :label="$t('apply:whitePaperHref')">{{ applyDetail.white_paper_url }}</el-descriptions-item>
                <el-descriptions-item :label="$t('apply:desc')">{{ applyDetail.desc }}</el-descriptions-item>
                <el-descriptions-item :label="$t('apply:teamIntroduction')">{{ applyDetail.team_introduction }}</el-descriptions-item>
                <el-descriptions-item :label="$t('apply:businessTxid')">{{ applyDetail.trade_txid }}</el-descriptions-item>
            </el-descriptions>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
import { get, post } from "@/common/axios.js";
import Page from "@/components/Page.vue";
export default {
  name: "",
  data() {
    return {
        activeName: '1',
        screenWidth: document.body.clientWidth,
        size: "",
        loading: false,
        ruleForm: {
            currency: "",
            currency_zh: "",
            public_chain: "",
            contract_address: "",
            official_website: "",
            white_paper_url: "",
            desc: "",
            team_introduction: "",
            trade_txid: "",
        },
        currPage: 1,
        pageSize: 30,
        total: 0,
        applyList: [],
        showApplyDialog: false,
        applyDetail: {},
    };
  },
  computed: {
    ...mapState({
      address: (state) => state.base.address,
      isConnected: (state) => state.base.isConnected,
      mainTheme: (state) => state.comps.mainTheme,
      apiUrl: (state) => state.base.apiUrl,
      isMobel: (state) => state.comps.isMobel,
    }),
    rules () {
        let rules = {
            currency: [
                { required: true, message: this.$t('apply:PleaseEnterName'), trigger: "blur" },
            ],
            currency_zh: [
                { required: true, message: this.$t('apply:PleaseEnterChineseName'), trigger: "blur" },
            ],
            public_chain: [
                { required: true, message: this.$t('apply:PleaseEnterChain'), trigger: "blur" },
            ],
            contract_address: [
                { required: true, message: this.$t('apply:PleaseEnterContractAddress'), trigger: "blur" },
            ],
            white_paper_url: [
                { required: true, message: this.$t('apply:PleaseEnterWhitePaperHref'), trigger: "blur" },
            ],
            official_website: [
                { required: true, message: this.$t('apply:PleaseEnterOweHref'), trigger: "blur" },
            ],
            desc: [{ required: true, message: this.$t('apply:PleaseEnterDesc'), trigger: "blur" }],
            team_introduction: [
                { required: true, message: this.$t('apply:PleaseEnterTeamIntroduction'), trigger: "blur" },
            ],
            trade_txid: [
                { required: true, message: this.$t('apply:PleaseEnterBusinessTxid'), trigger: "blur" },
            ],
        };
        return rules;
    },
  },
  mounted() {
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth;
    };
  },
  created() {},
  watch: {},
  components: {
    "wbc-page": Page, //加载分页组件
  },
  methods: {
    async getApplyList(ServerWhere) { //获取我的申请记录
        if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
            ServerWhere = {
                address: this.address,
                page: this.currPage,
                limit: this.pageSize,
            };
        }
        this.loading = true;
        axios.get(this.apiUrl + "/Api/Apply/getApplyList", {
            params: ServerWhere
        }).then((json) => {
            console.log(json);
            // console.log(this.address);
            if (json.code == 10000) {
                if (json.data.lists.length > 0) {
                    this.applyList = json.data.lists;
                    this.total = json.data.count;
                }
                // if(this.$refs.seamlessScroll) {
                //     this.$refs.seamlessScroll.reset()
                // }
            } else {
                this.$message.error("加载数据失败");
            }
            this.loading = false;
        }).catch((error) => {
            this.loading = false;
            this.$message.error(error);
        });
    },
    showTokenDetail(row) {
        console.log(row);
        this.applyDetail = row;
        this.showApplyDialog = true;
    },
    tokenClickFun(tab) {
        if(tab == 2) {
            this.getApplyList();
        }
    },
    limitPaging(limit) {
        //赋值当前条数
        this.pageSize = limit;
        this.getApplyList(); //刷新列表
    },
    skipPaging(page) {
        //赋值当前页数
        this.currPage = page;
        this.getApplyList(); //刷新列表
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
            this.ruleForm.address = this.address;
            post(
                this.apiUrl + "/Api/Apply/setApplyOwnData",
                this.ruleForm,
                async (json) => {
                console.log(json);
                if (json && json.code == 10000) {
                    this.$message({
                    message: "Success!",
                    type: "success",
                    });
                    this.$refs[formName].resetFields();
                } else {
                    this.$message.error(json.msg);
                }
                return;
                }
            );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    copySuccess() {
      this.$message({
        message: "Copy successfully!",
        type: "success",
      });
    },
    addressStr(address){
        return address.substring(0, 4) + "***" + address.substring(address.length - 3)
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  /deep/ {
    height: 120vh;
    .token-application {
      color: rgb(255, 255, 255);
      line-height: 1.5;
      margin-top: 2rem;
      margin-bottom: 2rem;
      font-size: 26px;
      font-weight: 900;
    }
    .radio-nav {
        margin-bottom: 10px;
        border: 2px solid #454848;
        border-radius: 50px;
        .el-radio-button:first-child .el-radio-button__inner,.el-radio-button:last-child .el-radio-button__inner {
            border-radius: 50px;
        }
        .el-radio-button__orig-radio:checked+.el-radio-button__inner {
            background-color: #e09320;
        }
        .el-radio-button__inner {
            background: transparent;
            color: #fff;
            border: 0;
        }
    }
    .marginTop {
      // width: 100%;
      // margin-top: 50px;
      margin-bottom: 30px;
      border: 2px solid #454848;
      padding: 20px;
      border-radius: 20px;
      // background-color: rgb(0, 59, 89);
      .title {
        float: left;
      }
      .ruleForm {
        text-align: center;
        // border: 1px solid #454848;
        .el-form-item__content {
          margin-left: 0 !important;
        }
        .el-input__inner {
          border: 2px solid #454848;
          color: #fff;
          display: flex;
          width: 100%;
          height: 40px;
          padding: 0px 16px;
          border-radius: 20px;
          background-color: #21313b;
        }
        .el-textarea__inner {
          border: 2px solid #454848;
          color: #fff;
          display: flex;
          width: 100%;
          border-radius: 20px;
          background-color: #21313b;
        }

        .el-input-group__prepend {
          border: 0;
          color: #fff;
          background-color: #141a1f;
          padding: 0 10px;
          font-size: 10px;
        }
        .el-input-group__append {
          border: 0;
          color: #fff;
          background-color: #141a1f;
          font-size: 10px;
          padding: 0 10px;
        }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
        .apply-button {
            margin-top: 20px;
            width: 80%;
            // display: grid;
            padding: 20px;
            color: rgb(255, 255, 255);
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            border: none;
            border-radius: 0.8rem;
            background-color: #141a1f;
            background-repeat: no-repeat;
            transition: opacity 0.2s linear 0s;
        }
        .apply-button:hover {
            background-color: #21313b;
        }
        .apply-button.is-disabled {
            background: #c8c9cc63;
            color: #fff;
        }
        .apply-button.is-disabled:hover {
            background: #c8c9cc63;
            color: #fff;
        }
      }
      .odds {
        padding-left: 0 !important;
        margin: 20px 0;
      }
      .profit {
        padding-right: 0 !important;
        margin: 20px 0;
      }
        .el-table {
            background-color: transparent !important;
            tr {
                background-color: transparent !important;
                color: #fff;
                font-size: 10px;
            }
            .el-table__cell {
                background-color: transparent !important;
            }
        }
        .pagination {
            .el-input__inner {
                height: 30px;
                background-color: #21313b !important;
                color: #fff !important;
            }
            .el-pagination__total,.el-pagination__jump {
                color: #fff !important;
            }
            .el-pagination button:disabled {
                background-color: #21313b;
            }
            .el-pager li {
                background-color: #21313b;
            }
        }
    }
    .el-dialog {
        // width: 50%;
        background-color: rgb(33, 36, 41);
        .el-dialog__body {
            padding: 0;
        }
        .el-dialog__title {
            color: #fff;
        }
        .el-descriptions__body {
            background-color: rgb(33, 36, 41);
            padding: 20px;
            color: #fff;
        }
    }
    .el-loading-mask {
        border-radius: 5px;
        background-color: rgba(0,0,0,0.8);
        border: 0;
    }
  }
}
</style>
