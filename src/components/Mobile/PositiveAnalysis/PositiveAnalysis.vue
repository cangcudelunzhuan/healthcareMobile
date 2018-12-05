<template>
<div class="analysis-wrap">
  <h2 v-if="hasTitle">{{data.kpiResult}}</h2>
  <div>
    <h3>检测结果：</h3>
    <p class="text-num"
      :class="{'text-alert': type}"
      v-for="result in data.result.split('|')">
      {{result}}
    </p>
  </div>
  <div>
    <h3>参考值：</h3>
    <p class="text-num">{{data.referenceValue}}</p>
  </div>
  <div>
    <h3>医学解释：</h3>
    <p class="text-paragraph">{{data.explan == null ? '暂无解释' : data.explan}}</p>
  </div>
  <div>
    <h3>常见病因：</h3>
    <p class="text-paragraph" v-for="item in data.cause" :key="item">{{item === '' ? '暂无病因' : item}}</p>
  </div>
</div>
</template>

<script>
import { bus } from '@/globalEventBus/bus'
import { getPositiveDetail } from '@/fetch/healcareApi'

export default {
  name: 'PositiveAnalysis',
  data () {
    return {
      hasTitle: true,
      type: true,
      data: {
        kpiResult: '',
        projectName: '',
        result: '',
        referenceValue: '',
        explan: '',
        cause: ''
      }
    }
  },
  created () {
    this.init()
  },
  mounted () {
    let compareValue = bus.getCookie('compareValue')
    if (compareValue.toString() === '3' || compareValue.toString() === '4') {
      this.hasTitle = false
    }
  },
  methods: {
    init () {
      // let hospitalCode = bus.getCookie('hospitalCode')
      // let checkupTime = bus.getCookie('checkupTime')
      // let empNo = bus.getCookie('empNo')
      // let courseCode = bus.getCookie('courseCode')
      // let projectCode = bus.getCookie('projectCode')
      let resultCode = bus.getCookie('resultCode')
      let rowid = bus.getCookie('rowid')
      let index = ''
      // 判断是不是文本类型的，如果是文本类型的则需要传递index参数，来明确多个病因时的指针
      let compareValue = bus.getCookie('compareValue')
      if (compareValue.toString() === '3' || compareValue.toString() === '4') {
        index = bus.getCookie('textAnalysisIndex')
      }
      getPositiveDetail(rowid, resultCode, index)
        .then((res) => {
          if (res.code === 'success') {
            // 常见病因如果是1,2,3数字排列时，需要换行。隔开有可能是;或；或 |
            if (res.data.cause === null) res.data.cause = ''
            // 单以'|'分隔
            let arr = res.data.cause.split('|')
            /* 以'；' ';' '|'分隔的方法
            let arr = []
            let flag = false
            let startIndex = 0
            for (let i = 0; i < res.data.cause.length; i++) {
              if (res.data.cause[i] === ';' || res.data.cause[i] === '；') {
                flag = true
                arr.push(res.data.cause.substring(startIndex, i + 1))
                startIndex = i + 1
              } else if (res.data.cause[i] === '|') {
                flag = true
                arr.push(res.data.cause.substring(startIndex, i))
                startIndex = i + 1
              }
            }
            if (!flag) {
              arr.push(res.data.cause)
            } else {
              // 数据有可能以非分号结尾，最后一项就有可能被遗漏
              if (res.data.cause.length !== startIndex) {
                arr.push(res.data.cause.substring(startIndex, res.data.cause.length))
              }
            }
            */
            res.data.cause = arr
            res.data.referenceValue = this.formateReferenceValue(res.data.referenceValue)
            if (res.data.kpiResult === null) this.hasTitle = false
            this.data = res.data
            bus.$emit('loadingFinish')
          }
        })
        .catch((err) => {
          console.log(err)
          bus.$emit('loadingFinish')
        })
    },
    formateReferenceValue (referenceValue) {
      let reg = /[0-9]+([.]{1}[0-9]+){0,1}>(=)*\|<(=)*(([0-9]+([.]{1}[0-9]+){0,1})|∞)/
      if (reg.test(referenceValue)) {
        let arr = referenceValue.split('|')
        let min
        let max
        if (arr[0].indexOf('>=') !== -1) {
          min = arr[0].split('>=')[0]
        } else {
          min = arr[0].split('>')[0]
        }
        if (arr[1].indexOf('<=') !== -1) {
          max = arr[1].split('<=')[1]
        } else {
          max = arr[1].split('<')[1]
        }
        if (min === '0' && max === '∞') return '0 - ∞'
        if (min === max) return min
        if (min === '0') {
          return '<' + max
        }
        if (max === '∞') {
          return '>' + min
        }
        return min + ' - ' + max
      } else {
        return referenceValue
      }
    }
  }
}
</script>

<style scoped>
.analysis-wrap {
  background-color: #fff;
  padding: 0 16px 30px;
  color: #666;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  box-sizing: border-box;
}
.analysis-wrap > h2 {
  padding-top: 21px;
  padding-bottom: 22px;
  line-height: 54px; /*px*/
  font-size: 36px; /*px*/
  color: #333;
  font-family: 'PingFangSC-Medium';
}
.analysis-wrap > div {
  padding-top: 8px;
  padding-bottom: 16px;
  border-bottom: 1px solid #DEDEDE; /*no*/
}
.analysis-wrap h3 {
  color: #333;
  font-size: 30px; /*px*/
  line-height: 31px;
  /*margin: 4px 0;*/
}
.text-paragraph {
  font-size: 28px; /*px*/
  line-height: 28px;
}
.analysis-wrap .text-num {
  font-size: 32px; /*px*/
  line-height: 44px; /*px*/
}
.analysis-wrap .text-alert {
  color: #FA476F;
  font-weight: bold;
}
</style>
