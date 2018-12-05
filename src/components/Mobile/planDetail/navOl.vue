<template id="">
  <ol class="titList">
    <li v-if="!itemdata.children" class="lefScr" :id="itemdata.id"
    :class="{Lactive:activeArr.indexOf(itemdata.id)!==-1}">
      <h2 @click="go(itemdata.id)">{{inx+1+'、'+itemdata.title}}</h2>
    </li>
    <li v-else class="lefScr" :id="itemdata.id" :class="{Lactive:activeArr.indexOf(itemdata.id)!==-1}">
      <h2 @click="go(itemdata.id)">{{inx+1+'、'+itemdata.title}}</h2>
      <navOl :data="item" :index="index" v-for="(item, index) in itemdata.children" :active="activeArr" ></navOl>
    </li>
  </ol>
</template>
<script type="text/javascript">
  import navOl from '@/components/Mobile/planDetail/navOl'
  export default {
    name:'navOl',
    props: ['data', 'id', 'active', 'index'],
    inject: ['goaction'],
    computed: {
      itemdata () {
        return this.data
      },
      activeArr () {
        return this.active
      },
      inx () {
        return this.index
      }
    },
    components: {
      navOl
    },
    methods: {
      go (id) {
        this.goaction(id)
      }
    }
  }
</script>
