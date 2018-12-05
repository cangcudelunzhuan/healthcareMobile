<template id="">
  <div class="plantBox">
    <section>
      <div class="inputContent">
        <input type="text" name="" placeholder="输入搜索信息" v-model="searchV">
        <i class="iconfont icon-sousuo"></i>
      </div>
      <div class="titleBox">
        <span class="iconbox">
          <promote-icon class="promote-icon"></promote-icon>
        </span>
        <div class="titleBoxRight">
          <h2>{{empName}}的全年促进方案</h2>
          <p>{{checkupTime|daterange}}</p>
        </div>
      </div>
    </section>
    <div class="navboxs" :style="{height: navh + 'px'}">
      <navOl :data="item" :index="index"  v-for="(item, index) in navData" :active="activeArr" ></navOl>
    </div>
  </div>
</template>
<script type="text/javascript">
  import PromoteIcon from '@/assets/SVG/PromoteSVG.vue'
  import navOl from '@/components/Mobile/planDetail/navOl'
  import $ from 'jquery'
  export default {
    props: ['data'],
    components: {
      PromoteIcon,
      navOl
    },
    mounted () {
      this.checkupTime = this.$route.query.checkupTime
      this.empName = this.$route.query.empName
      let vm = this
      this.$nextTick(() => {
        let winHeight = $(window).height()
        let el = $('.navboxs')
        vm.navh = winHeight - el.offset().top
      })
    },
    data () {
      return {
        checkupTime:'',
        empName:'',
        searchV: '',
        activeArr: [],
        navh: 0
      }
    },
    computed: {
      navData () {
        return this.data
      }
    },
    watch: {
      searchV (val, old) {
        let vm = this
        vm.activeArr = []
        let v = val.replace(/\s+/g,"")
        if (v) {
          vm.getActiveId(vm.navData||[], v, vm.activeArr)
        }
        // var _body = document.getElementsByTagName('body')[0]
        // _body.style.height= _body.clientHeight + "px"
        let winHeight = $(window).height()
        $(window).resize(function() {
          var thisHeight = $(this).height()
          var keyboardHeight = thisHeight - winHeight
          $(".plantBox").css({ 'bottom': keyboardHeight + 'px' })
        })
        vm.scrollActive(vm.activeArr[0]||'1')
      }
    },
    methods: {
      getActiveId (data, val, arr) {
        let vm = this
        data.map((item, i) => {
          if (item.title.indexOf(val) !== -1) {
            arr.push(item.id)
          }
          if (item.children) {
            vm.getActiveId (item.children, val, arr)
          }
        })
      },
      scrollActive (id) {
        if (!id) {
          return
        }
        $('.lefScr').each((i, item) => {
          let ids = $(item).attr('id')
          if (ids === id) {
            let el = $(".navboxs")
            let nh = el.scrollTop()
            let navh = el.height()
            let scrH = el.prop("scrollHeight")
            let itemTop = $(item).offset().top
            let navOffTop = el.offset().top
            let h = itemTop - navOffTop + nh
            el.animate({scrollTop: h +'px'}, 50)
          }
        })
      }
    }
  }
</script>
<style media="screen">
  .plantBox{
    padding-left: 16px;
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
  .inputContent{
    flex: 1;
    position: relative;
    padding-right: 16px;
    padding-top: 16px
  }
  .inputContent i {
    position: absolute;
    top: 13px;
    bottom: 0;
    margin: auto 0;
    display: block;
    right: 23px;
    font-size: 16px;
    line-height: 16px;
    height: 16px
  }
  .inputContent input{
    background: rgba(142,142,147,0.12);
    border-radius: 4px;
    color: #8E8E93;
    font-size: 17px;
    line-height: 22px;
    padding: 7px;
    width: 100%;
  }
  input, textarea{
    -webkit-user-select: auto!important;
    -khtml-user-select: auto!important;
    -moz-user-select: auto!important;
    -ms-user-select: auto!important;
    -o-user-select: auto!important;
    user-select: auto!important;
  }
  .iconbox{
    width: 64px;
    height: 64px;
    box-shadow: 0 0 16px 0 rgba(0,0,0,0.08);
    border-radius: 50%;
    text-align: center;
    display: inline-block;
  }
  .iconbox .promote-icon{
    margin-left: 0
  }
  .titleBox{
    padding: 18px 16px 18px 0;
    display: flex;
    align-items: center;
  }
  .titleBoxRight{
    margin-left: 16px
  }
  .titleBoxRight h2{
    font-size: 14px;
    color: #333;
    line-height: 14px
  }
  .titleBoxRight p{
    font-size: 14px;
    color: #666;
    line-height: 27px;
    margin-top: 12px
  }
  .titList h2{
    font-size: 14px;
    line-height: 25px;
    padding: 10px 0 8px 0;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
  .titList>li>h2{
    position: relative;
  }
  .titList>li>h2::after{
    width: 200%;
    height: 1px;
    background: #dedede;
    transform: scale(0.5);
    position: absolute;
    content: '';
    right: -50%;
    bottom: 0
  }
  .titList>li>ol{
    margin-left: 32px
  }
  .titList>li>ol>li>ol{
    margin-left: 42px
  }
  .navboxs{
    /* width: 100%; */
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    /* height: calc(100% - 170px); */
    padding-bottom: 16px;
    height: 300px
  }
</style>
