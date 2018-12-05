<template id="">
      <vue-drawer-layout
          ref="drawerLayout" :content-drawable="true" :z-index="1" @mask-click="hand">
          <div class="drawer" slot="drawer">
            <LeftNav :data="storage"></LeftNav>
          </div>
          <div class="drawercontent report-list-wrap" slot="content" @click="hand">
            <div  class="planBox report-list-ul-wrap">
              <section class="planItem" v-for="nav in storage">
                <div class="planItemTit">
                  <div class="itemLeft">
                    <i class="iconfont" :class="nav.iconClass"></i>
                    <span class="scr" :id="nav.id">{{nav.title}}</span>
                  </div>
                </div>
                <div class="content">
                  <template id="" v-if="nav.id ==='1'">
                    <ptable :data="nav.data" v-if="nav.data" :parent="nav.id" ></ptable>
                  </template>
                  <template id="" v-else-if="nav.id ==='2'">
                    <plist :index="index"
                     :data="item"
                     :parent="nav.id"
                     v-for = "(item,index) in nav.data"></plist>
                  </template>
                  <template id="" v-else-if="nav.id ==='5'">
                    <p class="dcontent" style="margin-top:26px" v-if="nav.data[0].templete">{{nav.data[0].templete}}</p>
                    <mess  :index="index"
                     :data="item"
                     :parent="nav.id"
                     v-for = "(item,index) in nav.data"></mess>
                  </template>
                  <template id="" v-else>
                    <scheme  :index="index"
                     :data="item"
                     :parent="nav.id"
                     v-for = "(item, index) in nav.children"></scheme>
                  </template>
                </div>
              </section>
            </div>
          </div>
      </vue-drawer-layout>
</template>
<script type="text/javascript">
  import ptable from '@/components/Mobile/planDetail/planTable'
  import plist from '@/components/Mobile/planDetail/plist'
  import LeftNav from '@/components/Mobile/planDetail/LeftNav'
  import scheme from '@/components/Mobile/planDetail/scheme'
  import mess from '@/components/Mobile/planDetail/mess'
  import Api from '@/fetch/blankApi'
  import $ from 'jquery'
  export default {
    provide () {
      return {
        goaction: this.goaction
      }
    },
    components: {
      ptable,
      plist,
      LeftNav,
      scheme,
      mess
    },
    data () {
      return {
        tableData: null,
        storage: [],
        positiveList: null,
        healthList: null,
        healthDietSchemeList: null,
        reexList: null
      }
    },
    computed: {
      navData () {
        return this.storage
      }
    },
    mounted () {
      let vm = this
      let schemeId = this.$route.query.schemeId
      let checkupTime = this.$route.query.checkupTime
      vm.storage = JSON.parse(sessionStorage.getItem('navList'))
      bus.$emit('loadingFinish')
      let defaultScr = this.$route.query.scr
      vm.$nextTick(()=>{
        if (defaultScr) {
          vm.scr(defaultScr.toString())
        }
      })
      // vm.getDatas(schemeId, checkupTime)
    },
    methods: {
      hand () {
        this.$refs.drawerLayout.toggle()
      },
      goaction (id) {
        this.hand()
        this.scr(id)
      },
      scr (id) {
        $('.scr').each((i,item) => {
          let ids = $(item).attr('id')
          if (id === ids) {
            let scrT = $(".planBox").scrollTop()
            let h = $(item).offset().top + scrT - 20
            $('.planBox').animate({scrollTop: h +'px'}, 10)
          }
        })
      }
    }
  }
</script>
<style scoped>
  .planBox{
    padding-top: 10px
  }
  .planItem{
    margin-bottom: 10px;
    background: #fff;
    padding: 0 0 16px 16px;
  }
  .planItemTit{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 17px;
    color: #000;
    position: relative;
    padding: 15px 0;
    height: 26px;
    line-height: 20px
  }
  .planItemTit::after{
    position: absolute;
    width: 200%;
    bottom: 0;
    right: -50%;
    height: 1px;
    background: #dedede;
    transform: scale(0.5);
    content: ''
  }
  .planItemTit .itemLeft{
    display: flex;
    align-items: center;
  }
  .planItemTit i {
      position: relative;
      background-image: -webkit-gradient(linear, 0 0, right bottom, from(#03BFEE), to(#1DE9B6));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-right: 16px;
      font-size: 20px;
  }
  .content .plistContent{
    padding-right: 16px
  }
  .drawercontent{
    /* overflow-y: scroll; */
    height: 100%
  }
  .drawer{
    height: 100%
  }
</style>
