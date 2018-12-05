<template id="">
  <div class="plistContent">
    <ol :id="parentId + '-'+ indexItem" class="scr">
        <h2 class="plTitle">
          <span class="numbox">({{indexItem + 1|formatNum}})</span>
          {{dataItem.title}}
        </h2>
        <p class="dcontent" v-if="dataItem.data[0].templete">{{dataItem.data[0].templete}}</p>
        <template id="" v-for="(list, lindex) in dataItem.data">
          <h2 class="plTitle scr" :id="parentId + '-'+ indexItem + '-' + lindex">
            <span class="numbox">{{lindex + 1 +'.'}}</span>
            {{list.title}}
          </h2>
          <p class="dcontent" v-for="(re, rein) in list.remark.split('|')" v-html="re">
          </p>
        </template>
      </li>
    </ol>
  </div>
</template>
<script type="text/javascript">
  export default {
    props: ['data', 'index', 'parent'],
    data () {
      return {
      }
    },
    computed: {
      dataItem () {
        return this.data
      },
      indexItem () {
        return this.index
      },
      parentId () {
        return this.parent
      }
    }
  }
</script>
