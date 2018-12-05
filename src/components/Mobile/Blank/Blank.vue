<template>
<div class="report-overview-wrap">
  <div class="overview-inner-wrap">
    <div class="base-content" style="height:auto;position:relative">
      <img src="static/plan/docters.svg" alt=""  class="docter">
      <p class="namebox">{{empName}}</p>
      <div class="plan-content">
        <p style="text-indent:2em;margin-bottom:16px">{{templete}}</p>
        <p v-for="(r, i) in remark.split('|')">
          <template id="" v-if="remark.split('|').length>1">
            {{i+1+'、'}}
          </template>
          {{r}}
        </p>
      </div>
    </div>
    <div class="result-content"  v-if="navList.length>0">
      <h3 class="result-title">促进方案内容</h3>
      <ul >
        <template id="" v-for="(item, index) in navList">
          <li  class="result-item" @click="goPlan(item.id)"  v-if="item.id!=='3'">
            <p>
              <span class="result-icon">
                <i class="iconfont" :class="item.iconClass"></i>
              </span>
              <span class="result-name">{{item.title}}</span>
              <span class="result-arrow"></span>
            </p>
          </li>
          <template id="" v-else v-for="(child, cindex) in item.children">
            <li class="result-item" @click="goPlan(child.id)" v-if="child.show==='0'">
              <p>
                <span class="result-icon">
                  <i class="iconfont" :class="child.iconClass"></i>
                </span>
                <span class="result-name">{{child.title}}</span>
                <span class="result-arrow"></span>
              </p>
            </li>
          </template>
        </template>
      </ul>
    </div>
    <div class="promote-plan" >
      <div class="promote-link" @click="goreport">
        <promote-icon class="promote-icon"></promote-icon>
        <span class="promote-text">体检报告</span>
        <span class="result-arrow"></span>
      </div>
    </div>
  </div>
</div>
</template>
<script type="text/javascript">
  import PromoteIcon from '@/assets/SVG/PromoteSVG.vue'
  import Api from '@/fetch/blankApi'
  import formats from '@/globalEventBus/formatNum'
  export default {
    components: {
      PromoteIcon
    },
    data () {
      return {
        empName: '',
        remark: '',
        templete: '',
        navList: [
          // {
          //   title: 'X年(x次)体检阳性指标说明',
          //   iconUrl: 'icon-xieniandu',
          //   id: '1'
          // },
          // {
          //   title: 'x年体检阳性指标解释、病因',
          //   iconUrl: 'icon-xieniandu',
          //   id: '2'
          // },
          // {
          //   title: '医生专家定制的健康法促进方案',
          //   iconUrl: 'icon-dingzhifangan',
          //   id: '3'
          // },
          // {
          //   title: '营养饮食促进方案',
          //   iconUrl: 'icon-yinshifangan',
          //   id: '4'
          // },
          // {
          //   title: '阳性指标复查时间安排',
          //   iconUrl: 'icon-riqi',
          //   id: '5'
          // }
        ],
        tableData: [],
        positiveList: [],
        healthList: [],
        healthDietSchemeList: [],
        reexList: []
      }
    },
    mounted () {
      let id = this.$route.query.id
      let checkupTime = this.$route.query.checkupTime
      this.empName = this.$route.query.empName
      this.getall(id, checkupTime)
      // this.compareReport(id, checkupTime)
    },
    methods: {
      goPlan (scr) {
        this.$router.push({
          path: '/planDetail',
          query: {
            scr:scr,
            schemeId: this.$route.query.id,
            checkupTime: this.$route.query.checkupTime,
            empName: this.$route.query.empName
          }
        })
      },
      async getall (schemeId, checkupTime) {
        let vm = this
        let str = null
        if (checkupTime.indexOf('-') !== -1) {
          let reg = new RegExp('-',"g")
          str = checkupTime.replace(reg, '')
        }
        let empNo = bus.getCookie('empNo')
        let params = {
          schemeId: schemeId,
          empNo: empNo,
          checkupTime: str || checkupTime
        }
        try {
          let [
            res,
            compare,
            positiveIndex,
            healthWellnessScheme,
            healthDietScheme,
            Message
          ] = await Promise.all([
            Api.healthCareSummary(schemeId),
            Api.compareReport(params),
            Api.positiveIndex(params),
            Api.healthWellnessScheme(params),
            Api.healthDietScheme(params),
            Api.reexaminationMessage(params)
          ])
          // let res = await Api.healthCareSummary(schemeId)
          this.remark = res.data ? res.data.remark : ''
          this.templete = res.data ? res.data.templete : ''
          // let compare = await Api.compareReport(params)
          let timeArr = compare.data.checkupTime || []
          let compareTitle = vm.getcompareTitle(timeArr)
          let ye = checkupTime.substr(0, 4)
          // 阳性指标说明
          vm.tableData = compare.data
          // 阳性指标解释、病因
          // let positiveIndex = await Api.positiveIndex(params)
          vm.positiveList = positiveIndex.data
          // 健康促进方案
          // let healthWellnessScheme = await Api.healthWellnessScheme(params)
          vm.healthList = healthWellnessScheme.data
          // 营养饮食保健方案
          // let healthDietScheme = await Api.healthDietScheme(params)
          vm.healthDietSchemeList = healthDietScheme.data
          // 复查时间-消息明细
          // let Message = await Api.reexaminationMessage(params)
          vm.reexList = Message.data
          let nav = vm.getNavdata(compareTitle, ye)
          vm.navList = nav
          sessionStorage.setItem('navList', JSON.stringify(nav))
          bus.$emit('loadingFinish')
        } catch (e) {
          bus.$emit('loadingFinish')
        }
      },
      getNavdata (compareTitle, ye) {
        let vm = this
        let navdata = [{
          id: '1',
          title: `${compareTitle}`,
          iconClass: 'icon-shuoming',
          data:this.tableData,
          children: vm.compareTree(vm.tableData.courses||[], '1'),
          show: vm.tableData.hospitals ? '0' : '1'
        },{
          id: '2',
          title: `${ye}年体检阳性指标解释、病因`,
          iconClass: 'icon-jieshibingyin',
          data:this.positiveList,
          children: vm.compareTreeTit(vm.positiveList||[], '2'),
          show: vm.positiveList.length > 0 ? '0' : '1'
        },{
          id: '3',
          title: '全年健康促进方案',
          iconClass: 'icon-dingzhifangan',
          data: [],
          // children: vm.compareTreeTit(vm.healthList||[], '3'),
          children: [
            {
              id: '3-0',
              title: '医生专家制定的健康促进方案',
              data: vm.healthList,
              iconClass: 'icon-dingzhifangan',
              children: vm.compareTreeTit(vm.healthList || [], '3-0'),
              show: vm.healthList.length > 0 ? '0' : '1'
            }, {
              id: '3-1',
              title: '营养饮食方案',
              data: vm.healthDietSchemeList,
              iconClass: 'icon-yinshifangan',
              children: vm.compareTreeTit(vm.healthDietSchemeList|| [], '3-1'),
              show: vm.healthDietSchemeList.length > 0 ? '0' : '1'
            }
          ],
          show: (vm.healthList.length > 0 || vm.healthDietSchemeList.length > 0) ? '0' : '1'
        },{
          id: '5',
          title: '阳性指标复查时间安排',
          iconClass: 'icon-riqi',
          data: this.reexList,
          children: vm.compareTreeTit(vm.reexList||[], '5'),
          show: vm.reexList.length > 0 ? '0' : '1'
        }]
        let nav = navdata.filter(item => item.show === '0' )
        nav.map((item, i) => {
          if (item.id === '3') {
            let c = item.children.filter(child => child.show === '0')
            nav[i].children = c
          }
        })
        return nav
      },
      compareTree (data, id) {
        let children = []
        data.map((item, i) => {
          if (item.projects) {
            item.projects.map((pro, ins) => {
              children.push({
                title: pro.projectName,
                id: `${id}-${i}-${ins}`
              })
            })
          }
        })
        return children
      },
      goreport () {
        bus.setCookie('hospitalCode', this.$route.query.hospitalCode)
        bus.setCookie('checkupTime', this.$route.query.checkupTime)
        this.$router.push({path:'/reportOverview'})
      },
      compareTreeTit (data, id) {
        let children = []
        data.map((item, ins) => {
          children.push({
            title: item.title,
            id: `${id}-${ins}`
          })
        })
        return children
      },
      getcompareTitle (timeArr) {
        let sum = []
        let y
        let yN
        // 去重排序求最大最小值差 转中文
        if (timeArr.length > 0 ) {
          let yArr = []
          timeArr.map((item, i) => {
            yArr.push(parseInt(item.substr(0, 4)))
          })
          sum = [...new Set(yArr)]
          sum.sort((a,b)=>{return a-b})
          y = formats.SectionToChinese(sum[sum.length-1] - sum[0] + 1)
          yN = formats.SectionToChinese(timeArr.length)
          let sumY = Array.from(sum, (x) => `${x}年`)
          return `${y}年(${yN}次)体检阳性指标说明(${sumY.join(',')})`
        } else {
          return `一年(零次)体检阳性指标说明`
        }
      }
    }
  }
</script>
<style scoped>
.docter{
  position:relative;
  display: block;
  width: calc(100% + 32px);
  margin: -16px 0 24px -16px
}
.plan-content p{
  font-size:16px;
  line-height:32px;
  color:#333;
}
.namebox{
  position: absolute;
  left: 50px;
  top: 66px;
  font-size: 18px;
  color: #0BCCDD
}
</style>
