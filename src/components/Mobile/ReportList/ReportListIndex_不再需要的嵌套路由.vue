<template>
<div class="list-index-wrap">
  <div class="list-content">
    <router-view
      :reportListData="reportListData"
      @changeBtnNum="changeBtnNum"
      @changeSelected="changeSelected"
      :alertShowFromBtn="alertShow"
      :reportCompareData="reportCompareData"
    >
    </router-view>
  </div>
  <div class="compare-wrap" ref="compareWrap">
    <div class="compare-btn" @click="toggleBtn" v-if="!isBtn">对比</div>
    <div class="compare-btn" @click="btnClickFn" v-if="isBtn" :class="{'num-not-enough': btnNum < 2}">{{btnText}}</div>
  </div>
</div>
</template>

<script>
import { bus } from '@/globalEventBus/bus'
import { empReportList } from '@/fetch/healcareApi'

export default {
  name: 'ReportListIndex',
  data () {
    return {
      btnText: '对比',
      btnNum: 0,
      alertShow: false,
      isBtn: false,
      // 获取到数据，分别对应报告列表页和报告对比页
      reportListData: null,
      reportCompareData: null
    }
  },
  beforeCreate () {
    // bus.$emit('showLoading')
  },
  beforeUpdate () {
    if (window.location.href.indexOf('/reportListIndex/reportCompare') !== -1) {
      this.isBtn = true
    } else {
      this.isBtn = false
    }
  },
  mounted () {
    this.init()
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
              if (res.data[i].reportType === '0') {
                compareDataArr.push(res.data[i])
              }
            }
            this.reportListData = res.data
            this.reportCompareData = compareDataArr
            this.$nextTick(() => {
              console.log('loading')
              bus.$emit('loadingFinish')
            })
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    toggleBtn () {
      this.isBtn = true
      this.$router.push({
        path: '/reportListIndex/reportCompareList'
      })
    },
    changeSelected (selectedArr) {
      // 将选中的信息存入cookie中
      bus.setCookie('compareList', JSON.stringify(selectedArr))
    },
    changeBtnNum (num) {
      this.btnNum = num
      this.btnText = '对比（' + num + '/3）'
    },
    btnClickFn () {
      if (this.btnNum <= 1) {
        this.alertShow = true
        setTimeout(() => {
          this.alertShow = false
        }, 1000)
      } else {
        this.$router.push({
          path: '/reportCompare'
        })
      }
    }
  }
}
</script>

<style scoped>
.list-index-wrap {
  width: 100%;
  height: 100%;
  background-color: #f5f5f7;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.list-content {
  height: calc(100% - 62px);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
.list-index-wrap .compare-wrap {
  height: 60px;
  width: 100%;
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
