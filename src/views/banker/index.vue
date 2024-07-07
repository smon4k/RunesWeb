<template>
    <div class="container">
        <el-row class="main" v-show="false">
            <el-col :span="24" >
                <el-tabs v-model="activeName" :stretch="true" :style="{width: isMobel ? '100%' : '80%'}">
                    <el-tab-pane label="上庄" name="1" :disabled="trading" :style="{padding: isMobel ? '0' : '10px'}">
                        <el-row class="balance" :style="{padding: isMobel ? '30px' : '0'}">
                            <el-col :span="24">
                                <div>
                                    <!-- <span>平台余额：{{ Math.trunc(Number(localBalance) + Number(walletBalance)) }} LUSD</span> -->
                                    <span>{{ $t('game:platformBalance') }}：{{ toFixed(Number(localBalance) + Number(walletBalance), 4) }} LUSD</span>
                                    <br />
                                    <span>{{ $t('game:walletBalance') }}：{{ toFixed(Number(LUSDBalance), 4) }} LUSD</span>
                                    <!-- <span>GS Balance：{{localBalance}}</span> -->
                                    <!-- <span v-else>GS Balance：<el-skeleton-item variant="text" style="width: 5%;" /></span> -->
                                </div>
                            </el-col>
                            <!-- <el-col :span="24">
                                <div>
                                    <div>
                                        <span v-if="!isStatus && !isWithdraw">CS Balance：{{walletBalance}}</span>
                                        <span v-else>
                                            CS Balance：<span v-loading="true"></span>
                                            <span style="font-size:10px;color:#909399;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The transfer speed on the chain is slow, please be patient for 5 minutes. .</span>
                                        </span>
                                    </div>
                                </div>
                            </el-col> -->
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form :model="depositForm" ref="depositForm">
                                    <el-input 
                                        type="number" 
                                        label="LUSD:" 
                                        v-model="depositForm.amount" 
                                        placeholder="请输入充值金额" 
                                        onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" 
                                        :rules="[{ validator: checkDepositAmount, message: '请输入正确内容' }]"
                                        :style="{width: isMobel ? '90%' : '100%'}"
                                        >
                                            <template slot="prepend">LUSD</template>
                                        </el-input>
                                    <el-row class="button-amount">
                                        <el-col :span="8">
                                            <el-button type="primary" plain @click="buttonAmount(100)">100</el-button>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-button type="primary" plain @click="buttonAmount(200)">200</el-button>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-button type="primary" plain @click="buttonAmount(500)">500</el-button>
                                        </el-col>
                                    </el-row>
                                    <el-row class="button-amount">
                                        <el-col :span="8">
                                            <el-button type="primary" plain @click="buttonAmount(1000)">1000</el-button>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-button type="primary" plain @click="buttonAmount(2000)">2000</el-button>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-button type="primary" plain @click="buttonAmount(maxWithdrawableBalance())">ALL</el-button>
                                        </el-col>
                                    </el-row>
                                    <div class="submit-name">
                                        <el-button type="primary" :loading="trading" :disabled="trading" @click="startApprove" v-if="!approve">批准</el-button>
                                        <el-button type="primary" :loading="trading" :disabled="trading || isStatus || isWithdraw" @click="submitForm('depositForm')" v-else>存入</el-button>
                                        <!-- <el-button @click="resetForm('depositForm')">Cancel</el-button> -->
                                    </div>
                                </el-form>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="下庄" name="2" :disabled="trading" :style="{padding: isMobel ? '0' : '50px'}">
                        <el-row class="balance" :style="{padding: isMobel ? '30px' : '0'}">
                            <el-col :span="24">
                                <div>
                                    <span>平台余额：{{ toFixed(Number(localBalance) + Number(walletBalance), 4) }} LUSD</span>
                                    <br />
                                    <span>钱包余额：{{ toFixed(Number(LUSDBalance), 4) }} LUSD</span>
                                    <!-- <span>GS Balance：{{localBalance}}</span> -->
                                </div>
                            </el-col>
                            <!-- <el-col :span="24">
                                <div>
                                    <span v-if="!isStatus && !isWithdraw">CS Balance：{{walletBalance}}</span>
                                    <span v-else>
                                        CS Balance：<span :loading="true"></span>
                                        <span style="font-size:10px;color:#909399;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The transfer speed on the chain is slow, please be patient for 5 minutes. .</span>
                                    </span>
                                </div>
                            </el-col> -->
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form  :model="withdrawForm" ref="withdrawForm">
                                    <el-input 
                                        label="LUSD:" 
                                        type="number" 
                                        v-model="withdrawForm.amount" 
                                        placeholder="请输入金额" 
                                        min="0" 
                                        :max="maxWithdrawableBalance()" 
                                        onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" 
                                        :rules="[{ validator: checkWithdrawalAmount, message: '请输入正确内容' }]"
                                        :style="{width: isMobel ? '90%' : '100%'}"
                                    >
                                        <template slot="prepend">LUSD</template>
                                    </el-input>
                                    <el-row class="button-amount">
                                        <el-col :span="8">
                                            <el-button type="primary" plain @click="buttonAmount(100)">100</el-button>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-button type="primary" plain @click="buttonAmount(200)">200</el-button>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-button type="primary" plain @click="buttonAmount(500)">500</el-button>
                                        </el-col>
                                    </el-row>
                                    <el-row class="button-amount">
                                        <el-col :span="8">
                                            <el-button type="primary" plain @click="buttonAmount(1000)">1000</el-button>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-button type="primary" plain @click="buttonAmount(2000)">2000</el-button>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-button type="primary" plain @click="buttonAmount(toFixed(Number(LUSDBalance), 4))">ALL</el-button>
                                        </el-col>
                                    </el-row>
                                    <div class="submit-name">
                                        <el-button type="primary" :loading="trading" :disabled="trading" @click="startApprove" v-if="!approve">批准</el-button>
                                        <el-button type="primary" :loading="trading" :disabled="trading || isStatus || isGame || isWithdraw" @click="submitForm('withdrawForm')" v-else>提取</el-button>
                                        <!-- <el-button @click="resetForm('withdrawForm')">Cancel</el-button> -->
                                    </div>
                                </el-form>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
        </el-row>
        <!-- <div style="text-align: center;padding:20px 0;font-size:23px;">{{ gameName }} 庄家</div> -->
        <el-row :style="{width: isMobel ? '100%' : '90%'}">
            <el-col :span="isMobel ? 24 : 24" :align="isMobel ? 'center' : 'left'">
                <div style="font-size:13px;margin-top:10px;">{{ $t('game:DealerIntroduction') }}</div>
            </el-col>
        </el-row>
        <el-row class="dealer-box" :style="{width: isMobel ? '100%' : '90%'}"> 
            <el-col :span="isMobel ? 24 : 24" :align="isMobel ? 'center' : 'left'">
                <!-- 庄家总余额 -->
                <el-col :span="isMobel ? 12 : 8" :align="isMobel ? 'center' : 'left'">
                    <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                        <span class="name">{{ $t('game:dealerTotalBalance') }}：</span>
                        <span class="amount">{{ toFixed(totalBalance, 2) }} LUSD</span>
                    </div>
                </el-col>
                <!-- 总盈利额 -->
                <el-col :span="isMobel ? 12 : 8" :align="isMobel ? 'center' : 'left'">
                    <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                        <span class="name">{{ $t('game:totalProfit') }}：</span>
                        <span class="amount">{{ calcAllProfit() }} LUSD</span>
                    </div>
                </el-col>
                <el-col v-show="!isMobel" :span="isMobel ? 12 : 8" :align="isMobel ? 'center' : 'left'">
                    <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                        <span class="name">&nbsp;</span>
                        <span class="amount">&nbsp;</span>
                    </div>
                </el-col>
                <!-- 我的总余额 -->
                <el-col :span="isMobel ? 12 : 8" :align="isMobel ? 'center' : 'left'">
                    <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                        <span class="name">{{ $t('game:myTotalBalance') }}：</span>
                        <span class="amount">{{ toFixed(walletBalance, 2) }} LUSD</span>
                    </div>
                </el-col>
                <!-- 我的占比 -->
                <el-col :span="isMobel ? 12 : 8" :align="isMobel ? 'center' : 'left'">
                    <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                        <span class="name">{{ $t('game:myPercentage') }}：</span>
                        <span class="amount">{{ calcProportion() }} %</span>
                    </div>
                </el-col>
                <!-- 盈利额 -->
                <el-col :span="isMobel ? 12 : 8" :align="isMobel ? 'center' : 'left'">
                    <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                        <span class="name">{{ $t('game:profit') }}：</span> 
                        <span class="amount">{{ calcProfit() }} LUSD</span> 
                    </div>
                </el-col>
            </el-col>
            <el-col :span="isMobel ? 24 : 24" :align="isMobel ? 'center' : 'center'" :style="{marginTop: isMobel ? '20px' : '20px'}">
                <el-button class="roll-button" @click="shangZhuangClick()" :style="{width: isMobel ? '120px' : ''}">{{ $t('game:upper') }}</el-button>
                <el-button class="roll-button" @click="xiaZhuangClick()" :style="{width: isMobel ? '120px' : ''}">{{ $t('game:lower') }}</el-button>
            </el-col>
            
            <!-- <el-col :span="isMobel ? 8 : 6" :align="isMobel ? 'center' : 'left'">
                <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                    <span>庄家总余额：{{ toFixed(totalBalance, 4) }} LUSD</span><br>
                    <span>我的余额：{{ toFixed(walletBalance, 4) }} LUSD</span><br>
                </div>
            </el-col>
            <el-col :span="isMobel ? 8 : 6" :align="isMobel ? 'center' : 'left'">
                <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                    <span>总盈利额：{{ calcAllProfit() }} LUSD</span><br>
                    <span>我的占比：{{ calcProportion() }} %</span>
                </div>
            </el-col>
            <el-col :span="isMobel ? 8 : 6" :align="isMobel ? 'center' : 'left'">
                <div class="proportion" :style="{marginBottom: isMobel ? '10px' : ''}">
                    <span></span><br>
                    <span>盈利额：{{ calcProfit() }} LUSD</span> 
                </div>
            </el-col>
            <el-col :span="isMobel ? 24 : 6" :align="isMobel ? 'center' : 'right'" :style="{marginTop: isMobel ? '10px' : ''}">
                <el-button class="roll-button" @click="shangZhuangClick()" :style="{width: isMobel ? '120px' : ''}">上庄</el-button>
                <el-button class="roll-button" @click="xiaZhuangClick()" :style="{width: isMobel ? '120px' : ''}">下庄</el-button>
            </el-col> -->
        </el-row>
        <el-tabs class="list-tabs" v-model="listTabsActive" @tab-click="handleClicks" :stretch="true"  :style="{width: isMobel ? '100%' : '100%', marginTop: isMobel ? '' : ''}">
            <el-tab-pane :label="$t('game:bookmakerSummary')" name="3">
                <el-table :data="userDealerProportion" style="width: 100%;" v-loading="loading" height="500">
                    <!-- <el-table-column sortable prop="id" label="ID" width="100" align="center" fixed="left"></el-table-column> -->
                    <el-table-column prop="address" label="User" align="center" :show-overflow-tooltip="true">
                        <template slot-scope="scope">
                            <span>{{ addressStr(scope.row.address) }}</span>
                        </template>
                    </el-table-column>
                    <!-- 庄家总余额 -->
                    <el-table-column prop="" :label="$t('game:dealerBalance') + '(LUSD)'" align="center">
                        <template slot-scope="scope">
                            <span>{{ keepDecimalNotRounding(Number(scope.row.user_balance), 4)}}</span>
                        </template>
                    </el-table-column>
                    <!-- 庄家占比 -->
                    <el-table-column prop="" :label="$t('game:proportionOfDealers')" align="center">
                        <template slot-scope="scope">
                            <span>{{ keepDecimalNotRounding(Number(scope.row.proportion), 2)}} %</span>
                        </template>
                    </el-table-column>
                    <!-- 盈利额 -->
                    <el-table-column prop="" :label="$t('game:profit') + '(LUSD)'" align="center">
                        <template slot-scope="scope">
                            <span>{{ keepDecimalNotRounding(Number(scope.row.profit), 4)}}</span>
                        </template>
                    </el-table-column>
                    <!-- 收益率 -->
                    <el-table-column prop="" :label="$t('game:rate')" align="center">
                        <template slot-scope="scope">
                            <span>{{ keepDecimalNotRounding(Number(scope.row.rate * 100), 4)}}%</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane :label="$t('game:allRecords')" name="1">
                <el-table :data="tableData" style="width: 100%;" v-loading="loading" height="500">
                    <!-- <el-table-column sortable prop="id" label="ID" width="100" align="center" fixed="left"></el-table-column> -->
                    <el-table-column prop="address" label="User" align="center" :show-overflow-tooltip="true"></el-table-column>
                    <el-table-column prop="time" :label="$t('game:Time')" align="center" width="150"></el-table-column>
                    <el-table-column prop="local_balance" :label="$t('game:Amount') + '(LUSD)'" align="center">
                        <template slot-scope="scope">
                        <span>{{ keepDecimalNotRounding(Number(scope.row.amount), 2)}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="" label="占比" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.amount }} %</span>
                        </template>
                    </el-table-column> -->
                    <!-- <el-table-column prop="local_balance" label="平台业务余额(USDT)" width="120" align="center">
                        <template slot-scope="scope">
                        <span>{{ keepDecimalNotRounding(Number(scope.row.local_balance), 2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="local_balance" label="钱包充提余额(USDT)" width="120" align="center">
                        <template slot-scope="scope">
                        <span>{{ keepDecimalNotRounding(Number(scope.row.wallet_balance), 2)}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="type" :label="$t('game:Type')" align="center">
                        <template slot-scope="scope">
                        <span v-if="scope.row.type == 1">{{ $t('game:upper') }}</span>
                        <span v-else>{{ $t('game:lower') }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" :label="$t('game:State')" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1">{{ $t('game:processing') }}</span>
                            <span v-else>{{ $t('game:completed') }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="TxLink" align="center">
                        <template slot-scope="scope">
                        <a :href="'https://www.hecoinfo.com/en-us/tx/' + scope.row.hash" target="_blank" rel="noopener noreferrer">
                            <img src="@/assets/bsc-show.png" alt="" width="30">
                        </a>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-row class="pages">
                    <el-col :span="24">
                        <div style="float:right;">
                        <wbc-page
                            :total="allTotal"
                            :pageSize="allPageSize"
                            :currPage="allCurrPage"
                            @changeLimit="allLimitPaging"
                            @changeSkip="allSkipPaging"
                        ></wbc-page>
                        </div>
                    </el-col>
                </el-row> -->
            </el-tab-pane>
            <el-tab-pane :label="$t('game:mySeatRecord')" name="2">
                <el-table :data="myTableData" style="width: 100%;" v-loading="loading" height="500">
                    <!-- <el-table-column sortable prop="id" label="ID" width="100" align="center" fixed="left"></el-table-column> -->
                    <!-- <el-table-column prop="address" label="Token" align="center" :show-overflow-tooltip="true"></el-table-column> -->
                    <el-table-column prop="time" :label="$t('game:Time')" align="center" width="150"></el-table-column>
                    <el-table-column prop="local_balance" :label="$t('game:Amount') + '(LUSD)'" align="center">
                        <template slot-scope="scope">
                        <span>{{ keepDecimalNotRounding(Number(scope.row.amount), 2)}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="" label="占比" align="center">
                        <template slot-scope="scope">
                            <span>{{ scope.row.amount }} %</span>
                        </template>
                    </el-table-column> -->
                    <!-- <el-table-column prop="local_balance" label="平台业务余额(USDT)" width="120" align="center">
                        <template slot-scope="scope">
                        <span>{{ keepDecimalNotRounding(Number(scope.row.local_balance), 2)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="local_balance" label="钱包充提余额(USDT)" width="120" align="center">
                        <template slot-scope="scope">
                        <span>{{ keepDecimalNotRounding(Number(scope.row.wallet_balance), 2)}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="type" :label="$t('game:Type')" align="center">
                        <template slot-scope="scope">
                        <span v-if="scope.row.type == 1">{{ $t('game:upper') }}</span>
                        <span v-else>{{ $t('game:lower') }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" :label="$t('game:State')" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status == 1">{{ $t('game:processing') }}</span>
                            <span v-else>{{ $t('game:completed') }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="type" label="TxLink" align="center">
                        <template slot-scope="scope">
                        <a :href="'ttps://www.oklink.com/zh-cn/okc/tx/' + scope.row.hash" target="_blank" rel="noopener noreferrer">
                            <img src="@/assets/bsc-show.png" alt="" width="30">
                        </a>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-row class="pages">
                    <el-col :span="24">
                        <div style="float:right;">
                        <wbc-page
                            :total="myTotal"
                            :pageSize="myPageSize"
                            :currPage="myCurrPage"
                            @changeLimit="myLimitPaging"
                            @changeSkip="mySkipPaging"
                        ></wbc-page>
                        </div>
                    </el-col>
                </el-row> -->
            </el-tab-pane>
        </el-tabs>
        
        <el-dialog
            :title="$t('game:upper')"
            :visible.sync="shangZhuangDialog"
            :width="isMobel ? '90%' : '50%'">
            <div class="zhuang">
                <el-row class="balance">
                    <el-col :span="24">
                        <div>
                            {{ $t('game:walletBalance') }}：
                            <span @click="WalletBalanceAll()" style="color:#409EFF;text-decoration: underline;cursor:pointer;">{{ toFixed(Number(LUSDBalance), 4) }} LUSD</span>
                        </div>
                        <div>{{ $t('game:platformBalance') }}：{{ toFixed(Number(localBalance) + Number(walletBalance), 4) }} LUSD</div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form :model="depositForm" ref="depositForm" :rules="depositFormRules">
                            <el-form-item prop="amount">
                                <el-input 
                                    type="number" 
                                    label="LUSD:" 
                                    v-model="depositForm.amount" 
                                    :placeholder="$t('game:PleaseAmount')" 
                                    onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" 
                                    :rules="[{ validator: checkDepositAmount, message: $t('game:PleaseContent')}]"
                                >
                                    <template slot="prepend">LUSD</template>
                                </el-input>
                            </el-form-item>
                            <!-- <el-row class="button-amount">
                                <el-col :span="8">
                                    <el-button type="primary" plain @click="buttonAmount(100, 1)">100</el-button>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" plain @click="buttonAmount(200, 1)">200</el-button>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" plain @click="buttonAmount(500, 1)">500</el-button>
                                </el-col>
                            </el-row>
                            <el-row class="button-amount">
                                <el-col :span="8">
                                    <el-button type="primary" plain @click="buttonAmount(1000, 1)">1000</el-button>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" plain @click="buttonAmount(2000, 1)">2000</el-button>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" plain @click="buttonAmount(maxWithdrawableBalance(), 1)">ALL</el-button>
                                </el-col>
                            </el-row> -->
                            <div class="submit-name">
                                <el-button type="primary" :loading="trading" :disabled="trading" @click="startApprove" v-if="!approve">{{ $t('swap:Approve') }}</el-button>
                                <el-button type="primary" :loading="trading" :disabled="trading || isStatus || isWithdraw" @click="submitForm('depositForm', 1)" v-else>{{ $t('game:Deposit2') }}</el-button>
                                <!-- <el-button @click="resetForm('depositForm')">Cancel</el-button> -->
                            </div>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>

        <el-dialog
            :title="$t('game:lower')"
            :visible.sync="xiaZhuangDialog"
            :width="isMobel ? '90%' : '50%'">
            <div class="zhuang">
                <el-row class="balance" :style="{padding: isMobel ? '30px' : '0'}">
                    <el-col :span="24">
                        <div>
                            <div>
                                {{ $t('game:platformBalance') }}：
                                 <span @click="PlatformBalanceAll()" style="color:#409EFF;text-decoration: underline;cursor:pointer;">{{ toFixed(Number(localBalance) + Number(walletBalance), 4) }} LUSD</span>
                            </div>
                            <div>
                                {{ $t('game:walletBalance') }}：
                                <span>{{ toFixed(Number(LUSDBalance), 4) }} LUSD</span>
                            </div>
                            <!-- <br /> -->
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form  :model="withdrawForm" ref="withdrawForm" :rules="withdrawFormRules">
                            <el-form-item prop="amount">
                                <el-input 
                                    label="LUSD:" 
                                    type="number" 
                                    v-model="withdrawForm.amount" 
                                    :placeholder="$t('game:PleaseAmount')" 
                                    min="0" 
                                    :max="maxWithdrawableBalance()" 
                                    onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))" 
                                    :rules="[{ validator: checkWithdrawalAmount, message: $t('game:PleaseContent') }]"
                                    :style="{width: isMobel ? '90%' : '100%'}"
                                >
                                    <template slot="prepend">LUSD</template>
                                </el-input>
                            </el-form-item>
                            <!-- <el-row class="button-amount">
                                <el-col :span="8">
                                    <el-button type="primary" plain @click="buttonAmount(100, 2)">100</el-button>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" plain @click="buttonAmount(200, 2)">200</el-button>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" plain @click="buttonAmount(500, 2)">500</el-button>
                                </el-col>
                            </el-row>
                            <el-row class="button-amount">
                                <el-col :span="8">
                                    <el-button type="primary" plain @click="buttonAmount(1000, 2)">1000</el-button>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" plain @click="buttonAmount(2000, 2)">2000</el-button>
                                </el-col>
                                <el-col :span="8">
                                    <el-button type="primary" plain @click="buttonAmount(toFixed(Number(localBalance) + Number(walletBalance), 4), 2)">ALL</el-button>
                                </el-col>
                            </el-row> -->
                            <div class="submit-name">
                                <el-button type="primary" :loading="trading" :disabled="trading" @click="startApprove" v-if="!approve">{{ $t('swap:Approve') }}</el-button>
                                <el-button type="primary" :loading="trading" :disabled="trading || isStatus || isGame || isWithdraw" @click="submitForm('withdrawForm', 2)" v-else>{{ $t('game:Withdraw2') }}</el-button>
                                <!-- <el-button @click="resetForm('withdrawForm')">Cancel</el-button> -->
                            </div>
                        </el-form>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { get, post } from "@/common/axios.js";
import { mapState } from "vuex";
import { approve, depositPoolsIn, depositPoolsOut } from "@/wallet/trade";
import {getBalance,isApproved, getDiceDealerBalance, getDiceBalanceOf, getFillingIncreasingId} from "@/wallet/serve";
import { keepDecimalNotRounding } from "@/utils/tools";
import TOKEN from '@/wallet/token.js'
import Page from "@/components/Page.vue";
export default {
    props: ['game_type'],//接受参数
    name: "Index",
    data() {
        return {
            gameName: '',
            // game_type: 0,
            screenWidth: document.body.clientWidth,
            activeName: "1",
            listTabsActive: "3",
            localBalance: 0, //本地余额
            walletBalance: 0, //用户庄家余额
            totalBalance: 0, //庄家总的余额
            isStatus: false, //是否可以充提 0：可以充提 1：不可以充提
            isGame: false, //是否打赏中 true： 打赏中 false：不在打赏中
            isGameInfoNum: 0, //正在打赏中 提示次数
            isWithdraw: false, //是否充提进行中
            approve: false,
            trading: false,
            buttonAmountNum: 0, //按钮选择额度值
            LUSDBalance: 0,
            depositForm: {
                amount: '',
            },
            depositFormRules: {
                amount: [
                    { required: true, validator: (rule, value, callback) => {
                        if (!value) { //请输入充值金额
                            return callback(new Error(this.$t('game:PleaseRechargeAmount')));
                        }
                        let num = this.LUSDBalance;
                        if(Number(value) > num) { //余额不足
                            return callback(new Error(this.$t('swap:InsufficientBalance')));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' },
                ]
            },
            withdrawForm: {
                amount: '',
            },
            withdrawFormRules: {
                amount: [
                    { required: true, validator: (rule, value, callback) => {
                        if (!value) { //请输入充值金额
                            return callback(new Error(this.$t('game:PleaseRechargeAmount')));
                        }
                        let num = this.maxWithdrawableBalance();
                        if(Number(value) > num) { ////余额不足
                            return callback(new Error(this.$t('swap:InsufficientBalance')));
                        } else {
                            callback();
                        }
                    }, trigger: 'blur' },
                ]
            },
            balanceTimeInterval: null,
            refreshBankerTime: 5000, //数据刷新间隔时间
            tableData: [],
            allCurrPage: 1, //当前页
            allPageSize: 100, //每页显示条数
            allTotal: 1, //总条数
            myTableData: [],
            myCurrPage: 1, //当前页
            myPageSize: 100, //每页显示条数
            myTotal: 1, //总条数
            loading: false,
            shangZhuangDialog: false,
            xiaZhuangDialog: false,
            accessNum: 0, //用户充提总值
            allAccessNum: 0, //总的用户充提总值
            gamesFillingAddress: '', //台子地址
            timeBankerInterval: null,
            refreshBankerTime: 3000, //数据刷新间隔时间
        };
    },
    mounted() {
        window.onresize = () => {
            this.screenWidth = document.body.clientWidth;
        }
    },
    activated() { //页面进来
        // this.refreshData();
        // this.getUserInfo();
    },
    beforeRouteLeave(to, from, next){ //页面离开
        if (this.balanceTimeInterval) {
            clearInterval(this.balanceTimeInterval);
            this.balanceTimeInterval = null;
        }
        next();
    },
    created() {
        try {
            // console.log(this.game_type);
            // let game_type = this.$route.query.game_type;
            // this.game_type = game_type;
            if(this.game_type == 1) {
                this.gamesFillingAddress = this.numberAddress;
                this.gameName = '猜数字';
            } else if(this.game_type == 2) {
                this.gamesFillingAddress = this.sizeAddress;
                this.gameName = '猜大小';
            } else if(this.game_type == 3) {
                this.gamesFillingAddress = this.singDoubleAddress;
                this.gameName = '猜单双';
            } else if(this.game_type == 4) {
                this.gamesFillingAddress = this.baccaratAddress;
                this.gameName = '百家乐';
            }
            console.log(this.gamesFillingAddress, this.gameName);
        } catch (err) {
            console.log(err);
        }
    },
    watch: {
        isConnected: {
            immediate: true,
            async handler(val){
                if(val) {
                    await this.getIsApprove();
                    await this.getBalanceInfo();
                    await this.getAllListData();
                    await this.getAccessNum();
                    // await this.refreshData();
                    if(!this.userDealerProportion.length) {
                        this.$store.dispatch("getUserDealerProportion", {game_type: this.game_type});
                    }
                }
            }
        },
        userDealerProportion: {
            immediate: true,
            async handler(val){
                if(val) {
                    // console.log(val);
                }
            }
        }
    },
    computed: {
        ...mapState({
            isConnected:state=>state.base.isConnected,
            chainName:state=>state.base.chainName,
            address:state=>state.base.address,
            numberAddress:state=>state.base.numberAddress,
            sizeAddress:state=>state.base.sizeAddress,
            singDoubleAddress:state=>state.base.singDoubleAddress,
            baccaratAddress:state=>state.base.baccaratAddress,
            apiUrl:state=>state.base.apiUrl,
            userId:state=>state.base.userId,
            isMobel:state=>state.comps.isMobel,
            userDealerProportion:state=>state.base.userDealerProportion,
            versionName:state=>state.base.versionName,
        }),
        changeData() {
            const {apiUrl,address} = this
            return {
                apiUrl, address
            };
        }
    },
    components: {
        "wbc-page": Page, //加载分页组件
    },
    beforeDestroy() { //页面关闭执行
        clearInterval(this.timeBankerInterval);
        this.timeBankerInterval = null;
    },
    methods: {
        async getAllListData(ServerWhere) {
            if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
                ServerWhere = {
                    limit: this.allPageSize,
                    page: this.allCurrPage,
                    type: this.game_type,
                    chain: this.chainName,
                    version_type: 1,
                };
            }
            console.log(ServerWhere);
            axios.get(this.apiUrl + "/Api/Dealerrecord/getDepositWithdrawRecord", {
                params: ServerWhere
            }).then((json) => {
                console.log(json);
                // console.log(this.address);
                if (json.code == 10000) {
                    this.tableData = json.data.lists;
                    this.allTotal = json.data.count;
                } else {
                    this.$message.error(this.$t('public:FailedLoadData')); //加载数据失败
                }   
            }).catch((error) => {
                this.$message.error(error);
            });
        },
        getMyListData(ServerWhere) {
            if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
                ServerWhere = {
                    address: this.address,
                    limit: this.myPageSize,
                    page: this.myCurrPage,
                    type: this.game_type,
                    chain: this.chainName,
                    version_type: 1,
                };
            }
            console.log(ServerWhere);
            axios.get(this.apiUrl + "/Api/Dealerrecord/getDepositWithdrawRecord", {
                params: ServerWhere
            }).then((json) => {
                console.log(json);
                // console.log(this.address);
                if (json.code == 10000) {
                    this.myTableData = json.data.lists;
                    this.myTotal = json.data.count;
                } else {
                    this.$message.error(this.$t('public:FailedLoadData')); //加载数据失败
                }   
            }).catch((error) => {
                this.$message.error(error);
            });
        },
        async getAccessNum() { //获取用户充提数值
            axios.get(this.apiUrl + "/Api/Dealerrecord/getAccessNum", {
                params: {
                    address: this.address,
                    type: this.game_type,
                    chain: this.chainName,
                    version_type: 1,
                }
            }).then((json) => {
                console.log(json);
                // console.log(this.address);
                if (json.code == 10000) {
                    this.accessNum = json.data.num;
                    this.allAccessNum = json.data.all_num;
                } else {
                    this.$message.error(this.$t('public:FailedLoadData')); //加载数据失败
                }   
            }).catch((error) => {
                this.$message.error(error);
            });
        },
        allLimitPaging(limit) { //全部 赋值当前条数
            this.allPageSize = limit;
            this.getAllListData(); //刷新列表
        },
        allSkipPaging(page) { //全部 赋值当前页数
            this.allCurrPage = page;
            this.getAllListData(); //刷新列表
        },
        myLimitPaging(limit) { //全部 赋值当前条数
            this.myPageSize = limit;
            this.getMyListData(); //刷新列表
        },
        mySkipPaging(page) { //全部 赋值当前页数
            this.myCurrPage = page;
            this.getMyListData(); //刷新列表
        },
        calcProportion() { //计算占比
            let proportion = 0.0;
            if(Number(this.walletBalance) > 0) {
                proportion = Number(this.walletBalance) / Number(this.totalBalance) * 100;
            }
            // console.log(proportion);
            return keepDecimalNotRounding(proportion, 2, true);
        },
        calcProfit() {  //计算盈利额
            let profit = 0;
            if(Number(this.walletBalance) > 0) {
                profit = Number(this.walletBalance) - Number(this.accessNum);
            }
            return keepDecimalNotRounding(profit, 2, true);
        },
        calcAllProfit() {  //计算总的盈利额
            let profit = 0;
            if(Number(this.totalBalance) > 0) {
                profit = Number(this.totalBalance) - Number(this.allAccessNum);
            }
            return keepDecimalNotRounding(profit, 2, true);
        },
        shangZhuangClick() {
            this.depositForm.amount = '';
            this.withdrawForm.amount = '';
            this.shangZhuangDialog = true;
        },
        xiaZhuangClick() {
            this.depositForm.amount = '';
            this.withdrawForm.amount = '';
            this.xiaZhuangDialog = true;
        },
        checkDepositAmount(value) { //充值输入框验证
            console.log(value);
            if (!value) {
                return false;
            }
            let num = this.LUSDBalance;
            if(Number(value) > num) {
                return false;
            } else {
                return true;
            }
        },
        checkWithdrawalAmount(value) { //提取输入验证
            console.log(value);
            if (!value) {
                return false;
            }
            let num = this.maxWithdrawableBalance();
            if(Number(value) > num) {
                return false
            } else {
                return true
            }
        },
        pageSwitchChange(evt, hidden) { //浏览器页面 切换事件
            //hidden为false的时候，表示从别的页面切换回当前页面
            //hidden为true的时候，表示从当前页面切换到别的页面
            if(hidden === false) { //页面切换进来
                this.refreshData();
                this.getBalanceInfo();
            } else { //页面切换离开
                if (this.balanceTimeInterval) {
                    clearInterval(this.balanceTimeInterval);
                    this.balanceTimeInterval = null;
                }
            }
        },
        async refreshData() {
            // this.walletBalance = await getGameFillingBalance(); //获取余额
            this.timeBankerInterval = setInterval(async() => {
                this.walletBalance = await getDiceDealerBalance(this.gamesFillingAddress); //获取余额
                this.LUSDBalance = await getBalance(TOKEN[this.chainName].LUSD, 18); //获取LUSD余额
                this.$store.dispatch("refreshUserDealerProportion", this.game_type);
                await this.getBalanceInfo();
                // console.log(this.walletBalance);
            }, this.refreshBankerTime)
        },
        maxWithdrawableBalance() {
            let num = Number(this.walletBalance) + Number(this.localBalance);
            return num;
        },
        async handleClicks(tab, event) {
            if(tab.name == 1) { 
                this.allCurrPage = 1;
                await this.getAllListData();
            } else if(tab.name == 2){
                this.myCurrPage = 1;
                await this.getMyListData();
            } else {
                this.$store.dispatch("refreshUserDealerProportion", this.game_type);
            }
        },
        async getIsApprove() { //获取余额 查看是否授权
            let balance = await this.getLusdBalance(); //获取余额
            isApproved(TOKEN[this.chainName].LUSD, 18, balance, this.gamesFillingAddress).then((bool) => {
                console.log("isApprove", bool);
                this.approve = bool ? true : false;
            });
        },
        async getLusdBalance() {  //获取余额
            let balance = await getBalance(TOKEN[this.chainName].LUSD, 18);
            console.log("LUSD balance", balance);
            this.tokenBalance = keepDecimalNotRounding(balance, 4, true);
            return balance;
        },
        startApprove() { //批准LUSD
            const loading = this.$loading({
            lock: true,
            text: 'transaction in progress',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
            });
        this.trading = true;
        approve(TOKEN[this.chainName].LUSD, this.gamesFillingAddress).then((hash) => {
            // console.log(result);
            loading.close();
            if(hash) {
                this.approve = true;
                this.trading = false;
            }
        }).finally(() => {
            loading.close();
            this.trading = false;
        });
        },
        async submitForm(formName, type) {//1. 提交调用合约
            // console.log(this.$refs[formName]);
            this.$refs[formName].validate(async (valid) => {
            if (valid) {
                const loading = this.$loading({
                    lock: true,
                    text: 'transaction in progress',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });
                this.trading = true;
                let amount = 0;
                let contractName = '';
                let orderId = '';
                // console.log(isInProgress);
                if(this.isStatus == 1 || this.isWithdraw) {
                    this.trading = false;
                    return false;
                }
                if(type == 1) {//上庄
                    amount = this.depositForm.amount;
                    contractName = depositPoolsIn;
                } else { //下庄
                    // await this.getIsInTheGame(); //检测是否在打赏中 提示信息
                    if(this.isGame) {
                        this.trading = false;
                        return false;
                    }
                    amount = this.withdrawForm.amount;
                    contractName = depositPoolsOut;
                    orderId = await getFillingIncreasingId();
                    if(!orderId || orderId <= 0) {
                        this.$notify({ type: 'danger', message: this.$t('public:FailedOrderIdError')});
                    }
                }
                const fillingRecordParams = { //充提记录参数
                    amount: Number(amount),
                    address: this.address,
                    userId: this.userId,
                    type: type,
                    local_balance: this.localBalance,
                    wallet_balance: this.walletBalance,
                    hash: '',
                    currency: '',
                    orderId: orderId,
                    game_type: this.game_type,
                    chain: this.chainName,
                    version_type: 1,
                };
                console.log(fillingRecordParams);
                contractName(this.gamesFillingAddress, amount, 18, fillingRecordParams, orderId).then(async (hash) => {
                    loading.close();
                    if(hash) {
                        fillingRecordParams.hash = hash;
                        await this.setDepositWithdraw(fillingRecordParams);
                        // saveNotifyStatus(0, false);
                        await this.getAllListData(); 
                        await this.getLusdBalance(); //获取余额
                        this.shangZhuangDialog = false;
                        await this.getBalanceInfo();
                        await this.getAccessNum();
                        this.resetForm('depositForm');
                        this.resetForm('withdrawForm');
                    }
                }).finally(() => {
                    loading.close();
                    // saveNotifyStatus(0);
                    this.trading = false;
                });
            } else {
                console.log('error submit!!');
                return false;
            }
            });
        },
        async setDepositWithdraw(params) { // 记录数据库记录
            await axios.post(this.apiUrl + '/Api/Dealerrecord/depositWithdraw', params).then((json) => {
                if (json && json.code == 10000) {
                    return true;
                } else {
                    return false;
                }
                return;
            }).catch((error) => {
                this.$message.error(error);
                return false;
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.trading = false;
        },
        allBlanceFun() { //全部余额
            if(this.localBalance > 0 || this.walletBalance > 0) {
                this.withdrawForm.amount = Number(this.localBalance) + Number(this.walletBalance);
                return true;
            }
            return false;
        },
        allWalletBlanceFun() { //全部钱包余额
            if(this.LUSDBalance > 0) {
                this.depositForm.amount = Math.trunc(this.LUSDBalance);
                return true;
            }
            return false;
        },
        async getBalanceInfo() {
            this.walletBalance = await getDiceDealerBalance(this.gamesFillingAddress); //获取合约余额
            this.totalBalance = await getDiceBalanceOf(this.gamesFillingAddress); //获取合约总余额
            console.log('庄家币的总余额：', this.totalBalance);
            console.log('庄家我的余额：', this.walletBalance);
            this.LUSDBalance = await getBalance(TOKEN[this.chainName].LUSD, 18); //获取LUSD余额
            console.log('LUSD 余额：', this.LUSDBalance);
        },
        buttonAmount(value, type) { //选中按钮选择数量
            if(value) {
                if(type == 1) {//上庄
                    this.depositForm.amount = value;
                } else {
                    this.withdrawForm.amount = value;
                }
            }
        },
        onClickSave() { //编辑资料
            this.$router.go(-1);
        },
        addressStr(address){
            console.log(address);
            let addressstrnt = address || this.address;
            return addressstrnt.substring(0, 4) + "***" + addressstrnt.substring(addressstrnt.length - 3)
            // console.log(this.address);
        },
        WalletBalanceAll() { //点击钱包余额
            console.log(222);
            this.depositForm.amount = keepDecimalNotRounding(this.LUSDBalance, 4, true);
        },
        PlatformBalanceAll() { //点击平台余额
            this.withdrawForm.amount = keepDecimalNotRounding(Number(this.localBalance) + Number(this.walletBalance), 0, true);
        },
    },
};
</script>
<style>
    .el-loading-mask {
        border-radius: 0 !important; 
    }
</style>
<style lang="scss" scoped>
.container {
    /deep/ {
        .dealer-box {
            margin: 0 auto;
            padding: 15px 5px;
            align-items: center;
            background-color: rgb(34, 45, 52);
            border: 2px solid #454848;
            // border-radius: 10px;
            margin-top: 10px;
        }
        input[type=number] {
            -moz-appearance:textfield;
        }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
        // height: 100vh;
        .el-dialog {
            background: #1e272a;
            .el-dialog__header {
                text-align: center;
                .el-dialog__title {
                    color: #fff;
                }
            }
        }
        .proportion {
            font-size: 10px;
            .name {
                position: relative;
                display: block;
                float: left;
                width: 120px;
                text-align: right;
            }
            .amount {
                text-align: left;
                // width: 100px;
                display: block;
                float: left;
                position: relative;
            }
        }
        .zhuang {
            // background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%), linear-gradient(230.47deg, rgb(30, 69, 137) -47%, rgb(93, 69, 179) 48.82%, rgb(130, 1, 112) 131.59%);
            // border-radius: 20px !important;
            // background-color: #fff !important;
            // width: 80%;
            // height: 100vh;
            // padding: 20px;
            text-align: center;
            margin: 0 auto;
            // margin-top: 35px;
            .el-form {
                margin-top: 15px;
            }
            .el-form-item {
                // height: 50px;
            }
            .el-loading-spinner {
                margin-top: -11px;
                .circular {
                    width: 20px;
                    height: 20px;
                }
            }
            .el-form-item__label {
                color: #fff;
                // @include mainFont($color-mainFont-light);
            }
            .el-input {
                // background-color: #333257;
                // color: #fff;
                // border: 1px solid #333257;
                // padding: 0 10px;
                font-size: 16px;
                .el-input__label {
                    width: 50px;
                    margin-right: 0;
                    // text-align: right;
                }
            }
            .el-input__inner {
                background-color: #21313b;
                color: #fff;
                border: 0;
                // background-color: #333257;
                // color: #fff;
                // border: 1px solid #333257;
                padding: 10px;
                height: 50px;
                line-height: 50px;
                font-size: 16px;
            }
            .el-input-group__prepend {
                background-color: #21313b;
                color: #fff !important;
                // border: 1px solid #DCDFE6 !important;
            }
            .el-input-group__append button.el-button {
                color: #fff;
            }
            .el-input-group__append, .el-input-group__prepend {
                background-color: #21313b;
                color: #fff;
                border: 0;
                padding: 0 15px;
            }
            .balance {
                // padding: 20px;
                text-align: left;
                height: 30px;
                line-height: 30px;
                color: #fff;
                // @include mainFont($color-mainFont-light);
            }
            .el-button {
                border-radius: 30px;
                width: 100px;
                border: 0;
            }
            .button-amount {
                margin-top: 30px;
                line-height: 30px;
                .el-button--primary.is-plain {
                    background: #141a1f;
                    color: #fff;
                }
                .el-button {
                    border-radius: 5px;
                }
                .el-button::after {
                    background-color: #e09320 !important;
                }
                .el-button:focus,.el-button:hover {
                    background-color: #e09320 !important;
                    color: #fff;
                }
            }
            .submit-name {
                margin-top: 30px;
                .el-button--primary {
                    width: 200px;
                    height: 50px;
                    border-radius: 50px;
                    background-color: #141a1f;
                    border: 0;
                }
                .el-button--primary:hover {
                    background-color: #21313b;
                }
                .el-button--primary.is-disabled {
                    background: #c8c9cc;
                    color: #fff;
                }
                .el-loading-mask {
                    border-radius: 5px;
                    background-color: rgba(0,0,0,0.8);
                    border: 0;
                }
            }
        }
        .roll-button {
            // margin-bottom: 20px;
            // width: 100px;
            // display: grid;
            // padding: 15px;
            color: rgb(255, 255, 255);
            font-size: 10px;
            font-weight: 600;
            text-transform: uppercase;
            border: none;
            border-radius: 0.8rem;
            background-color: #e09320;
            background-repeat: no-repeat;
            transition: opacity 0.2s linear 0s;
        }
        // .roll-button:hover {
        //     background-color: #21313b;
        // }
        .wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
        }
        .list-tabs {
            // width: 80%;
            margin: 0 auto;
            .el-tabs__nav {
                // border: 0;
            }
            .el-tabs__active-bar {
                // width: 33.33% !important;
                background-color: #e09320 !important;
            }
            .el-tabs__content {
                margin-top: -15px;
            }
            .el-tabs__item {
                color: #fff !important;
                border: 0;
                height: 50px;
                line-height: 50px;
            }
            .el-tabs__item.is-active {  
                color: #e09320 !important;  
                background-color: transparent !important;
                border-bottom-color: #e09320 !important; 
            } 
            .el-tabs__nav-scroll{
                // width:30%;
                margin:0 auto
            }
            .el-table {
                margin: 0 auto;
                background-color: transparent !important;
                tr {
                    background-color: transparent !important;
                    color: #fff;
                    font-size: 10px;
                }
                .el-table__cell {
                    background-color: transparent !important;
                }
                .red {
                    color: red;
                }
                .green {
                    color: #06ff00;
                }
                .blue {
                    color: #0af;
                }
            }
            .pages {
                margin-top: 20px;
                .el-pagination__total {
                    color: #fff;
                }
                .el-pagination__jump {
                    color: #fff;
                }
                .el-input__inner {
                    background-color: #21313b;
                    color: #fff;
                }
                .el-pagination button:disabled {
                    background-color: #21313b;
                }
                .el-pager li {
                    background: #21313b;
                }
                .el-pager li.active {
                    color: #fff;
                }
            }
        }
        // .el-select-dropdown {
        //     background-color: #21313b;
        // }
    }
}
</style>
