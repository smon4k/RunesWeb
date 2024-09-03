<template>
  <div class="container">
    <div class="content">
      <el-card v-loading="receiveLoading">
        <div slot="header" class="header">
          <div>
            <span>{{ 'Transform' }}</span>
          </div> 
          <div class="wormhole"><img :src="require('@/assets/svg/wormhole.svg')" alt="" width="24" @click="wormholeDialogShow = true"></div>
          <!-- <p class="tips">{{ $t('swap:TradeInstant') }}</p> -->
        </div>
        <div class="info">
          <!-- 中间输入框内容 -->
           <!-- INPUT  -->
          <div class="input">
            <div class="input-title">
              <div class="amount">
                <span>Amount</span> 
                <el-button v-if="inputName === 'CFXs' || inputName === 'NFT'"ize="mini" @click="showSelectDialog">Select</el-button>
              </div>
              <div v-if="inputName === 'Coin'">
                <span>Balance: {{ CoinBalance }}</span> 
                <el-button class="max-balance" size="mini" @click="maxBalanceClick">MAX</el-button>
              </div>
              <div v-else>Total: {{ CFXsSelectedAmount }}</div>
              <!-- <div class="textRight">{{ $t('swap:Balance') }}: {{ inputBalance }}</div> -->
            </div>
            <div class="input-box">
              <el-input
                class="input-input"
                v-model.number="inputValue"
                placeholder="0"
                :disabled="inputName !== 'Coin'"
                @input="inputChangeValue"
              ></el-input>
              <el-dropdown trigger="click" tabIndex="1" @command="dropdownInputMenuClick">
                <span class="el-dropdown-link">
                  <img :src="require('@/assets/svg/cfxs-black.svg')" alt="" width="20" v-if="inputName === 'CFXs'">
                  <img :src="require('@/assets/svg/nft.svg')" alt="" width="20" v-if="inputName === 'NFT'">
                  <img :src="require('@/assets/svg/coin.svg')" alt="" width="20" v-if="inputName === 'Coin'">
                  {{ inputName ? inputName : "Select" }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="CFXs"><img :src="require('@/assets/svg/cfxs-black.svg')" alt="" width="20">CFXs</el-dropdown-item>
                  <el-dropdown-item command="NFT"><img :src="require('@/assets/svg/nft.svg')" alt="" width="20">NFT</el-dropdown-item>
                  <el-dropdown-item command="Coin"><img :src="require('@/assets/svg/coin.svg')" alt="" width="20">Coin</el-dropdown-item>
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
              <div>Will Receive</div>
              <div v-if="inputName === 'CFXs' && outputName === 'NFT'">Coins: {{ CFXsSelectedAmount }}</div>
              <!-- <div class="textRight">{{ $t('swap:Balance') }}: {{ inputBalance }}</div> -->
            </div>
            <div class="input-box">
              <el-input
                class="input-input"
                v-model="outputValue"
                placeholder="0"
                :disabled="true"
                @input="outputChangeValue"
              ></el-input>
              <el-dropdown trigger="click" tabIndex="1" @command="dropdownOutputMenuClick">
                <span class="el-dropdown-link">
                  <img :src="require('@/assets/svg/cfxs-black.svg')" alt="" width="20" v-if="outputName === 'CFXs'">
                  <img :src="require('@/assets/svg/nft.svg')" alt="" width="20" v-if="outputName === 'NFT'">
                  <img :src="require('@/assets/svg/coin.svg')" alt="" width="20" v-if="outputName === 'Coin'">
                  {{ outputName ? outputName : "Select" }}
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :disabled="inputName == '' || inputName === 'CFXs'" command="CFXs"><img :src="require('@/assets/svg/cfxs-black.svg')" alt="" width="20">CFXs</el-dropdown-item>
                  <el-dropdown-item :disabled="inputName == '' || inputName === 'NFT' || inputName === 'Coin'" command="NFT"><img :src="require('@/assets/svg/nft.svg')" alt="" width="20">NFT</el-dropdown-item>
                  <el-dropdown-item :disabled="inputName == '' || inputName === 'Coin' || inputName === 'NFT'" command="Coin"><img :src="require('@/assets/svg/coin.svg')" alt="" width="20">Coin</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>

          <div class="price">
            <el-row>
              <el-col :span="5">
                <div class="fee-icon">
                  <span>Fee</span>
                  <el-tooltip class="item" effect="dark" placement="right">
                    <div slot="content">
                      CFXs to Token: CFXs amount*0.01 CFX <br />
                      CFXs to NFT: CFXs amount*0.1 CFX <br />
                      Token to CFXs: 0.2 CFX <br />
                      NFT to CFXs: CFXs amount*0.02 CFX
                    </div>
                    <i class="el-icon-question"></i>
                  </el-tooltip>
                </div>
              </el-col>
              <el-col :span="19" style="text-align: right">
                  <span>
                    <span>{{ inputValue * calcFee }}</span>
                    <span>{{ 'CFX' }}</span>
                    <!-- <span> {{ $t('swap:Per') }} {{ inputName }}</span> -->
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
          <!-- <el-button class="exchangeButton" v-if="!inputApproved" :loading="btnLoading" :disabled="btnLoading" @click="startApprove(inputName)">批准 {{ inputName }}</el-button>
          <el-button class="exchangeButton" v-else-if="!outputApproved" :loading="btnLoading" :disabled="btnLoading" @click="startApprove(outputName)">批准 {{ outputName }}</el-button> -->
          <el-button type="primary" :loading="btnLoading" :disabled="!calcDisabledButton" @click="confirmExchange">{{ 'CONFIRM TRANSFORM' }}</el-button>
        </div>
      </el-card>
    </div>

      <el-dialog
          title="Select CFXs"
          :visible.sync="selectCfxsDialogShow"
          :width="screenWidth > adaptiveSize ? '30%' : '90%'"
          :before-close="() => {
            selectCfxsDialogShow = false;
          }"
          class="select-cfxs"
          top="20vh">
          <div class="dialog-content">
              <div class="select-all">
                <el-checkbox v-model="selectAllChecked" @change="selectAllChange">Select Al</el-checkbox>
              </div>
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
            <div class="left">
              <div class="item-num">{{ highlightedIndices.length }} item</div>
              <div class="clear" @click="clearSelectAll()">Clear</div>
            </div>
            <div class="right">
                <el-button type="primary" :class="{ 'batch-listing': highlightedIndices.length > 0 }" :disabled="highlightedIndices.length <= 0" @click="selectCfxConfirm">CONFIRM</el-button>
            </div>
          </div>
      </el-dialog>

      <el-dialog
          title="Wormhole"
          :visible.sync="wormholeDialogShow"
          :width="screenWidth > adaptiveSize ? '30%' : '90%'"
          :before-close="() => {
            wormholeDialogShow = false;
          }"
          class="wormhole-dialog"
          top="10vh">
          <div class="dialog-content">
              <span class="wormhole-content">Entering the CFXs world wormhole, the unique “Rosen Bridge” will transform CFXs into ERC20 or ERC721.</span>
              <span class="wormhole-content">First put on a helmet, then you need to master the following wormhole safety guidelines:</span>
              <span class="wormhole-title">CFXs to Token</span>
              <span class="wormhole-content">The ID of CFXs will not be retained, and the total amount of CFXs will be transform into the total amount of Token.</span>
              <span class="wormhole-title">CFXs to NFT</span>
              <span class="wormhole-content">The ID of CFXs will be written into the token ID of NFT. In addition to obtaining NFT, the total amount of CFXs will be transform into the total amount of Token.</span>
              <span class="wormhole-title">Token to CFXs</span>
              <span class="wormhole-content">Entering the CFXs world wormhole, the unique “Rosen Bridge” will transform CFXs into ERC20 or ERC721. You will receive a new CFXs.</span>
              <span class="wormhole-title">NFT to CFXs</span>
              <span class="wormhole-content">NFT token ID and corresponding token balance are restored to the original CFXs.</span>
              <span class="wormhole-content">Enjoy the journey.</span>
          </div>
      </el-dialog>
  </div>
</template>
<script>
import { mapState } from "vuex";
import Address from '@/wallet/address.json'
import { get } from "@/common/axios.js";
import { keepDecimalNotRounding, byDecimals} from '@/utils/tools'
import { clickApprove, swapGTokenTogBuyToken, swapBuyTokenTogToken } from '@/wallet/swap'
import { getBalance, isApproved, getSwapPoolsAmountsOut } from "@/wallet/serve";
import { approve, bettingTransfer, ExchangeCFXsForECR20721, ExchangeCFXsForOnlyECR20, ECR20721RedemptionOfCFXs, ECR20RedemptionOfCFXs } from "@/wallet/trade";
export default {
  data() {
    return {
      screenWidth: document.body.clientWidth,
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
      selectCfxsDialogShow: false,
      loading: false,
      dataList: [],
      currPage: 1,
      pageSize: 20,
      total: 0,
      highlightedIndices: [],
      isNoMoreData: false,
      selectAllChecked: false,
      CFXsSelectedAmount: 0,
      CFXsSelectedIds: [],
      CoinBalance: 0,
      wormholeDialogShow: false,
    };
  },
   created(){
    try {
    } catch (err) {}
  },
  components: {
  },
  computed: {
    ...mapState({
      apiUrl: state => state.base.apiUrl,
      address: state => state.base.address,
      isConnected: (state) => state.base.isConnected,
      chainName:state=>state.base.chainName,
      exchangeAddress: (state) => state.base.exchangeAddress,
      adaptiveSize: state => state.comps.adaptiveSize,
    }),
    calcOutputValue() {
      let fee = this.calcFee;
      if(this.inputName !== '' && this.outputName !== '') {
        this.outputValue = this.CFXsSelectedAmount * fee;
      }
    },
    calcFee() {
      let fee = 0;
      if(this.inputName !== '' && this.outputName !== '') {
        if(this.inputName === 'CFXs') {
          if(this.outputName === 'NFT') {
            fee = 0.1;
          } 
          if(this.outputName === 'Coin') {
            fee = 0.01;
          }
        }
        if(this.inputName === 'NFT') {
          if(this.outputName === 'CFXs') {
            fee = 0.02;
          } 
        }
        if(this.inputName === 'Coin') {
          if(this.outputName === 'CFXs') {
            fee = 0.2;
          } 
        }
      }
      return fee;
    },
    caleMaxBalanceINputValue() {
      if(this.inputName === 'Coin') {
        if(this.inputValue > this.CoinBalance) {
          return false;
        }
      }
      return true;
    },
    calcDisabledButton() {
      if(this.btnLoading || (!this.inputValue || this.inputValue <= 0) || (!this.outputValue || this.outputValue <= 0) || (this.inputName == '' || this.outputName == '') || !this.caleMaxBalanceINputValue) {
        return false;
      } else {
        return true;
      }
    }
  },
  watch: {
    isConnected: {
      immediate: true,
      handler(val) {
        if (val) {
          this.getCoinBalance();
        }
      },
    },
  },
  mounted() {
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth;
    }
  },
  methods: {
    showSelectDialog() {
      this.dataList = [];
      this.highlightedIndices = [];
      this.currPage = 1;
      this.isNoMoreData = false;
      if(this.inputName === 'CFXs') {
        this.getMyMarketplaceData();
      } 
      if(this.inputName === 'NFT') {
        this.getMyNftData();
      }
      this.selectCfxsDialogShow = true;
    },
    onLoadMoreData() {
      this.currPage += 1;
      if(this.inputName === 'CFXs') {
        this.getMyMarketplaceData();
      } 
      if(this.inputName === 'NFT') {
        this.getMyNftData();
      }
    },
    selectCfxConfirm() { //确认选择CFXs
      let amount = 0;
      let selectCFXsids = [];
      this.dataList.forEach((item, index) => {
          if (this.highlightedIndices.includes(index)) {
            amount += Number(item.amount);
            if(this.inputName === 'CFXs') {
              selectCFXsids.push(item.chainid);
            }
            if(this.inputName === 'NFT') {
              selectCFXsids.push(item.tokenid);
            }
          }
      });
      this.CFXsSelectedIds = selectCFXsids;
      this.CFXsSelectedAmount = amount;
      this.inputValue = this.highlightedIndices.length;
      this.selectCfxsDialogShow = false;
      this.outputValue = amount;
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
        this.isNoMoreData = false;
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
    getMyNftData(ServerWhere) {
        if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
            ServerWhere = {
                limit: this.pageSize,
                page: this.currPage,
                owner: this.address,
            };
        }
        this.loading = true;
        this.isNoMoreData = false;
        get(this.apiUrl + "/Api/Market/getMyNftData", ServerWhere, async json => {
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
    isSelected(index) {
        if(this.highlightedIndices) {
            return this.highlightedIndices.includes(index);
        }
    },
    toggleHighlight(index) {
      const currentIndex = this.highlightedIndices.indexOf(index);
      if (currentIndex > -1) {
          // 如果索引已高亮，移除它
          this.highlightedIndices.splice(currentIndex, 1);
      } else {
          // 否则，添加这个索引到高亮数组
          this.highlightedIndices.push(index);
      }
    },
    selectAllChange(row) {
        if (!row) {
            this.highlightedIndices = [];
        } else {
            this.highlightedIndices = this.dataList.map((_, index) => index);
        }
    },
    clearSelectAll() {
        this.highlightedIndices = [];
        this.selectAllChecked = false;
    },
    //To Value 触发事件
    async inputChangeValue(toValue) {
      if (!Number.isInteger(toValue)) {
        this.inputValue = Math.floor(toValue);
        this.outputValue = Math.floor(toValue);
      } else {
        this.inputValue = "";
      }
    },
    //out Value 触发事件
    async outputChangeValue(toValue) {
      return;
    },
    maxBalanceClick() {
      this.inputValue = this.CoinBalance;
      this.outputValue = this.CoinBalance;
    },
    registerInputOutputSelect() {
      this.inputName = '';
      this.outputName = '';
      this.inputValue = '';
      this.outputValue = '';
      this.CFXsSelectedAmount = '';
      this.highlightedIndices = [];
      this.getCoinBalance();
    },
    async dropdownInputMenuClick(command) { //INPUT 下拉框选择币种事件
        this.inputName = command;
        this.outputName = '';
        this.inputValue = '';
        this.outputValue = '';
        this.CFXsSelectedAmount = 0;
        this.CFXsSelectedIds = 0;
    },
    async dropdownOutputMenuClick(command) { //OUTPUT 下拉框选择币种事件
        this.outputName = command;
        // this.calcOutputValue;
    },
    async getCoinBalance() {  //获取Coin余额
      const balance = await getBalance(Address.CFXsERC20TokenAddress, 18); //获取余额
      this.CoinBalance = balance;
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
      if(this.calcDisabledButton) {
        this.btnLoading = true
        let contractName = '';
        const value = this.calcFee * this.inputValue;
        if(this.inputName === 'CFXs' && this.outputName === 'NFT') {
          contractName = ExchangeCFXsForECR20721(this.CFXsSelectedIds, value);
        }
        if(this.inputName === 'CFXs' && this.outputName === 'Coin') {
          contractName = ExchangeCFXsForOnlyECR20(this.CFXsSelectedIds, value);
        }
        if(this.inputName === 'Coin' && this.outputName === 'CFXs') {
          const value2 = this.calcFee * this.inputValue;
          contractName = ECR20RedemptionOfCFXs(this.inputValue, value2);
        }
        if(this.inputName === 'NFT' && this.outputName === 'CFXs') {
          contractName = ECR20721RedemptionOfCFXs(this.CFXsSelectedIds, value);
        }
        contractName.then(async (result)=> {
            if(result) {
              this.btnLoading = false;
              this.registerInputOutputSelect();
            }
        })
        .catch(error => {
          // 处理合约调用错误
          console.error('Contract call failed:', error);
        })
        .finally(()=>{
            this.btnLoading = false
        })
      }
    },
  },
};
</script>
<style lang="scss">
.el-dropdown {
  width: 100px;
  color: #fff;
  font-size: 16px;
  cursor: pointer;
  .el-dropdown-menu {
    //width: 100%;
    border: 0;
    //top: 15px !important;
  }
}
.el-dropdown-menu__item {
    padding: 0 15px;
    color: #aaa;
    font-size: 16px;
    font-weight: 400;
    display: flex;
    justify-content: space-around;
    align-items: center;
    img {
        margin-right: 5px;
    }
}
.el-dropdown-menu__item.is-disabled {
  opacity: 0.5;
}
.el-dropdown-menu__item:focus,.el-dropdown-menu__item:hover {
  background-color: #ad8d65 !important;
  color: rgb(0, 0, 0/1) !important;
}
.el-popper[x-placement^=bottom] {
    margin-top: 0;
    margin-left: -15px;
    width: 110px;
    background-color: #202020 !important;
    .popper__arrow::after {
        border-bottom-color: #1b1c23;
    }
    .popper__arrow {
      display: none !important;
    }
}
.el-tooltip__popper {
  line-height: 25px;
}
.el-tooltip__popper.is-dark {
  font-size: 14px;
  // background-color: #525252;
  // color: #aaa;
}
</style>
<style lang="scss" scoped>
.container {
  /deep/ {
    flex-grow: 1;
    align-items: center;
    // padding-top: 50px;
    width: 100%;
    margin: 0 auto;
    display: contents;
    position: fixed;
    .content {
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
              .amount {
                display: flex;
                gap: 10px;
                align-items: center;
                .el-button {
                  color: #ad8d65;
                  background: transparent;
                  border-color: #ad8d65;
                  font-size: 14px;
                  padding: 8px 16px;
                }
              }
              .max-balance {
                background-color: #525252;
                border: 0;
                color: #ad8d65;
                margin-left: 10px;
              }
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
    .price {
      margin-top: 10px;
      line-height: 30px;
      color: #aaa;
      font-size: 16px;
      .fee-icon {
        display: flex;
        align-items: center;
        gap: 5px;
      }
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
              .select-all {
                display: flex;
                justify-content: end;
                margin: 12px 0;
                .el-checkbox {
                  color: #aaa;
                  .el-checkbox__inner {
                      width: 18px;
                      height: 18px;
                      background-color: transparent;
                      border:1px solid #ad8d65;
                  }
                  .el-checkbox__inner::after {
                    //width: 6px;
                    //height: 10px;
                    left: 6px;
                    top: 3px;
                  }
                  .el-checkbox__input.is-checked .el-checkbox__inner {
                    background-color: #ad8d65;
                  }
                  .el-checkbox__label {
                      font-size: 16px;
                      font-weight: none;
                      padding-left: 6px;
                      color: #aaa;
                  }
      
                }
              }
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
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 60px;
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
              .left {
                display: flex;
                align-items: center;
                justify-content: center;
                .item-num {
                    width: 80px;
                }
                .clear {
                    cursor: pointer;
                    color: #ad8d65;
                }
              }
              .right {
                display: flex;
                align-items: center;
                justify-content: center;
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
    }

    .wormhole-dialog {
      .el-dialog {
        height: 668px;
        background-color: #202020;
        overflow-y: auto;
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
            .wormhole-content {
              color: #aaa;
              font-size: 14px;
              margin-bottom: 16px;
            }
            .wormhole-title {
              width: 96px;
              margin-bottom: 10px;
              background-color: #282828;
              color: #ad8d65;
              font-size: 12px;
              padding-top: 4px;
              padding-bottom: 4px;
              text-align: center;
            }
        }
      }
    }
  }
  @media (max-width: 960px) {
    .el-card {
      padding: 16px!important;
    } 
  }
}
</style>