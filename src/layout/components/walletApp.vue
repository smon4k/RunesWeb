<template>
    <div class="container">
        <div class="wallet">
            <el-dialog
                title="提示"
                :visible.sync="centerDialogVisible"
                width="80%"
                center
            >
                <span>需要注意的是内容是默认不居中的</span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
export default {
    name: '',
    data() {
        return {
            centerDialogVisible: false
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
    created() {

    },
    watch: {

    },
    components: {

    },
    methods: {

    },
    mounted() {

    },
}
</script>
<style lang="scss" scoped>
    .container {
        /deep/ {

        }
    }
</style>
