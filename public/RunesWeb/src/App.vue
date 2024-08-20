<template>
  <div id="app">
    <router-view />

    <div class="popUpOuter">
      <div class="outerItem">
        <PopUp v-if="showPending" type="pending" />
      </div>
      <div class="outerItem">
        <PopUp v-if="showConstruction" type="construction" />
      </div>
      <div v-for="(item, index) in popUpList" :key="index" class="outerItem">
        <PopUp :typeData="item" :type="item.kind" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PopUp from "./components/popUp.vue";
import { connectInfo, fetchAccountData } from "@/wallet/connect/metaMask";
export default {
  name: "App",
  components: {
    PopUp,
  },
  // data(){
  //   return {
  //   }
  // },
  computed: {
    popUpList() {
      return this.$store.state.comps.popUpList;
    },
    ...mapState({
      isConnected: (state) => state.base.connected,
      showPending: (state) => state.comps.showPending,
      showConstruction: (state) => state.comps.showConstruction,
    }),
  },
  mounted() {
    setTimeout(() => {
      fetchAccountData();
      // connectInfo()
    }, 300);
  },
};
</script>

<style lang="scss" scoped>
.popUpOuter {
  position: fixed;
  z-index: 9998;
  display: flex;
  right: 20px;
  top: 85px;

  .outerItem {
    margin-left: 12px;
  }

  .outerItem:nth-of-type(1) {
    margin-left: 0px;
  }
}
</style>
