<template id="">
  <div class="">
    <table class="planTable" align="center" v-if="timeData">
      <colgroup>
        <col :style="{width:100/timeData.length+'%'}" v-for="item in timeData.length">
      </colgroup>
      <thead>
        <tr>
          <th v-for="item in timeData">{{item}}</th>
        </tr>
      </thead>
      <tbody class="" >
        <template id="" v-for = "(item, tDinx) in tData">
          <tr v-for = "(items, proi) in item.projects" :id="parentId + '-'+ tDinx+'-'+ proi" class="scr">
            <td v-for = "(itemsx, index) in items.dateProjects"
            :class="{high:itemsx.referenceUnit,
              textnum: !isNaN(Number(itemsx.result))}">
              <span class="fontType" v-if="itemsx.compareValue.indexOf('3') !== -1 || itemsx.compareValue.indexOf('4') !== -1">
                <p :class="{'redfont': itemsx.compareValue.indexOf('4') !== -1}"
                v-for="(emContent, indexs) in itemsx.result.split('|')">
                  <b v-if="itemsx.result.split('|').length > 1">{{indexs|sortNum}}</b>
                  {{emContent}}
                </p>
              </span>
              <span v-else class="redfont" >{{itemsx.result}}</span>
              <i class="iconfont icon-xiangshangjiantou redfont" v-if="itemsx.compareValue === '1'"></i>
              <i class="iconfont icon-xiangxiajiantou redfont" v-if="itemsx.compareValue === '2'"></i>
              <p class="bvalue">
                <template id="" v-if = "itemsx.compareValue === '1' || itemsx.compareValue === '2'">
                  ({{itemsx.referenceValue|referenceValueFormat}})
                </template>
                {{itemsx.referenceUnit}}
              </p>
              <div class="title" v-if="index===0">
                {{items.projectName}}
              </div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="nodatbox" v-else>
      <h2>暂无数据</h2>
    </div>
  </div>
</template>
<script type="text/javascript">
  export default {
    name: 'ptable',
    props: ['data', 'parent'],
    data () {
      return {
      }
    },
    computed: {
      tData () {
        return this.data.courses
      },
      timeData () {
        return this.data.checkupTime
      },
      parentId () {
        return this.parent
      }
    }
  }
</script>
<style media="screen">
  .planTable{
    font-size: 15px;
    color: #333;
    width: 100%
  }
  .planTable td{
    padding: 60px 0 16px 0;
    position: relative;
    text-align: center;
  }
  .planTable tr{
    position: relative;
  }
  .planTable tbody tr td::after {
    width: 200%;
    height: 1px;
    background: #dedede;
    transform: scale(0.5);
    position: absolute;
    content: '';
    right: -50%;
    bottom: 0
  }
  .planTable tr:last-child td::after{
    height:0px
  }
  .planTable th{
    border-bottom: 1px solid #efefef;
    padding: 9px 0;
    font-size: 14px
  }
  .planTable .title{
    position: absolute;
    top: 13px;
    color: #333;
    left: 0;
    font-size: 14px;
    width: 300px;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
    text-align: left;
  }
  .redfont{
    color:#FA476F
  }
  .high {
    font-size: 15px
  }
  .textnum{
    font-size: 18px
  }
  .bvalue{
    color: #999;
    font-size: 12px;
    margin-top: 5px
  }
  .fontType{
    font-size: 15px;
    text-align: center;
    display: block;
  }
</style>
