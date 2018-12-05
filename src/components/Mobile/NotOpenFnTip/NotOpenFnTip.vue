<template>
<div class="not-open-fn-tip">
  <p>暂未开放，敬请期待</p>
</div>
</template>

<script>
export default {
  name: 'NotOpenFnTip',
  data () {
    return {
    }
  },
  mounted () {
    window.bus.$emit('loadingFinish')
  }
}
</script>

<style scoped>
.not-open-fn-tip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.not-open-fn-tip p {
  font-size: 32px; /*px*/
}
</style>
