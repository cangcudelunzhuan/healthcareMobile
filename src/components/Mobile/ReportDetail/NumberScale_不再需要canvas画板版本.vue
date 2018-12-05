<template>
  <div class="board-parent">
    <canvas class="draw-board" ref="board" width="375" height="100">浏览器不支持canvas</canvas>
  </div>
</template>

<script>
export default {
  name: 'NumberScale',
  props: ['data'],
  data () {
    return {
      ctx: null,
      // 所有尺寸都需要根据RATIO进行计算，相应放大
      RATIO: Number(document.documentElement.getAttribute('data-dpr')) * 2
    }
  },
  mounted () {
    this.initBoard()
    this.ctx = this.$refs.board.getContext('2d')
    let referenceScale = this.data.referenceValue.split('-')
    this.drawBaseLine(referenceScale[0], referenceScale[1])
    if (this.data.compareValue === '0') {
      this.drawBlueCircle(referenceScale[0], referenceScale[1], this.data.result)
    } else if (this.data.compareValue === '1' || this.data.compareValue === '2') {
      this.drawRedCircle(referenceScale[0], referenceScale[1], this.data.result)
    }
  },
  methods: {
    initBoard () {
      // 因为每个设备的dpr不同，根据dpr来重设画板大小
      let w = this.$refs.board.parentNode.getBoundingClientRect().width
      let h = this.$refs.board.parentNode.getBoundingClientRect().height
      this.$refs.board.setAttribute('width', w * this.RATIO)
      this.$refs.board.setAttribute('height', h * this.RATIO)
    },
    drawBaseLine (low, high) {
      const R = this.RATIO
      let ctx = this.ctx
      ctx.lineWidth = 2 * R
      // 画灰色基准线
      ctx.beginPath()
      ctx.strokeStyle = '#eaeaea'
      ctx.moveTo(32 * R, 60 * R)
      ctx.lineTo(343 * R, 60 * R)
      ctx.closePath()
      ctx.stroke()
      // 画蓝色正常范围线
      ctx.beginPath()
      ctx.strokeStyle = '#03BFEE'
      ctx.moveTo(102 * R, 60 * R)
      ctx.lineTo(273 * R, 60 * R)
      ctx.closePath()
      ctx.stroke()

      ctx.fillStyle = '#999'
      ctx.font = (14 * R) + 'px normal PingFangSC-Regular'
      ctx.fillText(low, 102 * R, 90 * R)
      // 计算最高参考值的起始x位置
      let charLen = high === undefined ? 1 : high.length
      let dotLen = 0
      for (let i = 0; i < charLen; i++) {
        if (high[i] === '.') dotLen++
      }
      let highx = 273 - 8 * (charLen - dotLen) - 5 * dotLen
      ctx.fillText(high, highx * R, 90 * R)
    },
    drawBlueCircle (low, high, result) {
      const R = this.RATIO
      let ctx = this.ctx
      const x = parseInt((result - low) * (273 - 102) / (high - low) + 102)
      // 画圆
      ctx.beginPath()
      ctx.strokeStyle = '#03BFEE'
      ctx.arc(x * R, 60 * R, 7 * R, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fillStyle = '#FFF'
      ctx.arc(x * R, 60 * R, 4 * R, 0, 2 * Math.PI)
      ctx.fill()
      // 写字
      ctx.fillStyle = '#333333'
      ctx.font = (24 * R) + 'px normal PingFangSC-Regular'
      // 计算结果的起始x位置
      let charLen = result.length
      let dotLen = 0
      for (let i = 0; i < charLen; i++) {
        if (result[i] === '.') dotLen++
      }
      ctx.fillText(result, (x - 14 * (charLen - dotLen) / 2 - 2 * dotLen) * R, 35 * R)
    },
    drawRedCircle (low, high, result) {
      const R = this.RATIO
      let ctx = this.ctx
      let x = parseInt((result - low) * (273 - 102) / (high - low) + 102)
      if (isNaN(x)) {
        // high是∞的情况，parseInt()得到的x值为NaN
        let newHigh = Math.max(low, result) * 2
        x = parseInt((result - low) * (273 - 102) / (newHigh - low) + 102)
      }
      if (x > 343) {
        x = 320
      } else if (x < 32) {
        x = 40
      }
      // 画圆
      ctx.beginPath()
      ctx.strokeStyle = '#FA476F'
      ctx.arc(x * R, 60 * R, 7 * R, 0, 2 * Math.PI)
      ctx.stroke()
      ctx.fillStyle = '#FFF'
      ctx.arc(x * R, 60 * R, 4 * R, 0, 2 * Math.PI)
      ctx.fill()
      // 写字
      ctx.fillStyle = '#FA476F'
      ctx.font = (24 * R) + 'px normal PingFangSC-Regular'
      // 计算结果的起始x位置，计算出文字一半的长度，减去
      let charLen = result.length
      let dotLen = 0
      for (let i = 0; i < charLen; i++) {
        if (result[i] === '.') dotLen++
      }
      let halfTextLong = 14 * (charLen - dotLen) / 2 - 2 * dotLen
      let textStartX = x - halfTextLong
      // 防止文字超出界限右侧
      let arrowX = x + halfTextLong + dotLen * 10 + 8
      if (arrowX >= 343) {
        arrowX = 340
        textStartX = 340 - (14 * (charLen - dotLen) + 5 * dotLen + 8)
      }
      ctx.fillText(result, textStartX * R, 35 * R)
      ctx.font = (20 * R) + 'px normal PingFangSC-Regular'
      // 画箭头
      if (this.data.compareValue === '1') {
        this.drawArrow(ctx, arrowX * R, 20 * R, arrowX * R, 32 * R, 45, 5 * R, 2 * R)
      } else if (this.data.compareValue === '2') {
        this.drawArrow(ctx, arrowX * R, 32 * R, arrowX * R, 20 * R, 45, 5 * R, 2 * R)
      }
    },
    drawArrow (ctx, fromX, fromY, toX, toY, theta, headlen, width) {
      theta = typeof theta !== 'undefined' ? theta : 30
      headlen = typeof theta !== 'undefined' ? headlen : 10
      width = typeof width !== 'undefined' ? width : 1

      let angle = Math.atan2(fromY - toY, fromX - toX) * 180 / Math.PI
      let angle1 = (angle + theta) * Math.PI / 180
      let angle2 = (angle - theta) * Math.PI / 180
      let topX = headlen * Math.cos(angle1)
      let topY = headlen * Math.sin(angle1)
      let botX = headlen * Math.cos(angle2)
      let botY = headlen * Math.sin(angle2)

      ctx.save()
      ctx.beginPath()

      let arrowX = fromX - topX
      let arrowY = fromY - topY

      ctx.moveTo(arrowX, arrowY)
      ctx.lineTo(fromX, fromY)
      arrowX = fromX - botX
      arrowY = fromY - botY
      ctx.lineTo(arrowX, arrowY)
      ctx.moveTo(fromX, fromY)
      ctx.lineTo(toX, toY)

      ctx.strokeStyle = '#FA476F'
      ctx.lineWidth = width
      ctx.stroke()
      ctx.restore()
    }
  }
}
</script>

<style scoped>
  .board-parent {
    width: 343px;
    height: 121px;
    overflow: hidden;
  }
  .draw-board {
    transform: scale(0.5) translate(-52%, -50%);
  }
</style>
