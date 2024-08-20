<template>
    <div class="popup_outer">
        <div class="trade_success item" v-if="type === 'success'">
            <div class="icon">
                <img src="@/assets/tradeSuccess.png" alt="">
            </div>
            <div class="info">
                <p :class="{ 'noHash': !typeData.hash }">
                    {{ typeData.type === 'approve' ? '授权成功' : '交易成功' }} <br />
                    <a v-if="typeData.hash" :class="{ 'notZH': $i18n.locale !== 'zh_CN' }" :href="httpAddress" target="_blank">{{ '去浏览器中查看' }}</a>
                </p>
            </div>
            <div class="close" @click="closePopUp">
                <img src="@/assets/close.png" alt="">
            </div>
        </div>
        <div class="trade_pending item" v-if="type === 'pending'">
            <div class="icon">
                <img src="@/assets/trading.png" alt="">
            </div>
            <div class="info">
                <p :class="{ 'noHash': !typeData.hash }">
                    {{ pendingOrderAmount + '笔交易正在进行' }} <br />
                    <a v-if="typeData.hash" :class="{ 'notZH': $i18n.locale !== 'zh_CN' }" :href="httpAddress" target="_blank">{{ '去浏览器中查看' }}</a>
                </p>
            </div>
            <div class="close" @click="closePopUp">
                <img src="@/assets/close.png" alt="">
            </div>
        </div>
        
        <div class="trade_pending item construction" v-if="type === 'construction'">
            <div class="icon">
                <img src="@/assets/jianshe.svg" alt="">
            </div>
            <div class="info">
                <span :class="{'notZH':$i18n.locale !== 'zh_CN'}">{{ '程序猿正在加班中' }}...</span>
            </div>
            <div class="close" @click="closePopUp">
                <img src="@/assets/close.png" alt="">
            </div>
        </div>
        <div class="trade_fail item" v-if="type === 'fail'">
            <div class="icon">
                <img src="@/assets/tradeFail.png" alt="">
            </div>
            <div class="info">
                <p :class="{ 'noHash': !typeData.isUserDeny && !typeData.hash && !typeData.errType }">
                    {{ typeData.type === 'approve' ? '授权失败' : '交易失败' }} <br />
                    <span v-if="typeData.isUserDeny">{{ '拒绝交易' }}</span>
                    <span v-if="typeData.errType">{{ $t(typeData.errType) }}</span>
                    <a v-if="!typeData.isUserDeny && typeData.hash" :class="{ 'notZH': $i18n.locale !== 'zh_CN' }" :href="httpAddress" target="_blank">{{ '去浏览器中查看' }}</a>
                </p>
            </div>
            <div class="close" @click="closePopUp">
                <img src="@/assets/close.png" alt="">
            </div>
        </div>
        <div class="close_line"></div>
    </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
    name:'popUp',
    props:{
        typeData:{
            type: Object,
            default:()=>{ return {} }
        },
        type: String
    },
    data(){
        return {
            timeOut:null,
            isPhone: false
        }
    },
    created() {
        if (location.search.indexOf('?pc') !== 0 && /Android|Windows Phone|iPhone|iPod/i.test(navigator.userAgent)) {
            this.isPhone = true
        }
    },
    mounted(){
        this.startAnimation();
        this.$nextTick(() => {
            this.timeOut = setTimeout(() => {
                let status = {}
                if (this.type === 'fail' || this.type === 'success' || this.type === 'pending') {
                    status.id = this.typeData.id
                } else {
                    status.kind = this.type
                }
                // this.$store.dispatch('closePopUp', status)
            }, 10800)
        })
    },
    computed:{
        ...mapState({
            tradeStatus: state => state.base.tradeStatus
        }),
        pendingOrderAmount() {
            console.log(this.tradeStatus);
            let arr = this.tradeStatus.list.filter(ele => ele.val === 3)
            return arr.length
        },
        httpAddress() {
            return 'https://evm.confluxscan.io/tx/' + (this.typeData.hash || '')
        }
    },
    beforeDestroy(){
        clearTimeout(this.timeOut)
        this.timeOut = null;
        const closeLineElement = this.$el.querySelector('.close_line');
        if (closeLineElement) {
            closeLineElement.removeEventListener('animationend', this.onAnimationEnd);
        }
    },
    watch:{
        pendingOrderAmount:{
            handler(val){
                if(!val){
                    this.closePopUp()
                }
            }
        }
    },
    methods:{
        closePopUp(){
            clearTimeout(this.timeOut)
            this.timeOut = null 
            let status = {}
            if (this.type === 'fail' || this.type === 'success' || this.type === 'pending') {
                status.id = this.typeData.id
            } else {
                status.kind = this.type
            }
            this.$store.dispatch('closePopUp' , status);
        },
        startAnimation() {
            const closeLineElement = this.$el.querySelector('.close_line');
            if (closeLineElement) {
                // closeLineElement.style.animation = 'closeLine 10s linear 0.8s forwards';

                closeLineElement.addEventListener('animationend', this.onAnimationEnd);
            }
        },
        onAnimationEnd() {
            this.closePopUp();
        }
    }
}
</script>
<style lang="scss" scoped>
.popup_outer {
    width: 300px;
    height: 80px;
    position: relative;
    background-color: rgb(51, 65, 85);
    box-shadow: 0px 2px 20px 0px rgba(170, 170, 170, 0.25);
    border-radius: 10px;
    overflow: hidden;
    animation: showPopDown 0.5s linear forwards;
    padding: 10px;
    .item {
        display: flex;
        width: 100%;
        position: relative;
        //height: 8px;

        // gap: 20px;
        .icon {
            display: flex;
            align-items: center;
            height: 100%;

            img {
                width: 20px;
                height: 20px;
            }
        }

        >div {
            // height 80px
        }

        .close {
            position: absolute;
            right: 0;
            top: 0;
            display: flex;
            cursor: pointer;

            img {
                width: 20px;
                height: 20px;
            }
        }

        .info {
            display: flex;
            align-items: center;
            gap: 5px;
            margin-left: 16px;

            .notZH {
                font-size: 16px;
            }

            p {
                padding-bottom: 0;
            }

            a,
            span {
                position: relative;
                //top: -.16rem;
            }
        }

        .noHash {
            //padding-top :30px;
        }

    }

    .trade_success .info {
        p {
            font-size: 16px;
            line-height: 28px;
            font-weight: 600;
            // padding: 16px 0 0 0;
            color: #39BC1F;
        }

        .noHash {
            //padding-top:30px;
        }

        a {
            font-size: 16px;
            line-height: 20px;
            text-decoration: underline;
            color: #FFC200;

        }

    }

    .trade_fail {
        p {
            font-size: 16px;
            line-height: 28px;
            font-weight: 600;
            //padding: .16rem 0 0 0;
            color: #fff;
        }

        span {
            font-size: 16px;
            font-weight: 600;
            color: rgb(148, 163, 184);
        }

        a {
            font-size: 18px;
            text-decoration: underline;
            color: #FFC200;
        }
    }

    .trade_pending {
        .info {
            p {
                font-size: 16px;
                line-height: 32px;
                font-weight: 600;
                //padding: .16rem 0 0 0;
                color: #fff;
            }

            .num {
                color: #FFC200;
                display: inline-block;
                margin-right: 12px;
            }

            span {
                font-size: 16px;
                font-weight: 600;
                color: rgb(148, 163, 184);
            }

            a {
                font-size: 18px;
                text-decoration: underline;
                color: #FFC200;
            }
        }

        .icon {
            img {
                animation: imgRotating 2s linear infinite;
            }

        }
    }

    .trade_pending.construction {
        .icon {
            img {
                animation: none;
            }
        }
    }

    .trade_pending.notZH {
        .info {
            //padding-top: 20px;
        }
    }

    .close_line {
        position: absolute;
        height: 4px;
        width: 100%;
        border-radius: 2px;
        background-color: #FFC200;
        bottom: 0px;
        left: 0px;
        animation: closeLine 10s linear 0.8s forwards;
    }

}

.popup_outer.phone {

    //min-height: 1rem;
    //width: 3.6rem;
    //padding-bottom: 16px;
    //height: auto;
    .item {
        .icon {
            line-height: 1rem;

            img {
                height: .56rem;
                width: .56rem;
            }
        }

        .info {
            .notZH {
                font-size: .24rem;
            }

            p {
                font-size: .32rem;
            }

            a {
                font-size: .24rem;
                line-height: 0rem;
            }
        }

        .close {
            height: .24rem;
            width: .24rem;
        }
    }

    .trade_pending {
        .icon {
            img {
                transform: rotateZ(360deg);
                transform-origin: .26rem .28rem;
            }
        }

        .info {

            //padding-top: .36rem;
        }
    }
}

@keyframes closeLine {
    0% {
        width: 100%;
    }

    100% {
        width: 0%;
    }
}

@keyframes showPopDown {
    0% {
        top: -30px;
        opacity: 0;
    }

    100% {
        top: 0px;
        opacity: 1;
    }
}

@keyframes imgRotating {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>
