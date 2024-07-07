<template>
    <div class="container">
        <div class="check-card">
            <el-row>
                <!-- 最后一个服务器种子 SHA256： -->
                <el-col :span="24" align="center">
                    <el-input v-model="fairnessInfoObj.last_server_seed_sha256" :readonly="true">
                        <template slot="prepend">{{ $t('game:Last-server-seed-SHA256') }}：</template>
                    </el-input>
                </el-col>
                <!-- 最后的服务器种子： -->
                <el-col :span="24" align="center">
                    <el-input v-model="fairnessInfoObj.last_server_seed" :readonly="true">
                        <template slot="prepend">{{ $t('game:Last-server-seed') }}：</template>
                    </el-input>
                </el-col>
                <!-- 最后一个客户种子： -->
                <el-col :span="24" align="center" >
                    <el-input v-model="fairnessInfoObj.last_client_seed" :readonly="true">
                        <template slot="prepend">{{ $t('game:Last-client-seed') }}：</template>
                    </el-input>
                </el-col>
                <!-- 下一个服务器种子 SHA256： -->
                <el-col :span="24" align="center" >
                    <el-input v-model="fairnessInfoObj.next_server_seed_sha256" :readonly="true">
                        <template slot="prepend">{{ $t('game:Next-server-seed-SHA256') }}：</template>
                    </el-input>
                </el-col>
                <!-- 下一个客户种子： -->
                <el-col :span="24" align="center" >
                    <el-input :placeholder="$t('game:typeYourClientSeed')" v-model="fairnessInfoObj.next_client_seed" :readonly="!riskValue">
                        <template slot="prepend">{{ $t('game:Next-server-seed') }}：</template>
                        <template slot="append">
                            <div @click="resetUserClienSeedAddress()" v-if="!riskValue">
                                <el-button size="mini" :loading="btnLoading">{{ $t('game:Randomize') }}</el-button>
                            </div>
                            <div @click="customizeUserClienSeedAddress()" v-else>
                                <el-button size="mini" :loading="btnLoading">{{ $t('game:Save') }}</el-button>
                            </div>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="24" align="left" style="margin-left: 20px;">
                    <el-checkbox v-model="riskValue" @change="riskValueChange">{{ $t('game:IunderstandRisks') }}</el-checkbox>
                </el-col>
            </el-row>
        </div>
        <div class="check-card">
            <el-row>
                <el-col :span="24" align="left">
                    <div class="play-rule">
                        <span>{{ $t('game:fairness-text-01') }}</span> <br>
                        <span>{{ $t('game:fairness-text-02') }}</span> <br>
                        <span>{{ $t('game:fairness-text-02-01') }}</span> <br> 
                        <br>
                        <span>{{ $t('game:fairness-text-03') }}</span> <br>
                        <span>{{ $t('game:fairness-text-04') }}</span> <br>
                        <span>{{ $t('game:fairness-text-05') }}</span> <br>
                        <span>{{ $t('game:fairness-text-06') }}</span> <br>
                        <span>{{ $t('game:fairness-text-07') }}</span> <br>
                        <span>{{ $t('game:fairness-text-08') }}</span> <br>
                        <br>
                        <span v-html="$t('game:fairness-text-09')"></span>
                        <span  v-html="$t('game:fairness-text-10')"></span> <br>
                        <!-- 更多关于可证明公平系统的信息，请参见可证明公平标签。 -->
                        <div style="margin-top: 20px;text-align: left;color: #fff;">{{ $t('game:bettingRules') }}</div>
                        <div style="margin-top: 20px;text-align: left;color: #fff;">{{ $t('game:thirdPartyTages') }}</div>
                        <div style="text-align: left;margin-top: 10px;">
                            <a :href="'https://dicesites.com/crypto-games/verifier?game=dice'" target="_blank" rel="noopener noreferrer" style="color:#409EFF;text-decoration:underline;">
                            {{ $t('game:thirdParty') }}
                            </a>
                        </div>
                        <div style="text-align: left;margin-top: 10px;">
                            <a :href="'https://dicesites.com/provably-fair'" target="_blank" rel="noopener noreferrer" style="color:#409EFF;text-decoration:underline;">
                            {{ $t('game:principleFairness') }}
                            </a>
                        </div>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
import { get, post } from "@/common/axios.js";
import { mapGetters, mapState } from "vuex";
export default {
    name: '',
    data() {
        return {
            fairnessInfoObj: {},
            riskValue: false,
            btnLoading: false,
        }
    },
    computed: {
        ...mapState({
            address:state=>state.base.address,
            isConnected:state=>state.base.isConnected,
            isMobel:state=>state.comps.isMobel,
            mainTheme:state=>state.comps.mainTheme,
            apiUrl:state=>state.base.apiUrl,
        }),

    },
    mounted() {

    },
    created() {
        this.getFairnessSeedAddress();
    },
    watch: {

    },
    components: {

    },
    methods: {
        async riskValueChange(val) {
            console.log(val);
            if(val) {
                this.fairnessInfoObj.next_client_seed = '';
            } else {
                await this.resetUserClienSeedAddress();
            }
        },
        async getFairnessSeedAddress() { //获取我的返佣记录
            get(this.apiUrl + "/Api/User/getFairnessSeedAddress", {
                address: this.address,
            }, async (json) => {
                if(json.code == 10000) {
                    this.fairnessInfoObj = json.data;
                } else {
                    console.log("get getFairnessSeedAddress error");
                }
            });
        },
        async resetUserClienSeedAddress() { //重置随机客户种子地址
            this.btnLoading = true;
            get(this.apiUrl + "/Api/User/resetUserClienSeedAddress", {
                address: this.address,
            }, async (json) => {
                this.btnLoading = false;
                if(json.code == 10000) {
                    this.fairnessInfoObj.next_client_seed = json.data;
                } else {
                    console.log("get resetUserClienSeedAddress error");
                }
            });
        },
        async customizeUserClienSeedAddress() { //自定义机客户种子地址
            this.btnLoading = true;
            setTimeout(async() => {
                post(this.apiUrl + "/Api/User/customizeUserClienSeedAddress", {
                    address: this.address,
                    next_client_seed: this.fairnessInfoObj.next_client_seed
                }, async (json) => {
                    this.btnLoading = false;
                    if(json.code == 10000) {
                        this.$message({
                            message: 'Save Success',
                            type: 'success'
                        });
                    } else {
                        console.log("get customizeUserClienSeedAddress error");
                    }
                });
            }, 1000);
        }
    },
}
</script>
<style lang="scss" scoped>
    .container {
        /deep/ {
            .check-card {
                margin-bottom: 20px;
                border: 2px solid #454848;
                padding: 15px;
                .el-col {
                    margin-bottom: 20px;
                }
                .el-input {
                    font-size: 10px;
                }
                .el-input__inner {
                    background-color: #21313b;
                    color: #fff;
                    border: 0;
                    padding: 5px;
                    height: 30px;
                    line-height: 30px;
                }
                .el-input-group__prepend {
                    color: #fff;
                    border: 0;
                    background-color: #141a1f;
                    padding-right: 0;
                }
                .el-input-group__append {
                    color: #fff;
                    border: 0;
                    background-color: #141a1f;
                    cursor:pointer; 
                    // padding-left: 0;
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
                .play-rule {
                    // padding: 10px;
                    // white-space: pre-wrap;
                }
                .el-checkbox {
                    color: #fff;
                    .el-checkbox__inner {
                        width: 12px;
                        height: 12px;
                    }
                    .el-checkbox__label {
                        font-size: 10px;
                    }
                }
            }
        }
    }
</style>
