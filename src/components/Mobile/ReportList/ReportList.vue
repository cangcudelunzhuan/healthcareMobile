<template>
<div class="report-list-wrap" ref="reportListWrap">
  <ul class="report-list-ul-wrap">
    <li v-for="item in data" class="list-item" :key="item.reportNo" @click="viewSingleReport(item)">
      <div class="item-left">
        <p><span class="text-num" :class="{'text-red': item.positiveNum !== 0, 'text-green': item.positiveNum == 0}">{{item.positiveNum}}</span><span class="text-attach">项</span></p>
        <p class="text-positive">阳性指标</p>
      </div>
      <div class="item-right">
        <p class="text-time">{{item.checkupTime}}</p>
        <p>{{item.hospitalName}}</p>
        <p>报告编号：{{item.reportNo}}</p>
      </div>
      <div class="tag">
        <p v-if="item.reportType == '1'" class="tag-exam">体检报告</p>
        <p v-if="item.reportType == '2'" class="tag-treat">就诊报告单</p>
      </div>
    </li>
  </ul>
  <div class="compare-wrap">
    <div class="compare-btn" @click="goReportCompareList($event)">对比</div>
  </div>
</div>
</template>

<script>
import { bus } from '@/globalEventBus/bus'
import { empReportList } from '@/fetch/healcareApi'
export default {
  name: 'ReportList',
  data () {
    return {
      data: null
    }
  },
  mounted () {
    this.init()
    localStorage.setItem('compareListSelectedFlag', JSON.stringify([]))
  },
  methods: {
    init () {
      empReportList(bus.getCookie('empNo'))
        .then((res) => {
          if (res.code === 'success') {
            for (let i = 0; i < res.data.length; i++) {
              // 更新检查时间为'yyyy-mm-dd'形式
              let checkupTime = res.data[i].checkupTime
              res.data[i].checkupTime = checkupTime.substring(0, 4) + '-' + checkupTime.substring(4, 6) + '-' + checkupTime.substring(6)

              // 限制医院名称hospitalName为16个字符
              if (res.data[i].hospitalName) {
                res.data[i].hospitalName = res.data[i].hospitalName.length > 16 ? res.data[i].hospitalName.substring(0, 16) + '...' : res.data[i].hospitalName
              }
            }
            this.data = res.data
            this.$nextTick(() => {
              bus.$emit('loadingFinish')
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    viewSingleReport (dataItem) {
      bus.setCookie('hospitalCode', dataItem.hospitalCode)
      bus.setCookie('checkupTime', dataItem.checkupTime.split('-').join(''))
      this.$router.push({
        path: '/reportOverview'
      })
    },
    goReportCompareList (event) {
      this.$router.push({
        path: '/reportCompareList'
      })
      event.stopPropagation()
    }
  }
}
</script>
