<template>
  <div class="container">
      <!-- <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/my/finances' }">我的理财</el-breadcrumb-item>
        <el-breadcrumb-item>质押</el-breadcrumb-item>
      </el-breadcrumb> -->
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-page-header @back="goBack"></el-page-header>
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
              <button
                :class="['enter', { disabled: btnDisabled }]"
                :disabled="btnDisabled"
                @click="submitOrder"
                v-loading="GettingApprove || trading"
              >
                {{ submitBtnText }}
              </button>
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
  getUserHashpowerBalance,
  getUserHashpowerPledgeBalance,
  isApproved,
  getGameFillingBalance,
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
      toolTipsLoading: false,
      hashId: 1,
      tokenBalance: "--",
      ableReceive: "--",
      rewardAmount: "",
      tokenAddress: "",
      currencyToken: "",
      goblin: "",
      name: "",
      approved: 1,
      decimals: 18,
      isDemand: false,
      isIRO: false,
      trading: false,
    };
  },
  created() {
    try {
      let JsonInfo = sessionStorage.getItem("hashpowerPoolsDetailInfo");
      let info = JSON.parse(JsonInfo);
      console.log(info);
      // this.tokenAddress = info.token;
      this.currencyToken = info.currencyToken;
      this.goblin = info.goblin;
      this.name = info.name;
      this.hashId = info.hashId;
    } catch (err) {}
  },
  mounted() {},
  watch: {
    isConnected: {
      immediate: true,
      async handler(val) {
        if (val && this.goblin) {
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
    type() {
      return this.$route.query.type;
    },
    kind() {
      return this.$route.query.kind;
    },
    GettingApprove() {
      return this.isConnected && this.approved === 0;
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
      // if (this.approved === 2 && this.type == 1) { 
      //     this.trading = true;
      //     approve(this.currencyToken, this.goblin).then(() => {
      //       this.approved = 1;
      //       this.trading = false;
      //     }).finally(() => {
      //       this.trading = false;
      //     });
      //     return;
      // }
      // let index = this.isDemand === 'hBNB' ? 6 : ( (this.kind || this.isDemand )? 5 : this.activeDayIndex  )
      let tradeFunc = this.type == 1 ? depositPoolsIn : depositPoolsOut;
      let index = this.activeDayIndex;
      this.trading = true;
      // post(this.apiUrl + '/Hashpower/Hashpower/startInvestNow', { 
      //     address: this.address, 
      //     hashId: this.hashId, 
      //     number: this.depositNum,
      //     type: this.type
      // }, (json) => {
      //   this.loading = false;
      //   console.log(json);
      //   if (json && json.code == 10000) {
      //       this.trading = false;
      //       this.depositNum = "";
      //       this.approve = 0;
      //       setTimeout(() => {
      //         this.$store.dispatch("getHashPowerPoolsList");
      //         this.$router.push({path:'/my/finances'})
      //       }, 2000)
      //   } else {
      //       this.$message.error(json.msg);
      //   }
      // })
      // console.log(this.hashId);
      // let btcbReward = await getPoolsPendingBonus(this.goblin); //获取BTCB奖励
      post(this.apiUrl + '/Hashpower/Hashpower/startInvestNow', { 
          address: this.address, 
          hashId: this.hashId, 
          number: this.depositNum,
          type: this.type,
          // reward_amount: btcbReward,
      }, async (json) => {
        this.loading = false;
        await setStatiscData(3, this.hashId);
        console.log(json);
        if (json && json.code == 10000) {
            this.trading = false;
            this.depositNum = "";
            // this.approve = 0;
            this.$message({
                type: 'success',
                message: this.type == 1 ? '质押成功!' : '提取成功'
            });
            setTimeout(() => {
              this.$store.dispatch("getHashPowerPoolsList");
              this.$router.push({path:'/hashpower/list'})
            }, 1000)
        } else {
            this.$message.error(json.msg);
        }
      })
    },
    clickAllBtn() {
      if (!this.isConnected || !this.tokenBalance) return;
      this.depositNum = keepDecimalNotRounding(this.tokenBalance, 4);
    },
    async getTokenBalanceApprove() { //获取余额 查看是否授权
      let balance = await getUserHashpowerBalance(this.hashId); //获取算力余额
      // console.log(balance);
      // console.log("balance", balance, "currencyToken", this.currencyToken, "goblin", this.goblin);
      this.tokenBalance = balance['number'];
      // isApproved(
      //       this.currencyToken,
      //       this.decimals,
      //       balance,
      //       this.goblin
      //   ).then((bool) => {
      //       this.approved = bool ? 1 : 2;
      //       // this.approved = 2
      //   });
    },
    // unfoldString(index){
    //     let kind = 'day365'
    //     switch (index){
    //         case 0 :
    //             kind = 'day90'
    //             break;
    //         case 1 :
    //             kind = 'day180'
    //             break;
    //     }
    //     return kind
    // },
    async getTokenBalance() { //获取已存入余额
        let balance = 0;
        // console.log(this.currencyToken , TOKEN.H2O);
        balance = await getUserHashpowerPledgeBalance(this.hashId);
        // console.log(balance);
        this.tokenBalance = balance['number'];
        // isApproved(
        //     this.currencyToken,
        //     this.decimals,
        //     balance,
        //     this.goblin
        // ).then((bool) => {
        //     this.approved = bool ? 1 : 2;
        //     // this.approved = 2
        // });
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
    width: 80%;
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
            // color: #333333;
            // @include balanceFont($balanceFont-light);
          }
        }
        .inputBox {
          height: 45px;
          background-color: rgba(0, 49, 255, 0.06);
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
            // border: 1px solid #0031FF;
            // color: #002EFF;
            border: 0;
            background-color: #0096FF;
            color: #fff;
            right: 15px;
            top: 8px;
            border-radius: 19px;
            cursor: pointer;
          }
          input {
            width: 100%;
            height: 45px;
            // padding: 0;
            margin: 0;
            border: none;
            outline: none;
            background-color: #21313b;
            color: #fff;
            font-size: 18px;
            // color: #333333;
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
        .enter {
            margin-top: 20px;
            width: 200px;
            // display: grid;
            padding: 1.5rem;
            color: rgb(255, 255, 255);
            font-size: 1rem;
            font-weight: 600;
            text-transform: uppercase;
            border: none;
            border-radius: 0.8rem;
            background-color: #141a1f;
            background-repeat: no-repeat;
            transition: opacity 0.2s linear 0s;
            cursor: pointer;
        }
        .enter.is-disabled {
            background: #c8c9cc63;
            color: #fff;
        }
        .enter:hover {
            background: #c8c9cc63;
            color: #fff;
        }
        .enter.disabled {
          @include enterDisabled($enterDisabled-light);
          color: #fff;
          cursor: not-allowed;
        }
      }
    }
  }
}
</style>