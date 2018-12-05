<template>
<div class="positive-wrap" ref="positiveWrap">
  <ul>
    <li class="item-wrap" v-for="(subItem,index) in data" @click="goPositiveAnalysis(subItem, index, $event)">
      <h3 class="item-title">
        <span>{{subItem.projectName}}</span>
        <span v-if="subItem.referenceUnit">({{subItem.referenceUnit}})</span>
        <span
          class="right-arrow"
          v-if="subItem.compareValue == '1' || subItem.compareValue == '2' || subItem.compareValue == '6' || subItem.compareValue == '7'">
        </span>
      </h3>
      <div class="content-wrap">
        <number-detail
          v-if="subItem.compareValue == '0' || subItem.compareValue == '1' || subItem.compareValue == '2'"
          :data='subItem'
        >
        </number-detail>
        <text-detail
          v-if="subItem.compareValue.indexOf('3') !== -1  || subItem.compareValue.indexOf('4') !== -1"
          :data="subItem"
          @newLocation="newLocation"
        >
        </text-detail>
        <yin-yang-detail
          v-if="subItem.compareValue == '5' || subItem.compareValue == '6' || subItem.compareValue == '7'"
          :data='subItem'
        >
        </yin-yang-detail>
      </div>
    </li>
  </ul>
   <div class="warm-tip">
              温馨提示：若您对此次检查出现的阳性指标不理解，可点击指标解读对该项目做进一步的了解，若您对此次的检查结果有其他疑问，请联系<a href="tel:0571-86718531">0571-86718531</a>，感谢您的使用。
    </div>
</div>
</template>

<script>
import { getAllPositive } from '@/fetch/healcareApi'
import { bus } from '@/globalEventBus/bus'

import NumberDetail from '@/components/Mobile/ReportDetail/NumberDetail'
import TextDetail from '@/components/Mobile/ReportDetail/TextDetail'
import YinYangDetail from '@/components/Mobile/ReportDetail/YinYangDetail'

export default {
  name: 'Positive',
  components: {
    NumberDetail,
    TextDetail,
    YinYangDetail
  },
  data () {
    return {
      data: null
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      let hospitalCode = bus.getCookie('hospitalCode')
      let empNo = bus.getCookie('empNo')
      let checkupTime = bus.getCookie('checkupTime')
      getAllPositive(hospitalCode, checkupTime, empNo)
        .then((res) => {
          bus.$emit('loadingFinish')
          if (res.code === 'success') {
            this.data = res.data.projectList
            this.$nextTick(() => {
              this.locationItem()
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 定位点击的项目
    locationItem () {
      let reportId = bus.getCookie('reportId')
      if (reportId === this.data[0].id) {
        let scrollDis = Number(bus.getCookie('pos'))
        this.$refs.positiveWrap.scrollTop = parseInt(scrollDis)
      }
    },
    goPositiveAnalysis (subItem, index, ev) {
      // 文字型compareValue可能多个竖杠隔开，只能从text-detail中触发
      if (subItem.compareValue.indexOf('|') !== -1) return
      bus.setCookie('courseCode', subItem.courseCode)
      bus.setCookie('projectCode', subItem.projectCode)
      bus.setCookie('resultCode', subItem.resultCode)
      bus.setCookie('compareValue', subItem.compareValue)
      bus.setCookie('rowid', subItem.rowid)

      // 用于定位
      bus.setCookie('reportId', subItem.id)
      bus.setCookie('pos', this.$refs.positiveWrap.scrollTop)
      this.$router.push({
        path: '/positiveAnalysis'
      })
    },
    // 文字类型数据跳转到分析时，保存定位信息
    newLocation (item) {
      bus.setCookie('reportId', item.id)
      bus.setCookie('pos', this.$refs.positiveWrap.scrollTop)
    }
  }
}
</script>

<style scoped>
.positive-wrap {
  background-color: #f5f5f7;
  position: relative;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.positive-wrap * {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.positive-wrap>ul {
  margin-top: 10px;
  min-height: calc(100% - 80px);
  background-color: #fff;
  padding: 0 16px;
}
.item-title {
  height: 53px;
  font-size: 28px; /*px*/
  line-height: 53px;
  color: #333;
  margin: 0 16px;
  border-top: 1px solid #eee; /*no*/
}
.item-title span:nth-of-type(2) {
  color: #9a9a9a;
}
.item-title .right-arrow {
  float: right;
  width: 22px;
  height: 100%;
  background: #fff url(../../../../static/right_arrow.png) no-repeat;
  background-size: 100%;
}
.positive-wrap .warm-tip {
  font-size: 24px; /*px*/
  line-height: 36px; /*px*/
  color: #999;
  margin-bottom: 40px;
  margin-top: 17px;
  padding: 0 16px;
}
</style>
