<template id="">
  <div class="plistContent">
    <ol :id="parentId + '-'+ indexItem" class="scr">
      <li>
        <h2 class="plTitle">
          <span class="numbox">{{indexItem + 1 +'.'}}</span>
          {{dataItem.title}}
        </h2>
        <dl class="">
          <dt class="dTitlt">医学解释：</dt>
          <dd class="dcontent">{{dataItem.remark}}</dd>
        </dl>
        <dl class="">
          <dt class="dTitlt">常见病因：</dt>
          <dd class="dcontent">
            <p v-for="(p, ip) in dataItem.cause.split('|')">
              <template id="" v-if="dataItem.cause.split('|').length>1">
                {{ip+1}}、
              </template> {{p}}
            </p>
          </dd>
        </dl>
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
