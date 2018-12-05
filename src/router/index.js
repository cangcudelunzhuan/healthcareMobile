import Vue from 'vue'
import Router from 'vue-router'
import { bus } from '@/globalEventBus/bus.js'
// 引入C3改标题
import '../C3/c3-jssdk-1.0.0.js'

import Index from '@/components/Mobile/Index'
import ReportList from '@/components/Mobile/ReportList/ReportList'
import ReportOverview from '@/components/Mobile/ReportOverview/ReportOverview'
import Detail from '@/components/Mobile/ReportDetail/Detail'
import Blank from '@/components/Mobile/Blank/Blank'
import planDetail from '@/components/Mobile/planDetail/index'
import blankList from '@/components/Mobile/blankList/index'
const ReportCompareList = resolve => require(['@/components/Mobile/ReportList/ReportCompareList.vue'], resolve)
const ReportCompare = resolve => require(['@/components/Mobile/ReportCompare/ReportCompare.vue'], resolve)
const Positive = resolve => require(['@/components/Mobile/Positive/Positive.vue'], resolve)
const PositiveAnalysis = resolve => require(['@/components/Mobile/PositiveAnalysis/PositiveAnalysis.vue'], resolve)

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/reportList',
      name: 'ReportList',
      component: ReportList
    },
    {
      path: '/reportCompareList',
      name: 'ReportCompareList',
      component: ReportCompareList
    },
    {
      path: '/reportCompare',
      name: 'ReportCompare',
      component: ReportCompare
    },
    {
      path: '/reportOverview',
      name: 'ReportOverview',
      component: ReportOverview
    },
    {
      path: '/detail',
      name: 'Detail',
      component: Detail
    },
    {
      path: '/positive',
      name: 'Positive',
      component: Positive
    },
    {
      path: '/positiveAnalysis',
      name: 'PositiveAnalysis',
      component: PositiveAnalysis
    },
    {
      path: '/doctorConsult',
      name: 'DoctorConsult',
      component: () => import('@/components/Mobile/DoctorConsult/DoctorConsult.vue')
    },
    {
      path: '/blank',
      name: 'Blank',
      component: Blank
    },
    {
      path: '/planDetail',
      name: 'planDetail',
      component: planDetail
    },
    {
      path: '/blankList',
      name: 'blankList',
      component: blankList
    },
    {
      path: '/notOpen',
      name: 'NotOpenFnTip',
      component: () => import('@/components/Mobile/NotOpenFnTip/NotOpenFnTip')
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 跳转则显示loading画面，loading在App.vue中绑定了事件，使用globalEventBus
  bus.$emit('showLoading')
  let inf = {
    userId: bus.getCookie('empNo'),
    serviceId: 1003
  }
  switch (to.path) {
    case '/':
      document.title = '幸福千万家'
      window.C3.ready(function () {
        window.C3.setTitle({
          title: '幸福千万家'
        })
      })
      window.Countly.track_pageview('幸福千万家首页')
      inf.menuName = '幸福千万家首页'
      bus.accessLog(inf)
      break
    case '/reportList':
      document.title = '全部报告'
      window.C3.ready(function () {
        window.C3.setTitle({
          title: '全部报告'
        })
      })
      window.Countly.track_pageview('全部报告')
      inf.menuName = '全部报告'
      bus.accessLog(inf)
      break
    case '/reportCompareList':
      document.title = '报告对比'
      window.C3.ready(function () {
        window.C3.setTitle({
          title: '报告对比'
        })
      })
      window.Countly.track_pageview('报告对比')
      inf.menuName = '报告对比'
      bus.accessLog(inf)
      break
    case '/reportCompare':
      document.title = '对比详情'
      window.C3.ready(function () {
        window.C3.setTitle({
          title: '对比详情'
        })
      })
      window.Countly.track_pageview('对比详情')
      inf.menuName = '对比详情'
      bus.accessLog(inf)
      break
    case '/reportOverview':
      document.title = '体检报告'
      window.C3.ready(function () {
        window.C3.setTitle({
          title: '体检报告'
        })
      })
      window.Countly.track_pageview('体检报告')
      inf.menuName = '体检报告'
      bus.accessLog(inf)
      break
    case '/detail':
      document.title = '报告详情'
      window.C3.ready(function () {
        window.C3.setTitle({
          title: '报告详情'
        })
      })
      window.Countly.track_pageview('报告详情')
      inf.menuName = '报告详情'
      bus.accessLog(inf)
      break
    case '/positive':
      document.title = '阳性指标'
      window.C3.ready(function () {
        window.C3.setTitle({
          title: '阳性指标'
        })
      })
      window.Countly.track_pageview('阳性指标')
      inf.menuName = '阳性指标'
      bus.accessLog(inf)
      break
    case '/positiveAnalysis':
      document.title = '阳性指标解读'
      window.C3.ready(function () {
        window.C3.setTitle({
          title: '阳性指标解读'
        })
      })
      window.Countly.track_pageview('阳性指标解读')
      inf.menuName = '阳性指标解读'
      bus.accessLog(inf)
      break
    case '/doctorConsult':
      document.title = '医生咨询'
      window.C3.ready(function () {
        window.C3.setTitle({
          title: '医生咨询'
        })
      })
      window.Countly.track_pageview('医生咨询')
      inf.menuName = '医生咨询'
      bus.accessLog(inf)
      break
    case '/blankList':
      document.title = '全部方案'
      window.C3.ready(function () {
        window.C3.setTitle({
          title: '全部方案'
        })
      })
      window.Countly.track_pageview('全部方案')
      inf.menuName = '全部方案'
      bus.accessLog(inf)
      break
    case '/blank':
      document.title = '健康促进方案'
      window.C3.ready(function () {
        window.C3.setTitle({
          title: '健康促进方案'
        })
      })
      window.Countly.track_pageview('健康促进方案')
      inf.menuName = '健康促进方案'
      bus.accessLog(inf)
      break
    case '/planDetail':
      document.title = '方案详情'
      window.C3.ready(function () {
        window.C3.setTitle({
          title: '方案详情'
        })
      })
      window.Countly.track_pageview('方案详情')
      inf.menuName = '方案详情'
      bus.accessLog(inf)
      break
    default:
      document.title = '幸福千万家'
      window.C3.ready(function () {
        window.C3.setTitle({
          title: '幸福千万家'
        })
      })
      window.Countly.track_pageview('其他（未开发功能提醒页）')
      inf.menuName = '其他（未开发功能提醒页）'
      bus.accessLog(inf)
      break
  }
  next()
})

export default router
