<template>
<div class="compare-list-wrap" ref="compareListWrap" style="background-color: #F7F7F9;">
  <ul class="ul-wrap">
    <li class="project-wrap" v-for="(project, index) in data.courses" :key="project.couseCode">
      <h2 class="project-title">
        <span class="project-icon"><i class="iconfont" :class="project.iconUrl"></i></span>
        <span class="title-content"> {{project.courseName}}</span>
      </h2>
      <div class="suspension-date">
        <div
          v-for="date in data.checkupTime"
          :key="date"
          class="date-box"
          :class="{'width2': data.checkupTime.length == 2, 'width3': data.checkupTime.length == 3}"
        >
        {{date.substring(2,4)}}-{{date.substring(4,6)}}-{{date.substring(6)}}
        </div>
      </div>
      <div class="whole-items-wrap">
        <div class="item-wrap" v-for="item in project.projects">
          <h3>{{item.projectName}}</h3>
          <div class="item-content-wrap">
            <p
              v-for="subItem in item.dateProjects"
              :key="subItem.id"
              class="subItem-content"
              :class="{'width2': data.checkupTime.length == 2, 'width3': data.checkupTime.length == 3}"
              >
                <!--数值和阴阳类型数据-->
                <span v-if="subItem.compareValue == '0' || subItem.compareValue == '1' || subItem.compareValue == '2' || subItem.compareValue == '5' || subItem.compareValue == '6'">
                  <span
                    class="content-span"
                    :class="{'text-red': subItem.compareValue == 1 || subItem.compareValue == 2 || subItem.compareValue == 6, 'text-num': !isNaN(Number(subItem.result))}"
                    >{{subItem.result}}
                      <up-arrow-icon class="num-icon" v-if="subItem.compareValue == 1"></up-arrow-icon>
                      <down-arrow-icon class="num-icon" v-if="subItem.compareValue == 2"></down-arrow-icon>
                    </span>
                  <span class="unit-span">{{subItem.referenceUnit}}</span>
                </span>
                <!--文字型数据有可能出现多条用“|”隔开的情况，劈开之后再循环-->
                <span v-if="subItem.compareValue == '3' || subItem.compareValue == '4'">
                  <em 
                    class="text-content-wrap"
                    :class="{'text-red': subItem.compareValue == '4'}"
                    v-for="(emContent,index) in subItem.result.split('|')"
                    >
                    <b v-if="subItem.result.split('|').length != 1">{{sortNum[index]}}</b>{{emContent}}
                  </em>
                </span>
            </p>
          </div>
        </div>
      </div>
    </li>
  </ul>
  <div class="suspension-part" v-if="suspensionFlag">
    <p class="suspension-title">
      <span class="suspension-icon"><i class="iconfont" :class="suspensionIcon"></i></span>
      <span class="title-content"> {{suspensionTitle}}</span>
    </p>
    <div class="suspension-date">
      <div
        v-for="date in data.checkupTime"
        :key="date"
        class="date-box"
        :class="{'width2': data.checkupTime.length == 2, 'width3': data.checkupTime.length == 3}"
      >
      {{date.substring(2,4)}}-{{date.substring(4,6)}}-{{date.substring(6)}}
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { bus } from '@/globalEventBus/bus'
import { reportCompare } from '@/fetch/healcareApi'

import UpArrowIcon from '@/assets/SVG/UpArrowSVG.vue'
import DownArrowIcon from '@/assets/SVG/DownArrowSVG.vue'

import BScroll from 'better-scroll'
export default {
  name: 'ReportCompare',
  components: {
    UpArrowIcon,
    DownArrowIcon
  },
  data () {
    return {
      // 每个日期wrap的出现的上下范围
      dateUpDown: [],
      data: {
        checkupTime: [],
        courses: []
      },
      // 存储better-scroll对象
      scroll: null,
      // 每个日期wrap是否悬浮的标记，用来绑定class=suspension
      suspensionFlag: false,
      currentSuspensionIndex: -1,
      suspensionIcon: 'icon-yibanxiangmujiancha',
      suspensionTitle: '一般检查',
      // 文字序号
      sortNum: ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩', '⑪', '⑫', '⑬', '⑭', '⑮', '⑯', '⑰', '⑱', '⑲', '⑳']
    }
  },
  created () {
    this.init()
  },
  mounted () {
  },
  methods: {
    init () {
      let compareList = bus.getCookie('compareList')
      let empNo = bus.getCookie('empNo')
      reportCompare(compareList, empNo)
        .then((res) => {
          if (res.code === 'success') {
            // 整理数据
            this.data = res.data
            this.$nextTick(() => {
              this.initDateUpDown()
              if (!this.scroll) {
                this.scroll = new BScroll(this.$refs.compareListWrap, {
                  probeType: 3
                })
                this.scroll.on('scroll', (pos) => {
                  this.scrollFn(pos)
                })
              } else {
                this.scroll.refresh()
              }
            })
            bus.$emit('loadingFinish')
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    initDateUpDown () {
      // 获取所有日期盒子的位置，和fixed的上下限制范围，塞到dateUpDown中
      this.dateUpDown = []
      let h2s = document.querySelectorAll('.project-wrap .suspension-date')
      let subjectWraps = document.querySelectorAll('.compare-list-wrap .project-wrap')
      const RATIO = Number(document.documentElement.getAttribute('data-dpr'))
      for (let i = 0; i < h2s.length; i++) {
        let obj = {}
        obj.up = h2s[i].getBoundingClientRect().top - 44 * RATIO
        obj.down = subjectWraps[i].getBoundingClientRect().bottom - 213 * RATIO
        this.dateUpDown.push(obj)
      }
    },
    scrollFn (pos) {
      let t = -pos.y
      for (let i = 0; i < this.dateUpDown.length; i++) {
        if (this.dateUpDown[i].up < t && this.dateUpDown[i].down > t) {
          if (this.currentSuspensionIndex === i) {
            break
          } else {
            this.currentSuspensionIndex = i
            this.suspensionIcon = this.data.courses[i].iconUrl
            this.suspensionTitle = this.data.courses[i].courseName
            this.suspensionFlag = true
            break
          }
        } else {
          if (this.currentSuspensionIndex === -1) {
            continue
          } else {
            this.suspensionFlag = false
            this.currentSuspensionIndex = -1
          }
        }
      }
    }
  }
}
</script>

<style scoped>
.compare-list-wrap {
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  background-color: #F7F7F9;
  color: #333;
  font-family: "PingFangSC-Regular";
}
.ul-wrap {
  background-color: #f7f7f9;
}
.project-wrap {
  background-color: #fff;
  position: relative;
  margin-bottom: 10px;
}
.project-title {
  height: 44px;
  color: #000;
  font-size: 34px; /*px*/
  font-weight: normal;
  line-height: 44px;
  border-bottom: 1px solid #eee; /*no*/
  overflow: hidden;
}
.project-title .project-icon,
.suspension-part .suspension-icon {
  display: inline-block;
  vertical-align: middle;
  margin: 0 12px 0 17px;
}
.project-title .project-icon .iconfont {
  font-size: 48px; /*px*/
  line-height: 48px; /*px*/
}
.suspension-date {
  height: 44px;
  width: 100%;
  background: #fff;
}
.suspension-date:after {
  content: '';
  display: block;
  clear: both;
}
.date-box {
  float: left;
  text-align: center;
  font-size: 28px; /*px*/
  line-height: 44px;
  height: 100%;
  background-color: #fff;
}
.item-wrap {
  border-top: 1px solid #eee; /*no*/
}
.item-wrap h3 {
  font-size: 28px; /*px*/
  line-height: 44px;
  height: 44px;
  text-indent: 16px;
  font-weight: normal;
}
.item-content-wrap {
  vertical-align: middle;
}
.item-content-wrap:after {
  content: '';
  display: block;
  clear: both;
}
.subItem-content {
  box-sizing: border-box;
  padding: 16px 8px;
  text-align: center;
  float: left;
  vertical-align: middle;
  font-size: 0;
}
.subItem-content span {
  font-size: 30px; /*px*/
  line-height: 42px; /*px*/
  display: inline-block;
}
.subItem-content .text-content-wrap {
  display: inline-block;
  text-align: center;
  width: 110px;
}
.subItem-content .text-content-wrap b {
  font-weight: normal;
}
.subItem-content .num-icon {
  width: 10px;
  height: 12px;
}
.subItem-content .unit-span {
  display: block;
  color: #999;
  font-size: 24px; /*px*/
}
.subItem-content .text-red {
  color: #FA476F;
}
.subItem-content .text-num {
  font-size: 36px; /*px*/
}
.width2 {
  width: 50%;
}
.width3 {
  width: 33%;
}
.suspension-part {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 99;
  box-shadow: 0 0 16px 0 rgba(0,0,0,0.05);
  background-color: #fff;
  color: #000;
  font-size: 34px; /*px*/
  font-weight: normal;
  line-height: 44px;
}
.suspension-title {
  height: 44px;
  overflow: hidden;
}
.suspension-part .suspension-icon .iconfont {
  font-size: 48px; /*px*/
  line-height: 48px; /*px*/
}
</style>
