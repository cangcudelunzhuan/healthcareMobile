<template>
<div class="yinyang-detail-wrap">
  <p>
    <span class="yinyang-wrap is-yin" v-if="data.compareValue == '5'">{{data.result}}</span>
    <span
      class="yinyang-wrap is-yang"
      v-if="data.compareValue == '6' || data.compareValue == '7'">
      {{data.result}}
    </span>
  </p>
</div>
</template>

<script>
export default {
  name: 'YinYangDetail',
  props: ['data']
}
</script>

<style scoped>
.yinyang-detail-wrap {
  padding: 0 16px 16px;
}
.yinyang-detail-wrap p {
  padding: 8px 0px;
}
.yinyang-wrap {
  display: inline-block;
  font-size: 26px; /*px*/
  line-height: 26px;
  padding: 0px 10px;
  border-width: 1px; /*no*/
  border-style: solid;
  border-radius: 3px;
  margin-right: 12px;
}
.is-yin {
  border-color: #03BFEE;
  color: #03BFEE;
  background-color: rgba(41, 196, 235, .04);
}
.is-yang {
  border-color: #FA476F;
  color: #FA476F;
  background-color: rgba(250, 87, 124, .04);
}
</style>
