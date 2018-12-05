<template>
  <div id="app">
    <router-view v-show="loadingFinish"></router-view>
    <div class="is-loading" v-show="!loadingFinish"></div>
  </div>
</template>

<script>
import { bus } from '@/globalEventBus/bus'

export default {
  name: 'App',
  data () {
    return {
      loadingFinish: false
    }
  },
  created () {
    bus.$on('showLoading', () => {
      this.loadingFinish = false
    })
    bus.$on('loadingFinish', () => {
      this.loadingFinish = true
    })
  },
  mounted () {
    bus.initCountly()
  }
}
</script>

<style>
/* 为了应对C3改变字体设置 */
html {
  -webkit-text-size-adjust: 100% !important;
}
#app {
  color: #515152;
  height: 100%;
  font-size: 24px; /*px*/
  line-height: 40px; /*px*/
  position: relative;
  background-color: #f7f7f9;
}
.is-loading {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, .1) url(../static/loading_gif.gif) no-repeat center center;
}
</style>
