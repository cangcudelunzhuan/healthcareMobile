// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// turn es2015 grammar into normal
import 'babel-polyfill'

import Vue from 'vue'
import App from './App'
import router from './router'
import { Toast } from 'mint-ui'
Vue.prototype.$toast = Toast
import 'mint-ui/lib/style.css'
import '@/filter'
// automatically turn px to rem
import '@/assets/css/basic.css'
import 'lib-flexible'
import '@/assets/cssoverwriteHSQ.css'
import '@/assets/iconfont/iconfont.css'

import { bus } from '@/globalEventBus/bus'
import {DrawerLayout} from 'vue-drawer-layout'
Vue.component(DrawerLayout.name, DrawerLayout)
import $ from 'jquery'
window.bus = bus

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  // store,
  components: { App },
  template: '<App/>'
})
