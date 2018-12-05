<template id="">
  <div class="report-list-wrap">
    <ul class="report-list-ul-wrap" v-if="list.length>0">
      <li class="list-item blankList-item" @click="goBlank(item.id, item.checkupTime, item.empName, item.hospitalId)" v-for = "item in list">
        <section class="innerContent">
          <h2 class="title">{{item.empName}}全年健康促进方案</h2>
          <p>时间：{{item.checkupTime | daterange}}</p>
          <p>报告编号：{{item.hospitalId}}-{{item.empNo}}-{{item.checkupTime}}</p>
        </section>
        <i class="tagbox">建议复查项：{{item.positiveNum}}项</i>
      </li>
    </ul>
    <div class="nodatbox" v-else>
      <i class="iconfont icon-linedesign-11"></i>
      <h2>暂无数据</h2>
    </div>
  </div>
</template>
<script type="text/javascript">
  import Api from '@/fetch/blankApi'
  export default {
    data () {
      return {
        list: []
      }
    },
    mounted () {
      this.getList()
    },
    methods: {
      async getList () {
        let empNo = bus.getCookie('empNo')
        let params = {
          empNo: empNo
          // empNo: '0065743'
        }
        let res = await Api.getList(params)
        this.list = res.data.items
        bus.$emit('loadingFinish')
      },
      goBlank (id, checkupTime, empName, hospitalId) {
        this.$router.push({
          path: '/blank',
          query: {
            id: id,
            checkupTime: checkupTime,
            empName: empName,
            hospitalCode: hospitalId
          }
      })
      }
    }
  }
</script>
<style media="screen">
.blankList-item{
  /* position: relative; */
}
.tagbox{
  position: absolute;
  background: #03BFEE;
  color: #fff;
  font-size: 10px;
  line-height: 14px;
  padding: 3px 5px;
  display: inline-block;
  font-style: normal;
  right: 0;
  top: 16px
}
.tagbox::before{
    display:block;
    content:'';
    border-width:15px 10px 10px 10px;
    border-style:solid;
    border-color:#03BFEE transparent transparent transparent;
    position:absolute;
    left:-10px;
    top:0;
}
.tagbox::after{
  display:block;
  content:'';
  border-width:10px 10px 15px 10px;
  border-style:solid;
  border-color:transparent transparent #03BFEE transparent;
  position:absolute;
  left:-10px;
  bottom: 0
}
.innerContent{
  padding: 8px 16px
}
.innerContent .title{
  font-size: 14px;
  line-height: 21px;
  color: #333;
  max-width: 220px
}
.innerContent p{
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  line-height: 18px
}
</style>
