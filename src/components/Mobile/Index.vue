<template>
  <div class="index-page">
    <!-- 轮播暂时用固定的图片替代
    <div class="loop-part">
      <ul class="loop-move" ref="loopMove" @touchstart="loopTouchStartFn($event)" @touchmove="loopTouchMoveFn($event)" @touchend="loopTouchEndFn($event)">
        <li class="loop-item">
          <p class="loop-title">{{data[data.length-1].title}}</p>
          <img :src="data[data.length-1].image" />
        </li>
        <li class="loop-item" v-for="item in data">
          <p class="loop-title">{{item.title}}</p>
          <img :src="item.image" />
        </li>
        <li class="loop-item">
          <p class="loop-title">{{data[0].title}}</p>
          <img :src="data[0].image" />
        </li>
      </ul>
      <div class="loop-dot">
        <span class="dot-wrap" v-for="(dotItem, index) in data" :class="{'active-dot': index == activeDotIndex}"></span>
      </div>
    </div>
    -->
    <div class="loop-replace"></div>
    <div class="big-link">
      <div class="query-report">
        <router-link :to="{ path: '/reportList' }">
          <query-report-icon class="big-icon"></query-report-icon><span>查询报告</span>
        </router-link>
        <div class="has-new-tag" v-if="hasNewFlag"></div>
      </div>
      <div class="promote-plan-index">
        <router-link :to="{ path: '/blankList'}">
          <promote-icon class="big-icon"></promote-icon><span>促进方案</span>
        </router-link>
      </div>
    </div>
    <div class="small-link">
      <div>
        <router-link :to="{ path: '/notOpen'}">
          <appointment-icon class="small-icon"></appointment-icon>
          <span>就医预约</span>
        </router-link>
      </div>
      <div>
        <router-link :to="{ path: '/doctorConsult'}">
          <doctor-query-icon class="small-icon"></doctor-query-icon>
          <span>医生咨询</span>
        </router-link>
      </div>
      <div>
        <router-link :to="{ path: '/notOpen'}">
          <review-remind-icon class="small-icon"></review-remind-icon>
          <span>复查提醒</span>
        </router-link>
      </div>
      <div>
        <router-link :to="{ path: '/notOpen'}">
          <upload-report-icon class="small-icon"></upload-report-icon>
          <span>上传就诊报告单</span>
        </router-link>
      </div>
    </div>
    <div class="health-mall">
      <h4>健康商城</h4>
      <div>
        <img src="../../assets/doctor.jpg" />
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from '@/globalEventBus/bus'
import { getCurrentUser, getBanner, queryNewReportFlag } from '@/fetch/healcareApi'

import QueryReportIcon from '@/assets/SVG/QueryReportSVG'
import PromoteIcon from '@/assets/SVG/PromoteSVG'
import AppointmentIcon from '@/assets/SVG/AppointmentSVG'
import DoctorQueryIcon from '@/assets/SVG/DoctorQuerySVG'
import ReviewRemindIcon from '@/assets/SVG/ReviewRemindSVG'
import UploadReportIcon from '@/assets/SVG/UploadReportSVG'

export default {
  name: 'Index',
  components: {
    QueryReportIcon,
    PromoteIcon,
    AppointmentIcon,
    DoctorQueryIcon,
    ReviewRemindIcon,
    UploadReportIcon
  },
  data () {
    return {
      data: [
        {
          image: '',
          title: ''
        },
        {
          image: '',
          title: ''
        },
        {
          image: '',
          title: ''
        }
      ],
      // banner使用的数据
      loopIndex: 1,
      loopTouchStartX: 0,
      // 两个接口调用完成的标识，都为true是隐藏loading画面
      bannerFlag: false,
      queryNewFlag: false,
      // 查询报告是否有新的标识
      hasNewFlag: false
    }
  },
  computed: {
    activeDotIndex () {
      if (this.loopIndex > this.data.length) {
        return 0
      } else if (this.loopIndex <= 0) {
        return this.data.length - 1
      }
      return this.loopIndex - 1
    }
  },
  mounted () {
    this.init()
  },
  watch: {
    bannerFlag () {
      if (this.bannerFlag && this.queryNewFlag) {
        bus.$emit('loadingFinish')
      }
    },
    queryNewFlag () {
      if (this.bannerFlag && this.queryNewFlag) {
        bus.$emit('loadingFinish')
      }
    }
  },
  methods: {
    init () {
      /*
      // 获取轮播数据
      getBanner()
        .then((res) => {
          if (res.code === 'success') {
            // 标识更改
            this.bannerFlag = true
            // 处理title文字超过15个
            res.data.forEach((item) => {
              if (item.title.length > 15) {
                item.title = item.title.substring(0, 15) + '...'
              }
            })
            this.data = res.data
            this.initLoopStatus()
            this.loopAutoPlay()
          }
        })
        .catch(() => {
        })
      */
      // 获取用户
      getCurrentUser()
        .then((res) => {
          bus.setCookie('empNo', res.data)
          // 获取用户后前端埋点初始化
          bus.countlyUserDetail({
            'name': res.data
          })
          let inf = {
            userId: res.data,
            serviceId: 1003,
            menuName: '幸福千万家首页'
          }
          bus.accessLog(inf)
          bus.$emit('loadingFinish')
          this.queryHasNew()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 查询是否有新报告
    queryHasNew () {
      let empNo = bus.getCookie('empNo')
      queryNewReportFlag(empNo)
        .then((res) => {
          if (res.code === 'success') {
            this.queryNewFlag = true
            if (res.data > 0) {
              this.hasNewFlag = true
            } else {
              this.hasNewFlag = false
            }
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    initLoopStatus () {
      let len = this.data.length
      this.loopIndex = 1
      this.$refs.loopMove.style.width = (len + 2) * 10 + 'rem'
    },
    loopAutoPlay () {
      clearInterval(this.autoPlay)
      let loopMove = this.$refs.loopMove
      this.autoPlay = setInterval(() => {
        loopMove.style.transition = '0.3s'
        this.loopIndex++
        loopMove.style.transform = loopMove.style.WebkitTransform = 'translateX(-' + this.loopIndex * 10 + 'rem)'
        setTimeout(() => {
          if (this.loopIndex > this.data.length) {
            this.loopIndex = 1
            loopMove.style.transition = 'none'
            loopMove.style.transform = loopMove.style.WebkitTransform = 'translateX(-10rem)'
          }
        }, 350)
      }, 3000)
    },
    loopTouchStartFn (event) {
      clearInterval(this.autoPlay)
      this.$refs.loopMove.style.transition = 'none'
      this.loopTouchStartX = event.changedTouches[0].pageX
    },
    loopTouchMoveFn (event) {
      let nowX = event.changedTouches[0].pageX
      let changeX = (nowX - this.loopTouchStartX) / 37.5
      let translatXValue = -10 * this.loopIndex + changeX
      this.$refs.loopMove.style.transform = this.$refs.loopMove.style.WebkitTransform = 'translate(' + translatXValue + 'rem)'
    },
    loopTouchEndFn (event) {
      let loopMove = this.$refs.loopMove
      let nowX = event.changedTouches[0].pageX
      let changeX = (nowX - this.loopTouchStartX) / 37.5
      if (changeX < -3) {
        this.loopIndex++
      } else if (changeX > 3) {
        this.loopIndex--
      }
      loopMove.style.transition = '0.2s'
      loopMove.style.transform = loopMove.style.WebkitTransform = 'translateX(-' + this.loopIndex * 10 + 'rem)'
      setTimeout(() => {
        if (this.loopIndex > this.data.length) {
          this.loopIndex = 1
          loopMove.style.transition = 'none'
          loopMove.style.transform = loopMove.style.WebkitTransform = 'translateX(-10rem)'
        } else if (this.loopIndex <= 0) {
          this.loopIndex = this.data.length
          loopMove.style.transition = 'none'
          loopMove.style.transform = loopMove.style.WebkitTransform = 'translateX(-' + 10 * this.loopIndex + 'rem)'
        }
        this.loopAutoPlay()
      }, 210)
    }
  }
}
</script>

<style scoped>
  .index-page {
    background-color: #f7f7f9;
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .loop-part {
    position: relative;
    width: 375px;
    height: 180px;
    overflow: hidden;
  }
  .loop-part .loop-move {
    transform: translateX(-10rem);
    height: 180px;
  }
  .loop-move .loop-item {
    float: left;
    position: relative;
  }
  .loop-item img {
    width: 375px;
    height: 180px;
  }
  .loop-title {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    color: #fff;
    height: 40px;
    line-height: 40px;
    font-size: 32px; /*px*/
    color: #fff;
    font-family: PingFangSC-Semibold '宋体';
    background: linear-gradient(0deg,
      #000 0,
      rgba(0,0,0,.5) 50%,
      rgba(0,0,0,0) 100%
    );
    text-indent: 16px;
  }
  .loop-part .loop-dot {
    position: absolute;
    right: 10px;
    bottom: 0;
    height: 40px;
  }
  .loop-dot span {
    display: inline-block;
    float: left;
    width: 8px;
    height: 8px;
    background-color: #FFF;
    border-radius: 50%;
    margin: 16px 4px;
  }
  .loop-dot .active-dot {
    background-color: #25DEDE;
  }
  .loop-replace {
    height: 220px;
    background: #f7f7f9 url(../../../static/loopReplace.png) no-repeat;
    background-size: 100%;
  }
  .big-link {
    height: 100px;
    background-color: #fff;
    margin-bottom: 10px;
  }
  .big-link>div {
    float: left;
    width: 50%;
    /*height: 100%;*/
    box-sizing: border-box;
    position: relative;
  }
  .big-link .query-report {
    border-right: 2px solid #f7f7f9; /*no*/
    position: relative;
  }
  .query-report .has-new-tag {
    position: absolute;
    right: 10px;
    top: 20px;
    width: 15px;
    height: 10px;
    background: #fff url(../../../static/new_tag.png) no-repeat;
    background-size: 100%;
  }
  .big-link a {
    display: block;
    height: 100%;
    line-height: 100px;
    font-size: 32px; /*px*/
  }
  .big-link .big-icon {
    vertical-align: middle;
    width: 52px;
    height: 52px;
  }
  .big-link .big-icon~span {
    display: inline-block;
    margin-left: 11px;
  }
  .index-page a {
    color: #515152;
    text-align: center;
  }
  .small-link {
    height: 128px;
    display: -webkit-box;
    display: flex;
    margin-bottom: 10px;
  }
  .small-link>div {
    width: 25%;
    height: 100%;
    background-color: #fff;
  }
  .small-link a {
    display: block;
    overflow: hidden;
    height: 100%;
    width: 100%;
  }
  .small-link .small-icon {
    display: block;
    width: 36px;
    height: 36px;
    margin: 24px 0 6px 29px;
  }
  .small-link span {
    font-size: 28px; /*px*/
    line-height: 42px; /*px*/
    text-align: center;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .health-mall {
    height: 167.5px;
    padding-top: 40px;
    background-color: #fff;
    position: relative;
  }
  .health-mall h4 {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99;
    text-align: left;
    box-shadow: 0 1px 0 0 #EAEAEA;
    font-size: 28px; /*px*/
    line-height: 40px;
    font-family: PingFangSC;
    text-indent: 16px;
  }
  .health-mall img {
    width: 100%;
    height: 167.5px;
  }
</style>
