<template>
  <div id="app">
      <router-view  />
  </div>
</template>

<script>
import { connectInfo,fetchAccountData } from '@/wallet/connect/metaMask'
import { connect } from '@/wallet/connect/tronWeb'
import { walletConnect } from '@/wallet/connect/walletConnect'
export default {
  name: 'App',
  // data(){
  //   return {
  //   }
  // },
  // computed:{
  //   key() {
  //     return this.$route.fullPath
  //   }
  // },
  mounted(){
    setTimeout(async () => {
      let walletName = localStorage.getItem('walletName');
      if(walletName) { 
        if(walletName === 'MetaMask') {
          await fetchAccountData()
        }
        if(walletName === 'TronLink') {
          await connect()
        }
        if(walletName === 'WalletConnect') {
          await walletConnect()
        }
      } else {
        localStorage.removeItem('walletName');
      }
      // connectInfo()
    }, 300)
  },
}
</script>

<style>
</style>
