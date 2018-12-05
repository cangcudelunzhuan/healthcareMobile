<template>
<div class="list-compare-wrap">
  <div class="list-compare-content-wrap">
    <div class="yellow-tip">
      <p><span class="yellow-bell"></span>仅限对比您的体检报告哦，最多支持三份报告对比哦！</p>
    </div>
    <div class="small-list-wrap">
      <ul>
        <li v-for="(item,index) in data" :key="item.reportNo" @click="selectFn(index)">
          <span class="circle-span" :class="{'is-selected': selectArr[index]}"></span>
          <span class="time-span">{{item.checkupTime}}</span>
          <span class="name-span">{{item.hospitalName}}</span>
        </li>
      </ul>
    </div>
  </div>
  <transition name="fade">
    <div class="error-alert" v-if="alertShow">
      <p>{{alertContent}}</p>
    </div>
  </transition>
  <div class="compare-wrap">
    <div class="compare-btn" @click="goReportCompare($event)" :class="{'num-not-enough': selectNum < 2}">{{btnText}}</div>
  </div>
</div>
</template>

<script>
import { bus } from '@/globalEventBus/bus'
import { empReportList } from '@/fetch/healcareApi'
export default {
  name: 'ReportCompare',
  data () {
    return {
      data: null,
      selectArr: [],
      selectNum: 0,
      alertShow: false,
      alertContent: '请至少选择两份报告'
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    btnText () {
      return '对比（' + this.selectNum + '/3）'
    }
  },
  methods: {
    init () {
      empReportList(bus.getCookie('empNo'))
        .then((res) => {
          if (res.code === 'success') {
            let compareDataArr = []
            for (let i = 0; i < res.data.length; i++) {
              // 更新检查时间为'yyyy-mm-dd'形式
              let checkupTime = res.data[i].checkupTime
              res.data[i].checkupTime = checkupTime.substring(0, 4) + '-' + checkupTime.substring(4, 6) + '-' + checkupTime.substring(6)

              // 限制医院名称hospitalName为16个字符
              if (res.data[i].hospitalName) {
                res.data[i].hospitalName = res.data[i].hospitalName.length > 16 ? res.data[i].hospitalName.substring(0, 16) + '...' : res.data[i].hospitalName
              }

              // 筛除就诊报告单传入比较页
              if (res.data[i].reportType === '1') {
                compareDataArr.push(res.data[i])
              }
            }
            this.data = compareDataArr
            this.initDataRelatedInfo()
            this.$nextTick(() => {
              bus.$emit('loadingFinish')
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 根据数据初始化相关信息
    initDataRelatedInfo () {
      let arr = []
      let selectedFlag = JSON.parse(localStorage.getItem('compareListSelectedFlag'))
      for (let i = 0; i < this.data.length; i++) {
        if (selectedFlag.indexOf(i) !== -1) {
          arr.push(true)
        } else {
          arr.push(false)
        }
      }
      this.selectArr = arr
      // 改变外层btn文字
      this.selectNum = selectedFlag.length
    },
    selectFn (index) {
      if (!this.selectArr[index]) {
        this.selectNum++
        if (this.selectNum >= 4) {
          this.selectNum = 3
          this.alertFn('最多支持三份报告')
          return
        }
      } else {
        this.selectNum--
      }
      this.$set(this.selectArr, index, !this.selectArr[index])
    },
    alertFn (text) {
      this.alertContent = text
      this.alertShow = true
      setTimeout(() => {
        this.alertShow = false
      }, 1000)
    },
    goReportCompare () {
      if (this.selectNum <= 1) {
        this.alertFn('请至少选择两份报告')
      } else {
        // 存储选中的信息
        let selectedArr = []
        let selectedFlag = []
        for (let i = 0; i < this.selectArr.length; i++) {
          if (this.selectArr[i]) {
            selectedFlag.push(i)
            let obj = {}
            obj.hospitalCode = this.data[i].hospitalCode
            obj.checkupTime = this.data[i].checkupTime.split('-').join('')
            selectedArr.push(obj)
          }
        }
        localStorage.setItem('compareListSelectedFlag', JSON.stringify(selectedFlag))
        // 将选中的信息存入cookie中
        bus.setCookie('compareList', JSON.stringify(selectedArr))
        this.$router.push({
          path: '/reportCompare'
        })
      }
    }
  }
}
</script>

<style scoped>
.list-compare-wrap {
  background-color: #f7f7f9;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.list-compare-content-wrap {
  height: calc(100% - 60px);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.yellow-tip p {
  font-size: 24px; /*px*/
  line-height: 42px;
  color: #FFA417;
  text-indent: 16px;
}
.yellow-tip .yellow-bell {
  display: inline-block;
  width: 13px;
  height: 16px;
  background: url(../../../../static/yellow_bell.png) no-repeat;
  background-size: 100%;
  margin-right: 8px;
  vertical-align: middle;
}
.small-list-wrap {
  background-color: #fff;
  font-size: 28px; /*px*/
  line-height: 44px;
  color: #000;
  font-family: PingFangSC;
}
.small-list-wrap li {
  border-bottom: 1px solid #DEDEDE; /*no*/
  height: 44px;
  overflow: hidden;
  position: relative;
  line-height: 44px;
}
.small-list-wrap li .circle-span {
  float: left;
  width: 20px;
  height: 20px;
  border: 1px solid #8E8E8F;
  border-radius: 50%;
  margin: 11px 12px;
  line-height: 20px;
  text-align: center;
  color: #fff;
}
.small-list-wrap li .is-selected {
  background: url(../../../../static/checked_icon.png) no-repeat;
  background-size: 100%;
  border: 1px solid;
}
.small-list-wrap li .time-span {
  float: left;
  height: 44px;
  margin-right: 5px;
}
.small-list-wrap li .name-span {
  position: absolute;
  top: 0;
  left: 135px;
  width: 240px;
  height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.error-alert {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px;
  color: #fff;
  font-size: 28px; /*px*/
  text-align: center;
  line-height: 42px; /*px*/
  background-color: rgba(0,0,0,.75);
  border-radius: 6px;
}
.fade-enter {
  opacity: 1;
}
.fase-enter-active {
  opacity: 1;
}
.fade-leave-active {
  transition: opacity .5s;
}
.fade-leave-to {
  opacity: 0;
}
.compare-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  box-sizing: border-box;
  padding: 10px 8px;
  background-color: #fff;
  box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.05);
}
.compare-wrap .compare-btn {
  display: block;
  width: 359px;
  height: 40px;
  text-align: center;
  font-size: 30px; /*px*/
  line-height: 40px;
  color: #fff;
  border-radius: 4px;
  background: linear-gradient(90deg,
    #03BFEE 0%,
    #1DE9B6 100%
  );
}
.num-not-enough {
  opacity: 0.4;
}
</style>
