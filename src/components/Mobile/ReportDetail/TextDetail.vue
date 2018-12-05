<template>
<div class="text-detail-wrap">
  <p v-for="(item, index) in handledData" :key="item.result" :class="{'text-red': item.compareValue == '4'}" @click.stop="goPositiveAnalysis(item, $event, index)">
    <span>{{item.result}}</span>
    <span class="right-arrow" v-if="item.compareValue == '4'"></span>
  </p>
</div>
</template>

<script>
import { bus } from '@/globalEventBus/bus'
export default {
  name: 'TextDetail',
  props: ['data'],
  data () {
    return {
      handledData: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let handledData = []
      if (this.data.result.indexOf('|') !== -1) {
        let resultArr = this.data.result.split('|')
        let resultCodeArr = this.data.resultCode.split('|')
        let compareValueArr = this.data.compareValue.split('|')
        for (let i = 0; i < resultArr.length; i++) {
          let obj = {}
          for (let attr in this.data) {
            if (attr === 'result') {
              obj[attr] = resultArr[i]
            } else if (attr === 'resultCode') {
              obj[attr] = resultCodeArr[i]
            } else if (attr === 'compareValue') {
              obj[attr] = compareValueArr[i]
            } else {
              obj[attr] = this.data[attr]
            }
          }
          handledData.push(obj)
        }
      } else {
        handledData.push(this.data)
      }
      this.handledData = handledData
    },
    goPositiveAnalysis (item, ev, index) {
      // 正常则返回
      if (item.compareValue === '3') return
      bus.setCookie('courseCode', item.courseCode)
      bus.setCookie('projectCode', item.projectCode)
      bus.setCookie('resultCode', item.resultCode)
      bus.setCookie('compareValue', item.compareValue)
      bus.setCookie('textAnalysisIndex', index)
      bus.setCookie('rowid', item.rowid)

      this.$router.push({
        path: '/positiveAnalysis'
      })

      this.$emit('newLocation', item)
      ev.stopPropagation()
    }
  }
}
</script>

<style scoped>
.text-detail-wrap {
  padding: 0 16px;
  font-size: 32px; /*px*/
  line-height: 54px; /*px*/
  color: #333;
  padding-bottom: 8px;
}
.text-detail-wrap p {
  padding: 8px 0;
  width: 279px;
  position: relative;
  padding-right: 32px;
}
.text-detail-wrap .right-arrow {
  position: absolute;
  right: 0;
  top: 0;
  width: 22px;
  height: 43px;
  background: #fff url(../../../../static/right_arrow.png) no-repeat;
  background-size: 100%;
}
.text-detail-wrap .text-red {
  color: #FA476F;
}
</style>
