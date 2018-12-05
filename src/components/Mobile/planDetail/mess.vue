<template id="">
  <div class="plistContent">
    <ol :id="parentId + '-'+ indexItem" class="scr">
      <li>
        <div class="messcontent">
          <span>{{indexItem + 1 +'.'}}</span>
          <span>
            {{dataItem.reexaminationTime}}
            <em class="dcontent">{{dataItem.title}}</em>
          </span>
        </div>
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
