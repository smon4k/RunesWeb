<template>
    <div class="container">
        <!-- <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>投注</el-breadcrumb-item>
        </el-breadcrumb> -->
        <!-- <el-card class="box-card"> -->
            <div class="content">
                <el-tabs v-model="gameActiveName" @tab-click="handleClick" :stretch="true" class="game" :tab-position="screenWidth < 600 ? 'top' : 'left'">
                    <el-tab-pane label="猜数字" name="1">
                        <el-row :gutter="20" class="content-box">
                            <el-col :span="screenWidth < 600 ? 24 : 8" align="left">
                                <!-- <el-button-group>
                                    <el-button size="small">机会</el-button>
                                    <el-button plain size="small">MIN</el-button>
                                    <el-button plain size="small">-1</el-button>
                                    <el-button plain size="small">+1</el-button>
                                    <el-button plain size="small">MAX</el-button>
                                </el-button-group> -->
                                <div class="marginTop">
                                    <div class="title">机会</div>
                                    <el-button-group>
                                        <el-button type="primary">MIN</el-button>
                                        <el-button type="primary" @click="reduceChange()">-1</el-button>
                                        <el-button type="primary" @click="addChange()">+1</el-button>
                                        <el-button type="primary" @click="maxChange()">MAX</el-button>
                                    </el-button-group>
                                    <el-input placeholder="" type="number" v-model="chance" max="98" class="operate chance" @input="calcChangeFun">
                                        <template slot="append">%</template>
                                        <!-- <template slot="append">
                                            <el-button class="function-button" size="small">MIN</el-button>
                                            <el-button class="function-button red" size="small" @click="reduceChange()">-1</el-button>
                                            <el-button class="function-button green" size="small" @click="addChange()">+1</el-button>
                                            <el-button class="function-button" size="small" @click="maxChange()">MAX</el-button>
                                        </template> -->
                                    </el-input>
                                </div>
                                <div class="marginTop">
                                    <div class="title">支出</div>
                                    <el-input placeholder="" v-model="expenditure" class="operate" @input="calcExpenditureFun">
                                        <!-- <template slot="prepend">支出</template> -->
                                        <template slot="append">x</template>
                                    </el-input>
                                </div>
                            </el-col>
                            <el-col :span="screenWidth < 600 ? 24 : 8" align="left">
                                <!-- <el-button-group>
                                    <el-button size="small">赌注</el-button>
                                    <el-button plain size="small">MIN</el-button>
                                    <el-button plain size="small">/2</el-button>
                                    <el-button plain size="small">x2</el-button>
                                    <el-button plain size="small">MAX</el-button>
                                </el-button-group> -->
                                <div class="marginTop">
                                    <div class="title">赌注</div>
                                    <div class="title" style="float:right;">余额: {{ dusdBalance }} DUSD</div>
                                    <el-button-group>
                                        <el-button type="primary" @click="minBet()">MIN</el-button>
                                        <el-button type="primary" @click="removeBet()">-1</el-button>
                                        <el-button type="primary" @click="takeBet()">+1</el-button>
                                        <el-button type="primary" @click="maxBet()">MAX</el-button>
                                    </el-button-group>
                                    <el-input placeholder="" v-model="bet" class="operate" @input="calcOperateFun">
                                        <template slot="append">DUSD</template>
                                        <!-- <template slot="append">
                                            <el-button class="function-button" size="small" @click="minBet()">MIN</el-button>
                                            <el-button class="function-button red" size="small" @click="removeBet()">/2</el-button>
                                            <el-button class="function-button green" size="small" @click="takeBet()">x2</el-button>
                                            <el-button class="function-button" size="small" @click="maxBet()">MAX</el-button>
                                        </template> -->
                                    </el-input>
                                </div>
                                <div class="marginTop">
                                    <div class="title">利润</div>
                                    <el-input placeholder="" v-model="profit" class="operate">
                                        <!-- <template slot="prepend">利润</template> -->
                                        <template slot="append">DUSD</template>
                                    </el-input>
                                </div>
                            </el-col>
                            <el-col :span="screenWidth < 600 ? 24 : 8" align="center">
                                <div class="rule" :style="{width: screenWidth < 600 ? '100%' : '100%', marginTop: screenWidth < 600 ? '10px' : '10px'}">
                                    <div class="title">玩法规则</div>
                                    <div class="box" style="max-height:200px">
                                        <span>
                                            普通猜数字玩法介绍：（2倍赔率）<br>
                                            A.使用OKT兑换好DUSD <br>
                                            B.向游戏地址投注DUSD，向游戏地址投注资金 <br>
                                            C.投注数额等于转账数额 <br>
                                            D.如押注100DUSD,则转账100DUSD <br>
                                            E.转账低于 10DUSD (限红)视为无效投注，不进行发牌返奖， <br>
                                            F.转账不满足限额时，退还本金（不扣手续费） <br>
                                            G.获取您投注转账后，满足限额要求会获得协议发牌，发牌转账Deal的区块事件日志里[topic0]为∶0x12693cbe14f5a2c78464fbeea779611c56f39525834aa514cdaa6def62c2aba8的第一行HEX哈希我们称为【区块哈希】，作为判定依据 <br>
                                        </span>
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="screenWidth < 600 ? 24 : 16" align="center">
                                <el-button class="roll-button" :loading="loading" :disabled="loading" @click="setRollDiceData()">Roll</el-button>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="猜大小" name="2">
                        <el-row>
                            <el-col :span="screenWidth < 600 ? 24 : 14" align="center">
                                <div class="marginTop" :style="{width: screenWidth < 600 ? '100%' : '80%'}">
                                    <div class="title">余额: {{ dusdBalance }} DUSD</div>
                                    <el-input placeholder="" :min="10" v-model="bet" class="operate" @input="bet=bet.replace(/^(0+)|[^\d]+/g,'')">
                                        <!-- <template slot="prepend">下注大小</template> -->
                                        <!-- <template slot="append">
                                            <el-button class="function-button" size="small" @click="minBet()">MIN</el-button>
                                            <el-button class="function-button red" size="small" @click="removeBet()">/2</el-button>
                                            <el-button class="function-button green" size="small" @click="takeBet()">x2</el-button>
                                            <el-button class="function-button" size="small" @click="maxBet()">MAX</el-button>
                                        </template> -->
                                    </el-input>
                                    <div class="bet-amount">
                                        <div v-if="screenWidth < 600">
                                            <el-radio-group v-model="bet">
                                                <el-radio-button label="10"></el-radio-button>
                                                <el-radio-button label="50"></el-radio-button>
                                                <el-radio-button label="100"></el-radio-button>
                                                <el-radio-button label="500"></el-radio-button>
                                                <el-radio-button label="1000"></el-radio-button>
                                            </el-radio-group>
                                        </div>
                                        <div v-else>
                                            <el-radio v-model="bet" label="10" border>10</el-radio>
                                            <el-radio v-model="bet" label="50" border>50</el-radio>
                                            <el-radio v-model="bet" label="100" border>100</el-radio>
                                            <el-radio v-model="bet" label="500" border>500</el-radio>
                                            <el-radio v-model="bet" label="1000" border>1000</el-radio>
                                        </div>
                                    </div>
                                    <div class="size">
                                        <el-radio v-model="size" label="10" border>大</el-radio>
                                        <el-radio v-model="size" label="50" border>小</el-radio>
                                    </div>
                                    <el-button class="start-bet" type="primary">开始下注</el-button>
                                </div>
                            </el-col>
                            <el-col :span="screenWidth < 600 ? 24 : 10" align="center">
                                <div class="rule" :style="{width: screenWidth < 600 ? '100%' : '100%', marginTop: screenWidth < 600 ? '30px' : '30px'}">
                                    <div class="title">玩法规则</div>
                                    <div class="box">
                                        <span>
                                            普通大小玩法介绍：（2倍赔率）<br>
                                            A.使用OKT兑换好DUSD <br>
                                            B.向游戏地址投注DUSD，向游戏地址投注资金（尾数为0.00代表下注小、尾数为其他代表下注大） <br>
                                            C.投注数额等于转账数额 <br>
                                            D.如押注100DUSD,则转账100DUSD <br>
                                            E.转账低于 10DUSD (限红)视为无效投注，不进行发牌返奖， <br>
                                            F.转账不满足限额时，退还本金（不扣手续费） <br>
                                            G.获取您投注转账后，满足限额要求会获得协议发牌，发牌转账Deal的区块事件日志里[topic0]为∶0x12693cbe14f5a2c78464fbeea779611c56f39525834aa514cdaa6def62c2aba8的第一行HEX哈希我们称为【区块哈希】，作为判定依据 <br>
                                            H.哈希末尾五位最后一位数字为牌面，例: ( *2ab8a )，最后一位数字为8，8为牌面，结果为大，01234判定结果为小，56789判定结果为大， <br>
                                            I.牌面中如果存在字母，则字母忽略 <br>
                                            J.根据下注结果与实际开牌结果，分胜负，赔率为赢家赔2倍 <br>
                                            K. 当哈希值末尾五位都为字母，判定为平局，大小都不退本金 <br>
                                            L.盈亏转账税为百分之一。 <br>
                                        </span>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="猜单双" name="3">
                        <el-row>
                            <el-col :span="screenWidth < 600 ? 24 : 14" align="center">
                                <div class="marginTop" :style="{width: screenWidth < 600 ? '100%' : '80%'}">
                                    <div class="title">余额: {{ dusdBalance }} DUSD</div>
                                    <el-input placeholder="" :min="10" v-model="bet" class="operate" @input="bet=bet.replace(/^(0+)|[^\d]+/g,'')">
                                        <!-- <template slot="prepend">下注大小</template> -->
                                        <!-- <template slot="append">
                                            <el-button class="function-button" size="small" @click="minBet()">MIN</el-button>
                                            <el-button class="function-button red" size="small" @click="removeBet()">/2</el-button>
                                            <el-button class="function-button green" size="small" @click="takeBet()">x2</el-button>
                                            <el-button class="function-button" size="small" @click="maxBet()">MAX</el-button>
                                        </template> -->
                                    </el-input>
                                    <div class="bet-amount">
                                        <div v-if="screenWidth < 600">
                                            <el-radio-group v-model="bet">
                                                <el-radio-button label="10"></el-radio-button>
                                                <el-radio-button label="50"></el-radio-button>
                                                <el-radio-button label="100"></el-radio-button>
                                                <el-radio-button label="500"></el-radio-button>
                                                <el-radio-button label="1000"></el-radio-button>
                                            </el-radio-group>
                                        </div>
                                        <div v-else>
                                            <el-radio v-model="bet" label="10" border>10</el-radio>
                                            <el-radio v-model="bet" label="50" border>50</el-radio>
                                            <el-radio v-model="bet" label="100" border>100</el-radio>
                                            <el-radio v-model="bet" label="500" border>500</el-radio>
                                            <el-radio v-model="bet" label="1000" border>1000</el-radio>
                                        </div>
                                    </div>
                                    <div class="size">
                                        <el-radio v-model="size" label="10" border>单</el-radio>
                                        <el-radio v-model="size" label="50" border>双</el-radio>
                                    </div>
                                    <el-button class="start-bet" type="primary">开始下注</el-button>
                                </div>
                            </el-col>
                            <el-col :span="screenWidth < 600 ? 24 : 10" align="center">
                                <div class="rule" :style="{width: screenWidth < 600 ? '100%' : '100%', marginTop: screenWidth < 600 ? '30px' : '30px'}">
                                    <div class="title">玩法规则</div>
                                    <div class="box">
                                        <span>
                                            普通单双玩法介绍：（2倍赔率）<br>
                                            A.使用OKT兑换好DUSD <br>
                                            B.向游戏地址投注DUSD，向游戏地址投注资金（尾数为0.001代表下注单、尾数为其他代表下注双） <br>
                                            C.投注数额等于转账数额 <br>
                                            D.如押注100DUSD,则转账100DUSD <br>
                                            E.转账低于 10DUSD (限红)视为无效投注，不进行发牌返奖， <br>
                                            F.转账不满足限额时，退还本金（不扣手续费） <br>
                                            G.获取您投注转账后，满足限额要求会获得协议发牌，发牌转账Deal的区块事件日志里[topic0]为∶0x12693cbe14f5a2c78464fbeea779611c56f39525834aa514cdaa6def62c2aba8的第一行HEX哈希我们称为【区块哈希】，作为判定依据 <br>
                                            H.哈希末尾五位最后一位数字为牌面，例: ( *2ab8a )，最后一位数字为8，8为牌面，结果为双，13579判定结果为单，24680判定结果为双， <br>
                                            I.牌面中如果存在字母，则字母忽略 <br>
                                            J.根据下注结果与实际开牌结果，分胜负，赔率为赢家赔2倍 <br>
                                            K. 当哈希值末尾五位都为字母，判定为平局，单双都不退本金 <br>
                                            L.盈亏转账税为百分之一。 <br>
                                        </span>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                    <el-tab-pane label="百家乐" name="4">
                        <el-row>
                            <el-col :span="screenWidth < 600 ? 24 : 14" align="center">
                                <div class="marginTop" :style="{width: screenWidth < 600 ? '100%' : '80%'}">
                                    <div class="title">余额: {{ dusdBalance }} DUSD</div>
                                    <el-input placeholder="" :min="10" v-model="bet" class="operate" @input="bet=bet.replace(/^(0+)|[^\d]+/g,'')">
                                        <!-- <template slot="prepend">下注大小</template> -->
                                        <!-- <template slot="append">
                                            <el-button class="function-button" size="small" @click="minBet()">MIN</el-button>
                                            <el-button class="function-button red" size="small" @click="removeBet()">/2</el-button>
                                            <el-button class="function-button green" size="small" @click="takeBet()">x2</el-button>
                                            <el-button class="function-button" size="small" @click="maxBet()">MAX</el-button>
                                        </template> -->
                                    </el-input>
                                    <div class="bet-amount">
                                        <div v-if="screenWidth < 600">
                                            <el-radio-group v-model="bet">
                                                <el-radio-button label="10"></el-radio-button>
                                                <el-radio-button label="50"></el-radio-button>
                                                <el-radio-button label="100"></el-radio-button>
                                                <el-radio-button label="500"></el-radio-button>
                                                <el-radio-button label="1000"></el-radio-button>
                                            </el-radio-group>
                                        </div>
                                        <div v-else>
                                            <el-radio v-model="bet" label="10" border>10</el-radio>
                                            <el-radio v-model="bet" label="50" border>50</el-radio>
                                            <el-radio v-model="bet" label="100" border>100</el-radio>
                                            <el-radio v-model="bet" label="500" border>500</el-radio>
                                            <el-radio v-model="bet" label="1000" border>1000</el-radio>
                                        </div>
                                    </div>
                                    <div class="size">
                                        <el-radio v-model="baccarat" label="闲" border>
                                            <span>闲</span>
                                            <!-- <span>1:1</span> -->
                                        </el-radio>
                                        <el-radio v-model="baccarat" label="和" border>和</el-radio>
                                        <el-radio v-model="baccarat" label="庄" border>庄</el-radio>
                                    </div>
                                    <el-button class="start-bet" type="primary">开始下注</el-button>
                                </div>
                            </el-col>
                            <el-col :span="screenWidth < 600 ? 24 : 10" align="center">
                                <div class="rule" :style="{width: screenWidth < 600 ? '100%' : '100%', marginTop: screenWidth < 600 ? '30px' : '30px'}">
                                    <div class="title">玩法规则</div>
                                    <div class="box">
                                        <span>
                                            普通百家乐玩法介绍：（1到8倍赔率）<br>
                                            A.使用OKT兑换好DUSD <br>
                                            B.向游戏地址投注DUSD，向游戏地址投注资金（尾数为0.001代表下注单、尾数为其他代表下注双） <br>
                                            C.投注数额等于转账数额 <br>
                                            D.如押注100DUSD,则转账100DUSD <br>
                                            E.转账低于 10DUSD (限红)视为无效投注，不进行发牌返奖， <br>
                                            F.转账不满足限额时，退还本金（不扣手续费） <br>
                                            G.获取您投注转账后，满足限额要求会获得协议发牌，发牌转账Deal的区块事件日志里[topic0]为∶0x12693cbe14f5a2c78464fbeea779611c56f39525834aa514cdaa6def62c2aba8的第一行HEX哈希我们称为【区块哈希】，作为判定依据 <br>
                                            H.哈希末尾五位为牌面例: ( *****2aba8 )，2aba8为牌面 <br>
                                            I.牌面中如果存在字母，则字母代表数字: 0 <br>
                                            J.庄家开奖号码是:千位数和万位数相加[例: 2aba8,庄家开奖号为:2+a=2+0=2，结果为2点] <br>
                                            K.闲家开奖号码是 :个位数、十位数相加[例: 2aba8,闲家开奖号为:a+8=0+8=8，结果为8点] <br>
                                            L.根据结果分胜负，赔率为赢家赔2倍，比如2点赢赔率为下注额的2倍，8点赢赔率也为下注额的2倍，平局获胜赔率为下注额8倍 <br>
                                            M. 1平局，庄闲都不退本金，其他平局退回庄闲下注额本金, <br>
                                            N.平局退回不扣手续费，盈亏转账税为百分之一。  <br>
                                        </span>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
                <el-alert
                    v-show="alertShow"
                    class="alert"
                    :title="'开牌结果' + dealResult"
                    :type="dealResultStatue"
                    description=""
                    show-icon
                    :center="false"
                    effect="dark">
                </el-alert>
            </div>
            <el-tabs v-model="activeName" @tab-click="handleClick" :stretch="true" type="card" class="list" :style="{width: screenWidth < 600 ? '100%' : '90%'}">
                <el-tab-pane label="所有投注" name="1">
                    <el-table
                        stripe
                        :data="allBetData">
                        <el-table-column
                            prop="bet_number"
                            label="投注编号"
                            align="center"
                            width="180">
                            <template slot-scope="scope">
                                <span class="">{{ scope.row.bet_number }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="address"
                            align="center"
                            label="用户">
                            <template slot-scope="scope">
                                <span class="">{{ addressStr(scope.row.address) }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="时间"
                            align="center"
                            width="180">
                            <template slot-scope="scope">
                                <span class="">{{ scope.row.time }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="bet"
                            label="赌注"
                            align="center">
                            <template slot-scope="scope">
                                <span class="blue">{{ scope.row.bet }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="chance"
                            align="center"
                            label="机会">
                            <template slot-scope="scope">
                                <span class="blue">{{ scope.row.chance }}%</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="expenditure"
                            align="center"
                            label="支出">
                            <template slot-scope="scope">
                                <span class="blue">x{{ scope.row.expenditure }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="profit"
                            align="center"
                            label="利润">
                            <template slot-scope="scope">
                                <span v-if="scope.row.result == 1" class="green">+{{ scope.row.profit }}</span>
                                <span v-else class="red">-{{ scope.row.profit }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="我的投注" name="2">
                    <el-table
                        :data="myBetData"
                        style="width: 100%">
                         <el-table-column
                            prop="bet_number"
                            label="投注编号"
                            align="center"
                            width="180">
                            <template slot-scope="scope">
                                <span class="">{{ scope.row.bet_number }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="时间"
                            align="center"
                            width="180">
                            <template slot-scope="scope">
                                <span class="">{{ scope.row.time }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="bet"
                            label="赌注"
                            align="center">
                            <template slot-scope="scope">
                                <span class="blue">{{ scope.row.bet }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="chance"
                            align="center"
                            label="机会">
                            <template slot-scope="scope">
                                <span class="blue">{{ scope.row.chance }}%</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="expenditure"
                            align="center"
                            label="支出">
                            <template slot-scope="scope">
                                <span class="blue">x{{ scope.row.expenditure }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            label="结果"
                            width="200">
                            <template slot-scope="scope">
                                <span class="blue">{{ scope.row.scope_left }}&le; &nbsp;&nbsp;{{ scope.row.result_num }}&nbsp;&nbsp; &le;{{ scope.row.scope_right }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="profit"
                            align="center"
                            label="利润">
                            <template slot-scope="scope">
                                <span v-if="scope.row.result == 1" class="green">+{{ scope.row.profit }}</span>
                                <span v-else class="red">-{{ scope.row.profit }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="数据统计" name="3">
                    <el-row>
                        <el-col :span="12">
                            <el-descriptions title="我的统计" :column="1">
                                <el-descriptions-item label="赌注"><el-tag size="mini">21</el-tag></el-descriptions-item>
                                <el-descriptions-item label="获胜"><el-tag size="mini">7</el-tag></el-descriptions-item>
                                <el-descriptions-item label="损失"><el-tag size="mini">14</el-tag></el-descriptions-item>
                                <el-descriptions-item label="运气"><el-tag size="mini">62.58%</el-tag></el-descriptions-item>
                                <el-descriptions-item label="下注"><el-tag size="mini">0.00000</el-tag></el-descriptions-item>
                            </el-descriptions>
                        </el-col>
                        <el-col :span="12">
                            <el-descriptions title="所有用户统计" :column="1">
                                <el-descriptions-item label="赌注"><el-tag size="mini">21</el-tag></el-descriptions-item>
                                <el-descriptions-item label="获胜"><el-tag size="mini">7</el-tag></el-descriptions-item>
                                <el-descriptions-item label="损失"><el-tag size="mini">14</el-tag></el-descriptions-item>
                                <el-descriptions-item label="运气"><el-tag size="mini">62.58%</el-tag></el-descriptions-item>
                                <el-descriptions-item label="下注"><el-tag size="mini">0.00000</el-tag></el-descriptions-item>
                            </el-descriptions>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        <!-- </el-card> -->
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
            activeName: '1',
            gameActiveName: '1',
            input1: '',
            formLabelAlign: {
                name: '',
                region: '',
                type: ''
            },
            tableData: [],
            chance: 0.01, //机会
            bet: 1.00000000, //赌注
            expenditure: '', //支出
            profit: '', //利润
            loading: false,
            approve: false,
            dusdBalance: 0,
            allBetData: [],
            myBetData: [],
            limit: 50,
            timeInterval: null,
            refreshTime: 3000, //数据刷新间隔时间
            size: '',
            betAmount: '', //下注额度
            size: '',
            baccarat: '',
            alertShow: false,
            dealResult: '', // 开牌结果
            dealResultStatue: '',
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
            isConnected:state=>state.base.isConnected,
            isMobel:state=>state.comps.isMobel,
            mainTheme:state=>state.comps.mainTheme,
            apiUrl:state=>state.base.apiUrl,
            gamesFillingAddress:state=>state.base.gamesFillingAddress,
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
            this.calcExpenditureProfit();
            this.getAllListData();
        } catch (err) {}
    },
    watch: {
        isConnected: {
            immediate: true,
            async handler(val){
                if(val) {
                    this.refreshData();
                }
            }
        },
        changeData: {
            immediate: true,
            async handler(val){
                if(val.address) {
                    await this.getIsApprove();
                }
            }
        },
    },
    components: {

    },
    methods: {
        handleClick(row) {
            console.log(row);
        },
        refreshData() { //定时刷新数据
            this.timeInterval = setInterval(async () => {
                if(this.activeName == 1) {
                    let ServerWhere = {
                        limit: this.limit,
                    };
                    this.getAllListData(ServerWhere);
                } else {
                    let ServerWhere = {
                        limit: this.limit,
                        address: this.address
                    };
                    this.getAllListData(ServerWhere);
                }
            }, this.refreshTime)
        },
        getAllListData(ServerWhere) {
            if (!ServerWhere || ServerWhere == undefined || ServerWhere.length <= 0) {
                ServerWhere = {
                    limit: this.limit
                };
            }
            axios.get(this.apiUrl + "/Api/Bet/getBetList", {
                params: ServerWhere
            }).then((json) => {
                // console.log(json);
                // console.log(this.address);
                if (json.code == 10000) {
                    if(this.activeName == 1) {
                        this.allBetData = json.data.lists;
                    } else {
                        this.myBetData = json.data.lists;
                    }
                } else {
                    this.$message.error("加载数据失败");
                }
            }).catch((error) => {
                this.$message.error(error);
            });
        },
        setRollDiceData() {
            this.loading = true;
            post(this.apiUrl + '/Api/Bet/setRollDiceData', {
                address: this.address,
                chance: this.chance,
                bet: this.bet,
            }, (json) => {
                console.log(json);
                if (json && json.code == 10000) {
                    this.loading = false;
                    this.$message({message: '投注成功', type: 'success'});

                    this.dealResult = json.data.data;
                    this.dealResultStatue = json.data.lost == 1 ? 'success' : 'error';
                    this.alertShow = true;
                    setTimeout(() => {
                        this.alertShow = false;
                    }, 60000)
                } else {
                    this.loading = false;
                    this.$message.error(json.msg);
                }
                return;
            });
        },
        calcChangeFun(value) { //机会 input改变事件
            // console.log(value);
            if(value > 0) {
                if(value > 98) {
                    this.chance = 98;
                }
                this.calcExpenditureProfit();
            }
        },
        calcExpenditureProfit() { //计算支出和收入
            let odds = (100 / Number(this.chance));
            this.expenditure = keepDecimalNotRounding(odds - odds / 100, 4); //支出
            this.profit = keepDecimalNotRounding((this.expenditure - 1) * this.bet, 8);
        },
        calcOperateFun(value) {  //赌注 计算收入
            // this.bet = value.replace(/^(0+)|[^\d]+/g,'');
            if(value > 0) {
                if(value >= this.dusdBalance) {
                    this.bet = this.dusdBalance;
                }
                this.profit = keepDecimalNotRounding((this.expenditure - 1) * value, 8);
            }
        },
        calcExpenditureFun(value) { //支出 计算收入和机会比
            if(value > 0) {
                if(value > 9999) {
                    this.expenditure = 9999;
                }
                this.profit = keepDecimalNotRounding((this.expenditure - 1) * this.bet, 8);
                let chance = Math.floor(100 / this.expenditure);
                if(chance > 1) {
                    this.chance = this.toFixed(Math.floor(100 / this.expenditure), 2);
                } else {
                    this.chance = this.toFixed(100 / this.expenditure, 2);
                }
            }
        },
        addChange() { //机会加 1
            if(this.chance < 1) {
                this.chance = 1;
            } else {
                this.chance ++;
            }
            this.calcChangeFun(this.chance);
        },
        reduceChange() { //机会减 1
            if(this.chance <= 1) {
                this.chance = 0.01;
            }
            if(this.chance <= 0.01) {
                return;
            } else {
                this.chance --;
            }
            this.calcChangeFun(this.chance);
        },
        maxChange() { //机会 MAX
            this.chance = 98;
            this.calcChangeFun(this.chance);
        },
        minBet() { //赌注 min
            this.bet = keepDecimalNotRounding(1, 8);
            this.calcOperateFun(this.bet);
        },
        removeBet() { //赌注 除 2
            this.bet = keepDecimalNotRounding(this.bet / 2, 8);
            if(this.bet < 1) {
                this.bet = keepDecimalNotRounding(1, 8);
            }
            this.calcOperateFun(this.bet);
        },
        takeBet() { //赌注 乘 2
            this.bet = this.bet * 2;
            this.calcOperateFun(this.bet);
        },
        maxBet() { //赌注 MAX
            this.bet = this.dusdBalance;
            this.calcOperateFun(this.bet);
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
                if(hash) {
                this.approve = true;
                this.trading = false;
                }
            }).finally(() => {
                loading.close();
                this.trading = false;
            });
        },
        addressStr(address){
            // console.log(this.address);
            if(!address || address == undefined || address == '') {
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
                .game {
                    width: 90%;
                    margin: 0 auto;
                    border: 0;
                    background-color: transparent;
                    padding: 20px;
                    .el-tabs__nav {
                        border: 0;
                    }
                    .el-tabs__content {
                        // margin-top: -15px;
                    }
                    .el-tabs__item {
                        color: #fff !important;
                        border: 0;
                        height: 50px;
                        line-height: 50px;
                        padding: 0 20px;
                    }
                    .el-tabs__item.is-active {  
                        color: #fff !important;  
                        background-color: #e09320;
                        // border-bottom-left-radius: 30px;
                        // border-top-left-radius: 30px;
                    } 
                    .el-tabs__active-bar {
                        background-color: #e09320;
                    }
                    .el-tabs__nav-scroll{
                        // width:30%;
                        margin:0 auto
                    }
                    .content-box {
                        // width: 80%;
                        margin: 0 auto;
                        margin-left: auto !important;
                        margin-right: auto !important;
                        .el-col {
                            padding-left: 0 !important;
                        }
                    }
                    .cards {
                        width: 100px;
                        margin: 0 auto;
                        background-color: transparent;
                        border: 2px solid #fff;
                    }
                    .el-radio__input { // 隐藏单选框小圆点
                        display: none !important;
                    }
                }
                // padding:10px;
                padding: 30px 0;
                // background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%), linear-gradient(230.47deg, rgb(30, 69, 137) -47%, rgb(93, 69, 179) 48.82%, rgb(130, 1, 112) 131.59%);
                // background: #1e272a;
                .clearfix {
                    img {
                      vertical-align: middle;  
                    }
                }
                .bet-amount {
                    margin-top: 10px;
                    .el-radio {
                        margin-right: 0;
                    }
                    .el-card__body {
                        padding-bottom: 80px;
                    }
                    .el-radio.is-bordered {
                        padding: 14px 20px 0 10px;
                        background-color: #141a1f;
                        border: 0;
                        color: #fff;
                    }
                    .el-radio.is-bordered.is-checked {
                        background-color: #e09320;
                        border: 0;
                        color: #fff;
                    }
                    .el-radio__input.is-checked+.el-radio__label {
                        color: #fff;
                    }
                    .el-radio-button__inner {
                        background: #21313b;
                        // border: 0;
                        color: #fff;
                    }
                    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
                        background-color: #e09320;
                        // border: 0;
                        border-color: #e09320;
                        color: #fff;
                        box-shadow: none;
                    }
                }
                .size {
                    margin-top: 20px;
                    .el-radio__label {
                        font-size: 18px;
                    }
                    .el-radio.is-bordered {
                        // padding: 14px 20px 0 10px;
                        background-color: #141a1f;
                        border: 0;
                        // border: 2px solid #fff;
                        color: #fff;
                    }
                    .el-radio.is-bordered {
                        padding: 20px 30px 35px 20px;
                    }
                    .el-radio.is-bordered.is-checked {
                        background-color: #e09320;
                        border: 0;
                        // border: 2px solid #e09320;
                        color: #fff;
                    }
                    .el-radio__input.is-checked+.el-radio__label {
                        color: #fff;
                        font-size: 18px;
                    }
                }
                .start-bet {
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
                }
                .start-bet:hover {
                    background-color: #21313b;
                }
                // max-width: 374px;
                // border-radius: 30px;
                .operate {
                    text-align: center;
                    height: 60px;
                    border: 1px solid #454848;
                    .el-input__inner {
                        border: 0;
                        color: #fff;
                        display: flex;
                        width: 100%;
                        height: 60px;
                        // border-radius: 0.8rem;
                        background-color: #21313b;
                    }
                    .el-input-group__prepend {
                        border: 0;
                        color: #fff;
                        background-color: #141a1f;
                        padding: 0 10px;
                    }
                    .el-input-group__append {
                        border: 0;
                        color: #fff;
                        background-color: #141a1f;
                    }
                    .function-button {
                        padding: 9px 9px;
                        height: 60px;
                        // width: 10px;
                        font-size: 10px;
                        border-color: #fff;
                        margin-left: 20px;
                        border: 2px solid #fff;
                    }
                    .red {
                        border-color: #f56c6c;
                    }
                    .green {
                        border-color: rgb(64, 199, 156);
                    }
                    input::-webkit-outer-spin-button,
                    input::-webkit-inner-spin-button {
                        -webkit-appearance: none;
                    }
                    input[type="number"]{
                        -moz-appearance: textfield;
                    }
                }
                // .chance {
                //     .el-input__inner {
                //         padding: 0;
                //     }
                // }
                .title {
                    margin-bottom: 10px;
                }
                .marginTop {
                    // width: 100%;
                    margin-top: 10px;
                    .title {
                        float: left;
                    }
                    .el-button-group {
                        width: 100%;
                        border: 1px solid transparent;
                        button {
                            width: 25.15%;
                            padding: 20px 20px;
                            border-radius: 0;
                            border: 1px solid transparent;
                        }
                        .el-button--primary {
                            background-color: #141a1f;
                            border-color: transparent;
                        }
                        .el-button--primary:hover {
                            background-color: #21313b;
                        }
                    }
                }
                .rule {
                    // width: 80%;
                    // display: flex;
                    // flex-direction: column;
                    // position: relative;
                    border-radius: 0.8rem;
                    font-size: 13px;
                    background-color: #21313b;
                    z-index: 1;
                    padding: 20px 0;
                    .title {
                        margin: 0 auto;
                        font-size: 18px;
                        font-weight: 800;
                    }
                    .box {
                        text-align: left;
                        padding: 0 10px;
                        max-height: 220px;
                        overflow: auto;
                    }
                    // .ccsMgw {
                    //     display: flex;
                    //     -webkit-box-pack: center;
                    //     justify-content: center;
                    //     -webkit-box-align: center;
                    //     align-items: center;
                    //     // padding: 1rem;
                    //     // border-bottom: 0.1rem solid rgba(255, 255, 255, 0.2);
                    //     .gmtMAH {
                    //         color: rgb(255, 255, 255);
                    //         font-size: 1.4rem;
                    //         font-weight: bold;
                    //     }
                    //     button {
                    //         text-decoration: none;
                    //         color: initial;
                    //         cursor: pointer;
                    //         outline: none;
                    //     }
                    // }
                    // .hvnAii {
                    //     padding: 1.5rem 1rem;
                    // }
                }
                .roll-button {
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
                }
                .roll-button:hover {
                    background-color: #21313b;
                }
            }
            .alert {
                width: 80%;
                margin: 0 auto;
                .el-alert__icon {
                    font-size: 50px;
                    width: 50px;
                }
                .el-alert__title {
                    font-size: 20px;
                    line-height: 20px;
                }
            }
            .list {
                // width: 80%;
                // width: 90%;
                margin: 0 auto;
                // padding: 10px;
                // margin-top: 30px;
                background-color: rgb(27, 28, 35);
                .el-tabs__nav {
                    border: 0;
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
                .el-descriptions__title {
                    padding: 30px 0 0 30px;
                    color: #fff;
                    font-size: 18px;
                }
                .el-descriptions__body {
                    background-color: transparent;
                    color: #fff;
                    padding-left: 60px;
                    font-size: 16px;
                    .el-tag {
                        color: #fff;
                        background: linear-gradient(rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%), linear-gradient(230.47deg, rgb(30, 69, 137) -47%, rgb(93, 69, 179) 48.82%, rgb(130, 1, 112) 131.59%);
                        border-radius: 20px;
                    }
                }
            }
        }
    }
</style>
