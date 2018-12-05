<template>
<div class="number-detail-wrap">
  <div class="grey-line"></div>
  <div class="blue-line" v-if="needBlueLine"></div>
  <p class="refer-wrap">
    <span class="refer-low" v-if="needBlueLine">{{low}}</span>
    <span class="refer-middle" v-if="!needBlueLine">{{middle}}</span>
    <span class="refer-high" v-if="needBlueLine" :style="{left: highLeft + 'rem'}">{{high}}</span>
  </p>
  <div class="result-circle" :class="{'red-circle': isAbnormal}" ref="resultCircle" :style="{left: circleLeft + 'rem'}"></div>
  <div class="result-wrap" ref="resultWrap" :style="{left: resultLeft + 'rem'}">
    <span class="result-content1" :class="{'result-abnormal': isAbnormal}">{{data.result}}</span>
    <up-arrow-icon class="result-arrow" v-if="isHigh"></up-arrow-icon>
    <down-arrow-icon class="result-arrow" v-if="isLow"></down-arrow-icon>
  </div>
</div>
</template>
<script>
import UpArrowIcon from '@/assets/SVG/UpArrowSVG.vue'
import DownArrowIcon from '@/assets/SVG/DownArrowSVG.vue'
export default {
  name: 'NumberDetail',
  components: {
    UpArrowIcon,
    DownArrowIcon
  },
  props: ['data'],
  data () {
    return {
      RATIO: Number(document.documentElement.getAttribute('data-dpr')),
      rem: 37.5,
      needBlueLine: true,
      low: '4.0',
      middle: '0',
      high: '10.0',
      isLow: false,
      isHigh: false,
      isAbnormal: false,
      highLeft: 230 / this.rem,
      circleLeft: 164 / this.rem,
      resultLeft: 154 / this.rem
    }
  },
  mounted () {
    this.initData()
    this.calculatePosition()
  },
  methods: {
    initData () {
      // 判断参考值是范围还是单个值
      let referenceArr = this.data.referenceValue.split('|')
      if (referenceArr[0].indexOf('>=') !== -1) {
        referenceArr[0] = referenceArr[0].slice(0, -2)
      } else {
        referenceArr[0] = referenceArr[0].slice(0, -1)
      }
      if (referenceArr[1].indexOf('<=') !== -1) {
        referenceArr[1] = referenceArr[1].substring(2)
      } else {
        referenceArr[1] = referenceArr[1].substring(1)
      }
      if (referenceArr.length === 2) {
        this.low = referenceArr[0].trim()
        this.high = referenceArr[1].trim()
      } else {
        this.needBlueLine = false
        this.middle = referenceArr[0]
      }
      // 判断是正常，高，低
      switch (this.data.compareValue) {
        case '1':
          this.isAbnormal = true
          this.isHigh = true
          break
        case '2':
          this.isAbnormal = true
          this.isLow = true
          break
        default:
          this.isAbnormal = false
          break
      }
    },
    // 计算结果值和结果circle位置
    calculatePosition () {
      let result = this.data.result.trim()
      // 如果参考值只是单个值，只需计算结果
      if (!this.needBlueLine) {
        if (this.isLow) {
          this.circleLeft = (86 - 8) / this.rem
        } else if (this.isHigh) {
          this.circleLeft = (257 - 8) / this.rem
        } else {
          this.circleLeft = (172 - 8) / this.rem
        }
        let textDotInfo = this.dotLength(result)
        let textHalfLen = (textDotInfo[0] * 14 + textDotInfo[1] * 6) / 2
        this.resultLeft = (this.circleLeft + 8 - textHalfLen) / this.rem
      } else {
      // 参考值是一个范围
        // 高参考值的位置
        let highDotInfo = this.dotLength(this.high)
        this.highLeft = (257 - highDotInfo[0] * 8 - highDotInfo[1] * 5) / this.rem
        // circle的位置
        let x = parseInt((result - this.low) * (257 - 86) / (this.high - this.low) + 86 - 8)
        if (isNaN(x)) {
          // high是∞的情况，parseInt()得到的x值为NaN
          let newHigh = Math.max(this.low, result) * 2
          x = parseInt((result - this.low) * (257 - 86) / (newHigh - this.low) + 86 - 8)
        }
        if (x > 310) {
          x = 310
        } else if (x < 32) {
          x = 32
        }
        this.circleLeft = x / this.rem
        // 文字的位置
        let textDotInfo = this.dotLength(result)
        let textHalfLen = (textDotInfo[0] * 14 + textDotInfo[1] * 6) / 2
        let resultLeft = x + 8 - textHalfLen
        // 文字超出右侧的情况
        if (resultLeft + textHalfLen + 20 > 300) {
          resultLeft = 333 - 2 * textHalfLen - 20
        } else if (resultLeft - textHalfLen < 10) {
          resultLeft = 10
        }
        this.resultLeft = resultLeft / this.rem
      }
    },
    // 计算传入值的非点字符长度和点字符长度，[非点字符长度， 点字符长度]
    dotLength (val) {
      if (typeof val !== 'string') return [2, 0]
      let dotLen = 0
      for (let i = 0; i < val.length; i++) {
        if (val[i] === '.') {
          dotLen++
        }
      }
      return [val.length - dotLen, dotLen]
    }
  }
}
</script>

<style scoped>
.number-detail-wrap {
  width: 343px;
  height: 121px;
  position: relative;
}
.grey-line {
  position: absolute;
  top: 60px;
  left: 16px;
  width: 311px;
  height: 2px;
  border-radius: 2px;
  background-color: #EAEAEA;
}
.blue-line {
  position: absolute;
  top: 60px;
  left: 86px;
  width: 171px;
  height: 2px;
  border-radius: 2px;
  background-color: #03BFEE;
}
.result-circle {
  position: absolute;
  top: 53px;
  width: 12px;
  height: 12px;
  background-color: #fff;
  z-index: 10;
  border-radius: 50%;
  border: 2px solid #03BFEE;
  left: 164px;
}
.number-detail-wrap .red-circle {
  border: 2px solid #FA476F;
}
.refer-wrap {
  position: absolute;
  left: 0;
  top: 76px;
  width: 100%;
  height: 21px;
  font-size: 28px; /*px*/
  line-height: 21px;
  color: #999;
  text-align: center;
}
.refer-low {
  position: absolute;
  top: 0;
  left: 86px;
}
.refer-high {
  position: absolute;
  top: 0;
  left: 230px;
}
.result-wrap {
  position: absolute;
  top: 8px;
  left: 154px;
  color: #333;
  font-size: 48px; /*px*/
  height: 36px;
  line-height: 36px;
  white-space: nowrap;
}
.result-wrap .result-content1 {
  display: inline-block;
  vertical-align: middle;
}
.result-wrap .result-abnormal {
  color: #FA476F;
  font-family: "PingFangSC-Semibold";
}
.result-wrap .result-arrow {
  display: inline-block;
  width: 12px;
  height: 14px;
  vertical-align: middle;
}
</style>
