import Vue from 'vue'
// 引入前端埋点
import '../countly/countly.min.js'

export var bus = new Vue({
  methods: {
    setCookie (cookieName, cookieValue, expiredays) {
      let ExpireDate = ''
      if (expiredays === null) {
        ExpireDate = ''
      } else {
        let d = new Date()
        d.setTime(d.getTime() + (expiredays * 24 * 3600 * 1000))
      }
      document.cookie = cookieName + '=' + cookieValue + '; expires=' + ExpireDate
    },
    getCookie (cookieName) {
      let arr = document.cookie.split('; ')
      for (let i = 0; i < arr.length; i++) {
        var arr1 = arr[i].split('=')
        if (arr1[0] === cookieName) {
          return arr1[1]
        }
      }
      return undefined
    },
    // 前端埋点
    initCountly () {
      window.Countly.init({
        app_key: '74bc9eebb9f6e7eceddc7ad68cda8fc0433df4d4',
        url: 'https://ub-api.geely.com/'
      })
      window.Countly.track_sessions()
      window.Countly.track_pageview()
      window.Countly.track_scrolls()
      window.Countly.track_clicks()
      window.Countly.track_links()
      window.Countly.track_forms()
      window.Countly.track_errors()
    },
    countlyUserDetail (info) {
      window.Countly.user_details(info)
    },
    // 部门前端埋点
    accessLog (inf) {
      let img = new Image(1, 1)
      let src = 'https://dt.geely.com/log/analysis/log.gif?args=' + encodeURIComponent(JSON.stringify(inf))
      img.src = src
    }
  }
})
