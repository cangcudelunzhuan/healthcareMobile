<template>
  <div class="detail-wrap" ref="detailWrap">
    <ul class="detail-ul-wrap" ref="detailUlWrap">
       <li class="subject-wrap" v-for="(item, index) in data" :ref="item.courseCode" :key="item.courseCode">
        <div class="subject-icon-wrap">
          <i class="iconfont" :class="item.iconUrl"></i>
        </div>
        <h2>{{item.courseName}}</h2>
        <div class="brief-wrap">
          <p>小结：{{item.checkupBrief}}</p>
        </div>
        <div class="whole-item-wrap">
          <div class="item-wrap" v-for="subItem in item.projectList">
            <h3 class="item-title" @click="goPositiveAnalysis(subItem)">
              <span>{{subItem.projectName}}</span>
              <span v-if="subItem.referenceUnit != null">({{subItem.referenceUnit}})</span>
              <span
                class="right-arrow"
                v-if="subItem.compareValue == '1' || subItem.compareValue == '2' || subItem.compareValue == '6'">
              </span>
            </h3>
            <number-detail
               v-if="subItem.compareValue == '0' || subItem.compareValue == '1' || subItem.compareValue == '2'"
              :data='subItem'
              >
            </number-detail>
            <text-detail
              v-if="subItem.compareValue == '3' || subItem.compareValue == '4'"
              :data='subItem'
            >
            </text-detail>
            <yin-yang-detail
              v-if="subItem.compareValue == '5' || subItem.compareValue == '6'"
              :data='subItem'
            >
            </yin-yang-detail>
          </div>
        </div>
      </li>
      <li class="warm-tip">
                  温馨提示：若您对此次检查出现的阳性指标不理解，可点击指标解读对该项目做进一步的了解，若您对此次的检查结果有其他疑问，请联系<a href="tel:13167102016">0571-86718531</a>，感谢您的使用。
      </li>
    </ul>
    <div class="suspension-part" v-if="suspensionFlag">{{suspensionInnerHTML}}</div>
  </div>
</template>

<script>
import { courseDetail } from '@/fetch/healcareApi'

import NumberDetail from '@/components/Mobile/ReportDetail/NumberDetail'
import TextDetail from '@/components/Mobile/ReportDetail/TextDetail'
import YinYangDetail from '@/components/Mobile/ReportDetail/YinYangDetail'

import { bus } from '@/globalEventBus/bus.js'
import BScroll from 'better-scroll'
export default {
  name: 'Detail',
  components: {
    NumberDetail,
    TextDetail,
    YinYangDetail
  },
  data () {
    return {
      // 是否悬浮的标记，用来绑定class=suspension
      suspensionFlag: false,
      suspensionInnerHTML: '一般检查',
      currentSuspensionIndex: -1,
      // h2的出现的上下范围
      h2UpDown: [],
      h2JudgeUpDown: [],
      allh2Elements: [],
      data: null,
      // scroll: null
      isAndroid: false,
      ulNowY: 0,
      ulMaxY: -1000,
      touchStartY: 0,
      touchStartTime: 0
    }
  },
  created () {
    // 初始化，获取数据
    this.init()
  },
  mounted () {
    this.$nextTick(() => {
      
    })
  },
  methods: {
    init () {
      let hospitalCode = bus.getCookie('hospitalCode')
      let checkupTime = bus.getCookie('checkupTime')
      let empNo = bus.getCookie('empNo')
      courseDetail(hospitalCode, checkupTime, empNo)
        .then((res) => {
          this.suspensionFlag = false
          this.data = res.data
          // 初始化better-scroll和悬浮信息
          this.$nextTick(() => {
            this.initH2UpDown()
            this.initScrollInfo()
            this.locationCourse()
//          if (!this.scroll) {
//            this.scroll = new BScroll(this.$refs.detailWrap, {
//              probeType: 3,
//              click: true
//            })
//            this.scroll.on('scroll', (pos) => {
//              this.scrollFn(pos)
//            })
//          } else {
//            this.scroll.refresh()
//          }
            this.bindScrollEvent()
          })
          bus.$emit('loadingFinish')
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 定位点击的course
    locationCourse () {
      let courseCode = bus.getCookie('courseCode')
      console.log(this.data, courseCode)
      let scrollDis = this.$refs[courseCode][0].getBoundingClientRect().top
      let y = scrollDis - 60 * Number(document.documentElement.getAttribute('data-dpr'))
      if (-y < this.ulMaxY) {
        y = -this.ulMaxY
      }
      if (this.isAndroid) {
        this.$refs.detailWrap.scrollTop = y
      } else {
        this.$refs.detailUlWrap.style.transform = 'translateY(' + -y + 'px)'
        this.ulNowY = -y
      }
    },
    initH2UpDown () {
      // 获取所有科目标题的位置，和fixed的上下限制范围，塞到h2UpDown中
      this.h2UpDown = []
      let h2s = document.querySelectorAll('.detail-wrap .subject-wrap h2')
      this.allh2Elements = h2s
      let subjectWraps = document.querySelectorAll('.detail-wrap .subject-wrap')
      const RATIO = Number(document.documentElement.getAttribute('data-dpr'))
      for (let i = 0; i < h2s.length; i++) {
        let obj = {}
        obj.up = h2s[i].getBoundingClientRect().top
        obj.down = subjectWraps[i].getBoundingClientRect().bottom - 50 * RATIO
        obj.pointer = i
        obj.courseName = this.data[i].courseName
        this.h2UpDown.push(obj)
      }
      // 初始化滚动过程中需要判断的一组上下范围值，三个子项
      let courseCode = bus.getCookie('courseCode')
      let nowCourseIndex = 0
      for (let i = 0; i < this.data.length; i++) {
        if (this.data[i].courseCode === courseCode) {
          nowCourseIndex = i
          break
        }
      }
      if (nowCourseIndex === 0) {
        nowCourseIndex = 1
      } else if (nowCourseIndex === this.data.length - 1) {
        nowCourseIndex = this.data.length - 2
      }
      this.h2JudgeUpDown = [this.h2UpDown[nowCourseIndex - 1], this.h2UpDown[nowCourseIndex], this.h2UpDown[nowCourseIndex + 1]]
      console.log(this.h2JudgeUpDown)
    },
    initScrollInfo () {
      // 判定是否为android
      let u = navigator.userAgent
      this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
      // 限定滑动的最大高度
      let ulHeight = this.$refs.detailUlWrap.getBoundingClientRect().height
      this.ulMaxY = -(ulHeight - window.screen.height * Number(document.documentElement.getAttribute('data-dpr')))
    },
    bindScrollEvent () {
      if (this.isAndroid) {
        this.$refs.detailWrap.style.overflowY = 'scroll'
        this.$refs.detailWrap.style.WebkitOverflowScrolling = 'touch'
        this.$refs.detailWrap.addEventListener('scroll', (ev) => {
          this.scrollFn(-this.$refs.detailWrap.scrollTop)
        }, false)
      } else {
        this.$refs.detailWrap.addEventListener('touchstart', (ev) => {
          this.touchStartFn(ev)
        }, false)
        this.$refs.detailWrap.addEventListener('touchmove', (ev) => {
          this.touchMoveFn(ev)
        }, false)
        this.$refs.detailWrap.addEventListener('touchend', (ev) => {
          this.touchEndFn(ev)
        }, false)
      }
    },
    touchStartFn (event) {
      clearInterval(this.bufferInterval)
      this.touchStartY = event.changedTouches[0].pageY
      this.touchStartTime = event.timeStamp
    },
    touchMoveFn (event) {
      let changeY = (event.changedTouches[0].pageY - this.touchStartY)
      let nowY = this.ulNowY + changeY
      if (nowY > 0) nowY = 0
      if (nowY < this.ulMaxY) nowY = this.ulMaxY
      this.$refs.detailUlWrap.style.transform = 'translateY(' + nowY + 'px)'
      this.scrollFn(this.ulNowY + changeY)
      event.preventDefault()
    },
    touchEndFn (event) {
      let touchEndY = event.changedTouches[0].pageY
      let changeY = (touchEndY - this.touchStartY)
      this.ulNowY = this.ulNowY + changeY
      this.touchBufferFn(changeY, event.timeStamp)
    },
    touchBufferFn (changeY, touchEndTime) {
      let timeDisRatio = changeY / (touchEndTime - this.touchStartTime)
      if (timeDisRatio < 0 && timeDisRatio > -1) return
      if (timeDisRatio >= 0 && timeDisRatio < 1) return
      const COF = 0.86
      let step = 100 * timeDisRatio
      this.bufferInterval = setInterval(() => {
        step *= COF
        this.ulNowY += step
        if (Math.abs(step) < 5) {
          clearInterval(this.bufferInterval)
        } else if (this.ulNowY > 0) {
          this.ulNowY = 0
          clearInterval(this.bufferInterval)
        } else if (this.ulNowY < this.ulMaxY) {
          this.ulNowY = this.ulMaxY
          clearInterval(this.bufferInterval)
        }
        this.scrollFn(this.ulNowY)
        this.$refs.detailUlWrap.style.transform = 'translateY(' + this.ulNowY + 'px)'
      }, 1000/60)
    },
    scrollFnTest (pos) {
      console.log(pos)
    },
    scrollFn (pos) {
      let t = -pos
      console.log(this.h2JudgeUpDown)
      for (let i = 0; i < this.h2JudgeUpDown.length; i++) {
        let pointer = this.h2JudgeUpDown[i].pointer
        if (this.h2JudgeUpDown[i].up < t && this.h2JudgeUpDown[i].down > t) {
          if (this.currentSuspensionIndex !== pointer) {
            this.suspensionInnerHTML = this.allh2Elements[pointer].innerHTML
            this.suspensionFlag = true
            this.currentSuspensionIndex = pointer
            if (pointer === 0 ) pointer = 1
            if (pointer === this.data.length) pointer = this.data.length - 2
            this.h2JudgeUpDown = [this.h2UpDown[pointer - 1], this.h2UpDown[pointer], this.h2UpDown[pointer + 1]]
          }
          break
        } else {
          if (this.currentSuspensionIndex === -1) {
            continue
          } else {
            this.suspensionFlag = false
            this.currentSuspensionIndex = -1
          }
        }
      }
    },
    goPositiveAnalysis (subItem) {
      // 正常则返回
      if (['0', '3', '4', '5'].indexOf(subItem.compareValue) !== -1) return
      bus.setCookie('courseCode', subItem.courseCode)
      bus.setCookie('projectCode', subItem.projectCode)
      bus.setCookie('resultCode', subItem.resultCode)
      bus.setCookie('compareValue', subItem.compareValue)

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
  /*overflow-y: scroll;
  -webkit-overflow-scrolling: touch;*/
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
  text-align: center;
  height: 44px;
  line-height: 44px;
  font-size: 32px; /*px*/
  color: #333;
  font-weight: 600;
  background-color: #fff;
  box-sizing: border-box;
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
