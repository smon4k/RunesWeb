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
            <p class="title" v-if="kind">
              <span>{{ $t('public:likeTo') }}{{ this.type == 1 ? $t('public:unstake') : $t('public:stake') }}</span>
            </p>
            <p class="title" v-else>
              <span>{{ $t('public:likeTo') }}{{ this.type == 2 ? $t('public:unstake') : $t('public:stake') }}</span>
            </p>

            <div class="input-area">
              <div class="balance">
                <span class="info">{{ $t('public:Balance') }}：</span>
                <span class="num">{{ tokenBalance ? tokenBalance : 0 }} {{ currency }}</span
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
              <el-button class="action-btn" v-loading="trading" :disabled="trading" round @click="submitOrder()">{{ submitBtnText }}</el-button>
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
import { getUserPlatformBalance } from "@/wallet/serve";
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
      productId: 0,
      currency: "",
      tokenBalance: "",
      total_invest: 0,
      ableReceive: "--",
      rewardAmount: "",
      tokenAddress: "",
      currencyToken: "",
      goblin: "",
      name: "",
      approved: 0,
      decimals: 18,
      trading: false,
    };
  },
  activated() { //页面进来
      if(this.userId) {
          // this.getProductDetail();
      }
  },
  created() {
    try {
      let info = this.$route.params;
      console.log(info);
      if(Object.keys(info).length==0) {
        this.$router.push({
            path:'PoolsListSpeed'
        })
      } else {
        // this.currencyToken = info.currencyToken;
        this.name = info.name;
        this.productId = info.id;
        this.type = info.type;
        this.currency = info.currency;
        this.total_invest = info.total_invest;
        this.getTokenBalance();
        // this.getProductDetail();
        // setTimeout(async() => {
        //   await this.getTokenBalance();
        // }, 300)
      }
    } catch (err) {}
  },
  mounted() {},
  watch: {
    isConnected: {
      immediate: true,
      async handler(val) {
        if (val) {
        }
      },
    },
  },
  computed: {
    ...mapState({
      address:state=>state.base.address,
      userId:state=>state.base.userId,
      isConnected: (state) => state.base.isConnected,
      fairLaunchAddress: (state) => state.base.fairLaunchAddress,
      mainTheme: (state) => state.comps.mainTheme,
      apiUrl:state=>state.base.apiUrl,
      nftUrl:state=>state.base.nftUrl,
    }),
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
      let bool = (this.tokenBalance === "--" && Number(this.depositNum)) || (this.tokenBalance !== "--" && Number(this.depositNum) > Number(this.tokenBalance));
      return bool;
    },
  },
  methods: {
    async timeCountBeat(start, end, duration) { //累计收益数值跳动
        let startTimestamp = null;
        const step = (timestamp) => {
            //  console.log("timestamp",timestamp)
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            //  console.log("progress",progress)
            this.cumulativeIncome = this.toFixed(progress * (end - start) + start, 8);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    },
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
    getCountAmount() { //获取投资数量
        return this.toFixed(Number(this.tokenBalance) * Number(this.networth) || 0, 4);
    },
    async submitOrder() { //开始存或者取
      if (!this.isConnected) return this.$connect();
      // let index = this.isDemand === 'hBNB' ? 6 : ( (this.kind || this.isDemand )? 5 : this.activeDayIndex  )
      if(this.type == 1) { //投资的话
          if(this.tokenBalance <= 0) {
              this.$message({
                  message: this.$t('swap:InsufficientBalance'), //'余额不足' ,
                  type: 'warning'
              });
              return false;
          }
          let amount = this.getCountAmount();
          if(amount > this.tokenBalance) {
              this.$message({
                  message: this.$t('pools:AvailableBalanceExceeded'), //this.languag === 'zh' ? '超出可用余额' : 'Exceeded available balance',
                  type: 'warning'
              });
              return false;
          }
      }
      if(this.type == 2) { //赎回的话
          if(this.total_invest <= 0) {
              this.$message({
                  message: this.$t('pools:InsufficientNumberShares'), // this.languag === 'zh' ? '投资份数不足' : 'Insufficient investment',
                  type: 'warning'
              });
              return false;
          }
          if(this.depositNum > this.total_invest) {
              this.$message({
                  message: this.$t('pools:MaxInsufficientNumberShares'), // this.languag === 'zh' ? '已超过最大投资份数' : 'The maximum number of investment shares has been exceeded',
                  type: 'warning'
              });
              return false;
          }
      } 
      if(this.shareValue <= 0) {
          this.$message({
              message: this.$t('pools:PleaseInvestmentAmount'), //this.languag === 'zh' ? '请输入投资数量' : 'Please enter the investment amount',
              type: 'warning'
          });
          return false;
      }

      this.trading = true;
      this.btnDisabled = true;
      setTimeout(() => {
          post(this.apiUrl + '/Api/Product/startInvestNow', { 
            userId: this.userId, 
            product_id: this.productId, 
            number: this.depositNum,
            type: this.type
          }, (json) => {
              this.trading = false;
              this.btnDisabled = false;
              console.log(json);
              if (json && json.code == 10000) {
                  this.shareValue = '';
                  this.$message({
                      type: 'success',
                      message: this.type == 1 ? this.$t('pools:successfulInvestment') : this.$t('pools:successfulRedemption') //投资成功或者赎回成功
                  });
                  setTimeout(() => {
                      this.$router.push({path:'/PoolsListSpeed'})
                      this.getProductDetail();
                      this.$emit('updateUserInfo', true);
                  }, 100)
              } else {
                  this.$message.error(json.msg);
              }
          })
      }, 2000)
    },
    getProductDetail() { //获取产品详情数据
        get(this.apiUrl + "/Api/Product/getProductDetail", {
            product_id: this.productId,
            userId: this.userId
        }, async json => {
            console.log(json);
            if (json.code == 10000) {
                this.networth = json.data.networth;
                this.tokenBalance = json.data.balance;
                this.total_income = Number(json.data.total_income);
                this.daily_income = Number(json.data.daily_income);
                this.total_number = Number(json.data.total_number);
                this.total_invest = Number(json.data.total_invest);
                this.annualized_income = json.data.annualized_income;
                this.interest = json.data.interest;
                this.today_profit = json.data.today_profit;
                this.duration = json.data.duration;
                this.used_profit = json.data.used_profit;
                this.end_profit = json.data.end_profit;
                let startNum = Number(this.total_income + this.used_profit);
                let endNum = Number(this.total_income + this.used_profit + this.end_profit);
                await this.timeCountBeat(startNum, endNum, this.duration);
                // this.is_bet = json.data.is_bet ? true : false;
            } else {
                this.$message.error("Error");
            }
              this.loadingShow = false;
        });
    },
    clickAllBtn() {
      if (!this.isConnected || !this.tokenBalance) return;
      this.depositNum = keepDecimalNotRounding(this.tokenBalance, 4);
    },
    async getTokenBalance() { //获取已存入余额
        // console.log(this.currencyToken , TOKEN.H2O);
        let balance = 0;
        if(this.type == 1) { //获取本地余额
          balance = await getUserPlatformBalance(this.currency);
          this.tokenBalance = balance;
        } else {
          await this.getUserProductBalance();
        }
    },
    async getUserProductBalance() { //获取已存款余额
      get(this.apiUrl + "/Api/Product/getUserProductBalance", {
            product_id: this.productId,
            userId: this.userId
        }, async json => {
            console.log(json);
            if (json.code == 10000) {
              this.tokenBalance = json.data.total_invest;
            }
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