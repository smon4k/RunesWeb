<template>
    <div class="container-list">
        <div class="bet-amount">
            <div>
                <!-- 所有投注 -->
                <el-radio v-model="activeName" label="1" border @input="handleClick">
                    <span class="icon-log">
                        <img src="@/assets/users.png" alt="" width="18">
                        <span>{{ $t('game:AllBets') }}</span>
                    </span>
                </el-radio>
                <!-- 我的投注 -->
                <el-radio v-model="activeName" label="2" border @input="handleClick">
                    <span class="icon-log">
                        <img src="@/assets/your-user.png" alt="" width="18">
                        <span>{{ $t('game:MyBets') }}</span>
                    </span>
                </el-radio>
                <!-- 数据统计 -->
                <el-radio v-model="activeName" label="3" border @input="handleClick">
                    <span class="icon-log">
                        <img src="@/assets/statistic.png" alt="" width="18">
                        <span>{{ $t('game:Stats') }}</span>
                    </span>
                </el-radio>
                <div v-if="isMobel" style="padding:3px 0 3px 0;"></div>
                <!-- 庄家 -->
                <el-radio v-model="activeName" label="4" border @input="handleClick">
                    <span class="icon-log">
                        <img src="@/assets/banker.png" alt="" width="18">
                        <span>{{ $t('game:Dealer') }}</span>
                    </span>
                </el-radio>
                <!-- GLS -->
                <el-radio v-model="activeName" label="6" border @input="handleClick">
                    <span class="icon-log">
                        <img src="@/assets/gls-tab.png" alt="" width="18">
                        <span>{{ $t('game:GLSDividend') }}</span>
                    </span>
                </el-radio>
                <!-- 玩法规则 -->
                <el-radio v-model="activeName" label="5" border @input="handleClick">
                    <span class="icon-log">
                        <img src="@/assets/top-play.png" alt="" width="18">
                        <span>{{ $t('game:HowToPlay') }}</span>
                    </span>
                </el-radio>
            </div>
        </div>

        <div v-if="activeName == 1" class="list">
            <!-- <el-table
                stripe
                :data="allBetData"
                class="top">
                <el-table-column
                    prop="bet_number"
                    label="RollID"
                    align="center"
                    width="">
                </el-table-column>
                <el-table-column
                    prop="address"
                    align="center"
                    :label="$t('game:User')"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="time"
                    :label="$t('game:Time')"
                    align="center"
                    width="">
                </el-table-column>
                <el-table-column
                    prop="bet"
                    :label="'Coin'"
                    align="center"
                    v-if="versionName == 'speed'"
                    width="">
                </el-table-column>
                <el-table-column
                    prop="bet"
                    :label="$t('game:Bet')"
                    align="center"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop=""
                    align="center"
                    :label="$t('game:Payout')"
                    width="">
                </el-table-column>
                <el-table-column
                    prop=""
                    align="center"
                    :label="$t('game:Target')">
                </el-table-column>
                <el-table-column
                    align="center"
                    :label="$t('game:Result')"
                    width="100">
                </el-table-column>
                <el-table-column
                    prop="profit"
                    align="center"
                    :label="$t('game:Profit')"
                    width="130">
                </el-table-column>
            </el-table> -->
            <!-- <vue-seamless-scroll v-if="allBetData.length>=1" :data="allBetData" class="seamless-warp" @ScrollEnd="ScrollEnd" :class-option="defaultOption" ref="seamlessScroll" > -->
                    <!-- height="500" -->
                <el-table
                    height="650"
                    stripe
                    :data="allBetData"
                    v-loading="loading"
                    :element-loading-text="$t('public:language') === 'zh' ? '拼命加载中' : 'loading'"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    class="bottom">
                    <el-table-column
                        prop="bet_number"
                        label="RollID"
                        align="center"
                        width="">
                        <template slot-scope="scope">
                            <a rel="noopener noreferrer" style="color:#409EFF;text-decoration:underline;cursor: pointer;" v-if="versionName === 'speed'" @click="seedShowClick(scope.row)">
                                {{ scope.row.id }}
                            </a>
                            <a :href="domainHostAddress + scope.row.hash" target="_blank" rel="noopener noreferrer" style="color:#409EFF;text-decoration:underline;" v-else>
                                {{ scope.row.id }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        align="center"
                        :label="$t('game:User')"
                        width="100">
                        <template slot-scope="scope">
                            <span class="">{{ addressStr(scope.row.address) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        :label="$t('game:Time')"
                        align="center"
                        width="">
                        <template slot-scope="scope">
                            <span class="">{{ scope.row.time }}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        prop="type"
                        label="类型"
                        align="center">
                        <template slot-scope="scope">
                            <span class="" v-if="scope.row.type == 1">猜数字</span>
                            <span class="" v-if="scope.row.type == 2">猜大小</span>
                            <span class="" v-if="scope.row.type == 3">猜单双</span>
                            <span class="" v-if="scope.row.type == 4">百家乐</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column
                        prop="bet"
                        :label="'Coin'"
                        align="center"
                        v-if="versionName == 'speed'"
                        width="">
                        <template slot-scope="scope">
                            <span class="" v-if="scope.row.currency === 'GLS'">{{ 'LUCK' }}</span>
                            <span class="" v-else>{{ scope.row.currency }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="bet"
                        :label="$t('game:Bet')"
                        align="center"
                        width="120">
                        <template slot-scope="scope">
                            <span class="">{{ keepDecimalNotRounding(scope.row.bet, 10, true) }}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        prop="chance"
                        align="center"
                        :label="$t('game:Chance')">
                        <template slot-scope="scope">
                            <span class="">{{ toFixed(scope.row.chance, 2) }}%</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column
                        prop=""
                        align="center"
                        :label="$t('game:Payout')"
                        width="">
                        <template slot-scope="scope">
                            <span class="">{{ toFixed(scope.row.payout, 4) }}x</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop=""
                        align="center"
                        :label="$t('game:Roll')">
                        <template slot-scope="scope">
                            <span class="" v-if="scope.row.user_choice === '单'">{{ $t('game:One') }}</span>
                            <span class="" v-else-if="scope.row.user_choice === '双'">{{ $t('game:Pair') }}</span>
                            <span class="" v-else-if="scope.row.user_choice === '大'">{{ $t('game:Max') }}</span>
                            <span class="" v-else-if="scope.row.user_choice === '小'">{{ $t('game:Min') }}</span>
                            <span class="" v-else-if="scope.row.user_choice === '闲'">{{ $t('game:Player') }}</span>
                            <span class="" v-else-if="scope.row.user_choice === '庄'">{{ $t('game:Banker') }}</span>
                            <span class="" v-else-if="scope.row.user_choice === '和'">{{ $t('game:Tie') }}</span>
                            <span class="" v-else>{{ scope.row.user_choice }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        :label="$t('game:Result')"
                        width="100">
                        <template slot-scope="scope">
                            <div v-if="versionName === 'chain'">
                                <span :class="versionName === 'chain' ? 'blue' : ''" v-if="scope.row.type == 1" style="text-decoration:underline;cursor: pointer;" @click="checkCardClick(scope.row)">
                                    {{ scope.row.scope_left }}&le; &nbsp;{{ scope.row.result_num }}&nbsp; &le;{{ scope.row.scope_right }}
                                </span>
                                <span :class="versionName === 'chain' ? 'blue' : ''" v-else style="text-decoration:underline;cursor: pointer;" @click="checkCardClick(scope.row)">{{ getResultStr(scope.row) }}</span>
                            </div>
                            <div v-else>
                                <div v-if="scope.row.type == 1">{{ scope.row.result_num }}</div>
                                <div v-else>{{ scope.row.result_num }}({{parseInt(scope.row.result_num)}})</div>
                                <!-- <span v-if="scope.row.type == 1">
                                    {{ scope.row.scope_left }}&le; &nbsp;{{ scope.row.result_num }}&nbsp; &le;{{ scope.row.scope_right }}
                                </span>
                                <span v-else>{{ getResultStr(scope.row) }}</span> -->
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="profit"
                        align="center"
                        :label="$t('game:Profit')"
                        width="130">
                        <template slot-scope="scope">
                            <span v-if="scope.row.result == 1" class="green">+{{ keepDecimalNotRounding(scope.row.profit, 12, true) }}</span>
                            <span v-else class="red">-{{ keepDecimalNotRounding(scope.row.profit, 12, true) }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            <!-- </vue-seamless-scroll> -->
        </div>
        <div v-if="activeName == 2" class="list">
            <!-- <el-table
                :data="myBetData"
                style="width: 100%"
                class="top">
                <el-table-column
                    prop="bet_number"
                    label="RollID"
                    align="center"
                    width="">
                </el-table-column>
                <el-table-column
                    prop="time"
                    :label="$t('game:Time')"
                    align="center">
                </el-table-column>
                <el-table-column
                    prop="bet"
                    :label="'Coin'"
                    align="center"
                    v-if="versionName == 'speed'">
                </el-table-column>
                <el-table-column
                    prop="bet"
                    :label="$t('game:Bet')"
                    align="center"
                    width="120">
                </el-table-column>
                <el-table-column
                    prop=""
                    align="center"
                    :label="$t('game:Payout')">
                </el-table-column>
                <el-table-column
                    prop=""
                    align="center"
                    :label="$t('game:Target')">
                </el-table-column>
                <el-table-column
                    align="center"
                    :label="$t('game:Result')"
                    width="">
                </el-table-column>
                <el-table-column
                    prop="profit"
                    align="center"
                    :label="$t('game:Profit')"
                    width="130">
                </el-table-column>
            </el-table> -->
            <!-- <vue-seamless-scroll v-if="myBetData.length>=1" :data="myBetData" class="seamless-warp" :class-option="defaultOption"  > -->
                <el-table
                    height="500"
                    :data="myBetData"
                    style="width: 100%"
                    v-loading="loading"
                    :element-loading-text="$t('public:loading')"
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    class="bottom">
                    <el-table-column
                        prop="bet_number"
                        label="RollID"
                        align="center"
                        width="">
                        <template slot-scope="scope">
                            <a rel="noopener noreferrer" style="color:#409EFF;text-decoration:underline;cursor: pointer;" v-if="versionName === 'speed'" @click="seedShowClick(scope.row)">
                                {{ scope.row.id }}
                            </a>
                            <a :href="domainHostAddress + scope.row.hash" target="_blank" rel="noopener noreferrer" style="color:#409EFF;text-decoration:underline;" v-else>
                                {{ scope.row.id }}
                            </a>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="time"
                        :label="$t('game:Time')"
                        align="center">
                        <template slot-scope="scope">
                            <span class="">{{ scope.row.time }}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        prop="type"
                        label="类型"
                        align="center">
                        <template slot-scope="scope">
                            <span class="" v-if="scope.row.type == 1">猜数字</span>
                            <span class="" v-if="scope.row.type == 2">猜大小</span>
                            <span class="" v-if="scope.row.type == 3">猜单双</span>
                            <span class="" v-if="scope.row.type == 4">百家乐</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column
                        prop="bet"
                        :label="'Coin'"
                        align="center"
                        v-if="versionName == 'speed'">
                        <template slot-scope="scope">
                            <span class="" v-if="scope.row.currency === 'GLS'">{{ 'LUCK' }}</span>
                            <span class="" v-else>{{ scope.row.currency }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="bet"
                        :label="$t('game:Bet')"
                        align="center"
                        width="120">
                        <template slot-scope="scope">
                            <span class="">{{ keepDecimalNotRounding(scope.row.bet, 10, true) }}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column
                        prop="chance"
                        align="center"
                        :label="$t('game:Chance')">
                        <template slot-scope="scope">
                            <span class="">{{ toFixed(scope.row.chance, 2) }}%</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column
                        prop=""
                        align="center"
                        :label="$t('game:Payout')">
                        <template slot-scope="scope">
                            <span class="">{{ toFixed(scope.row.payout, 4) }}x</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop=""
                        align="center"
                        :label="$t('game:Roll')">
                        <template slot-scope="scope">
                            <span class="">{{ scope.row.user_choice }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        :label="$t('game:Result')"
                        width="">
                        <template slot-scope="scope">
                            <div v-if="scope.row.type == 1">{{ scope.row.result_num }}</div>
                            <div v-else>{{ scope.row.result_num }}({{parseInt(scope.row.result_num)}})</div>
                            <!-- <div v-if="versionName === 'chain'">
                                <span class="blue" v-if="scope.row.type == 1" style="text-decoration:underline;cursor: pointer;" @click="checkCardClick(scope.row)">{{ scope.row.scope_left }}&le; &nbsp;&nbsp;{{ scope.row.result_num }}&nbsp;&nbsp; &le;{{ scope.row.scope_right }}</span>
                                <span class="blue" v-else style="text-decoration:underline;cursor: pointer;" @click="checkCardClick(scope.row)">{{ getResultStr(scope.row) }}</span>
                            </div>
                            <div v-else>
                                <span v-if="scope.row.type == 1">{{ scope.row.scope_left }}&le; &nbsp;&nbsp;{{ scope.row.result_num }}&nbsp;&nbsp; &le;{{ scope.row.scope_right }}</span>
                                <span v-else>{{ getResultStr(scope.row) }}</span>
                            </div> -->
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="profit"
                        align="center"
                        :label="$t('game:Profit')"
                        width="130">
                        <template slot-scope="scope">
                            <span v-if="scope.row.result == 1" class="green">+{{ keepDecimalNotRounding(scope.row.profit, 12, true) }}</span>
                            <span v-else class="red">-{{ keepDecimalNotRounding(scope.row.profit, 12, true) }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            <!-- </vue-seamless-scroll> -->
        </div>
        <div v-if="activeName == 3" class="list">
            <el-row>
                <el-col :span="12" align="right">
                    <el-descriptions :title="$t('game:MyStats')" :column="1" :style="{paddingLeft: screenWidth > 600 ? '60px' : ''}">
                        <el-descriptions-item :label="$t('game:BetNumbers')"><el-tag size="mini">{{ dataStatisticsData.betAddressNum }}</el-tag></el-descriptions-item>
                        <el-descriptions-item :label="$t('game:Wins')"><el-tag size="mini">{{ dataStatisticsData.winAddressNum }}</el-tag></el-descriptions-item>
                        <el-descriptions-item :label="$t('game:Losses')"><el-tag size="mini">{{ dataStatisticsData.lossAddressNum }}</el-tag></el-descriptions-item>
                        <el-descriptions-item :label="$t('game:Luck')"><el-tag size="mini">{{ toFixed(dataStatisticsData.luckAddressNum, 2) }}</el-tag></el-descriptions-item>
                        <el-descriptions-item :label="$t('game:betAmount')">
                            <el-tag size="mini" style="line-height:25px;height:25px;border-radius: 15px;">
                                <span>{{ dataStatisticsData.betAddressAmountNum }} {{ getTransactionCurrency() }}</span> <br>
                                <!-- <span>{{ keepDecimalNotRounding(dataStatisticsData.betAddressValuationNum, getTransactionCurrencyDecimal(), true) }} LUSD</span> -->
                            </el-tag>
                        </el-descriptions-item>
                        <el-descriptions-item :label="$t('game:GLSBalance')"><el-tag size="mini">{{ glsBalance }} LUCK</el-tag></el-descriptions-item>
                        <!-- <el-descriptions-item v-if="screenWidth > 600" :label="$t('game:glsStatsText', {num: dataStatisticsData.betAddressAmountNum * 0.001})"></el-descriptions-item> -->
                        <!-- <el-descriptions-item label="最大下注额"><el-tag size="mini">{{ dataStatisticsData.betMaxAddressAmountNum }} {{ getTransactionCurrency() }}</el-tag></el-descriptions-item> -->
                    </el-descriptions>
                    <!-- <div>预计获取2.022GLS；满1000LUSD下注额发放股权代币奖励1GLS；</div> -->
                </el-col>
                <el-col :span="12" align="right">
                    <el-descriptions :title="$t('game:AllStats')" :column="1">
                        <el-descriptions-item :label="$t('game:BetNumbers')"><el-tag size="mini">{{ dataStatisticsData.betNum }}</el-tag></el-descriptions-item>
                        <el-descriptions-item :label="$t('game:Wins')"><el-tag size="mini">{{ dataStatisticsData.winNum }}</el-tag></el-descriptions-item>
                        <el-descriptions-item :label="$t('game:Losses')"><el-tag size="mini">{{ dataStatisticsData.lossNum }}</el-tag></el-descriptions-item>
                        <el-descriptions-item :label="$t('game:Luck')"><el-tag size="mini">{{ toFixed(dataStatisticsData.luckNum, 2) }}</el-tag></el-descriptions-item>
                        <el-descriptions-item :label="$t('game:betAmount')">
                            <el-tag size="mini" style="line-height:25px;height:25px;border-radius: 15px;">
                                <span>{{ dataStatisticsData.betAmountNum }} {{ getTransactionCurrency() }}</span> <br>
                                <!-- <span>{{ keepDecimalNotRounding(dataStatisticsData.betValuationNum, getTransactionCurrencyDecimal(), true) }} LUSD</span> -->
                            </el-tag>
                        </el-descriptions-item>
                        <!-- <el-descriptions-item label="最大下注额"><el-tag size="mini">{{ dataStatisticsData.betMaxAmountNum }} {{ getTransactionCurrency() }}</el-tag></el-descriptions-item> -->
                    </el-descriptions>
                </el-col>
                <el-col :span="24">
                    <div class="gls-stats-text" :style="{left: screenWidth > 600 ? '70px' : ''}">{{ $t('game:glsStatsText', {num: calcGlsExpected}) }}</div>
                    <!-- <div style="font-size: 10px;padding-bottom: 10px;">预计累计获取 {{ dataStatisticsData.betAmountNum * 1000}} GLS；满1000LUSD下注额发放股权代币奖励1GLS；</div> -->
                </el-col>
            </el-row>
        </div>
        <div v-if="activeName == 4" class="list">
            <Banker :game_type="game_type" v-if="versionName === 'chain'" />
            <BankerSpeed :game_type="game_type" :activeName="activeName" v-else @childUpdateBalance="childUpdateBalance" />
        </div>
        <div v-if="versionName === 'speed' && activeName == 6" class="list">
            <Gls :game_type="game_type" :activeName="activeName" @childUpdateBalance="childUpdateBalance" />
        </div>
        <div v-if="activeName == 5" class="list">
            <div class="play-rule">
                <span v-if="game_type == 1">{{ versionName === 'chain' ?  $t('game:rulesPlay-number') :  $t('game:rulesPlay-number-speed')}}
                    <!-- <span v-if="$t('public:language') === 'zh'">
                        数字0到9范围猜谜游戏：（高达9.8倍的赔率）。<br>
                        A.用HT来兑换LUSD。<br>
                        B.转账LUSD到游戏合约地址（转账金额的小数点后必须包含共3位数字，其中最后2位代表下注范围，例如10.017，代表1到7）。<br>
                        C.投注金额就是转账金额。<br>
                        D.如果你投注100LUSD，就转100LUSD。<br>
                        E.转账金额低于1LUSD的，视为无效投注，不发放奖励。<br>
                        F.当转帐不符合限额时，本金将被退还（不扣除手续费）。<br>
                        G. 在收到您的投注转账后，智能合约会在当前这笔交易的日志里附带开奖信息。日志中当前合约地址关联的[topic1]中的内容的最后5个字符串将被作为开奖字符串。例如：如果[topic1]的内容是0x0a92381588172b91a4dfd53af26c52242e7033f4f9966b82694ea880dfd3yoq8，那么3yoq8就是开奖字符串。<br>
                        H.取开奖字符串倒数的第一个数字作为开奖结果，例如:3yoq8的倒数起第一个数字是8，那么8就是开奖结果。例2:o2xfd的倒数起第一个数字是2，那么2就是开奖结果。<br>
                        I.如果开奖字符串都是字母，则判庄家赢；<br>
                        J.根据所选数字范围在整个区间内的比例来计算赔率。<br>
                        K.损益转移税为百分之一。<br>
                    </span>
                    <span v-else>
                        Number 0 to 9 range guessing game: (up to 9.8x odds).<br>
                        A.Use HT to exchange LUSD.<br>
                        B.Transfer LUSD to the game contract address(The transfer amount must contain a total of 3 digits after the decimal point, where the last 2 digits represent the betting range, e.g. 10.017 for 1 to 7.).<br>
                        C. The bet amount is the transfer amount.<br>
                        D. If you bet 100LUSD, transfer 100LUSD.<br>
                        E.If the transfer amount is less than 1LUSD, it is considered an invalid bet and no reward will be issued.<br>
                        F. When the transfer does not meet the limit, the principal amount will be refunded (without deducting the handling fee).<br>
                        G. Upon receipt of your wager transfer, the smart contract will attach the prize information to the log of this current transaction. The last 5 strings of the contents of [topic1] associated with the current contract address in the log will be used as the prize string. For example: if the content of [topic1] is 0x0a92381588172b91a4dfd53af26c52242e7033f4f9966b82694ea880dfd3yoq8, then 3yoq8 is the prize string.<br>
                        H. Take the first number of the reciprocal of the prize string as the result of the lottery, for example: the first number from the reciprocal of 3yoq8 is 8, then 8 is the result of the lottery. Example 2: The first number from the reciprocal of o2xfd is 2, then 2 is the result of the lottery.<br>
                        I. If the prize strings are all letters, then the dealer is awarded a win.<br>
                        J. The odds are calculated based on the proportion of the selected range of numbers over the entire interval.<br>
                        K. The profit and loss transfer tax is one percent.<br>
                    </span> -->
                </span>
                <span v-if="game_type == 2">{{ $t('game:rulesPlay-size') }}
                </span>
                <span v-if="game_type == 3">{{ $t('game:rulesPlay-sindouble') }}
                </span>
                <span v-if="game_type == 4">{{ $t('game:rulesPlay-baccarat') }}
                </span>
            </div>
        </div>

        <!-- 验牌 -->
        <el-dialog
            :title="$t('game:checkCard')"
            :visible.sync="checkCardTools"
            :width="isMobel ? '90%' : '50%'">
            <div class="check-card">
                <el-row>
                    <el-col :span="24" align="center">
                        <el-input clearable :placeholder="$t('game:correctCard')" v-model="cardsAddress" :readonly="true">
                            <template slot="prepend">{{ $t('game:cards') }}：</template>
                        </el-input>
                    </el-col>
                    <el-col :span="24" align="center">
                        <br>
                        <el-input clearable placeholder="" :value="verifyAddress" :readonly="true">
                            <template slot="prepend">keccak256 hash：</template>
                        </el-input>
                    </el-col>
                    <!-- <el-col :span="24" align="right">
                        <el-button class="check-card-button" :loading="loading" :disabled="loading" @click="checkCard()">{{ '验牌' }}</el-button>
                    </el-col> -->
                </el-row>
                <br>
                <el-row>
                    <el-col :span="24" align="center">
                        <el-input :placeholder="$t('game:correctPools')" v-model="gamesFillingAddress" :readonly="true">
                            <template slot="prepend">pool address：</template>
                        </el-input>
                    </el-col>
                    <el-col :span="24" align="right" v-if="checkHash && checkHash !== ''">
                        <el-button class="check-card-button" :loading="loading" :disabled="loading" @click="jumpBlockBrowsing()">{{ $t('game:jumpBlockBrowsing') }}</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-dialog>

        <!-- 验牌 -->
        <el-dialog
            :title="'Dice RollID ' + betInfoObj.id"
            :visible.sync="seedShowDialog"
            :width="isMobel ? '90%' : '50%'"
            class="dice-seed-dislog">
            <div class="check-card">
                <div class="bet-amount">
                    <el-radio v-model="diceBetRadiaValue" label="1" border>{{ $t('game:result') }}</el-radio>
                    <el-radio v-model="diceBetRadiaValue" label="2" border>{{ $t('game:BetVerification') }}</el-radio>
                </div>
                <el-row v-if="diceBetRadiaValue == 1">
                    <el-col :span="24" align="center" style="margin-bottom: 10px;">
                        <div class="roll-details">
                            <span>{{ $t('game:RollID') }}: </span>
                            <span>{{ betInfoObj.id }}</span>
                        </div>
                    </el-col>
                    <el-col :span="24" align="center" style="margin-bottom: 10px;">
                        <div class="roll-details">
                            <span>{{ $t('game:betTheAmount') }}: </span>
                            <span>{{ betInfoObj.bet }}</span>
                        </div>
                    </el-col>
                    <el-col :span="24" align="center" style="margin-bottom: 10px;">
                        <div class="roll-details" v-if="betInfoObj.type == 1">
                            <span>{{ $t('game:target') }}:</span>
                            <span>{{ betInfoObj.scope_left + '≤ ' + betInfoObj.result_num + ' ≤' + betInfoObj.scope_right }}</span>
                        </div>
                        <div class="roll-details" v-else>
                            <span>{{ $t('game:target') }}:</span>
                            <span>{{ betInfoObj.result_num }}</span>
                        </div>
                    </el-col>
                    <el-col :span="24" align="center" style="margin-bottom: 10px;">
                        <div class="roll-details">
                            <span>{{ $t('game:expenditure') }}:</span>
                            <span class="" v-if="betInfoObj.currency === 'GLS'">{{ 'LUCK' }}</span>
                            <span class="" v-else>{{ betInfoObj.currency }}</span>
                        </div>
                    </el-col>
                    <el-col :span="24" align="center" style="margin-bottom: 10px;">
                        <div class="roll-details">
                            <span>{{ $t('game:result') }}:</span>
                            <span>{{ betInfoObj.result_num }}</span>
                        </div>
                    </el-col>
                    <el-col :span="24" align="center" style="margin-bottom: 10px;">
                        <div class="roll-details">
                            <span>{{ $t('game:Profit') }}: </span>
                            <span v-if="betInfoObj.result == 1">{{ betInfoObj.profit }}</span>
                            <span v-else>{{ '-' + betInfoObj.profit }}</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row v-if="diceBetRadiaValue == 2">
                    <el-col :span="24" align="center" style="margin-bottom: 10px;">
                        <div class="roll-details">
                            <span>{{ $t('game:Serverseed') }}: </span>
                            <span>{{ betInfoObj.server_seed }}</span>
                        </div>
                    </el-col>
                    <el-col :span="24" align="center" style="margin-bottom: 10px;">
                        <div class="roll-details">
                            <span>{{ $t('game:Clientseed') }}: </span>
                            <span>{{ betInfoObj.client_seed }}</span>
                        </div>
                    </el-col>
                    <el-col :span="24" align="center" style="margin-bottom: 10px;">
                        <div class="roll-details">
                            <span>{{ $t('game:SHA512hash') }}: </span>
                            <span v-html="getHighLight(betInfoObj.sha512_hash, betInfoObj.hex)"></span>
                        </div>
                    </el-col>
                    <el-col :span="24" align="center" style="margin-bottom: 10px;">
                        <div class="roll-details">
                            <span>{{ $t('game:Hex') }}: </span>
                            <span>{{ betInfoObj.hex }}</span>
                        </div>
                    </el-col>
                    <el-col :span="24" align="center" style="margin-bottom: 10px;">
                        <div class="roll-details">
                            <span>{{ $t('game:Decimal') }}: </span>
                            <span v-html="getHighLight(betInfoObj.decimal, betInfoObj.result_num)"></span>
                        </div>
                    </el-col>
                    <el-col :span="24" align="center" style="margin-bottom: 10px;">
                        <div class="roll-details">
                            <span>{{ $t('game:result') }}: </span>
                            <span>{{ betInfoObj.result_num }}</span>
                        </div>
                    </el-col>
                    <!-- 更多关于可证明公平系统的信息，请参见可证明公平标签。 -->
                    <div style="margin-top: 20px;text-align: left;color: #fff;">{{ $t('game:bettingRules') }}</div>
                    <div style="margin-top: 20px;text-align: left;color: #fff;">{{ $t('game:thirdPartyTages') }}</div>
                    <div style="text-align: left;margin-top: 10px;">
                        <a :href="'https://dicesites.com/crypto-games/verifier?game=dice&ss='+betInfoObj.server_seed+'&cs='+betInfoObj.client_seed+'&ssh='+betInfoObj.sha256" target="_blank" rel="noopener noreferrer" style="color:#409EFF;text-decoration:underline;">
                        {{ $t('game:thirdParty') }}
                        </a>
                    </div>
                </el-row>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { get, post } from "@/common/axios.js";
import { mapState } from "vuex";
import { keepDecimalNotRounding } from "@/utils/tools";
import Banker from '../banker/index.vue'
import BankerSpeed from '../banker/indexSpeed.vue'
import Gls from '../banker/gls.vue'
import { getBalance, keccak256LVerify, getUserPlatformBalance, getSwapPoolsAmountsOut } from "@/wallet/serve";
import vueSeamlessScroll from 'vue-seamless-scroll'
import TOKEN from '@/wallet/token.js'
export default {
    props: ['game_type', 'childUpdatePlatformBalance'],//接受参数
    name: '',
    data() {
        return {
            screenWidth: document.body.clientWidth,
            activeName: '1',
            allBetData: [],
            myBetData: [],
            mark: 0,
            limit: 50,
            timeInterval: null,
            refreshTime: 2000, //数据刷新间隔时间
            dataStatisticsData: {},
            loading: false,
            glsBalance: 0,
            checkCardTools: false,
            gamesFillingAddress: '', //桌子地址
            cardsAddress: '', //牌面地址
            verifyAddress: '', //验牌结果
            checkHash: '', //牌号已验证hash值
            seedShowDialog: false,
            diceBetRadiaValue: '1',
            betInfoObj: {}, //点击投注详情数据
            CurrencyPrice: 1, //币价
            autoPlay: true,
        }
    },
    mounted() {
        window.onresize = () => {
            this.screenWidth = document.body.clientWidth;
        }
    },
    computed: {
        ...mapState({
            address:state=>state.base.address,
            chainName:state=>state.base.chainName,
            isConnected:state=>state.base.isConnected,
            isMobel:state=>state.comps.isMobel,
            mainTheme:state=>state.comps.mainTheme,
            apiUrl:state=>state.base.apiUrl,
            domainHostAddress:state=>state.base.domainHostAddress,
            numberAddress:state=>state.base.numberAddress,
            sizeAddress:state=>state.base.sizeAddress,
            singDoubleAddress:state=>state.base.singDoubleAddress,
            baccaratAddress:state=>state.base.baccaratAddress,
            versionName:state=>state.base.versionName,
            transactionCurrency:state=>state.base.transactionCurrency,
            transactionSpareCurrency:state=>state.base.transactionSpareCurrency,
        }),
        defaultOption () {
            return {
                step: 2, // 数值越大速度滚动越快
                limitMoveNum: 7, // 开始无缝滚动的数据量 this.dataList.length
                hoverStop: true, // 是否开启鼠标悬停stop
                direction: 0, // 0向下 1向上 2向左 3向右
                openWatch: true, // 开启数据实时监控刷新dom
                singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
                singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
                waitTime: 1000, // 单步运动停止的时间(默认值1000ms)
                autoPlay: false
            }
        },
        calcGlsExpected() { // 计算 预计累计获得 GLS
            let num = 0;
            if(this.dataStatisticsData.betAddressValuationNum) {
                num = keepDecimalNotRounding(Number(this.dataStatisticsData.betAddressValuationNum) / 1000, 4);
            }
            return num;
        }

    },
    created() {
        try {
            this.loading = true;
            this.getAllListData();
            this.getCurrencyPrice();
            if(this.game_type == 1) {
                this.gamesFillingAddress = this.numberAddress;
            } else if(this.game_type == 2) {
                this.gamesFillingAddress = this.sizeAddress;
            } else if(this.game_type == 3) {
                this.gamesFillingAddress = this.singDoubleAddress;
            } else if(this.game_type == 4) {
                this.gamesFillingAddress = this.baccaratAddress;
            }
        } catch (err) {}
    },
    watch: {
        isConnected: {
            immediate: true,
            async handler(val){
                if(val) {
                    this.refreshData();
                    await this.getGlsBalance();
                }
            }
        },
    },
    components:{
        Banker,
        BankerSpeed,
        Gls,
        vueSeamlessScroll
    },
    beforeDestroy() { //页面关闭执行
        clearInterval(this.timeInterval);
        this.timeInterval = null;
    },
    methods: {
        async checkCardClick(row) { //验牌小工具事件
            if(this.versionName === 'chain') { //公链版 验牌
                this.checkCardTools = true;
                this.cardsAddress = row.topics_hash;
                let verifyAddress = await keccak256LVerify(this.cardsAddress);
                this.verifyAddress = verifyAddress;
                this.checkHash = row.checkHash ? row.checkHash : '';
            }
        },
        async checkCard() { //开始验牌
            let verifyAddress = await keccak256LVerify(this.cardsAddress);
            console.log(verifyAddress, web3);
            this.verifyAddress = verifyAddress;
        },
        seedShowClick(row) { //显示下注种子弹框
            console.log(row);
            this.betInfoObj = row;
            this.seedShowDialog = true;
        },
        handleClick(row) {
            console.log(row);
            if(row == 3) { //数据统计
                this.dataStatisticsBet();
            }
            if(row == 4 || row == 5 || row == 6) {
                clearInterval(this.timeInterval);
                this.timeInterval = null;
            } else {
                clearInterval(this.timeInterval);
                this.timeInterval = null;
                this.refreshData();
            }
            if(row == 1 || row == 2) { //投注数据
                this.loading = true;
            }
            if(row == 2) { //我的投注
                console.log(222);
                let ServerWhere = {
                    limit: this.limit,
                    address: this.address,
                    game_type: this.game_type,
                    chain: this.versionName === 'speed' ? 'speed' : this.chainName,
                    versionName: this.versionName,
                };
                this.getAllListData(ServerWhere);
            }
            if(row == 4) {
                this.$store.dispatch("refreshUserDealerProportion", {game_type: this.game_type, isLoding: false});
            }
        },
        refreshData() { //定时刷新数据
            this.timeInterval = setInterval(async () => {
                if(this.activeName == 1) {
                    let ServerWhere = {
                        limit: this.limit,
                        game_type: this.game_type,
                        chain: this.versionName === 'speed' ? 'speed' : this.chainName,
                        versionName: this.versionName
                    };
                    this.getAllListData(ServerWhere);
                } else if(this.activeName == 2) {
                    let ServerWhere = {
                        limit: this.limit,
                        address: this.address,
                        game_type: this.game_type,
                        chain: this.versionName === 'speed' ? 'speed' : this.chainName,
                        versionName: this.versionName
                    };
                    this.getAllListData(ServerWhere);
                } else if(this.activeName == 3){
                    this.dataStatisticsBet();
                    this.getGlsBalance();
                }
            }, this.refreshTime)
        },
        getAllListData(ServerWhere) {
            if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
                ServerWhere = {
                    limit: this.limit,
                    game_type: this.game_type,
                    chain: this.versionName === 'speed' ? 'speed' : this.chainName,
                    versionName: this.versionName
                };
            }
            axios.get(this.apiUrl + "/Api/Bet/getBetList", {
                params: ServerWhere
            }).then((json) => {
                // console.log(json);
                // console.log(this.address);
                if (json.code == 10000) {
                    if(this.activeName == 1) {
                        if (json.data.lists.length > 0) {
                            // if (this.allBetData.length > 50) { //自己之所以设置成12，是因为上面设置开始滚动limitMoveNum是7，
                            //     //两轮数据缓冲时间，这样可以确保获取到的数据充分更新
                            //     this.allBetData = [];
                            // }
                            // let list = (json.data && json.data.lists) || [];
                            // this.allBetData = [...this.allBetData, ...list];
                            // if(this.$refs.seamlessScroll) {
                            //     this.$refs.seamlessScroll.reset()
                            // }
                            this.allBetData = json.data.lists;
                            // let list = (json.data && json.data.lists) || [];
                            // if (this.allBetData.length <= 1) {
                            //     console.log('首次加载');
                            //     this.allBetData = json.data.lists;
                            // } else {
                            //     console.log('追加数据');
                            //     this.allBetData = [...this.allBetData, ...list];
                            // }
                        }
                    } else {
                        this.myBetData = json.data.lists;
                    }
                    // if(this.$refs.seamlessScroll) {
                    //     this.$refs.seamlessScroll.reset()
                    // }
                } 
                // else {
                //     this.$message.error("加载数据失败");
                // }
                this.loading = false;
            }).catch((error) => {
                this.loading = false;
                // this.$message.error(error);
            });
        },
        ScrollEnd() {
            console.log("ScrollEnd");
            this.autoPlay = false;
        },
        getTransactionCurrency() { //获取交易币种
            if(this.versionName == 'chain') {
                return 'LUSD';
            } else {
                return this.transactionSpareCurrency;
            }
        },
        getTransactionCurrencyDecimal() {
            let name = this.getTransactionCurrency();
            if(name === 'DOGE') {
                return 6;
            }
            return 4;
        },
        dataStatisticsBet() { //数据统计
            let params = {};
            if(this.versionName === 'speed') {
                params = {
                    address: this.address,
                    game_type: this.game_type,
                    versionName: this.versionName,
                    transactionCurrency: this.transactionCurrency
                };
            } else {
                params = {
                    address: this.address,
                    game_type: this.game_type,
                    chain: this.chainName,
                    versionName: this.versionName,
                    transactionCurrency: this.transactionCurrency
                };
            }
            axios.get(this.apiUrl + "/Api/Bet/dataStatisticsBet", {
                params: params
            }).then((json) => {
                console.log(json);
                // console.log(this.address);
                if (json.code == 10000) {
                    this.dataStatisticsData = json.data;
                } else {
                    this.$message.error("加载数据失败");
                }
            }).catch((error) => {
                this.$message.error(error);
            });
        },
        addressStr(address){
            // console.log(this.address);
            let addressstrnt = address || this.address;
            return addressstrnt.substring(0, 4) + "***" + addressstrnt.substring(addressstrnt.length - 3)
        },
        async getGlsBalance() {  //获取余额
            let balance = 0;
            if(this.versionName == 'chain') { //公链模式
                balance = await getBalance(TOKEN[this.chainName].GLS, 18);
                console.log("GLS balance", balance);
                this.glsBalance = keepDecimalNotRounding(balance, 10, true);
            } else {
                balance = await getUserPlatformBalance('gls');
                console.log("GLS balance", balance);
                this.glsBalance = keepDecimalNotRounding(balance, 10, true);
            }
            return balance;
        },
        getResultStr(row) { //列表牌面结果转换
            let result_value_num = row.result_num;
            let type = row.type;
            let winner = '';
            if(type == 2) { //大小
                if(this.versionName == 'chain') { //公链模式
                    if(Number(result_value_num) <= 4) { // 01234 开牌结果 小
                        winner = this.$t('game:Min');
                    }
                    if(Number(result_value_num) >= 5 && Number(result_value_num) <= 9) { // 56789 开牌结果 大
                        winner = this.$t('game:Max');
                    }
                } else {
                    if(Number(result_value_num) <= 49.999) { // 开牌结果 小于等于49.999 小
                        winner = this.$t('game:Min');
                    }
                    if(Number(result_value_num) > 49.999 && Number(result_value_num) <= 99.999) { // 开牌结果 大于49.999 并且 小于等于99.999 大
                        winner = this.$t('game:Max');
                    }
                }
            }
            if(type == 3) { //单双
                let result_value = Math.floor(result_value_num);
                if(Number(result_value) % 2 == 0) { // 开牌结果 双数
                    winner = this.$t('game:Pair');
                } else { // 开牌结果 单
                    winner = this.$t('game:One');
                }
            }
            if(type == 4) { //百家乐
                let bankerNum = (parseInt((result_value_num / 1000) % 10)) + (parseInt((result_value_num / 10000) % 10));
                //闲家 = 个位数和十位数相加
                let playerNum = (parseInt(result_value_num % 10)) + (parseInt((result_value_num / 10) % 10));
                let tieNum = ''; //平局 庄家 = 闲家
                // console.log(bankerNum, playerNum);
                if(bankerNum > playerNum) {
                    winner = this.$t('game:Banker');
                }
                if(bankerNum < playerNum) {
                    winner = this.$t('game:Player');
                }
                if(bankerNum == playerNum) {
                    winner = this.$t('game:Tie');
                }
            }
            return winner;
        },
        async getCurrencyPrice() { //获取币种估值
            axios.get(this.apiUrl + "/Api/Bet/getEthPrice", {
                params: {
                    transactionCurrency: this.transactionCurrency
                }
            }).then((json) => {
                console.log(json);
                // console.log(this.address);
                if (json.code == 10000) {
                    this.CurrencyPrice = json.data;
                }
            }).catch((error) => {
                this.$message.error(error);
            });
        },
        jumpBlockBrowsing() { //跳转到区块浏览
            if(this.chainName === 'HECO') {
                window.open('https://www.hecoinfo.com/tx/' + this.checkHash + '#eventlog');
            } else {
                window.open('https://arbiscan.io/tx/' + this.checkHash + '#eventlog');
            }
        },
        childUpdateBalance() { //接受子组件更新余额
            console.log('更新List组件余额');
            this.$emit('childUpdatePlatformBalance'); //更新游戏组件余额
        },
        getHighLight(word, hWord) { //文字高亮
	    //   var reg = hWord.join("|");
            let str = word.replace(hWord, `<span style="background-color:#e09320;">${hWord}</span>`);
            return str;
            // return word.replace(new RegExp(hWord, "ig"), (a) => {
            //     return `<span style="background-color:#e09320;">${a}</span>`;
            // });
	    },
    },
}
</script>
<style lang="scss" scoped>
    .container-list {
        /deep/ {
            ::-webkit-scrollbar {  display: none;}
            padding-bottom: 100px;
            overflow: hidden;
            .bet-amount {
                text-align: left;
                .el-radio__label {
                    padding-left: 0;
                }
                .el-radio.is-bordered {
                    width: 100px;
                    padding: 12px 22px 0px 20px;
                }
                .icon-log {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    img {
                        margin-right: 3px;
                    }
                }
            }
            .list {
                // width: 80%;
                // width: 90%;
                margin: 0 auto;
                // padding: 10px;
                // margin-top: 30px;
                background-color: rgb(27, 28, 35);
                border: 2px solid #454848;
                // max-height: 550px;
                .icon-log {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    img {
                        margin-right: 3px;
                    }
                }
                .el-tabs__nav {
                    border: 0;
                }
                .el-tabs__content {
                    margin-top: -15px;
                }
                .el-tabs__item {
                    color: #fff !important;
                    border: 0;
                    height: 40px;
                    line-height: 40px;
                    font-size: 10px;
                }
                .el-tabs__item.is-active {  
                    color: #1890ff;  
                    background-color: #e09320;
                } 
                .el-tabs__nav-scroll{
                    // width:30%;
                    margin:0 auto
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
                .el-table::before {
                    height: 0;
                }
                .el-descriptions__title {
                    padding: 30px 0 0 30px;
                    color: #fff;
                    font-size: 13px;
                }
                .el-descriptions__body {
                    background-color: transparent;
                    color: #fff;
                    // padding-left: 60px;
                    font-size: 10px;
                    .el-tag {
                        color: #fff;
                        background-color: #21313b;
                        // background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%), linear-gradient(230.47deg, rgb(30, 69, 137) -47%, rgb(93, 69, 179) 48.82%, rgb(130, 1, 112) 131.59%);
                        border-radius: 20px;
                    }
                    .el-tag--mini {
                        padding: 0 10px;
                    }
                }
                .el-descriptions-item__label.has-colon::after {
                    content: '';
                }
                .play-rule {
                    padding: 30px;
                    padding-bottom: 20px;
                    text-align: left;
                    font-size: 10px;
                    white-space: pre-wrap;
                }
                // .top .el-table__body-wrapper {
                //     display: none;
                // }
                // .bottom .el-table__header-wrapper {
                //     display: none;
                //     width: 100%;
                // }
            }
            .el-descriptions-item__label:not(.is-bordered-label) {
                display: block;
                width: 80px;
                text-align: right;
            }
            .gls-stats-text {
                font-size: 10px;
                padding-bottom: 10px;
                position: relative;
                // left: 70px;
                float: left;
            }
            .el-dialog {
                background: #1e272a;
                .el-dialog__header {
                    text-align: center;
                    .el-dialog__title {
                        color: #fff;
                    }
                }
            }
            .dice-seed-dislog {
                .el-dialog__header {
                    text-align: left;
                    .el-dialog__title {
                        color: #fff;
                    }
                }
                .el-dialog__body {
                    padding-top: 0;
                }
                .bet-amount .el-radio.is-bordered {
                    width: auto;
                }
                .el-radio__label {
                    font-size: 14px;
                }
                .roll-details {
                    height: 30px;
                    line-height: 30px;
                    background-color: #21313b;
                    padding: 5px 20px;
                    color: #fff;
                    border-radius: 4px;
                    display:block; /*这里设置inline-block或者block；根据使用情况来定（行内元素需要加这个，块级元素和行内块级可以不用）*/
                    white-space:nowrap;
                    overflow:hidden;
                    // text-overflow:ellipsis;
                    overflow-x: auto;
                    text-align: left;
                }
            }
            .check-card {
                .el-input__inner {
                    background-color: #21313b;
                    color: #fff;
                    border: 0;
                    padding: 5px;
                }
                .el-input-group__prepend {
                    color: #fff;
                    border: 0;
                    background-color: #21313b;
                    padding-right: 0;
                }
                .el-input-group__append {
                    color: #fff;
                    border: 0;
                    background-color: #21313b;
                    padding-left: 0;
                }
                .check-card-button {
                    margin-top: 20px;
                    // width: 150px;
                    padding: 15px;
                    // display: grid;
                    color: rgb(255, 255, 255);
                    font-size: 1rem;
                    font-weight: 600;
                    border: none;
                    background-color: #141a1f;
                }
                .check-card-button:hover {
                    background-color: #21313b;
                }
                .bet-amount {
                    text-align: left;
                }
            }
            .seamless-warp {
                height: 500px;
                overflow: hidden;
            }
        }
    }
</style>
