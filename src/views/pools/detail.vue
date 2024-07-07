<template>
  <div class="container">
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/my/finances' }">我的理财</el-breadcrumb-item>
        <el-breadcrumb-item>质押</el-breadcrumb-item>
      </el-breadcrumb> -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-page-header @back="goBack">
            <template slot="title">{{ $t('public:Back') }}</template>
          </el-page-header>
        </div>
        <el-row class="app-left">
          <el-col :span="24">
            <p class="title" v-if="kind || isDemand">
              <span>{{ $t('public:likeTo') }}{{ this.type == 1 ? $t('public:unstake') : $t('public:stake') }}</span>
            </p>
            <p class="title" v-else>
              <span>{{ $t('public:likeTo') }}{{ this.type == 2 ? $t('public:unstake') : $t('public:stake') }}</span>
            </p>

            <div class="input-area">
              <div class="balance">
                <span class="info">{{ $t('public:Balance') }}：</span>
                <span class="num"
                  >{{ toFixed(tokenBalance, 6) || "--" }} {{ name }}</span
                >
              </div>
              <div :class="['inputBox', { overMax: isConnected && isOverMax }]">
                <!-- <img :src="currentTokenImage('H2O')" alt="" /> -->
                <input
                  type="text"
                  minLength="1"
                  maxLength="5"
                  v-model="depositNum"
                  @input="inputEvent"
                />
                <button @click="clickAllBtn">{{ $t('public:MAX') }}</button>
              </div>
            </div>
            <p class="warn-tips" v-show="isConnected && isOverMax">
              {{ $t('public:balanceInsufficient') }}
            </p>

            <div class="submitBtns">
              <el-button class="action-btn" v-loading="trading" :disabled="btnDisabled" round @click="submitOrder()">{{ submitBtnText }}</el-button>
              <!-- <button
                :class="['enter', { disabled: btnDisabled }]"
                :disabled="btnDisabled"
                @click="submitOrder"
                v-loading="trading"
              >
                {{ submitBtnText }}
              </button> -->
              <!-- <button class="cancal" @click="returnPage">BACK</button> -->
            </div>
          </el-col>
        </el-row>
      </el-card>
  </div>
</template>
<script>
import imagePointer from "@/utils/images";
import { mapState } from "vuex";
import { approve, depositPoolsIn, depositPoolsOut } from "@/wallet/trade";
import {
  getBalance,
  isApproved,
  getPoolsUserInfo,
  setStatiscData,
  getPoolsPendingBonus
} from "@/wallet/serve";
import { get, post } from "@/common/axios.js";
import { keepDecimalNotRounding } from "@/utils/tools";
export default {
  name: "PledegDetail",
  data() {
    return {
      propertyList: [{ id: 1, name: "币种" }],
      activeDayIndex: 4,
      depositNum: "",
      // toolTips0:'--',
      // toolTips1:'--',
      type: 0,
      toolTipsLoading: false,
      hashId: 1,
      tokenBalance: "--",
      ableReceive: "--",
      rewardAmount: "",
      tokenAddress: "",
      currencyToken: "",
      goblin: "",
      name: "",
      approved: 0,
      decimals: 18,
      isDemand: false,
      isIRO: false,
      trading: false,
    };
  },
  created() {
    try {
      let info = this.$route.params;
      console.log(info);
      if(Object.keys(info).length==0) {
        this.$router.push({
            path:'PoolsList'
        })
      } else {
        this.currencyToken = info.currencyToken;
        this.goblin = info.goblin;
        this.name = info.name;
        this.hashId = info.hashId;
        this.type = info.type;
      }
    } catch (err) {}
  },
  mounted() {},
  watch: {
    isConnected: {
      immediate: true,
      async handler(val) {
        if (val && this.goblin && !this.approve) {
          this.type == 1
            ? this.getTokenBalanceApprove()
            : this.getTokenBalance();
          // this.getRewardInfo()
        }
      },
    },
    goblin: {
      handler(val) {
        if (this.isConnected && val) {
          this.type == 1
            ? this.getTokenBalanceApprove()
            : this.getTokenBalance();
          // this.getRewardInfo()
        }
      },
    },
  },
  computed: {
    ...mapState({
      address:state=>state.base.address,
      isConnected: (state) => state.base.isConnected,
      fairLaunchAddress: (state) => state.base.fairLaunchAddress,
      mainTheme: (state) => state.comps.mainTheme,
      apiUrl:state=>state.base.apiUrl,
      nftUrl:state=>state.base.nftUrl,
    }),
    btnDisabled() {
      return (
        (this.isConnected &&
          !(this.approved === 2 && this.type == 1) &&
          !Boolean(Number(this.depositNum))) ||
        this.isOverMax
      );
    },
    themeText() {
      return this.type == 1 ? this.$t('public:Deposit') : this.$t('public:Withdraw');
    },
    kind() {
      return this.$route.query.kind;
    },
    submitBtnText() {
      return this.isConnected
        ? this.approved === 2 && this.type == 1
          ? this.$t('public:Approve')
          : this.themeText
        : this.$t('public:ConnectWallet');
    },
    isOverMax() {
      let bool = false;
      if (this.isDemand) {
        bool =
          (this.tokenBalance === "--" && Number(this.depositNum)) ||
          (this.tokenBalance !== "--" &&
            Number(this.depositNum) > Number(this.tokenBalance));
      } else {
        bool =
          (this.tokenBalance === "--" && Number(this.depositNum)) ||
          (this.tokenBalance !== "--" &&
            Number(this.depositNum) > Number(this.tokenBalance)) ||
          Number(this.depositNum) > Number(this.ableReceive);
      }
      return bool;
    },
    pid() {
      if (!this.isDemand) {
        return this.activeDayIndex;
      }
      return this.fixedpId;
    },
  },
  methods: {
    currentTokenImage(token) {
      let point = this.mainTheme === "light" ? "L" : "D";
      return imagePointer[token] && imagePointer[token][point]
        ? imagePointer[token][point]
        : imagePointer.default;
    },
    inputEvent(e) {
      this.depositNum = this.$inputLimit(e, 6, true);
    },
    returnPage() {
      this.depositNum = "";
      this.$router.go(-1);
    },
    async submitOrder() { //开始存或者取
      if (!this.isConnected) return this.$connect();
      if (this.trading) return;
      if (this.approved === 2 && this.type == 1) { 
          this.trading = true;
          // console.log("currencyToken", this.currencyToken);
          // console.log("fairLaunchAddress", this.fairLaunchAddress);
          approve(this.currencyToken, this.goblin).then(() => {
            this.approved = 1;
            this.trading = false;
          }).finally(() => {
            this.trading = false;
          });
          return;
      }
      // let index = this.isDemand === 'hBNB' ? 6 : ( (this.kind || this.isDemand )? 5 : this.activeDayIndex  )
      let tradeFunc = this.type == 1 ? depositPoolsIn : depositPoolsOut;
      let index = this.activeDayIndex;
      this.trading = true;
      // let btcbReward = await getPoolsPendingBonus(this.goblin); //获取BTCB奖励
      tradeFunc(
        this.goblin,
        this.depositNum,
        this.decimals
      ).then((hash) => {
        if(hash) {
          this.trading = false;
          this.depositNum = "";
          this.approve = 0;
          setTimeout(() => {
            this.$store.dispatch("poolsTokenList");
            this.$router.push({path:'/PoolsList'})
          }, 2000)
        }
      }).finally(() => {
        this.trading = false;
      });
    },
    clickAllBtn() {
      if (!this.isConnected || !this.tokenBalance) return;
      this.depositNum = keepDecimalNotRounding(this.tokenBalance, 4);
    },
    async getTokenBalanceApprove() { //获取余额 查看是否授权
      let balance = await getBalance(this.currencyToken, this.decimals); //获取余额
      // console.log("balance", balance, "currencyToken", this.currencyToken, "goblin", this.goblin);
      this.tokenBalance = balance;
      isApproved(
            this.currencyToken,
            this.decimals,
            balance,
            this.goblin
        ).then((bool) => {
            this.approved = bool ? 1 : 2;
            // this.approved = 2
        });
    },
    async getTokenBalance() { //获取已存入余额
        let balance = 0;
        // console.log(this.currencyToken , TOKEN.H2O);
        balance = await getPoolsUserInfo(this.goblin);
        // console.log(balance);
        this.tokenBalance = balance;
        isApproved(
            this.currencyToken,
            this.decimals,
            balance,
            this.goblin
        ).then((bool) => {
            this.approved = bool ? 1 : 2;
            // this.approved = 2
        });
    },
    goBack() {
      this.$router.go(-1);
    }
  },
};
</script>
<style lang="scss" scoped>
.container {
  /deep/ {
    width: 95%;
    margin: 0 auto;
    border: 0;
    padding-top: 20px;
    background-color: transparent !important;
    .el-breadcrumb {
        height: 25px;
        font-size: 16px;
    }
    .warn-tips {
      color: #f00;
      font-size: 14px;
      margin-top: 5px;
    }
    .box-card {
      background-color: transparent !important;
      color: #fff;
      .el-card__body {
        padding-bottom: 80px;
        color: #fff;
      }
      border-radius: 30px;
      .app-left {
        }
      .title {
        color: #fff;  
        // color: #1C1C1B;
        font-size: 18px;
        font-weight: 600;
        padding-bottom: 10px;
        // @include mainFont($color-mainFont-light);
      }
      
      .input-area {
        .receInfo {
          text-align: right;
          font-size: 12px;
          margin-bottom: 8px;
          span {
            font-weight: 600;
            font-size: 14px;
          }
        }
        .balance {
          font-size: 12px;
          line-height: 12px;
          padding-bottom: 8px;
          text-align: right;
          .info {
            color: #fff;
          }
          .num {
            color: #fff;
            // @include balanceFont($balanceFont-light);
          }
        }
        .inputBox {
          height: 45px;
          background-color: #21313b;
          border-radius: 8px;
          position: relative;
          img {
            position: absolute;
            height: 30px;
            width: 30px;
            left: 14px;
            top: 8px;
          }
          button {
            position: absolute;
            height: 30px;
            width: 80px;
            text-align: center;
            line-height: 26px;
            font-size: 12px;
            border: 1px solid #fff;
            color: #fff;
            // @include btnBorderColor($color-btnBorderColor-light);
            background-color: transparent;
            right: 15px;
            top: 8px;
            border-radius: 19px;
            cursor: pointer;
          }
          input {
            width: 100%;
            height: 40px;
            // padding: 0;
            margin: 0;
            border: none;
            outline: none;
            background-color: transparent;
            font-size: 18px;
            color: #fff;
            // @include balanceFont($balanceFont-light);
            // padding: 0 120px 0 62px;
            padding-left: 10px;
            box-sizing: border-box;
          }
        }
        .overMax {
          border: 1px solid #f00;
        }
      }
      .submitBtns {
        padding-top: 30px;
        text-align: center;
        .action-btn {
          width: 200px;
          color: rgb(255, 255, 255);
          font-size: 10px;
          padding: 15px 18px;
          font-weight: 600;
          text-transform: uppercase;
          border: none;
          border-radius: 20px;
          background-color: #141a1f;
        }
        .action-btn:hover {
            background-color: #21313b;
        }
        .action-btn.is-disabled {
            color: #999;
            background-color: #21313b;
        }
      }
    }
  }
}
</style>