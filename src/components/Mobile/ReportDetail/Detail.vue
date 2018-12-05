<template>
  <div class="detail-wrap" ref="detailWrap" @scroll="scrollFn($event)">
    <ul class="detail-ul-wrap" ref="detailUlWrap">
       <li class="subject-wrap" v-for="item in data" :ref="item.courseCode" :key="item.courseCode">
        <div class="subject-icon-wrap">
          <i class="iconfont" :class="item.iconUrl"></i>
        </div>
        <h2>{{item.courseName}}</h2>
        <div class="brief-wrap">
          <p>小结：{{item.checkupBrief ? item.checkupBrief.split('|').join('，') : '未见明显异常'}}</p>
        </div>
        <div class="whole-item-wrap">
          <div class="item-wrap" v-for="subItem in item.projectList">
            <h3 class="item-title" @click.stop="goPositiveAnalysis(subItem)">
              <span>{{subItem.projectName}}</span>
              <span v-if="subItem.referenceUnit">({{subItem.referenceUnit}})</span>
              <span
                class="right-arrow"
                v-if="subItem.compareValue == '1' || subItem.compareValue == '2' || subItem.compareValue == '6' || subItem.compareValue == '7'">
              </span>
            </h3>
            <number-detail
               v-if="subItem.compareValue == '0' || subItem.compareValue == '1' || subItem.compareValue == '2'"
              :data='subItem'
              >
            </number-detail>
            <text-detail
              v-if="subItem.compareValue.indexOf('3') !== -1 || subItem.compareValue.indexOf('4') !== -1"
              :data='subItem'
            >
            </text-detail>
            <yin-yang-detail
              v-if="subItem.compareValue == '5' || subItem.compareValue == '6' || subItem.compareValue == '7'"
              :data='subItem'
            >
            </yin-yang-detail>
          </div>
        </div>
      </li>
      <li class="warm-tip">
                  温馨提示：若您对此次检查出现的阳性指标不理解，可点击指标解读对该项目做进一步的了解，若您对此次的检查结果有其他疑问，请联系<a href="tel:0571-86718531">0571-86718531</a>，感谢您的使用。
      </li>
    </ul>
  </div>
</template>

<script>
import { courseDetail } from '@/fetch/healcareApi'

import NumberDetail from '@/components/Mobile/ReportDetail/NumberDetail'
import TextDetail from '@/components/Mobile/ReportDetail/TextDetail'
import YinYangDetail from '@/components/Mobile/ReportDetail/YinYangDetail'

import { bus } from '@/globalEventBus/bus.js'
export default {
  name: 'Detail',
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
  created () {
    // 初始化，获取数据
    this.init()
  },
  methods: {
    init () {
      let hospitalCode = bus.getCookie('hospitalCode')
      let checkupTime = bus.getCookie('checkupTime')
      let empNo = bus.getCookie('empNo')
      courseDetail(hospitalCode, checkupTime, empNo)
        .then((res) => {
          this.data = res.data
          this.$nextTick(() => {
            this.locationCourse()
          })
          bus.$emit('loadingFinish')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 记录滚动位置，
    scrollFn (event) {
      // 报告详情，scrollTop从overview->detail根据科目定位，从positiveAnalysis->detail记录位置
      localStorage.setItem('detailPageScrollTop', event.target.scrollTop)
    },
    // 定位点击的course
    locationCourse () {
      let y
      if (localStorage.getItem('detailPageScrollTop') === '0') {
        let courseCode = bus.getCookie('courseCode')
        let scrollDis = this.$refs[courseCode][0].getBoundingClientRect().top
        y = scrollDis - 60 * Number(document.documentElement.getAttribute('data-dpr'))
      } else {
        y = localStorage.getItem('detailPageScrollTop')
      }
      this.$refs.detailWrap.scrollTop = parseInt(y)
    },
    goPositiveAnalysis (subItem) {
      // 正常则返回
      if (['0', '3', '4', '5'].indexOf(subItem.compareValue) !== -1) return
      // 文字型compareValue可能多个竖杠隔开，只能从text-detail中触发
      if (subItem.compareValue.indexOf('|') !== -1) return
      bus.setCookie('courseCode', subItem.courseCode)
      bus.setCookie('projectCode', subItem.projectCode)
      bus.setCookie('resultCode', subItem.resultCode)
      bus.setCookie('compareValue', subItem.compareValue)
      bus.setCookie('rowid', subItem.rowid)

      this.$router.push({
        path: '/positiveAnalysis'
      })
    }
  }
}
</script>

<style scoped>
.detail-wrap {
  position: relative;
  background: #f5f5f5 url(../../../../static/big_bg.png) no-repeat 0 -65px;
  background-size: 100% auto;
  padding: 0 16px;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.detail-wrap .detail-ul-wrap {
  padding-top: 60px;
  min-height: calc(100% - 80px);
}
.subject-wrap {
  background-color: #fff;
  margin-bottom: 60px;
  box-shadow: 0 0 16px 0 rgba(0,0,0,.05);
  border-radius: 8px;
  position: relative;
  padding-top: 46px;
}
.detail-ul-wrap li:nth-last-of-type(2) {
  margin-bottom: 30px;
}
.subject-icon-wrap {
  position: absolute;
  top: -44px;
  left: calc(50% - 42px);
  width: 84px;
  height: 84px;
  box-shadow: 0 0 16px 0 rgba(0,0,0,0.05);
  border-radius: 8px;
  background-color: #fff;
  text-align: center;
}
.subject-icon-wrap .iconfont {
  width: 44px;
  height: 44px;
  font-size: 44px;
  background-image: -webkit-gradient(linear, 0 0, right bottom, from(#03BFEE), to(#1DE9B6));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: inline-block;
  padding-top: 32px;
}
.subject-wrap h2 {
  position: sticky;
  position: -webkit-sticky;
  top: -1px;
  text-align: center;
  height: 44px;
  line-height: 42px;
  font-size: 32px; /*px*/
  color: #333;
  font-weight: 600;
  background-color: #fff;
  box-sizing: border-box;
  z-index: 99;
  overflow: hidden;
}
.brief-wrap {
  margin: 8px 16px 17px;
  border-radius: 8px;
  background-color: #FFFAF0;
  padding: 16px;
}
.brief-wrap p {
  font-size: 28px; /*px*/
  line-height: 40px; /*px*/
  color: #666;
}
.item-wrap {
  /*overflow: hidden;*/
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
  color: #3F3F3F;
}
.item-title .right-arrow {
  float: right;
  width: 22px;
  height: 100%;
  background: #fff url(../../../../static/right_arrow.png) no-repeat;
  background-size: 100%;
}
.detail-wrap .suspension-part {
  position: fixed;
  top: 0;
  left: 16px;
  z-index: 99;
  width: calc(100% - 32px);
  text-align: center;
  height: 44px;
  line-height: 44px;
  font-size: 32px; /*px*/
  color: #333;
  font-weight: 600;
  background-color: #fff;
  box-shadow: 0 0 16px 0 rgba(0,0,0,0.05);
}
.warm-tip {
  font-size: 24px; /*px*/
  line-height: 36px; /*px*/
  color: #999;
  padding-bottom: 40px;
}
</style>
