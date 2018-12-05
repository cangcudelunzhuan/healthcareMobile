<template>
<div class="report-overview-wrap" ref="reportOverviewWrap">
  <div class="overview-inner-wrap">
    <div class="base-content">
      <div class="base-top">
        <div class="header-img">
          <img src="../../../../static/header.png" alt="用户头像" />
        </div>
        <div class="user-part">
          <p>
            <span class="emp-name">{{data.empName}}</span>
            <span class="checkup-time">{{data.checkupTime}}</span>
            <span class="eye-icon" @click="changeIsHidden">
              <open-eye-icon class="icon-inner" v-if="!isHidden"></open-eye-icon>
              <close-eye-icon class="icon-inner" v-if="isHidden"></close-eye-icon>
            </span>
          </p>
          <p @click="goPositive">
            <span
              class="positive-num"
              :class="{'positive-num-blue': data.positiveNum == 0}">
              {{data.positiveNum}}
            </span>
            <span class="text-attach">项阳性指标</span>
            <span class="text-triangle" v-if="data.positiveNum != 0">▲</span>
          </p>
        </div>
      </div>
      <div class="base-bottom">
        <h5>基础健康数据</h5>
        <ul>
          <li v-for="item in data.baseHealth" :key="item.name">
            <p :class="{'is-positive': item.compareValue == 1 || item.compareValue == 2}">
              <span class="base-name">{{item.projectName}}&nbsp;</span>
              <span class="base-unit" v-if="item.referenceUnit">({{item.referenceUnit}})</span>
              <span class="base-value">{{item.result}}</span>
              <span class="base-arrow">
                <up-arrow-icon class="base-arrow-icon" v-if="item.compareValue == 1"></up-arrow-icon>
                <down-arrow-icon class="base-arrow-icon" v-if="item.compareValue == 2"></down-arrow-icon>
              </span>
            </p>
          </li>
        </ul>
      </div>
    </div>
    <div class="result-content" ref="resultContent">
      <h3 class="result-title">健康检查结果</h3>
      <ul>
        <li v-for="item in data.healthResult" :key="item.courseCode" class="result-item" @click="goDetail(item)">
          <p>
            <span class="result-icon"><i class="iconfont" :class="item.iconUrl"></i></span>
            <span class="result-name">{{item.courseName}}</span>
            <span class="result-arrow"></span>
          </p>
        </li>
      </ul>
    </div>
    <div class="promote-plan" @click.stop="goPlan(1)">
      <promote-icon class="promote-icon"></promote-icon>
      <span class="promote-text">促进方案</span>
      <span class="result-arrow"></span>
    </div>
  </div>
  <div class="suspension-part" :class="{'suspension': suspensionFlag}" ref="resultTitle">健康检查结果</div>
</div>
</template>

<script>
import { empReport, updateHidden, getPromoteSchemeId } from '@/fetch/healcareApi'

import openEyeIcon from '@/assets/SVG/OpenEyeSVG.vue'
import closeEyeIcon from '@/assets/SVG/CloseEyeSVG.vue'
import PromoteIcon from '@/assets/SVG/PromoteSVG.vue'
import UpArrowIcon from '@/assets/SVG/UpArrowSVG.vue'
import DownArrowIcon from '@/assets/SVG/DownArrowSVG.vue'

import BScroll from 'better-scroll'
export default {
  name: 'ReportOverview',
  components: {
    openEyeIcon,
    closeEyeIcon,
    PromoteIcon,
    UpArrowIcon,
    DownArrowIcon
  },
  data () {
    return {
      data: {
        baseHealth: null,
        empName: '',
        checkupTime: '',
        positiveNum: 0
      },
      originalData: null,
      hiddenData: null,
      isHidden: false,
      // ‘健康检查结果’标题悬浮范围
      scrollScale: [880, 1600],
      suspensionFlag: false,
      // 跳转促进方案时使用
      schemeId: null
    }
  },
  mounted () {
    this.init()
    // 报告详情，scrollTop从overview->detail根据科目定位，从positiveAnalysis->detail记录位置
    localStorage.setItem('detailPageScrollTop', 0)
  },
  methods: {
    init () {
      let hospitalCode = bus.getCookie('hospitalCode')
      let empNo = bus.getCookie('empNo')
      let checkupTime = bus.getCookie('checkupTime')
      empReport(hospitalCode, empNo, checkupTime)
        .then((res) => {
          // 更新检查时间为'yyyy-mm-dd'形式
          let checkupTime = res.data.checkupTime
          res.data.checkupTime = checkupTime.substring(0, 4) + '-' + checkupTime.substring(4, 6) + '-' + checkupTime.substring(6)
          // 保存原始data
          this.originalData = res.data
          // 计算并保存隐藏数据
          let hideRes = JSON.parse(JSON.stringify(res.data))
          hideRes.positiveNum = '*'
          for (let i = 0; i < hideRes.baseHealth.length; i++) {
            hideRes.baseHealth[i].result = '***'
            hideRes.baseHealth[i].compareValue = '0'
          }
          this.hiddenData = hideRes
          // 根据isHidden给数据
          if (res.data.isHidden === '1') {
            this.isHidden = false
            this.data = this.originalData
          } else if (res.data.isHidden === '0') {
            this.isHidden = true
            this.data = this.hiddenData
          }
          // 初始化滚动界限，创建滚动
          this.$nextTick(() => {
            this.initScrollInfo()
            if (!this.scroll) {
              this.scroll = new BScroll(this.$refs.reportOverviewWrap, {
                probeType: 3,
                click: true
              })
              this.scroll.on('scroll', (pos) => {
                this.scrollFn(pos)
              })
            } else {
              this.scroll.refresh()
            }
          })
          bus.$emit('loadingFinish')
        })
        .catch((err) => {
          console.log(err)
        })

      // 获取促进方案schemeId,用于跳转
      getPromoteSchemeId (hospitalCode, empNo, checkupTime)
        .then(res => {
          if (res.data.length !== 0) {
            this.schemeId = res.data[0].id
          } else {
            this.schemeId = ''
          }
        })
    },
    changeIsHidden () {
      this.isHidden = !this.isHidden
      if (this.isHidden) {
        this.data = this.hiddenData
      } else {
        this.data = this.originalData
      }
      let isHiddenValue = this.isHidden ? '0' : '1'
      let hospitalCode = bus.getCookie('hospitalCode')
      let checkupTime = bus.getCookie('checkupTime')
      let empNo = bus.getCookie('empNo')
      updateHidden(hospitalCode, checkupTime, empNo, isHiddenValue)
        .then((res) => {
        })
        .catch((err) => {
          console.log(err)
        })
    },
    goPositive () {
      if (this.data.positiveNum === 0) {
        return
      }
      bus.setCookie('pos', '0')
      this.$router.push({
        path: '/positive'
      })
    },
    goDetail (item) {
      bus.setCookie('courseCode', item.courseCode)
      this.$router.push({
        path: '/detail'
      })
    },
    goPlan (scr) {
      if (this.schemeId) {
        let checkupTime = this.originalData.checkupTime.split('-').join('')
        let empName = this.originalData.empName
        this.$router.push({
          path: '/blank',
          query: {
            scr: scr,
            id: this.schemeId,
            checkupTime: checkupTime,
            empName: empName,
            hospitalCode: bus.getCookie('hospitalCode')
          }
        })
      } else {
        this.$toast({
          message: '暂无对应促进方案'
        })
      }
    },
    initScrollInfo () {
      const RATIO = Number(document.documentElement.getAttribute('data-dpr'))
      let top = this.$refs.resultContent.getBoundingClientRect().top
      let bottom = this.$refs.resultContent.getBoundingClientRect().bottom - 213 * RATIO
      this.scrollScale = [top, bottom]
    },
    scrollFn (pos) {
      let t = -pos.y
      if (t > this.scrollScale[0] && t < this.scrollScale[1]) {
        this.suspensionFlag = true
      } else {
        this.suspensionFlag = false
      }
    }
  }
}
</script>

<style scoped>
.promote-text {
  display: inline-block;
  vertical-align: top;
}
</style>
