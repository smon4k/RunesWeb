<template>
  <div class="container">
    <div class="item">
      <el-card shadow="hover" v-loading="receiveLoading">
        <div slot="header" class="header">
          <div>
            <span>{{ 'Transform' }}</span>
            <el-button size="mini">Select</el-button></div>
          <div class="wormhole"><img :src="require('@/assets/svg/wormhole.svg')" alt="" width="24"></div>
          <!-- <p class="tips">{{ $t('swap:TradeInstant') }}</p> -->
        </div>
        <div class="info">
          <!-- 中间输入框内容 -->
           <!-- INPUT  -->
          <div class="input">
            <div class="input-title">
              <div>Amount</div>
              <div>Total: 0</div>
              <!-- <div class="textRight">{{ $t('swap:Balance') }}: {{ inputBalance }}</div> -->
            </div>
            <div class="input-box">
              <el-input
                class="input-input"
                v-model="inputValue"
                placeholder="0.0"
                @input="inputChangeValue"
              ></el-input>
              <el-dropdown trigger="click" tabIndex="1" @command="dropdownMenuClick">
                <span class="el-dropdown-link">
                  {{ inputName }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" :append-to-body="false">
                  <el-dropdown-item command="HT" v-if="chainName === 'HECO'">HT</el-dropdown-item>
                  <el-dropdown-item command="HT" v-else>ETH</el-dropdown-item>
                  <el-dropdown-item command="USDT">USDT</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>

          <div class="arrow">
            <el-button size="small" circle>
              <i class="el-icon-bottom"></i>
            </el-button>
          </div>

          <!-- OUTPUT  -->
          <div class="output">
            <div class="input-title">
              <div>Amount</div>
              <div>Total: 0</div>
              <!-- <div class="textRight">{{ $t('swap:Balance') }}: {{ inputBalance }}</div> -->
            </div>
            <div class="input-box">
              <el-input
                class="input-input"
                v-model="outputValue"
                placeholder="0.0"
                @input="outputChangeValue"
              ></el-input>
              <el-dropdown trigger="click" tabIndex="1" @command="dropdownMenuClick">
                <span class="el-dropdown-link">
                  {{ inputName }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown" :append-to-body="false">
                  <el-dropdown-item command="HT" v-if="chainName === 'HECO'">HT</el-dropdown-item>
                  <el-dropdown-item command="HT" v-else>ETH</el-dropdown-item>
                  <el-dropdown-item command="USDT">USDT</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>

          <div
            class="price"
            v-show="inputValue > 0 && outputValue > 0"
          >
            <el-row>
              <el-col :span="5">{{ $t('swap:Price') }}</el-col>
              <el-col :span="19" style="text-align: right">
                  <span>
                    <span>{{ exchangePrice }}</span>
                    <span>{{ outputName }}</span>
                    <span> {{ $t('swap:Per') }} {{ inputName }}</span>
                  </span>
                  <!-- <span v-else>
                    <span>{{ inputPricePer }} </span>
                    <span>{{getFilersSwapPoolsArr(exchangeArray.OUTPUT).name}}</span>
                    <span> {{ $t('swap:Per') }} {{getFilersSwapPoolsArr(exchangeArray.INPUT).name}}</span>
                  </span> -->
                <!-- <span class="refresh">
                  <i class="el-icon-refresh"></i>
                </span> -->
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="btn">
          <el-button class="exchangeButton" v-if="!inputApproved" :loading="btnLoading" :disabled="btnLoading" @click="startApprove(inputName)">批准 {{ inputName }}</el-button>
          <el-button class="exchangeButton" v-else-if="!outputApproved" :loading="btnLoading" :disabled="btnLoading" @click="startApprove(outputName)">批准 {{ outputName }}</el-button>
          <el-button class="exchangeButton" v-else v-loading="btnLoading" :disabled="btnDisabled || (!inputValue || inputValue <= 0) || (!outputValue || outputValue <= 0)" @click="confirmExchange">{{ btnName }}</el-button>
        </div>
      </el-card>
    </div>

  </div>
</template>
<script>
import { mapState } from "vuex";
import TOKEN from '@/wallet/token.js'
import { keepDecimalNotRounding, byDecimals} from '@/utils/tools'
import { clickApprove, swapGTokenTogBuyToken, swapBuyTokenTogToken } from '@/wallet/swap'
import { getBalance, isApproved, getSwapPoolsAmountsOut } from "@/wallet/serve";
import { approve, bettingTransfer } from "@/wallet/trade";
export default {
  data() {
    return {
      receiveNum: "--",
      btnLoading:false,
      btnDisabled:false,
      btnName: this.$t('swap:Exchange'),
      receiveLoading: false, //卡片loding
      inputName: '',
      outputName: '',
      inputBalance: 0,
      outputBalance: 0,
      inputValue: '',
      outputValue: '',
      inputApproved: false,
      outputApproved: false,
      exchangePrice: 1,


      exchangeArray: {
        INPUT: "",
        OUTPUT: "",
      },
      exchangeMoney: {},
      valuationState: 'OUTPUT',
      approvedArrStatus: {
        ////是否批准
        INPUT: false,
        OUTPUT: false,
      },
      priceRefreshState: true, //价格刷新状态 true input1->input2 false input2->input1
      selectTokenOpen: false, //显示确认交换弹框
      timeRefusr: new Date().getTime(),
      isFirstEnter: true, ////是否首次加载
      inputPricePer: 0, //input Price
      outputPricePer: 0, //output Price
    };
  },
   created(){
    try {
      let assets = this.$route.params.assets;
      console.log(assets);
      if(assets && assets !== '') {
        if(assets === 'deposit') { //入金
          this.inputName = 'USDT';
          this.outputName = 'LUSD';
        } else { //出金
          this.inputName = 'LUSD';
          this.outputName = 'USDT';
        }
        setTimeout(async() => {
          await this.getLusdBalance();
        }, 300);
        this.assets = assets;
      }
    } catch (err) {}
  },
  components: {
  },
  computed: {
    ...mapState({
      chainName:state=>state.base.chainName,
      isConnected: (state) => state.base.isConnected,
      exchangeAddress: (state) => state.base.exchangeAddress,
    }),
  },
  watch: {
    isConnected: {
      immediate: true,
      handler(val) {
        if (val) {
          setTimeout(() => {
          }, 300);
        }
      },
    },
    swapPools: {
        immediate: true,
        handler(val) {
          // console.log(val);
        },
        deep: true
    }
  },
  mounted() {
      // window.clickGuruApprove = this.clickGuruApprove;
  },
  methods: {
    //To Value 触发事件
    async inputChangeValue(toValue) {
      console.log(toValue);
      if(toValue > this.inputBalance) {// 如果超过余额 给最大值
        this.inputValue = this.inputBalance;
      }
      if(toValue) { 
        let outputValue = Number(this.inputValue) * this.exchangePrice;
        this.outputValue = outputValue;
        this.btnDisabled = false;
        this.btnName = this.$t('swap:Exchange');
      } else {
        this.outputValue = 0;
        this.btnDisabled = true;
        this.btnName = this.$t('swap:Exchange');
      }
    },
    //out Value 触发事件
    async outputChangeValue(toValue) {
      console.log(toValue);
      if(toValue > this.outputBalance) { // 如果超过余额 给最大值
        this.outputValue = this.outputBalance;
      }
      if(toValue) {
        let inputValue = Number(this.outputValue) / this.exchangePrice;
        if(inputValue > this.inputBalance) {
          this.btnDisabled = true;
          this.btnName = this.inputName + this.$t('swap:InsufficientBalance');
        } else {
          this.btnDisabled = false;
          this.btnName = this.$t('swap:Exchange');
        }
        this.inputValue = inputValue;
      } else {
        this.inputValue = 0;
        this.btnDisabled = true;
        this.btnName = this.$t('swap:Exchange');
      }
    },
    async dropdownMenuClick(command) { //INPUT 下拉框选择币种事件
        this.inputName = command;
        await this.getLusdBalance();
    },
    async getLusdBalance() {  //获取币种余额 及 是否批准
        let inputBalance = await getBalance(TOKEN[this.chainName][this.inputName], 18);
        let outputBalance = await getBalance(TOKEN[this.chainName][this.outputName], 18);
        console.log("input balance", inputBalance);
        console.log("output balance", outputBalance);
        this.inputBalance = keepDecimalNotRounding(inputBalance, 4, true);
        this.outputBalance = keepDecimalNotRounding(outputBalance, 4, true);
        let inputApproved = await isApproved(TOKEN[this.chainName][this.inputName], 18, this.inputBalance, this.exchangeAddress);
        let outputApproved = await isApproved(TOKEN[this.chainName][this.outputName], 18, this.outputBalance, this.exchangeAddress);
        this.inputApproved = inputApproved;
        this.outputApproved = outputApproved;
        console.log("input approved", inputApproved);
        console.log("output approved", outputApproved);
        await this.getExchangePrice();
        return true;
    },
    startApprove(name) { //批准LUSD
        this.btnLoading = true;
        this.btnDisabled = true;
        approve(TOKEN[this.chainName][name], this.exchangeAddress).then(async(hash) => {
            // console.log(result);
            if(hash) {
                await this.getLusdBalance();
                this.btnLoading = false;
                this.btnDisabled = false;
            }
        }).finally(() => {
            this.btnLoading = false;
            this.btnDisabled = false;
        });
    },
    async getExchangePrice() { //获取兑换价格
        if((this.inputName === 'USDT' || this.inputName === 'LUSD') && (this.outputName === 'USDT' || this.outputName === 'LUSD')) { //USDT or LUSD 1:1
            this.exchangePrice = 1;
        } else {
            let exchangePrice = 0;
            if(this.chainName === "HECO") {
              exchangePrice = await getSwapPoolsAmountsOut(TOKEN[this.chainName].MdexRouter, TOKEN[this.chainName].WHT, TOKEN[this.chainName].USDT);
            } else {
              exchangePrice = await getSwapPoolsAmountsOut(TOKEN[this.chainName].MdexRouter, TOKEN[this.chainName].WHT, TOKEN[this.chainName].USDC, null, 6);
            }
            console.log("估值：", exchangePrice);
            this.exchangePrice = exchangePrice;
        }
    },
    /**
     * 金额转换
     * @param {*} tokenBalance 
     * @param {*} tokenDecimals 
     * @returns 
     */
    computeTokenBalanceChange(tokenBalance, tokenDecimals, length) {
        let number = 0;
        const num = length && length > 0 ? length : 8;
        if (tokenBalance && tokenDecimals) {
            number = keepDecimalNotRounding(byDecimals(tokenBalance, tokenDecimals), num);
        }
        // console.log(tokenBalance, tokenDecimals);
        return number;
    },
    //用户批准额度操作
    clickGuruApprove(addr, approveKey) {
        this.btnLoading = true
        clickApprove(addr).then((result)=> {
            if(approveKey == 'INPUT') {
                this.approvedArrStatus.INPUT = true;
            } else {
                this.approvedArrStatus.OUTPUT = true;
            }
        }).finally(()=>{
            this.btnLoading = false
        })
    },
    //用户开始兑换操作
    confirmExchange() {
        this.btnLoading = true
        if((this.inputName === 'HT' && this.outputName === 'LUSD')) { // HT or LUSD
          bettingTransfer(TOKEN[this.chainName][this.outputName], this.exchangeAddress, this.inputValue).then(async (result)=> {
              console.log(result);
              if(result) {
                this.btnLoading = false;
                await this.getLusdBalance();
              }
          }).finally(()=>{
              this.btnLoading = false
          })
        } else {
          let methodsFunName = '';
          if((this.inputName === 'USDT' && this.outputName === 'LUSD')) { // USDT or LUSD
            // console.log(this.exchangeMoney.INPUT, this.exchangeMoney.OUTPUT, methodsFunName);
            methodsFunName = swapBuyTokenTogToken;
          } else if((this.inputName === 'LUSD' && this.outputName === 'USDT')) { // LUSD or USDT
            methodsFunName = swapGTokenTogBuyToken;
          }
            methodsFunName(this.inputValue, this.outputValue, TOKEN[this.chainName][this.inputName], TOKEN[this.chainName][this.outputName]).then(async (result)=> {
              console.log(result);
              if(result) {
                this.btnLoading = false;
                await this.getLusdBalance();
              }
          }).finally(()=>{
              this.btnLoading = false
          })
        }
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  /deep/ {
    flex-grow: 1;
    align-items: center;
    // padding-top: 50px;
    width: 100%;
    margin: 0 auto;
    display: flex;
    position: fixed;
    .item {
      border-radius: 10px;
      padding-top: 50px;
      margin-left: 16px;
      max-width: 498px;
      width: 95%;
      cursor: pointer;
      margin: 0 auto;
      .header {
        display: flex;
        font-size: 16px;
        justify-content: space-between;
        .wormhole {
          cursor: pointer;
        }
        .el-button {
          color: #ad8d65;
          background: transparent;
          border-color: #ad8d65;
          font-size: 14px;
        }
      }
      .el-card {
        padding: 32px;
        border: 0 solid #454848;
        background-color: #202020;
        // @include sideBarSwapBgc($claimCardSwap-dark);
        // @include claimCardBorder($claimCardBorder-light);
      }
      .el-card__header {
        // text-align: center;
        padding-bottom: 0;
        // @include claimCardBorder($claimCardBorder-light);
        color: #fff;
        border-bottom: 0 solid #454848;
        // @include mainFont($color-mainFont-light);
      }
      .tips {
        // color: #B0B0DD;
        font-size: 0.875rem;
      }
      .info {
        color: #fff;
        // @include mainFont($color-mainFont-light);
          .el-dropdown {
            width: 70px;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            .el-dropdown-menu {
              background-color: #1b1c23;
              width: 100%;
              border: 0;
              left: 0 !important;
              top: 15px !important;
            }
            .el-dropdown-menu__item {
                  padding: 0 15px;
                  color: #fff;
                  font-weight: bold;
                  display: flex;
                  justify-content: space-around;
                  align-items: center;
                  img {
                      margin-right: 5px;
                  }
              }
              .el-dropdown-menu__item:hover {
                  background-color: #606266;
              }
              .el-popper[x-placement^=bottom] {
                  .popper__arrow::after {
                      border-bottom-color: #1b1c23;
                  }
                  .popper__arrow {
                      border-bottom-color: transparent;
                  }
              }
          }
          .input, .output {
            display: block;
            padding-top: 16px;
            padding-bottom: 16px;
            padding-left: 20px;
            padding-right: 20px;
            background-color: #282828;
            .input-title {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 16px;
              color: #aaa;
            }
            .input-box {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background-color: transparent;
              min-height: 60px;
              line-height: 30px;
              border-radius: 16px;
              margin-top: 6px;
              // padding: 0.75rem 0.75rem 0.75rem 1rem;
              .input-input {
                  .el-input__inner {
                    // width: 0px;
                    position: relative;
                    font-weight: 500;
                    outline: none;
                    border: none;
                    flex: 1 1 auto;
                    font-size: 16px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding-left: 10px;
                    padding-right: 10px;
                    //text-align: right;
                    appearance: textfield;
                    color: #fff;
                    background-color: transparent;
                  }
              }
              .input-max {
                @include sideBarSwapInputBgc($claimCardSwapInput-light);
                border: 1px solid #0096ff;
                color: #fff;
                float: right;
              }
            }
          }
          .arrow {
            text-align: center;
            margin: 10px 0 10px 0;
            button {
              background-color: #21313b;
              border: 0;
              i {
                color: #0096ff;
                font-weight: 800;
              }
            }
          }
      }
      .btn {
        padding-top: 30px;
        text-align: center;
        button {
          background: #141a1f;
          color: #fff;
          line-height: 26px;
          margin-right: 23px;
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 48px;
          border: none;
          border-radius: 19px;
          outline: none;
          cursor: pointer;
        }
        button:hover {
          background: #21313b;
        }
        button:disabled {
          background: #141a1f;
        }
      }
    }
    .price {
      margin-top: 10px;
      line-height: 30px;
      .refresh {
        width: 22px;
        height: 22px;
        padding: 0.1rem 0.25rem 0.1rem 0.2rem;
        margin-left: 5px;
        @include sideBarSwapInputBgc($claimCardSwapInput-light);
        border-radius: 50%;
        border: none;
        font-size: 0.875rem;
        font-weight: 400;
        cursor: pointer;
        color: rgb(244, 238, 255);
        // display: flex;
        -webkit-box-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        align-items: center;
        i {
          color: #0096ff;
          font-weight: 800;
        }
      }
    }
    .item-bottom {
      border-radius: 24px;
      margin-top: 10px;
      max-width: 436px;
      // width: 100%;
      cursor: default;
      margin: 0 auto;
      // padding: 15px;
      @include sideBarSwapInputBgc($claimCardSwapInput-light);
      color: #fff;
      .item-bottom-box {
        padding: 15px;
        line-height: 25px;
        .tooltip {
            span {
                position: absolute;
            }
          //   position: relative;
        }
      }
    }
    .item-bottom-two {
      border-radius: 24px;
      margin-top: 10px;
      max-width: 436px;
      // width: 100%;
      cursor: default;
      margin: 0 auto;
      // padding: 15px;
      @include swapBlackBgc($swapBlack-light);
      color: #fff;
      .item-bottom-box {
        padding: 15px;
        line-height: 25px;
        .tooltip {
            span {
                position: absolute;
            }
          //   position: relative;
        }
      }
    }
    .textRight {
      text-align: right;
      // padding: 0 16px;
    }
    .textCenter {
        text-align: center;
    }

    .dialogClass {
        /deep/ {
            .el-dialog--center {
                width: 100%;
                max-width: 500px;
                min-height: 60vh;
                border-radius: 32px;
                @include sideBarSwapInputBgc($claimCardSwapInput-light);
                margin: 0 auto;
                // margin-left: 45%;
            }
            .el-dialog__title{
                color: #fff;
                // float: left;
            }
            .content {
                color: #fff;
                // @include mainFont($color-mainFont-light);
                font-size: 16px;
                img {
                    vertical-align:middle;
                }
                .arrow {
                    margin: 20px 0 20px 25px;
                    i {
                        font-weight: 800;
                        font-size: 15px;
                    }
                }
                .desc {
                    margin-top: 40px;
                    font-size: 14px;
                }
            }
        }
    }
  }
}
</style>
<style lang="scss">
    .exchangeButton {
        background: #21313b;
        color: #fff;
        line-height: 26px;
        margin-right: 23px;
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 48px;
        border: none;
        border-radius: 19px;
        outline: none;
        cursor: pointer;
    }
    .exchangeButton:disabled {
        background: #8b8b9b;
    }
</style>