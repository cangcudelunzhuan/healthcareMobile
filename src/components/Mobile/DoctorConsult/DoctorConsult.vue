<template>
<div class="doctor-consult-wrap">
  <div class="inner-wrap">
    <div class="big-icon-wrap">
      <doctor-query-icon class="big-icon"></doctor-query-icon>
    </div>
    <p class="query-phone">
      <span class="number">0571-8671 8531</span>
      <span class="text">咨询电话</span>
    </p>
    <p class="query-time">
      <span class="number">08: 00 - 11: 30</span>
      <span class="number">13: 00 - 14: 30</span>
      <span class="text">咨询时间 周一至周五</span>
    </p>
    <div class="call-button">
      <a href="tel:0571-86718531">
        <i class="iconfont icon-dianhua"></i><span>拨打电话咨询</span>
      </a>
    </div>
  </div>
</div>
</template>

<script>
import DoctorQueryIcon from '@/assets/SVG/DoctorQuerySVG'
export default {
  name: 'DoctorConsult',
  components: {
    DoctorQueryIcon
  },
  mounted () {
    window.bus.$emit('loadingFinish')
  }
}
</script>

<style scoped>
.doctor-consult-wrap {
  position: relative;
  height: 100%;
  width: 100%;
  background: #f3f3f5 url(../../../../static/big_bg.png) no-repeat 0 -65px;
  background-size: 100% auto;
  color: #333;
}
.inner-wrap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 16px;
  background-color: #fff;
  box-shadow:0px 0px 16px 0px rgba(0,0,0,0.05);
  border-radius:8px;
}
.big-icon-wrap {
  padding: 64px 0;
  text-align: center;
}
.big-icon-wrap .big-icon {
  width: 82px;
  height: 82px;
}
.query-phone {
  text-indent: 24px;
  margin-bottom: 24px;
}
.number {
  font-size: 36px; /*px*/
  line-height: 27px;
  display: block;
  font-family: Arial;
  font-weight: bold;
}
.text {
  display: block;
  font-family: PingFangSC-Regular;
  font-size: 32px; /*px*/
  line-height: 24px;
}
.query-time {
  text-indent: 24px;
  margin-bottom: 48px;
}
.call-button {
  margin: 0 24px;
  background:linear-gradient(349deg,rgba(29,233,182,1) 0%,rgba(3,191,238,1) 100%);
  border-radius:4px;
}
.call-button i {
  display: inline-block;
  font-size: 38px; /*px*/
  vertical-align: top;
  margin-right: 9px;
  line-height: 40px;
}
.call-button a {
  display: block;
  text-align: center;
  color: #fff;
  line-height: 40px;
  font-weight: 600;
  font-size: 30px; /*px*/
}
</style>
